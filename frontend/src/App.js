import React, { useState } from 'react';
import './App.css';

function App() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/llm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log('Frontend API Response:', data);
            setResponse(data.text);
            setError(null);
        } catch (error) {
            console.error('Error in frontend request:', error);
            setError(error.message);
        }
    };

    return (
        <div className="App">
            <h1>Text-Based LLM Project</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt"
                />
                <button type="submit">Submit</button>
            </form>
            {response && (
                <div>
                    <h2>Response</h2>
                    <p>{response}</p>
                </div>
            )}
            {error && (
                <div>
                    <h2>Error</h2>
                    <pre>{error}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
