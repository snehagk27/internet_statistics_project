
Prerequisites:

Before running the application, ensure you have the following installed on your machine:

Docker

PostgreSQL

pgAdmin

Python

Step 1: Clone the Repository

First, clone this GitHub repository to your local machine:

 git clone https://github.com/snehagk27/internet_statistics_project.git
 
 cd internet_statistics_project

Step 2: Set Up PostgreSQL

Open pgAdmin 

Create a new database named internet_statistics.

Run the following SQL script in pgAdmin to create the required tables:

-- Create the countries table

CREATE TABLE countries (

  code VARCHAR(2) PRIMARY KEY,
  
  country VARCHAR(100)
  
);

-- Create the internet_statistics table

CREATE TABLE internet_statistics (

  id SERIAL PRIMARY KEY,
  
  location VARCHAR(2) REFERENCES countries(code),
  
  rate_wb DECIMAL,
  
  year_wb INT,
  
  rate_itu DECIMAL,
  
  year_itu INT,
  
  users_cia INT,
  
  year_cia INT,
  
  notes TEXT
  
);


Step 3: Configure the .env File

Since the .env file is not included in this repository, you must create it manually.

Create a new file named .env in the root folder

Add the following content:

DB_USER=postgres

DB_HOST=localhost

DB_DATABASE=internet_statistics

DB_PASSWORD=your_password_here

DB_PORT=5432

PORT=3000

API_KEY=your_api_key_here

Step 4: Load Data into PostgreSQL

Before running the application, you need to populate the database with initial data.

Open a terminal and navigate to the Backend/ folder:

cd Backend

Run the following command to execute the Python script that loads data:

python3 load_data.py

Step 5: Build and Run the Containers

Once PostgreSQL is set up and the data is loaded, start the backend and frontend containers:

Navigate to the root folder and run docker-compose up --build

This will start the backend on http://localhost:3000 and the frontend on http://localhost:4200.
