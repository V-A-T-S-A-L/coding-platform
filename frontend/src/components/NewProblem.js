import React, { useState } from 'react';
import './CreateChallenge.css';

const CreateChallenge = ({ roomId }) => {
    const [problemName, setProblemName] = useState('');
    const [explanation, setExplanation] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [deadline, setDeadline] = useState('');
    const [exampleTestCases, setExampleTestCases] = useState([{ input: '', output: '' }, { input: '', output: '' }]);
    const [hiddenTestCases, setHiddenTestCases] = useState([
        { input: '', output: '' }, { input: '', output: '' }, { input: '', output: '' }, { input: '', output: '' }, { input: '', output: '' }
    ]);

    const handleSubmit = async () => {
        const challengeData = {
            problemName,
            explanation,
            difficulty,
            deadline,
            exampleTestCases,
            hiddenTestCases,
            roomId
        };

        try {
            const response = await fetch(`http://localhost:5000/create-challenge/${roomId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(challengeData),
            });

            if (response.ok) {
                alert("Challenge created successfully");
            } else {
                console.error("Failed to create challenge");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="create-challenge-container">
            <div className="left-column">
                <div className="card">
                    <h2>Create New Challenge</h2>
                    <div className="field-group">
                        <label>Problem Name</label>
                        <input type="text" value={problemName} onChange={(e) => setProblemName(e.target.value)} />
                    </div>
                    <div className="field-group">
                        <label>Explanation</label>
                        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} />
                    </div>
                    <div className="field-group">
                        <label>Difficulty</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <div className="field-group">
                        <label>Deadline</label>
                        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                    </div>
                </div>

                <div className="card">
                    <h3>Example Test Cases</h3>
                    {exampleTestCases.map((testCase, index) => (
                        <div key={index} className="field-group">
                            <label>Input {index + 1}</label>
                            <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => {
                                    const newTestCases = [...exampleTestCases];
                                    newTestCases[index].input = e.target.value;
                                    setExampleTestCases(newTestCases);
                                }}
                            />
                            <label>Output {index + 1}</label>
                            <input
                                type="text"
                                value={testCase.output}
                                onChange={(e) => {
                                    const newTestCases = [...exampleTestCases];
                                    newTestCases[index].output = e.target.value;
                                    setExampleTestCases(newTestCases);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="right-column">
                <div className="card">
                    <h3>Hidden Test Cases</h3>
                    {hiddenTestCases.map((testCase, index) => (
                        <div key={index} className="field-group">
                            <label>Input {index + 1}</label>
                            <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => {
                                    const newTestCases = [...hiddenTestCases];
                                    newTestCases[index].input = e.target.value;
                                    setHiddenTestCases(newTestCases);
                                }}
                            />
                            <label>Output {index + 1}</label>
                            <input
                                type="text"
                                value={testCase.output}
                                onChange={(e) => {
                                    const newTestCases = [...hiddenTestCases];
                                    newTestCases[index].output = e.target.value;
                                    setHiddenTestCases(newTestCases);
                                }}
                            />
                        </div>
                    ))}
                    <button className="submit-btn" onClick={handleSubmit}>Create Challenge</button>
                </div>
            </div>
        </div>
    );
};

export default CreateChallenge;
