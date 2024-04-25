from db import create_connection, create_database, create_tables
from flask import Flask, jsonify, request
import logging

app = Flask(__name__)


# Create a new user
@app.route("/users", methods=["POST"])
def create_user():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection error"}), 500

    try:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO Users DEFAULT VALUES RETURNING user_id;")
        user_id = cursor.fetchone()[0]
        connection.commit()
        return jsonify({"user_id": user_id}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# Get all users
@app.route("/users", methods=["GET"])
def get_users():
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection error"}), 500

    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM Users;")
        users = cursor.fetchall()
        return jsonify({"users": users}), 200
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# Create a note
@app.route("/notes", methods=["POST"])
def create_notes():
    connection = create_connection()
    app.logger.info("Creating Notes")
    if connection is None:
        return jsonify({"error": "Database connection error"}), 500
    try:
        cursor = connection.cursor()

        # Extract data from the request
        data = request.get_json()
        user_id = data.get("user_id")  # Assuming you pass user_id in the request
        note_header = data.get("note_header")
        note_content = data.get("note_content")

        # Check if user_id exists in the table
        cursor.execute(
            """
            INSERT INTO Users (user_id)
            VALUES (%s)
            ON CONFLICT (user_id) DO NOTHING
        """,
            (user_id,),
        )

        # Insert the data into the Notes table
        cursor.execute(
            """
            INSERT INTO Notes (user_id, note_header,note_content)
            VALUES (%s, %s, %s)
        """,
            (user_id, note_header, note_content),
        )

        # Commit the transaction
        connection.commit()

        return jsonify({"message": "Note created successfully"}), 201
    except Exception as e:
        # Rollback the transaction in case of error
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # Close cursor and connection
        if connection:
            connection.close()


@app.route("/users/<int:user_id>/notes/<string:note_header>", methods=["DELETE"])
def remote_user_notes(user_id, note_header):
    app.logger.info("Deleting notes from user")
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection error"}), 500
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            DELETE FROM Notes WHERE user_id = %s AND note_header = %s

            """,
            (user_id, note_header),
        )
        connection.commit()  # Committing the changes
        if cursor.rowcount == 0:
            return (
                jsonify({"error": "No notes found for the given user and header"}),
                404,
            )
        return jsonify({"success": "Notes deleted"}), 200
    except Exception as e:
        connection.rollback()  # Roll back in case of error
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


# Route to retrieve all notes belonging to a user
@app.route("/users/<int:user_id>/notes", methods=["GET"])
def get_user_notes(user_id):
    app.logger.info("Gettings notes")
    connection = create_connection()
    if connection is None:
        return jsonify({"error": "Database connection error"}), 500
    try:
        cursor = connection.cursor()

        # Fetch notes belonging to the user
        cursor.execute(
            """
            SELECT * FROM Notes WHERE user_id = %s
        """,
            (user_id,),
        )
        notes = cursor.fetchall()

        notes_list = [
            {"user_id": note[1], "header": note[2], "content": note[3]}
            for note in notes
        ]
        return jsonify(notes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


# @app.before_first_request
def before_first_request_func():
    app.logger.info("Before first request initiate")
    create_database()
    # Connect to the PostgreSQL database and create tables if they don't exist
    connection = create_connection()
    if connection is not None:
        create_tables(connection)
        connection.close()


@app.route("/")
def home():
    return {"message": "This is root dir, use /users or /notes to interact with notes"}


# Main function
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
    app.logger.info("start up")
    with app.app_context():
        before_first_request_func()
