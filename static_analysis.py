import subprocess
import json
import os
import nbformat

def run_pylint(file_path):
    try:
        result = subprocess.run(
            ['pylint', file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        return e.stderr

def extract_code_from_ipynb(file_path):
    """Extract Python code from a Jupyter notebook."""
    with open(file_path, 'r') as f:
        notebook = nbformat.read(f, as_version=4)
    
    code = []
    # Extract code from code cells
    for cell in notebook.cells:
        if cell.cell_type == 'code':
            code.append(cell.source)
    
    return "\n".join(code)

def analyze_code(repo_path):
    """Analyze code in a given repository."""
    issues = []
    
    # Loop through all files in the repository
    for root, dirs, files in os.walk(repo_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            
            # Analyze Python files (.py)
            if file_name.endswith('.py'):
                pylint_results = run_pylint(file_path)
                for issue in pylint_results:
                    issues.append({
                        "message": issue["message"],
                        "line": issue["line"],
                        "type": issue["type"],
                        "module": issue["module"]
                    })
            
            # Analyze Jupyter notebook files (.ipynb)
            elif file_name.endswith('.ipynb'):
                notebook_code = extract_code_from_ipynb(file_path)
                # Save the extracted code to a temporary file
                with open('temp_code.py', 'w') as temp_file:
                    temp_file.write(notebook_code)
                pylint_results = run_pylint('temp_code.py')
                os.remove('temp_code.py')  # Clean up temporary file
                
                for issue in pylint_results:
                    issues.append({
                        "message": issue["message"],
                        "line": issue["line"],
                        "type": issue["type"],
                        "module": issue["module"]
                    })
    
    return issues

if __name__ == '__main__':
    repo_path = 'C:/Users/regan/code-analysis/sample_repo'  # Path to a local repository
    issues = analyze_code(repo_path)
    print("Detected Issues:")
    for issue in issues:
        print(issue)
