import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import './index.css'
import Playground from './Playground';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '@asyncapi/react-component/lib/styles/fiori.css';
import './common/icons';
import ListOfApiDocs from "./ListOfApiDocs";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/create">
                    <Playground/>
                </Route>
                <Route path="/view">
                    <div>Viewer</div>
                </Route>
                <Route path="/edit">
                    <div>Edit</div>
                </Route>
                <Route path="/list">
                    <ListOfApiDocs/>
                </Route>
                <Route path="/">
                  <input
                    className="focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10"
                    type="text" aria-label="Filter projects" placeholder="Filter projects"/>
                </Route>
            </Switch>
        </Router>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
