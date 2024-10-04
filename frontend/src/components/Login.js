import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/');
        }
    })

    const collectData = async () => {

        const data = { name, password };

        try {
            const response = await axios.post('http://localhost:5000/login', data);
            if (response.status === 200 || response.status === 201) {
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate("/home");
            }
        } catch (error) {
            console.warn(error);
            alert('Error');
        }
    }

    return (
        <div>
            <div className="signup-div">
                <label><h1>Login</h1></label>
                <label><p style={{ marginTop: "0" }}>Welcome back!</p></label>
                <hr style={{ color: "black", width: "400px" }}></hr>
                <br></br>
                <label>Email</label>
                <input type="text" className="inputBox" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your email"></input>
                <label>Password</label>
                <input type="password" className="inputBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"></input>
                <p>Don't have an account? <Link to='/signup' style={{color: "black"}}>Signup</Link></p>
                <button onClick={collectData} className="signup-btn" type="button">Login</button>
            </div>
        </div>
    )
}

export default Login;