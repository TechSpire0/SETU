from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

# --- Base Schemas for Core Entities ---

class SpeciesBase(BaseModel):
    scientific_name: str = Field(..., example="Sardinella longiceps")
    common_name: str = Field(..., example="Indian Oil Sardine")
    description: Optional[str] = Field(None, example="A key commercial fish found in the Arabian Sea.")
    habitat: Optional[str] = Field(None, example="Coastal pelagic")

class Species(SpeciesBase):
    id: int
    class Config:
        orm_mode = True

class Sighting(BaseModel):
    sighting_id: str = Field(..., example="CMLRE-2025-10A")
    species_id: int = Field(..., example=1)
    latitude: float = Field(..., example=15.4989)
    longitude: float = Field(..., example=73.8278)
    sighting_date: date = Field(..., example="2025-05-21")
    sea_surface_temp_c: Optional[float] = Field(None, example=28.5)
    salinity_psu: Optional[float] = Field(None, example=35.1)
    chlorophyll_mg_m3: Optional[float] = Field(None, example=0.4)
    class Config:
        orm_mode = True

# --- Schemas for API Responses ---

class PaginatedSpeciesResponse(BaseModel):
    count: int
    results: List[Species]