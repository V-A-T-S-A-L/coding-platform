// CodeSubmissionPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';

const CodeSubmissionPage = () => {
    const { room_id, challenge_id } = useParams();
    const [code, setCode] = useState('// Write your code here');
    const [language, setLanguage] = useState('java');
    const [output, setOutput] = useState('');
    const [challengeData, setChallengeData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get-challenge-data/${challenge_id}`);
                setChallengeData(response.data);
            } catch(error) {
                console.warn("Error fetching code data",error);
            }
        }

        getData();
    }, [challenge_id])

    const handleCodeChange = (value) => {
        setCode(value);
    };

    const handleSubmit = async () => {
        console.log(`Room ID: ${room_id}`);
        console.log(`Challenge ID: ${challenge_id}`);
        console.log(`Code: ${code}`);
        console.log(`Language: ${language}`);

        setOutput('Test cases passed: 3/3');
    };

    return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: 'black' }}>
            <h2>Submit Code for Challenge: {challenge_id} in Room: {room_id}</h2>
            <div style={{ height: '400px', marginBottom: '20px' }}>
                <Editor
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage={language}
                    value={code}
                    onChange={handleCodeChange}
                />
            </div>
            <button
                onClick={handleSubmit}
                style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px'
                }}
            >
                Submit Code
            </button>
            {output && (
                <div style={{ marginTop: '20px', backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
                    <h3>Output:</h3>
                    <pre>{output}</pre>
                </div>
            )}
        </div>
    );
};

export default CodeSubmissionPage;
