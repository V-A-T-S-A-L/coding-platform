import React, { useState, useEffect } from 'react';
import { json, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import SplitPane from 'react-split-pane';
import axios from 'axios';
import './codeSubmit.css'; // Add your styling here

const CodeSubmissionPage = () => {
    const { room_id, challenge_id } = useParams();
    const [code, setCode] = useState('// Write your code here');
    const [language, setLanguage] = useState('java');
    const [output, setOutput] = useState('');
    const [challengeData, setChallengeData] = useState([]);
    const [testCases, setTestCases] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get-challenge-data/${challenge_id}`);
                setChallengeData(response.data);
                console.warn(response.data);
                setTestCases(JSON.parse(response.data.example_test_cases));
            } catch (error) {
                console.warn("Error fetching code data", error);
            }
        }

        getData();
    }, [challenge_id])

    // Handle code change in editor
    const handleCodeChange = (value) => {
        setCode(value);
    };

    // Run Code
    const handleRun = () => {
        console.log("Running code...");
        setOutput('Test cases passed: 3/3 (Run Output)');
    };

    // Compile Code
    const handleCompile = () => {
        console.log("Compiling code...");
        setOutput('Code compiled successfully! No errors.');
    };

    return (
        <div className="code-submission-page">
            <SplitPane split="vertical" minSize={400} defaultSize="45%" className="split-pane">
                {/* Left Column - Problem Explanation */}
                <div className="problem-explanation">
                    <h2>Problem: {challengeData.problem_name}</h2>
                    <p>Explanation: {challengeData.explanation}</p>
                    <h3>Example:</h3>
                    {testCases.map((testCase, index) => (
                        <pre>
                            Input: {testCase.input}
                            <br />
                            Output: {testCase.output}
                        </pre>
                    ))}
                </div>

                {/* Right Column - Code Editor */}
                <div className="code-editor-section" style={{ padding: '20px' }}>
                    {/* Language Selector */}
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="language">Select Language: </label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>

                    {/* Monaco Editor */}
                    <Editor
                        height="400px"
                        theme="vs-dark"
                        defaultLanguage={language}
                        value={code}
                        onChange={handleCodeChange}
                    />

                    {/* Buttons for Run and Compile */}
                    <div style={{ marginTop: '10px' }}>
                        <button
                            onClick={handleRun}
                            style={{
                                marginRight: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Run Code
                        </button>

                        <button
                            onClick={handleCompile}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#008CBA',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Compile Code
                        </button>
                    </div>

                    {/* Output Section */}
                    {output && (
                        <div style={{ marginTop: '20px', backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
                            <h3>Output:</h3>
                            <pre>{output}</pre>
                        </div>
                    )}
                </div>
            </SplitPane>
        </div>
    );
};

export default CodeSubmissionPage;
