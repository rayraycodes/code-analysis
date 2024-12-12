import React, { useState } from 'react';
import axios from 'axios';

function CodeAnalysis() {
  const [repoUrl, setRepoUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const [readmeContent, setReadmeContent] = useState('');
  const [openIssues, setOpenIssues] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setAnalysisResults([]);
    setLoading(true);
    
    if (!isValidUrl(repoUrl)) {
      setError('Invalid URL');
      setLoading(false);
      return;
    }

    const sanitizedUrl = sanitizeInput(repoUrl);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        repoUrl: sanitizedUrl,
      });

      const data = response.data;
      setAnalysisResults(data.analysisResults);
      setReadmeContent(data.readmeContent);
      setOpenIssues(data.openIssues);
    } catch (error) {
      setError('Failed to fetch analysis results');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    },
    input: {
      margin: '10px 0',
      padding: '10px',
      width: '80%',
      maxWidth: '400px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    resultsContainer: {
      textAlign: 'left',
      maxWidth: '1400px',
      margin: '20px auto',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '5px',
      overflow: 'auto',
      fontSize: '1rem',
    },
    resultItem: {
      width: '100%',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
      textAlign: 'left',
    },
    error: {
      color: 'red',
      marginTop: '10px',
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
      maxWidth: '800px',
      maxHeight: '400px',
      margin: '20px auto',
      padding: '10px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '5px',
      overflow: 'auto',
    },
    issueItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '10px',
    },
    issueTitle: {
      fontWeight: 'bold',
    },
    loading: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginTop: '10px',
    },
  };
  
  const preprocessText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Make text between ** bold
      .replace(/###\s*(.*?)/g, '$1'); // Make text after ### bold
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
      {loading && <p style={styles.loading}>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {analysisResults.length > 0 && (
        <div style={styles.resultsContainer}>
          <h3>Analysis Results</h3>
          {analysisResults.map((result, index) => (
            <div key={index} style={styles.resultItem}>
              <pre>{preprocessText(result)}</pre>
            </div>
          ))}
        </div>
      )}
      {readmeContent && (
        <div style={styles.readme}>
          <h3>README</h3>
          <pre>{readmeContent}</pre>
        </div>
      )}
      {openIssues.length > 0 && (
        <div style={styles.issues}>
          <h3>Open Issues</h3>
          <ul style={styles.results}>
            {openIssues.map((issue, index) => (
              <li key={index} style={styles.issueItem}>
                <span style={styles.issueTitle}>{issue.title}</span> by {issue.user.login} <br />
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