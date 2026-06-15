import { useState } from 'react';
import axios from 'axios';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first'); return; }

    // FormData is how you send files over HTTP in JavaScript
    const formData = new FormData();
    formData.append('resume', file);  // 'resume' must match upload.single('resume') in backend

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/resume/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'  // required for file uploads
        }
      });
      setResult(res.data);
    } catch (err) {
      setError('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <h2>Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={e => setFile(e.target.files[0])}
      />

      {file && <p>Selected: {file.name}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {result && (
        <div className="results">
          <h3>ATS Score: {result.atsScore}%</h3>
          <h4>Skills Found:</h4>
          {result.skills.map((s, i) => <span key={i} className="chip">{s}</span>)}
          <h4>Missing Skills:</h4>
          {result.missing.map((s, i) => <span key={i} className="chip missing">{s}</span>)}
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;