# Crimes Against Foodies

A fun project that generates interesting food combinations, and then uses AI to create an image of the "culinary crime."

---

## Features

* **Random Food Combination Generator:** Generates random combinations of food items and preparation methods.
* **"Lock" an Item:** Users can lock a generated food item to keep it while re-rolling the others.
* **Themed Generators:** Users can select a theme (e.g., "Desserts," "Seafood") to get more specific food combinations.
* **AI-Generated Images:** Users can generate an AI image of the created "culinary crime."
* **Suggestion Box:** Users can suggest new food items and preparation methods.
* **Admin Panel:** An admin panel to approve or reject user suggestions.

---

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python, Flask, SQLAlchemy
* **Database:** SQLite
* **Image Generation:** Google Gemini

---

## How to Run (on Windows PowerShell)

These instructions are specifically for running the project on Windows using the PowerShell terminal.

1.  **Clone the repository:**
    ```powershell
    git clone [https://github.com/BGBondurant/CrimesAgainstFoodies.git](https://github.com/BGBondurant/CrimesAgainstFoodies.git)
    cd CrimesAgainstFoodies
    ```

2.  **Install the backend dependencies:**
    ```powershell
    pip install -r backend/requirements.txt
    ```

3.  **Set up the database:**
    ```powershell
    # Set the environment variable to point to your Flask app
    $env:FLASK_APP = "backend/app.py"

    # Run the database upgrade command
    python -m flask db upgrade
    ```

4.  **Populate the database with initial data:**
    ```powershell
    python backend/populate_db.py
    python backend/populate_categories.py
    ```

5.  **Set up Google Cloud Authentication:**

    **Part A: Service Account Key**
    Set the environment variable that points to your downloaded Google Cloud JSON key file.
    ```powershell
    $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\your\keyfile.json"
    ```
    **Important:** Replace `"C:\path\to\your\keyfile.json"` with the actual full path to the file on your computer.

    **Part B: Project ID and Location**
    These are **not commands** to run. You must create a file and put this text inside it.

    In the `backend` directory, create a new file named `.env` and add the following lines.
    ```
    GCP_PROJECT_ID=your-gcp-project-id
    GCP_PROJECT_LOCATION=your-gcp-project-location
    ```
    **Important:** Replace `your-gcp-project-id` and `your-gcp-project-location` with your actual credentials.

6.  **Run the Flask application:**
    ```powershell
    python -m flask run
    ```
<<<<<<< HEAD
7.  **Open your browser and navigate to `http://127.0.0.1:5000`** (or the address shown in the terminal when you started the Flask application).
=======
    Keep this terminal running. You should see output indicating the server is active at `http://127.0.0.1:5000/`.

7.  **Open the website:**
    In your file explorer, find and open the `index.html` file with your web browser.

---
>>>>>>> 3dd87373302ee79e821e968ca92f7c6cde2994ec

## Admin Panel

To access the admin panel, Alt+Click on the logo on the main page. The admin panel allows you to:

* View dashboard statistics.
* View and approve or reject user suggestions.
