# GitHub Project Code Analysis Tool

The Code Analysis Tool is designed to assist developers in reviewing and analyzing code from GitHub repositories. It identifies common code issues, provides actionable feedback, and offers insights into project structure through an intuitive front-end and a robust back-end application.

## Project Structure

```
├── app.py                  # Main Flask application
├── static_analysis.py      # Logic for static code analysis
├── bug_prediction.ipynb    # Jupyter Notebook for bug prediction analysis
├── nodel.ipynb             # Jupyter Notebook for additional data modeling
├── code-analysis-frontend/          # React-based front-end application
│   ├── public/             # Static assets for the React app
│   ├── src/                # Source code for the React app
│   │   ├── components/     # Individual React components
│   │   ├── App.js          # Main entry point for the React app
│   └── package.json        # React app dependencies
├── .gitignore              # Files and directories to be ignored by Git
├── README.md               # Project documentation
└── __pycache__/            # Auto-generated directory for compiled Python files
```

## Prerequisites

Ensure you have the following installed before setting up the project:

- **Python** (3.6 or higher)
- **Node.js** and **npm** (Node Package Manager)
- **OpenAI API Key**: Obtain an API key from [OpenAI](https://platform.openai.com/signup/) and set it in your environment variables.

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/rayraycodes/code-analysis.git
cd code-analysis
```

### Step 2: Set Up the Back-End (Flask)

1. **Set the OpenAI API Key:**
   - Create a `.env` file in the project root directory and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key
     ```

2. **Install Dependencies:**
   ```bash
   pip install flask pylint
   ```

3. **Run the Flask Application:**
   ```bash
   python app.py
   ```
   The Flask application will run at `http://localhost:5000`.

### Step 3: Set Up the Front-End (React)

1. **Navigate to the React Directory:**
   ```bash
   cd code-analysis-frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the React Application:**
   ```bash
   npm start
   ```
   The React application will run at `http://localhost:3000`.

## Usage

1. **Start the Flask Back-End:**
   ```bash
   python app.py
   ```

2. **Start the React Front-End:**
   Navigate to the `code-analysis-front-end` directory and run:
   ```bash
   npm start
   ```

3. **Analyze a GitHub Repository:**
   - Open your browser and go to `http://localhost:3000`.
   - Enter a GitHub repository URL in the input field and click "Analyze".
   - The tool will perform static analysis and display results, including code feedback, project details, and open issues.

4. **Run Jupyter Notebooks for Advanced Analysis:**
   - Open the `bug_prediction.ipynb` or `nodel.ipynb` notebook using Jupyter Notebook.
   - These notebooks contain advanced models for bug prediction and data modeling.

## Key Components

- **Flask Back-End (`app.py`)**:
  - Handles API requests, repository processing, and code analysis.
  - Communicates with the OpenAI API for reviewing and analyzing code snippets.

- **Static Analysis Module (`static_analysis.py`)**:
  - Contains logic to detect code smells and identify common issues in supported programming languages.

- **React Front-End (`code-analysis-frontend/`)**:
  - Provides an interactive user interface for analyzing repositories and viewing results.
  - Displays feedback, README content, and open issues in a structured format.

- **Jupyter Notebooks (`bug_prediction.ipynb`, `nodel.ipynb`)**:
  - `bug_prediction.ipynb`: Implements bug prediction analysis with data science methods.
  - `nodel.ipynb`: Focuses on additional modeling and exploratory data analysis.

## Running Tests

1. **Unit Tests for Static Analysis:**
   - Add test cases to a `tests/` directory.
   - Use a Python testing framework like `unittest` to validate the static analysis logic.

## Troubleshooting

- **ModuleNotFoundError:**
  - Ensure Flask is installed by running `pip install flask`.

- **React App Not Starting:**
  - Check that you are in the `code-analysis-frontend` directory and that `npm install` completed successfully.

- **CORS Issues:**
  - Install and configure Flask-CORS in the back-end to allow cross-origin requests.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Authors

- **Regan Maharjan** - [GitHub Profile](https://github.com/rayraycodes)
- **Other Contributors** - [Contributors Page](https://github.com/rayraycodes/code-analysis/contributors)

## Acknowledgments

- Special thanks to the open-source community for tools like Flask and React that made this project possible.

