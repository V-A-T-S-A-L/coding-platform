import React from "react";
import './home.css';
import Footer from "./Footer";

const Land = () => {

    return (
        <div>
            <div className="home-name">
                <div className="brackets">
                    <h1>{'<>'}</h1>
                </div>
                <h1 style={{textAlign: "center"}}>CODE BUSTERS</h1>
                <p>Unleash your coding prowess and conquer the digital realm with Code Busters, the ultimate competitive programming platform.</p>
            </div>
            <Footer />
        </div>
    )
}

export default Land;