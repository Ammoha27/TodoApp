// Header.js
import React from 'react';
import './Header.css';
import {Link} from "react-router-dom"; // Stellen Sie sicher, dass Sie den Pfad zu Ihrer CSS-Datei entsprechend anpassen.

export const Header = () => {
    return (
        <header className="main-header">
            <nav>
                <Link className={"link"} to={"/"}>Home</Link>
            </nav>
        </header>
    );
};
