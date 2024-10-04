import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const profilePic = '/uploads/add.png';

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if(auth) {
            navigate('/home');
        }
    })

    const collectData = async () => {

        const data = { name, password, email, profilePic };
        console.warn(data);
        
        try {
            const response =  await axios.post('http://localhost:5000/signup', data);
            if(response.status === 200 || response.status === 201) {
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
                <label><h1>Create an account</h1></label>
                <label><p style={{marginTop: "0"}}>Enter your details below to get started</p></label>
                <hr style={{color:"black", width: "400px"}}></hr>
                <br></br>
                <label>Name</label>
                <input type="text" className="inputBox" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name"></input>
                <label>Email</label>
                <input type="text" className="inputBox" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"></input>
                <label>Password</label>
                <input type="password" className="inputBox" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"></input>
                <p>Already have an account? <Link to={'/login'} style={{color: "black"}}>Login</Link></p>
                <button onClick={collectData} className="signup-btn" type="button">Register</button>
            </div>
        </div>
    )
}

export default Signup;