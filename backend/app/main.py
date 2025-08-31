# Import the required tools from FastAPI
from fastapi import FastAPI, Body, UploadFile, File
from typing import List
from . import schemas

# --- ADDED ---
# Import the CORSMiddleware to handle cross-origin requests
from fastapi.middleware.cors import CORSMiddleware

# Initialize the main FastAPI application instance
app = FastAPI(
    title="CMLRE Marine Biodiversity API",
    description="The backend service for the SIH 2025 AI-Driven Marine Data Platform.",
    version="1.0.0"
)

# --- ADDED ---
# Define the list of origins (websites) that are allowed to make requests to this API.
# This is our "guest list". We are explicitly allowing our Vite frontend development server.
origins = [
    "http://localhost:5173",
]

# --- ADDED ---
# Add the CORS middleware to the application. This is the crucial part.
# This piece of code will check every incoming request, and if it's from an origin
# in our `origins` list, it will add the required 'Access-Control-Allow-Origin' header
# to the response, telling the browser the request is allowed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allow requests from the origins in our list
    allow_credentials=True,      # Allow cookies to be sent with requests
    allow_methods=["*"],         # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],         # Allow all request headers
)

# --- The rest of your API endpoints remain unchanged ---

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "CMLRE API is running!"}

@app.get("/api/species", response_model=schemas.PaginatedSpeciesResponse, tags=["Species"])
async def get_all_species():
    mock_species_list = [
        {"id": 1, "scientific_name": "Sardinella longiceps", "common_name": "Indian Oil Sardine", "description": "A key commercial fish.", "habitat": "Coastal"},
        {"id": 2, "scientific_name": "Rastrelliger kanagurta", "common_name": "Indian Mackerel", "description": "Found in shallow waters.", "habitat": "Pelagic-neritic"}
    ]
    return {"count": 2, "results": mock_species_list}

@app.get("/api/sightings", response_model=List[schemas.Sighting], tags=["Sightings"])
async def get_sightings_data(species_id: int = None):
    mock_sightings = [
        {"sighting_id": "CMLRE-2025-10A", "species_id": 1, "latitude": 15.4989, "longitude": 73.8278, "sighting_date": "2025-05-21", "sea_surface_temp_c": 28.5},
        {"sighting_id": "CMLRE-2025-11B", "species_id": 2, "latitude": 12.9716, "longitude": 74.8560, "sighting_date": "2025-06-15", "sea_surface_temp_c": 29.1}
    ]
    if species_id is not None:
        return [s for s in mock_sightings if s['species_id'] == species_id]
    return mock_sightings

@app.post("/api/classify_otolith", tags=["AI Models"])
async def classify_otolith_image(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "predicted_species": "Indian Mackerel",
        "confidence_score": 0.92
    }

@app.get("/api/hypotheses", tags=["X-Factor"])
async def get_ai_hypotheses():
    return [
        {
            "id": "HYP-001",
            "title": "Chlorophyll & Sardine Correlation",
            "statement": "A strong positive correlation was found between high chlorophyll-a levels (>0.5 mg/m³) and an increase in 'Indian Oil Sardine' populations in the Arabian Sea during the post-monsoon period.",
            "severity": "High",
            "supporting_data_points": 152
        }
    ]