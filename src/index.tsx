import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import './index.css'
import Playground from './Playground';

import '@fortawesome/fontawesome-svg-core/styles.css';
// import '@asyncapi/react-component/styles/default.css';
import './common/icons';
import ListOfApiDocs from "./ListOfApiDocs";
import Viewer from "./Viewer";
import Editor from "./Editor";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/create">
                    <Playground/>
                </Route>
                <Route path="/view">
                    <Viewer/>
                </Route>
                <Route path="/edit">
                    <Editor/>
                </Route>
                <Route path="/list">
                    <ListOfApiDocs/>
                </Route>
                <Route path="/">
                  <ListOfApiDocs/>
                </Route>
            </Switch>
        </Router>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
