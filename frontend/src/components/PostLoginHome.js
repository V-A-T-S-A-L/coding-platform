import React from "react";
import './home.css';

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
                        <p>Start of by creating a room</p>
                        <button>Create</button>
                    </div>
                    <div className="join-room">
                        <p>Join an existing room</p>
                        <input type="text" placeholder="Enter room code"></input>
                        <button>Join</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostLoginhome;