import csv
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables from .env file for database credentials
load_dotenv()

# Get database credentials from .env
DB_NAME = os.getenv("DB_DATABASE")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# Function to safely convert a value to an integer, returning None if the value is invalid
def convert_to_int(value):
    try:
        return int(value)
    except ValueError:
        return None

# Function to safely convert a value to a float, returning None if the value is invalid
def convert_to_float(value):
    try:
        return float(value)
    except ValueError:
        return None

# Connect to PostgreSQL using credentials from environment variables
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()

# Load countries data from CSV and insert into the database
with open('backend/data/countries.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader)  # Skip header row
    for row in reader:
        cur.execute(
            "INSERT INTO countries (code, country) VALUES (%s, %s)",
            (row[1], row[0])  # Swap the order to match the table schema (code, country)
        )

# Load internet statistics data from CSV and insert into the database
with open('backend/data/country_internet_statistics.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader)  # Skip header row
    for row in reader:
        cur.execute(
            """
            INSERT INTO internet_statistics (location, rate_wb, year_wb, rate_itu, year_itu, users_cia, year_cia, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                row[0],  # location
                convert_to_float(row[1]),  # rate_wb (convert to float)
                convert_to_int(row[2]),  # year_wb (convert to int)
                convert_to_float(row[3]),  # rate_itu (convert to float)
                convert_to_int(row[4]),  # year_itu (convert to int)
                convert_to_int(row[5]),  # users_cia (convert to int)
                convert_to_int(row[6]),  # year_cia (convert to int)
                row[7] if row[7] else None  # notes (handle empty values)
            )
        )

# Commit the changes to the database and close the connection
conn.commit()
cur.close()
conn.close()

# Print success message after data is loaded
print("Data loaded successfully!")
