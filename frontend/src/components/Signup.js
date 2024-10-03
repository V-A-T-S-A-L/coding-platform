import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const profilePic = '/uploads/add.png';

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth) {
            navigate('/');
        }
    })

    const collectData = async () => {

        const data = { name, password, profilePic };
        
        try {
            const response =  await axios.post('http://localhost:5000/signup', data);
            if(response.status === 200 || response.status === 201) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate("/");
            } 
        } catch (error) {
            console.warn(error);
            alert('Error');
        }
    }

    return (
        <div>
            <div className="signup-div">
                <h1>Register</h1>
                <input type="text" className="inputBox" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"></input>
                <input type="password" className="inputBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"></input>
                <button onClick={collectData} className="signup-btn" type="button">Register</button>
            </div>
        </div>
    )
}

export default Signup;