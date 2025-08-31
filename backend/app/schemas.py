from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import date

# This schema is defined first, as it's needed by the Sighting schema.
class Species(BaseModel):
    id: int
    scientific_name: str
    common_name: str
    description: Optional[str] = None
    habitat: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# FINAL SIMPLIFIED Sighting Schema
# No validators, no complex logic. This is a simple data container.
class Sighting(BaseModel):
    sighting_id: str
    latitude: float
    longitude: float
    sighting_date: date
    sea_surface_temp_c: Optional[float] = None
    salinity_psu: Optional[float] = None
    chlorophyll_mg_m3: Optional[float] = None
    species: Species
    model_config = ConfigDict(from_attributes=True)

class PaginatedSpeciesResponse(BaseModel):
    count: int
    results: List[Species]

    model_config = ConfigDict(from_attributes=True)