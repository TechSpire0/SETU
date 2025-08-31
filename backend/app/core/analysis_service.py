import pandas as pd
from sqlalchemy.orm import Session
from .. import models

def find_strongest_correlation(db: Session) -> dict:
    """
    Analyzes the sightings data to find the strongest correlation between an
    environmental variable and the presence of a specific species.
    """
    print("--- Running Correlation Analysis ---")
    
    # 2. Query all sightings data from the database.
    sightings = db.query(models.Sighting).all()
    if not sightings:
        return {"error": "Not enough data to perform analysis."}

    # 3. Convert the list of SQLAlchemy objects into a Pandas DataFrame.
    data = [
        {
            "species_id": s.species_id,
            "sea_surface_temp_c": s.sea_surface_temp_c,
            "salinity_psu": s.salinity_psu,
            "chlorophyll_mg_m3": s.chlorophyll_mg_m3,
        }
        for s in sightings
    ]
    df = pd.DataFrame(data)

    # 4. One-hot encode the species_id to analyze each species separately.
    # This creates a new column for each species (e.g., 'species_1', 'species_2')
    # with a 1 if that species was present and 0 otherwise.
    df = pd.get_dummies(df, columns=['species_id'], prefix='species')

    # 5. Calculate the correlation matrix.
    # This computes the Pearson correlation between every column in the DataFrame.
    corr_matrix = df.corr()

    # 6. Find the strongest correlation between an environmental variable and a species.
    strongest_corr = {"correlation": 0, "variable": None, "species_id": None}
    
    env_vars = ["sea_surface_temp_c", "salinity_psu", "chlorophyll_mg_m3"]
    species_cols = [col for col in df.columns if col.startswith('species_')]

    for s_col in species_cols:
        for env_var in env_vars:
            # Get the absolute correlation value
            current_corr = abs(corr_matrix.loc[s_col, env_var])
            if current_corr > abs(strongest_corr["correlation"]):
                strongest_corr = {
                    "correlation": corr_matrix.loc[s_col, env_var],
                    "variable": env_var,
                    "species_id": int(s_col.split('_')[-1]) # Extract the ID (e.g., from 'species_1')
                }

    print(f"--- Strongest Correlation Found: {strongest_corr} ---")
    return strongest_corr