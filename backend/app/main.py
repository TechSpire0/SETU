from fastapi import FastAPI, Depends, UploadFile, File
from typing import List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from minio import Minio
import uuid

from . import schemas, models
from .database import SessionLocal, engine
from .core.minio_client import get_minio_client
from .ml.classifier import otolith_classifier
from .core import analysis_service, llm_service # <-- ADD llm_service IMPORT

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Tattva API")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "CMLRE API is running!"}

@app.get("/api/species", response_model=List[schemas.Species], tags=["Species"])
async def get_all_species(db: Session = Depends(get_db)):
    return db.query(models.Species).all()

@app.get("/api/sightings", response_model=List[schemas.Sighting], tags=["Sightings"])
async def get_sightings_data(db: Session = Depends(get_db)):
    """
    Get all geospatial and oceanographic data points with their related species info.
    """
    query_results = (
        db.query(
            models.Sighting,
            func.ST_Y(models.Sighting.location).label("latitude"),
            func.ST_X(models.Sighting.location).label("longitude")
        )
        .options(joinedload(models.Sighting.species))
        .all()
    )

    # THIS BLOCK IS NOW CLEANED UP
    response_data = []
    for s_model, lat, lon in query_results:
        response_data.append({
            "sighting_id": f"CMLRE-SIGHT-{s_model.id}",
            "latitude": lat,
            "longitude": lon,
            "sighting_date": s_model.sighting_date,
            "sea_surface_temp_c": s_model.sea_surface_temp_c,
            "salinity_psu": s_model.salinity_psu,
            "chlorophyll_mg_m3": s_model.chlorophyll_mg_m3,
            "species": s_model.species,
        })
    return response_data


@app.post("/api/classify_otolith", tags=["AI Models"])
async def classify_otolith_image(
    # 1. Define dependencies for the database and MinIO client.
    db: Session = Depends(get_db),
    minio: Minio = Depends(get_minio_client),
    # 2. Define the file upload parameter.
    file: UploadFile = File(...)
):
    """
    Accepts an otolith image, performs species classification,
    and stores the image in MinIO.
    """
    # 3. Read the contents of the uploaded file into memory.
    contents = await file.read()
    
    # 4. Use our AI classifier to get a prediction.
    prediction_results = otolith_classifier.predict(contents)

    # 5. Save the uploaded image to MinIO for persistence.
    #    - Generate a unique filename to prevent overwrites.
    #    - Use the predicted species as a "folder" name.
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    object_name = f"{prediction_results['predicted_species'].replace(' ', '_')}/{unique_filename}"
    
    # We need to get the size and reset the read pointer.
    file.file.seek(0)
    file_size = len(contents)

    minio.put_object(
        "otoliths", # The bucket name
        object_name,
        file.file,
        file_size,
        content_type=file.content_type
    )

    # 6. We could now also save the prediction results to our `otoliths` table in PostgreSQL.
    #    (This is an optional but recommended step for a full application).

    # 7. Return the prediction results to the user.
    return prediction_results



@app.get("/api/hypotheses", response_model=dict, tags=["X-Factor"])
async def get_ai_hypotheses(db: Session = Depends(get_db)):
    """
    Analyzes the database, finds a correlation, and uses a Generative AI model
    to formulate a scientific hypothesis.
    """
    # 2. Step 1 (Retrieve): Find the strongest statistical correlation.
    correlation_finding = analysis_service.find_strongest_correlation(db)

    # 3. Add the full species name to the finding for better context.
    if correlation_finding.get("species_id"):
        species = db.query(models.Species).filter(models.Species.id == correlation_finding["species_id"]).first()
        if species:
            correlation_finding["species_name"] = species.common_name

    # 4. Step 2 (Generate): Pass the finding to the LLM to get a text hypothesis.
    hypothesis_text = llm_service.generate_hypothesis_from_finding(correlation_finding)

    # 5. Return a structured response containing both the generated text and the source data.
    return {
        "hypothesis": hypothesis_text,
        "source_finding": correlation_finding
    }