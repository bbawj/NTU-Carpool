import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Login from "./Login"
import "./App.css"
import Signup from './Signup';

function App() {
    return (
        <div className="app">
        <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/signup" component={Signup} />
            </Switch>
        </Router>
        </div>
    )
}

export default App
