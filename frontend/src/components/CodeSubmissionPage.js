import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import SplitPane from 'react-split-pane';
import axios from 'axios';
import './codeSubmit.css'; // Add your styling here

const CodeSubmissionPage = () => {
    const { room_id, challenge_id } = useParams();

    const defaultCode = `import java.util.*;

class Main {
    public static void main(String[] args) {

        // Start code here
    }
}`

    const [code, setCode] = useState(defaultCode);
    const [language, setLanguage] = useState('java');
    const [output, setOutput] = useState('Run code to check example test cases');
    const [challengeData, setChallengeData] = useState({});
    const [testCases, setTestCases] = useState([]);
    const [executionTime, setExecutionTime] = useState('');
    const [memory, setMemory] = useState('');

    // Judge0 API URL
    const JUDGE0_API_URL = 'https://api.judge0.com/submissions/?base64_encoded=false&wait=true';

    // Mapping of languages to Judge0 language IDs
    const languageIDs = {
        java: 62,
        python: 71,
        cpp: 54
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get-challenge-data/${challenge_id}`);
                setChallengeData(response.data);
                setTestCases(JSON.parse(response.data.example_test_cases)); // Parsing the test cases
            } catch (error) {
                console.warn('Error fetching code data', error);
            }
        };

        getData();
    }, [challenge_id]);

    // Handle code change in editor
    const handleCodeChange = (value) => {
        setCode(value);
    };

    // Compile Code using Judge0
    const handleCompile = async () => {
        const submissionData = {
            source_code: code,
            language_id: languageIDs[language],
            stdin: testCases[0]?.input || '', // Example test case input
        };

        try {
            const response = await axios.post(JUDGE0_API_URL, submissionData);
            const { stdout, stderr, compile_output } = response.data;

            if (stderr) {
                setOutput(`Error: ${stderr}`);
            } else if (compile_output) {
                setOutput(`Compilation Error: ${compile_output}`);
            } else {
                setOutput(`Output: ${stdout}`);
            }
        } catch (error) {
            console.error('Compilation Error:', error);
            setOutput('Failed to compile the code.');
        }
    };

    // Run Code using Judge0
    const handleRun = async () => {
        let testResults = '';
        for (let i = 0; i < testCases.length; i++) {
            const submissionData = {
                source_code: code,
                language_id: languageIDs[language],
                stdin: testCases[i].input, // Using test case input
            };

            try {
                const response = await axios.post(JUDGE0_API_URL, submissionData);
                const { stdout, stderr, compile_output } = response.data;

                if (stderr) {
                    testResults += `Test Case ${i + 1}: Error: ${stderr}\n`;
                } else if (compile_output) {
                    testResults += `Test Case ${i + 1}: Compilation Error: ${compile_output}\n`;
                } else {
                    const expectedOutput = testCases[i].output.trim();
                    const actualOutput = stdout.trim();
                    const result = expectedOutput === actualOutput ? 'Passed' : 'Failed';
                    testResults += `Test Case ${i + 1}: ${result}\nExpected: ${expectedOutput}\nReceived: ${actualOutput}\n\n`;
                }
            } catch (error) {
                console.error('Execution Error:', error);
                testResults += `Test Case ${i + 1}: Failed to execute.\n\n`;
            }
        }

        setOutput(testResults);
    };

    const handleSubmit = async () => {
        setOutput("Loading..");
        const exampleTestCases = testCases;

        const payload = {
            code,
            exampleTestCases  // Pass the array of test cases
        };

        try {
            const response = await axios.post('http://localhost:5000/execute', payload);
            const result = response.data;

            if (result.results && result.results.length > 0) {
                const outputs = result.results.map((r, idx) => {
                    const yourOutput = r.yourOutput.trim(); // Trim your output
                    const expectedOutput = r.expectedOutput.trim(); // Trim expected output

                    const isPassed = yourOutput === expectedOutput; // Check for equality

                    return `Test Case ${idx + 1}:\n` +
                        `Status: ${isPassed ? 'passed' : 'failed'}\n` +
                        `Input: ${r.input}\n` +
                        `Your Output: ${yourOutput}\n` +
                        `Expected Output: ${expectedOutput}\n` +
                        `Execution Time: ${r.execution_time}\n`;
                }).join("\n");

                setOutput(outputs);
            } else {
                setOutput('No output received');
            }
        } catch (error) {
            setOutput('Failed to execute the code.');
        }
    };


    return (
        <div className="code-submission-page">
            <SplitPane split="vertical" minSize={400} defaultSize="40%" className="split-pane">
                {/* Left Column - Problem Explanation */}
                <div className="problem-explanation">
                    <h2>Problem: {challengeData.problem_name}</h2>
                    <p>Explanation: {challengeData.explanation}</p>
                    <h3>Example Test Cases:</h3>
                    {testCases.map((testCase, index) => (
                        <pre key={index}>
                            <strong>Input:</strong> {testCase.input}
                            <br />
                            <strong>Output:</strong> {testCase.output}
                        </pre>
                    ))}
                    {/* Output Section */}
                    {/* {output && (
                        <div style={{ overflowY: 'scroll', marginTop: '20px', backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
                            <h3>Output:</h3>
                            <pre>{output}</pre>
                        </div>
                    )} */}
                    <div style={{ overflowY: 'scroll', marginTop: '20px', backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
                        <h3>Output:</h3>
                        <pre>{output}</pre>
                    </div>
                </div>

                {/* Right Column - Code Editor */}
                <div className="code-editor-section" style={{ padding: '20px' }}>
                    {/* Monaco Editor */}
                    <Editor
                        height="600px"
                        theme="vs-dark"
                        defaultLanguage={language}
                        value={code}
                        onChange={handleCodeChange}
                    />

                    {/* Buttons for Run and Compile */}
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleSubmit}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#080808',
                                border: '1px solid white',
                                color: 'white',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Run Code
                        </button>

                        <button
                            onClick={handleCompile}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#080808',
                                border: '1px solid white',
                                color: 'white',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Compile Code
                        </button>
                    </div>
                </div>
            </SplitPane>
        </div>
    );
};

export default CodeSubmissionPage;
