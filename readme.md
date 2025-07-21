# Crimes Against Foodies

A fun project that generates interesting food combinations, and then uses AI to create an image of the "culinary crime."

## Features

*   **Random Food Combination Generator:** Generates random combinations of food items and preparation methods.
*   **"Lock" an Item:** Users can lock a generated food item to keep it while re-rolling the others.
*   **Themed Generators:** Users can select a theme (e.g., "Desserts," "Seafood") to get more specific food combinations.
*   **AI-Generated Images:** Users can generate an AI image of the created "culinary crime."
*   **Suggestion Box:** Users can suggest new food items and preparation methods.
*   **Admin Panel:** An admin panel to approve or reject user suggestions.

## Tech Stack

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend:** Python, Flask, SQLAlchemy
*   **Database:** SQLite
*   **Image Generation:** Google Gemini

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BGBondurant/CrimesAgainstFoodies.git
    ```
2.  **Install the backend dependencies:**
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  **Set up the database:**
    ```bash
    export FLASK_APP=backend/app.py
    flask db upgrade
    ```
4.  **Populate the database with initial data:**
    ```bash
    python backend/populate_db.py
    python backend/populate_categories.py
    ```
5.  **Set up Google Cloud Authentication:**
    - Create a service account and download the key as a JSON file.
    - Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of the JSON file.
    - Create a `.env` file in the `backend` directory and add the following:
    ```
    GCP_PROJECT_ID=your-gcp-project-id
    GCP_PROJECT_LOCATION=your-gcp-project-location
    ```
6.  **Run the Flask application:**
    ```bash
    python -m flask run
    ```
7.  **Open your browser and navigate to `http://127.0.0.1:5000`** (or the address shown in the terminal when you started the Flask application).

## Admin Panel

To access the admin panel, Alt+Click on the logo on the main page. The admin panel allows you to:

*   View dashboard statistics.
*   View and approve or reject user suggestions.

[Github Pages](https://bossarant.github.io/CrimesAgainstFoodies/)
