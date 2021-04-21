import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Playground from './Playground';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '@asyncapi/react-component/lib/styles/fiori.css';
import './common/icons';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/create">
                    <Playground/>
                </Route>
                <Route path="/view">
                    <div>View</div>
                </Route>
                <Route path="/list">
                    <div>ListOfApiDocs</div>
                </Route>
                <Route path="/">
                    <div>Home</div>
                </Route>
            </Switch>
        </Router>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));