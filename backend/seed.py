# 1. Import necessary modules and classes.
import logging
from app.database import SessionLocal, engine
from app.models import Species, Sighting, Base
from geoalchemy2.shape import from_shape
from shapely.geometry import Point

# 2. Set up basic logging to see the script's output.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 3. Create a new database session.
db = SessionLocal()

def seed_data():
    """
    Populates the database with initial sample data.
    """
    try:
        logger.info("Seeding database with initial data...")

        # 4. Check if species data already exists to prevent duplicates.
        if db.query(Species).count() == 0:
            logger.info("Creating sample species...")
            # 5. Create instances of the Species model.
            species1 = Species(
                scientific_name="Sardinella longiceps",
                common_name="Indian Oil Sardine",
                description="A key commercial fish found in the Arabian Sea.",
                habitat="Coastal pelagic"
            )
            species2 = Species(
                scientific_name="Rastrelliger kanagurta",
                common_name="Indian Mackerel",
                description="A popular food fish, found in shallow, coastal waters.",
                habitat="Pelagic-neritic"
            )
            # 6. Add the new species objects to the session.
            db.add_all([species1, species2])
            db.commit() # Commit the species first to get their IDs.
            logger.info("Sample species created.")
        else:
            logger.info("Species data already exists, skipping.")
            species1 = db.query(Species).filter(Species.scientific_name == "Sardinella longiceps").first()
            species2 = db.query(Species).filter(Species.scientific_name == "Rastrelliger kanagurta").first()


        # 7. Check if sightings data already exists.
        if db.query(Sighting).count() == 0:
            logger.info("Creating sample sightings...")
            # 8. Create instances of the Sighting model, linking them to the species.
            sighting1 = Sighting(
                species_id=species1.id,
                location=from_shape(Point(73.8278, 15.4989), srid=4326), # Goa
                sighting_date="2025-05-21",
                sea_surface_temp_c=28.5,
                salinity_psu=35.1,
                chlorophyll_mg_m3=0.4
            )
            sighting2 = Sighting(
                species_id=species2.id,
                location=from_shape(Point(74.8560, 12.9716), srid=4326), # Mangalore
                sighting_date="2025-06-15",
                sea_surface_temp_c=29.1,
                salinity_psu=35.5,
                chlorophyll_mg_m3=0.6
            )
            sighting3 = Sighting(
                species_id=species1.id,
                location=from_shape(Point(72.8777, 19.0760), srid=4326), # Mumbai
                sighting_date="2025-04-10",
                sea_surface_temp_c=27.9,
                salinity_psu=36.0,
                chlorophyll_mg_m3=0.3
            )
            # 9. Add the new sighting objects to the session and commit.
            db.add_all([sighting1, sighting2, sighting3])
            db.commit()
            logger.info("Sample sightings created.")
        else:
            logger.info("Sightings data already exists, skipping.")

        logger.info("Database seeding complete.")

    finally:
        # 10. Always close the database session.
        db.close()

if __name__ == "__main__":
    seed_data()