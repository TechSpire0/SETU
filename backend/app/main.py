# ==============================================================================

# Final Merged main.py for CMLRE Project

# ==============================================================================



# --- Core Imports ---

from fastapi import FastAPI, Depends, UploadFile, File

from typing import List

from sqlalchemy.orm import Session, joinedload

from sqlalchemy import func

from minio import Minio

import uuid



# --- Local Application Imports ---

from . import schemas, models

from .database import SessionLocal, engine

from .core.minio_client import get_minio_client

from .ml.classifier import otolith_classifier

from .core import analysis_service, llm_service



# --- CORS Middleware Import ---

# This is the crucial import for allowing frontend communication.

from fastapi.middleware.cors import CORSMiddleware



# This command ensures all database tables are created based on your models.

models.Base.metadata.create_all(bind=engine)



# Initialize the main FastAPI application.

app = FastAPI(

    title="CMLRE Unified Data Platform API",

    description="The complete backend service for the SIH 2025 AI-Driven Marine Data Platform.",

    version="1.0.0"

)





# ==============================================================================

# CORS MIDDLEWARE CONFIGURATION

# This section allows your React frontend at http://localhost:5173 to

# make requests to this backend. Without this, all API calls will be blocked

# by the browser's security policies.

# ==============================================================================

origins = [

    "http://localhost:5173",

]



app.add_middleware(

    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"], # Allows all methods (GET, POST, etc.)

    allow_headers=["*"], # Allows all headers

)



# ==============================================================================

# DATABASE DEPENDENCY

# This function provides a database session to your API endpoints and ensures

# the connection is properly closed after the request is complete.

# ==============================================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()



# ==============================================================================

# API ENDPOINTS

# These are the live, functional routes that connect to your database and AI models.

# ==============================================================================



@app.get("/", include_in_schema=False)

async def root():

    return {"message": "CMLRE API is running!"}





@app.get("/api/species", response_model=List[schemas.Species], tags=["Species"])

async def get_all_species(db: Session = Depends(get_db)):

    """

    Retrieves a list of all marine species from the PostgreSQL database.

    """

    return db.query(models.Species).all()





@app.get("/api/sightings", response_model=List[schemas.Sighting], tags=["Sightings"])

async def get_sightings_data(db: Session = Depends(get_db)):

    """

    Retrieves all geospatial and oceanographic data points, joining

    them with their related species information.

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

    db: Session = Depends(get_db),

    minio: Minio = Depends(get_minio_client),

    file: UploadFile = File(...)

):

    """

    Accepts an otolith image, performs species classification using the AI model,

    and stores the uploaded image in the MinIO object storage.

    """

    contents = await file.read()

    prediction_results = otolith_classifier.predict(contents)



    file_extension = file.filename.split('.')[-1]

    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    object_name = f"{prediction_results['predicted_species'].replace(' ', '_')}/{unique_filename}"

    

    file.file.seek(0)

    file_size = len(contents)



    minio.put_object(

        "otoliths",

        object_name,

        file.file,

        file_size,

        content_type=file.content_type

    )



    return prediction_results





@app.get("/api/hypotheses", response_model=dict, tags=["X-Factor"])

async def get_ai_hypotheses(db: Session = Depends(get_db)):

    """

    Analyzes the entire database to find the strongest statistical correlation

    and uses a Generative AI model to formulate a natural language hypothesis.

    """

    correlation_finding = analysis_service.find_strongest_correlation(db)



    if correlation_finding.get("species_id"):

        species = db.query(models.Species).filter(models.Species.id == correlation_finding["species_id"]).first()

        if species:

            correlation_finding["species_name"] = species.common_name



    hypothesis_text = llm_service.generate_hypothesis_from_finding(correlation_finding)



    return {

        "hypothesis": hypothesis_text,

        "source_finding": correlation_finding

    }