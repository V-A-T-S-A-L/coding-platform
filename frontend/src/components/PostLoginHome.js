import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import './home.css';
import Footer from "./Footer";

const PostLoginhome = () => {

    const [roomName, setRoomName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [rooms, setRooms] = useState("");
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user-rooms/${user.id}`);
                setRooms(response.data);
            } catch (error) {
                console.warn(error);
            }
        };
        fetchRooms();
    }, [user.id]);

    const createRoom = async () => {
        if (!roomName) {
            alert("Room name cannot be empty");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/create-room', {
                roomName,
                adminId: user.id
            })

            setRoomName("");
            alert("Room created successfully!");
            window.location.reload();
        } catch (error) {
            console.warn(error);
        }
    }

    const joinRoom = async () => {
        if (!roomCode) {
            alert("Room code cannot be empty");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/join-room', {
                roomCode,
                user_id: user.id
            })

            setRoomCode("");
            alert("Joined room successfully");
            
        } catch (error) {
            console.warn(error);
        }
    }

    return (
        <div>
            <div className="main">
                <div className="home-name">
                    <div className="brackets">
                        <h1>{'</>'}</h1>
                    </div>
                    <h1 style={{ textAlign: "center" }}>CODE BUSTERS</h1>
                    <div className="room-div">
                        <div className="new-room">
                            <h3>New Room</h3>
                            <p>Start off by creating a new room. Invite your friends and start coding.</p>
                            <input type="text" placeholder="Enter room name" value={roomName} onChange={(e) => setRoomName(e.target.value)}></input>
                            <button onClick={createRoom}>Create</button>
                        </div>
                        {/* <div className="vl"></div> */}
                        <div className="join-room">
                            <h3>Join Room</h3>
                            <p>Join an existing room. Ask your friend for the room code.</p>
                            <input type="text" placeholder="Enter room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)}></input>
                            <button onClick={joinRoom}>Join</button>
                        </div>
                    </div>
                </div>
                <div className="vl"></div>
                <div className="joined">
                    <h1 style={{ color: "white" }}>Joined Rooms</h1>
                    {rooms.length > 0 ? (
                        rooms.map((room, index) => (
                            <div className="room-card">
                                <div className="content">
                                    <h3>{room.roomName}</h3>
                                    <p>{room.timeSinceJoined}</p>
                                </div>
                                <div className="arrow">
                                    <h1>&#10140;</h1>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>You haven't joined any rooms yet</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default PostLoginhome;