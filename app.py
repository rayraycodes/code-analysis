import os
import shutil
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import git
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# Get the OpenAI API key from the environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define prompts for different file types
file_prompts = {
    '.py': "Review and analyze this Python code snippet. Provide suggestions for improvements:\n\n{snippet}",
    '.js': "Review and analyze this JavaScript code snippet. Provide suggestions for improvements:\n\n{snippet}",
    '.java': "Review and analyze this Java code snippet. Provide suggestions for improvements:\n\n{snippet}",
    '.cpp': "Review and analyze this C++ code snippet. Provide suggestions for improvements:\n\n{snippet}",
    # Add more file types and prompts as needed
}

def clone_repository(repo_url, base_path):
    """
    Clones a repository from the given URL to the local base path.

    :param repo_url: URL of the repository to clone
    :param base_path: Base directory for cloning repositories
    :return: Local path to the cloned repository
    """
    app.logger.info(f"Cloning repository from {repo_url} to {base_path}")
    
    if not os.path.exists(base_path):
        os.makedirs(base_path)
        app.logger.info(f"Created base path: {base_path}")

    repo_name = repo_url.split('/')[-1].replace('.git', '')
    local_path = os.path.join(base_path, repo_name)

    if os.path.exists(local_path):
        shutil.rmtree(local_path)  # Remove existing directory
        app.logger.info(f"Removed existing directory: {local_path}")

    git.Repo.clone_from(repo_url, local_path)
    app.logger.info(f"Cloned repository to {local_path}")
    
    change_permissions(local_path)
    app.logger.info(f"Changed permissions for {local_path}")
    
    return local_path

def change_permissions(path):
    """
    Changes the read and write permissions for the given path.

    :param path: Path to the directory or file
    """
    app.logger.info(f"Changing permissions for {path}")
    for root, dirs, files in os.walk(path):
        for dir in dirs:
            os.chmod(os.path.join(root, dir), 0o777)
        for file in files:
            os.chmod(os.path.join(root, file), 0o666)

def read_code_files(local_path):
    """
    Reads code files from the given repository path based on their extensions.

    :param local_path: Path to the cloned repository
    :return: List of tuples containing file extensions and code snippets
    """
    app.logger.info(f"Reading code files from {local_path}")
    code_snippets = []
    for root, dirs, files in os.walk(local_path):
        # Skip the .git directory
        if '.git' in dirs:
            dirs.remove('.git')

        for file in files:
            file_extension = os.path.splitext(file)[1]
            if file_extension in file_prompts:
                try:
                    with open(os.path.join(root, file), 'r', errors='ignore') as f:
                        code_snippets.append((file_extension, f.read()))
                        app.logger.info(f"Read file: {file}")
                except (PermissionError, IOError) as e:
                    app.logger.warning(f"Skipping file {file}: {e}")
    return code_snippets

def review_code(code_snippet, language='Python'):
    app.logger.info(f"Reviewing code snippet for language: {language}")
    message = [
        {"role": "system", "content": "You are a code review assistant."},
        {"role": "user", "content": f"Review and analyze this {language} code snippet. Provide suggestions for improvements:\n\n{code_snippet}"}
    ]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=message
    )
    return response.choices[0].message.content

def analyze_code_snippets(code_snippets):
    """
    Uses OpenAI API to analyze provided code snippets.

    :param code_snippets: List of tuples containing file extensions and code snippets
    :return: List of analysis results
    """
    app.logger.info("Analyzing code snippets")
    analysis_results = []
    for file_extension, snippet in code_snippets:
        language = file_extension.lstrip('.')
        analysis_result = review_code(snippet, language)
        app.logger.info(f"Analyzed snippet for {language}")
        analysis_results.append(analysis_result)
    return analysis_results

def read_readme(local_path):
    """
    Reads the README.md file from the repository if it exists.

    :param local_path: Path to the cloned repository
    :return: Content of the README file
    """
    app.logger.info(f"Reading README file from {local_path}")
    readme_path = os.path.join(local_path, 'README.md')
    if os.path.exists(readme_path):
        with open(readme_path, 'r', errors='ignore') as f:
            return f.read()
    return ""

def fetch_open_issues(repo_url):
    """
    Fetches open issues from the GitHub API for the given repository URL.

    :param repo_url: URL of the repository
    :return: List of open issues
    """
    app.logger.info(f"Fetching open issues for {repo_url}")
    repo_path = repo_url.replace('https://github.com/', '').replace('.git', '')
    issues_response = requests.get(f"https://api.github.com/repos/{repo_path}/issues?state=open")
    return issues_response.json() if issues_response.ok else []

@app.route('/api/analyze', methods=['POST'])
def analyze_repo():
    """
    Main endpoint to analyze a GitHub repository.

    Request Body:
        {
            "repoUrl": "<repository_url>"
        }

    Response:
        {
            "analysisResults": [<list_of_analysis_results>],
            "readmeContent": "<readme_content>",
            "openIssues": [<list_of_open_issues>]
        }
    """
    try:
        data = request.json
        repo_url = data.get("repoUrl", "")
        app.logger.info(f"Received request to analyze repository: {repo_url}")
        
        # Define the local path for cloning the repository inside the code-analysis/cloned_repos directory
        base_path = os.path.join(os.getcwd(), 'cloned_repos')
        local_path = clone_repository(repo_url, base_path)
        
        # Read all code files in the repository
        code_snippets = read_code_files(local_path)
        
        # Analyze the code using OpenAI API
        analysis_results = analyze_code_snippets(code_snippets)
        
        # Read README file
        readme_content = read_readme(local_path)
        
        # Fetch open issues from GitHub API
        open_issues = fetch_open_issues(repo_url)

        app.logger.info("Analysis complete")
        return jsonify({
            "analysisResults": analysis_results,
            "readmeContent": readme_content,
            "openIssues": open_issues
        })
    except Exception as e:
        app.logger.error(f"Unexpected error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)