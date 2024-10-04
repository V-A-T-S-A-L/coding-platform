import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const auth = localStorage.getItem('user');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/signup');
    }

    const profilePic = '';
    /*const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            setProfilePic(`http://localhost:5000${userData.profilePic}`);
        }
    }, []);

    console.warn(profilePic);*/

    return (
        <div>
            {/* {auth ? <ul className='nav-ul'>
                <div className='nav-div'>
                    <div className='pic-div'>
                        <img src={profilePic} className='profile-pic' alt='profile-pic'></img>
                    </div>
                    <div>
                        <li><Link to="/">Products</Link></li>
                        <li><Link onClick={logout} to="/signup">Logout:- {JSON.parse(auth).name}</Link></li>
                    </div>
                </div>
            </ul> */}
            {auth ? <div className='navbar'>
                <div>
                    <h3 style={{ paddingLeft: "40px" }}>{'<>'} Code Busters</h3>
                </div>
                <div>
                    <ul className='nav-ul'>
                        <li><Link style={{ textDecoration: "none", color: "white" }} to="/home">Home</Link></li>
                        <li><Link style={{ textDecoration: "none", color: "white" }} onClick={logout} to="/signup">Logout:- {JSON.parse(auth).name}</Link></li>
                    </ul>
                </div>
            </div>
                :
                <div className='navbar'>
                    <div>
                        <h3 style={{ paddingLeft: "40px" }}>{'<>'} Code Busters</h3>
                    </div>
                    <div>
                        <ul className='nav-ul'>
                            <li><Link style={{ textDecoration: "none", color: "white" }} to="/">Home</Link></li>
                            <li><Link style={{ textDecoration: "none", color: "white" }} to="/signup">Signup</Link></li>
                            <li><Link style={{ textDecoration: "none", color: "white" }} to="/login">Login</Link></li>
                            <li><Link style={{ textDecoration: "none", color: "white" }} to="/about">About</Link></li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    );
}

export default Nav;