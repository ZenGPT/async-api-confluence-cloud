import React from 'react';
import { createRoot } from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import './index.css'

import '@fortawesome/fontawesome-svg-core/styles.css';
import "@asyncapi/react-component/lib/styles/fiori.css";
import './common/icons';
import ListOfApiDocs from "./ListOfApiDocs";
import Viewer from "./Viewer";

function App() {
    try {
        return (
            <Router>
                <Routes>
                    {/*<Route path="/create" element={<Playground/>} />*/}
                    <Route path="/view" element={<Viewer/>} />
                    {/*<Route path="/edit" element={<Editor/>} />*/}
                    <Route path="/list" element={<ListOfApiDocs/>} />
                    <Route path="/" element={<ListOfApiDocs/>} />
                </Routes>
            </Router>
        )
    } catch (error) {
        console.error('App rendering error:', error);
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <h1>Error loading app</h1>
                <p>Check the console for details.</p>
            </div>
        );
    }
}

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
