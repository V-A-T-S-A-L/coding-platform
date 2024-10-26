import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './codeSubmit.css'; // Add your styling here

const CodeSubmissionPage = () => {
    const { room_id, challenge_id } = useParams();
    const user = localStorage.getItem('user');
    const user_id = JSON.parse(user).id;


    const defaultCode = `import java.util.*;

class Main {
    public static void main(String[] args) {
        // Start code here
    }
}`;

    const [code, setCode] = useState(defaultCode);
    const [language, setLanguage] = useState('java');
    const [output, setOutput] = useState('Run code to check examples or custom test cases');
    const [challengeData, setChallengeData] = useState({});
    const [testCases, setTestCases] = useState([]);
    const [hiddenTestCases, setHiddenTestCases] = useState([]);
    const [executionTime, setExecutionTime] = useState('');
    const [memory, setMemory] = useState('');
    const [customCase, setCustomCase] = useState('');
    const [customOutput, setCustomOutpt] = useState('');
    
    const [outputs, setOutputs] = useState([]); // State to store outputs of all test cases
    const [selectedTestCase, setSelectedTestCase] = useState(0); // Track selected test case

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
                setHiddenTestCases(JSON.parse(response.data.hidden_test_cases));
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

    const handleCompile = async () => {
        console.warn("compile");

        setOutput("Loading..");

        const payload = {
            code,
            hiddenTestCases,
            challenge_id,
            room_id,
            user_id
        };

        try {
            const response = await axios.post('http://localhost:5000/submit', payload);
            const result = response.data;

            if(result.results && result.results.length > 0) {
                console.warn(result);
                const passedTestCases = result.passedTestCases;
                const totalExecTime = result.totalExecTime;
                setOutput('Test cases cleared: ' + passedTestCases + ' of 5' + '\nTotal execution time: ' + totalExecTime);
            } else {
                console.warn('No output received');
            }
        } catch(error) {
            console.warn(error);
        }
    }

    // Handle Submit - Run Code
    const handleSubmit = async () => {
        setOutput("Loading..");
        const exampleTestCases = [...testCases];

        if (customCase.trim()) {
            exampleTestCases.push({
                input: customCase,
                output: customOutput
            });
        }

        const payload = {
            code,
            exampleTestCases // Pass the array of test cases
        };

        try {
            const response = await axios.post('http://localhost:5000/execute', payload);
            const result = response.data;

            if (result.results && result.results.length > 0) {
                const outputList = result.results.map((r, idx) => {
                    const yourOutput = r.yourOutput.trim();
                    const expectedOutput = r.expectedOutput.trim();
                    const isPassed = yourOutput === expectedOutput;

                    return `Test Case ${idx + 1}:\nStatus: ${isPassed ? 'passed' : 'failed'}\nInput: ${r.input}\nYour Output: ${yourOutput}\nExpected Output: ${expectedOutput}\nExecution Time: ${r.execution_time}\n`;
                });

                setOutputs(outputList); // Set all test case outputs in state
                setSelectedTestCase(0); // Reset to the first test case output
            } else {
                setOutput('No output received');
            }
        } catch (error) {
            setOutput('Failed to execute the code.');
        }
    };

    // Handle test case selection
    const handleTestCaseSelect = (index) => {
        setSelectedTestCase(index);
    };

    return (
        <div className="code-submission-page">
            <div style={{display: "flex", justifyContent: "space-between"}}>
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
                    <pre>
                        <h3>Custom Test Case:</h3>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <input value={customCase} onChange={(e) => setCustomCase(e.target.value)} className='customTestCaseInput' type='text' placeholder='Enter input for test case'></input>
                            <input value={customOutput} onChange={(e) => setCustomOutpt(e.target.value)} className='customTestCaseInput' type='text' placeholder='Enter expected output'></input>
                        </div>
                    </pre>

                    <div className='output' style={{ maxHeight: '220px', overflowY: 'scroll', marginTop: '20px', backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
                        <h3>Output:</h3>
                        {outputs.length > 0 ? (
                            <>
                                <pre>{outputs[selectedTestCase]}</pre>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    {outputs.map((_, index) => (
                                        <button 
                                            key={index} 
                                            onClick={() => handleTestCaseSelect(index)}
                                            style={{ backgroundColor: selectedTestCase === index ? '#555' : '#333', color: 'white', padding: '5px 10px', cursor: 'pointer', border: 'none', borderRadius: '5px' }}>
                                            {/* Test Case {index + 1} */}
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <pre>{output}</pre>
                        )}
                    </div>
                </div>
                <div className='bar'></div>
                <div className="code-editor-section" style={{ padding: '20px' }}>
                    <div className='editor-div'>
                        <Editor
                            height="600px"
                            width="900px"
                            theme="vs-dark"
                            defaultLanguage={language}
                            value={code}
                            onChange={handleCodeChange}
                        />
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
                            Submit Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeSubmissionPage;
