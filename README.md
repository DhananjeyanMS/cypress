# Test Automation Framework for Login Functionality
This project is a test automation framework developed using Cypress to automate and validate the login functionality for a sample web application. The framework is designed to cover both positive and negative scenarios, ensuring robust login workflows, session handling, and basic security check.

## Prerequisites
- Node.js installed (preferably the latest LTS version).
- Cypress installed (installation steps included below).
- Python installed.

## 1. How to Run the Python (Flask) Application
First clone the repository to local.
Then

1. **Navigate to the Application Directory**:
   Go to the `Login application` folder:

   ```bash
   cd "Login application"
   ```

2. **Set Up a Virtual Environment (Optional)**:
   It’s recommended to create a virtual environment to manage dependencies.

   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Flask**:
   ```bash
   pip install Flask Flask-Session
   ```

4. **Run the Application**:
   Start the Flask server:

   ```bash
   python app.py
   ```

   The application will be accessible at `http://127.0.0.1:5000`.


## 2. How to Run Cypress Tests

1. **Navigate to the Root Project Directory**:
   Go back to the root directory of the project:

   ```bash
   cd ..
   ```

2. **Install Cypress Dependencies**:
   Use npm to install Cypress and other project dependencies:

   ```bash
   npm install
   ```

3. **Open Cypress in Interactive Mode**:
   To open Cypress Test Runner:

   ```bash
   npx cypress open
   ```

   In the Test Runner, click on a test file to run it interactively.

4. **Run Cypress Tests in Headless Mode**:
   To run the tests in headless mode:

   ```bash
   npx cypress run
   ```
Note : The reports will only be generated if cypress is run headless using above command and generated reports will be under cypress/reports folder as mochawesome###.html which can be viewed in local browser.
---
