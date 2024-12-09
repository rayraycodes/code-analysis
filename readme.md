
# Code Analysis Tool

This project is a code analysis tool that helps developers review code by identifying common code issues and providing feedback. It consists of a back-end Flask application that performs static analysis on code from GitHub repositories and a front-end React application that allows users to interact with the tool.

## Project Structure

```
├── app.py                  # Main Flask application
├── static_analysis.py      # Code analysis logic for detecting code smells
├── code-analysis-front-end/          # React front-end for the code analysis tool
│   ├── public/             # Static files for the React app
│   ├── src/                # Source code for the React app
│   │   ├── components/     # React components
│   │   ├── App.js          # Main entry point for the React app
│   └── package.json        # Dependencies for the React app
├── .gitignore              # Specifies files to be ignored by Git
├── README.md               # This README file
└── __pycache__/            # Auto-generated directory for compiled Python files
```

## Prerequisites

Before you begin, ensure you have the following software installed:

- **Python** (version 3.6 or higher)
- **Node.js** and **npm** (Node Package Manager)

## Installation

Follow these steps to set up the project:

### 1. Clone the Repository

```bash
git clone https://github.com/rayraycodes/code-analysis.git
cd code-analysis
```

### 2. Set Up the Back-End (Flask)

1. **Install Flask** and other dependencies:
   ```bash
   pip install flask pylint
   ```

2. **Run the Flask app**:
   ```bash
   python app.py
   ```
   The Flask application should now be running at `http://localhost:5000`.

### 3. Set Up the Front-End (React)
npm install
   ```bash
   cd code-analysis
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Start the React app**:
   ```bash
   npm start
   ```
   The React app should now be running at `http://localhost:3000`.

## Usage

1. **Start the Flask application**:
   Run the following command in the project root directory:
   ```bash
   python app.py
   ```

2. **Start the React application**:
   In a new terminal window, navigate to the `code-analysis` directory and run:
   ```bash
   npm start
   ```

3. **Open a web browser** and go to `http://localhost:3000` to use the tool.

4. **Enter a GitHub repository URL** into the input field and click "Analyze" to perform static analysis on the repository. The results will be displayed on the page.

## Project Overview

The project includes the following key components:

- **Flask Back-End (`app.py`)**: This script sets up the server, provides the `/analyze` endpoint, and performs static code analysis using `static_analysis.py`.
- **Static Analysis (`static_analysis.py`)**: This script contains the logic for analyzing the code, such as detecting code smells.
- **React Front-End (`code-analysis/`)**: This directory contains the source code for the React app, which provides a user interface to interact with the code analysis tool.

## Key Files

- **`app.py`**: Main Flask application that runs the back-end server.
- **`static_analysis.py`**: Contains the logic for performing static analysis on the code.
- **`code-analysis/`**: This folder contains the React front-end source code.
- **`package.json`**: Specifies dependencies for the React app.
- **`README.md`**: This file, providing project information and setup instructions.

## Running Tests

### Unit Tests

You can run unit tests for the static analysis script by adding tests to a `tests/` directory and using a testing framework like `unittest` in Python.

## Troubleshooting

1. **ModuleNotFoundError: No module named 'flask'**
   - Make sure Flask is installed by running `pip install flask`.

2. **React App Not Starting**
   - If the React app doesn't start, ensure you are in the `code-analysis` directory and that `npm install` completed successfully.

3. **CORS Issues**
   - If you face CORS issues, consider using a browser extension to enable CORS or configure Flask to allow cross-origin requests.

## Contributing

Contributions are welcome! Please fork the repository, make changes, and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Authors

- [Regan Maharjan - Group 7 - CIS 580](https://github.com/rayraycodes)
- [Other Contributors](https://github.com/rayraycodes)

## Acknowledgments

- Thanks to the open-source community for tools like Flask and React that make projects like this possible.
