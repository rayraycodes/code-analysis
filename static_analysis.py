
import subprocess
import json

def run_pylint(file_path):
    """Run pylint on a given file and return the output."""
    result = subprocess.run(
        ['pylint', file_path, '--output-format=json'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    # Parse the output as JSON
    pylint_output = json.loads(result.stdout)
    return pylint_output

def analyze_code(repo_path):
    """Analyze code in a given repository."""
    # List of detected issues
    issues = []
    # Example file to analyze
    file_to_analyze = f"{repo_path}/example.py"
    pylint_results = run_pylint(file_to_analyze)
    for issue in pylint_results:
        issues.append({
            "message": issue["message"],
            "line": issue["line"],
            "type": issue["type"],
            "module": issue["module"]
        })
    return issues

if __name__ == '__main__':
    repo_path = './sample_repo'  # Path to a local repository
    issues = analyze_code(repo_path)
    print("Detected Issues:")
    for issue in issues:
        print(issue)
