import React from 'react';
import './Footer.css'; // Import your styles

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h3>{'</>'} Code Busters</h3>
                <p>&copy; 2024 Vatsal's Website. All rights reserved.</p>
                <p>
                    <a href="/terms">Terms & Conditions</a> | <a href="/privacy">Privacy Policy</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
