# app.py
from flask import Flask, request, jsonify
from static_analysis import analyze_code
import subprocess
import os

app = Flask(__name__)

def clone_repo(git_url, clone_dir='cloned_repo'):
    """Clone a GitHub repository to the specified directory."""
    if os.path.exists(clone_dir):
        subprocess.run(['rm', '-rf', clone_dir])
    subprocess.run(['git', 'clone', git_url, clone_dir])

@app.route('/analyze', methods=['POST'])
def analyze():
    """Endpoint to analyze a GitHub repository."""
    data = request.json
    repo_url = data.get('repo_url')
    if not repo_url:
        return jsonify({"error": "Repository URL is required"}), 400

    # Clone the repository
    clone_repo(repo_url)

    # Run static analysis on the cloned repo
    issues = analyze_code('cloned_repo')

    # Return the results
    return jsonify({"issues": issues})

if __name__ == '__main__':
    app.run(debug=True)
