import React from "react";
import './home.css';
import Footer from "./Footer";

const PostLoginhome = () => {

    return (
        <div>
            <div className="home-name">
                <div className="brackets">
                    <h1>{'<>'}</h1>
                </div>
                <h1 style={{ textAlign: "center" }}>CODE BUSTERS</h1>
                <div className="room-div">
                    <div className="new-room">
                        <h3>New Room</h3>
                        <p>Start off by creating a new room. Invite your friends and start coding.</p>
                        <button>Create</button>
                    </div>
                    <div className="vl"></div>
                    <div className="join-room">
                        <h3>Join Room</h3>
                        <p>Join an existing room. Ask your friend for the room code.</p>
                        <input type="text" placeholder="Enter room code"></input>
                        <button>Join</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default PostLoginhome;