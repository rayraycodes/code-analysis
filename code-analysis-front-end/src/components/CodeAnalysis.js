import React, { useState } from 'react';

function CodeAnalysis() {
  const [repoUrl, setRepoUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const [readmeContent, setReadmeContent] = useState('');
  const [openIssues, setOpenIssues] = useState([]);
  const [error, setError] = useState('');

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const sanitizeInput = (input) => {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  };

  const analyzeRepo = async () => {
    setError('');
    setReadmeContent('');
    setOpenIssues([]);
    if (!isValidUrl(repoUrl)) {
      setError('Invalid URL');
      return;
    }

    const sanitizedUrl = sanitizeInput(repoUrl);
    const repoPath = sanitizedUrl.replace('https://github.com/', '');

    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAnalysisResults([data]);

      const readmeResponse = await fetch(`https://api.github.com/repos/${repoPath}/readme`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!readmeResponse.ok) {
        throw new Error('Failed to fetch README');
      }

      const readmeData = await readmeResponse.json();
      const decodedContent = atob(readmeData.content);
      setReadmeContent(decodedContent);

      const issuesResponse = await fetch(`https://api.github.com/repos/${repoPath}/issues?state=open`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!issuesResponse.ok) {
        throw new Error('Failed to fetch issues');
      }

      const issuesData = await issuesResponse.json();
      setOpenIssues(issuesData);
    } catch (error) {
      setError('Failed to fetch analysis results');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      padding: '10px',
    },
    input: {
      margin: '10px 0',
      padding: '10px',
      width: '300px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    results: {
      listStyleType: 'none',
    },
    error: {
      color: 'red',
    },
    readme: {
      textAlign: 'left',
      maxWidth: '600px',
      margin: '20px auto',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '5px',
      overflow: 'auto',
    },
    issues: {
      textAlign: 'left',
      maxWidth: '800px', // Increased width
      maxHeight: '400px', // Added max height
      margin: '20px auto',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '5px',
      overflow: 'auto',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Code Analysis Tool</h2>
      <input
        style={styles.input}
        type="text"
        placeholder="Enter GitHub repository URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button style={styles.button} onClick={analyzeRepo}>Analyze</button>
      {error && <p style={styles.error}>{error}</p>}
      <h3>Analysis Results</h3>
      <ul style={styles.results}>
        {analysisResults.map((repo, index) => (
          <li key={index}>
            <strong>{repo.full_name}</strong>: {repo.description} <br />
            <strong>Stars:</strong> {repo.stargazers_count} <br />
            <strong>Forks:</strong> {repo.forks_count} <br />
            <strong>Open Issues:</strong> {repo.open_issues_count} <br />
            <strong>Primary Language:</strong> {repo.language} <br />
            <strong>Owner:</strong> {repo.owner.login} <br />
            <strong>Created At:</strong> {new Date(repo.created_at).toLocaleDateString()} <br />
            <strong>Last Updated:</strong> {new Date(repo.updated_at).toLocaleDateString()} <br />
          </li>
        ))}
      </ul>
      {readmeContent && (
        <div style={styles.readme}>
          <h3>README</h3>
          <pre>{readmeContent}</pre>
        </div>
      )}
      {openIssues.length > 0 && (
        <div style={styles.issues}>
          <h3>Open Issues</h3>
          <ul>
            {openIssues.map((issue, index) => (
              <li key={index}>
                <strong>{issue.title}</strong> by {issue.user.login} <br />
                {issue.body}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CodeAnalysis;