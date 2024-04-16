import psycopg2
from psycopg2 import Error

# Function to establish a connection to the PostgreSQL database
def create_connection():
    print("Create Connection invoke")
    try:
        connection = psycopg2.connect(
            user="user",
            password="password",
            host="localhost",
            port="5433",
            dbname="notes_db",
        )
        return connection
    except Error as e:
        print("Error while connecting to PostgreSQL", e)
        return None

# Function to establish a connection to the PostgreSQL database
def create_connection_with_no_db():
    try:
        print("Establishing connection")
        connection = psycopg2.connect(
            user="user",
            password="password",
            host="localhost",
            port="5433",
            dbname="postgres",
        )
        print("Connected to PostgresSQL")
        return connection
    except Error as e:
        print("Error while connecting to PostgreSQL", e)
        return None

# Function to create the database if it doesn't exist
def create_database():
    print("Create database invoke")
    try:
        connection = create_connection_with_no_db()
        connection.autocommit = True
        cursor = connection.cursor()
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'notes_db'")
        exists = cursor.fetchone()
        if not exists:
            cursor.execute("CREATE DATABASE notes_db")
            print("Database created successfully.")
        else:
            print("Database already exists.")
    except Error as e:
        print("Error creating database:", e)

# Function to create tables
def create_tables(connection):
    print("Create tables invoked")

    try:
        cursor = connection.cursor()

        # Create Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Users (
                user_id SERIAL PRIMARY KEY
            );
        ''')

        # Create Notes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Notes (
                note_id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                note_header TEXT,
                note_content TEXT,
                FOREIGN KEY (user_id) REFERENCES Users(user_id)
            );
        ''')

        connection.commit()
        print("Tables created successfully.")

    except Error as e:
        print("Error creating tables:", e)

if __name__ == "__main=__":
    create_database()
