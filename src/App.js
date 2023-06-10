import React from 'react';
import logo from './logo.svg';
import './App.css';
import OpenCVComponent from './components/OpenCVComponent.tsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WebcamComponent from './components/WebcamComponent.tsx';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <OpenCVComponent />
        </Route>
        <Route path="/webcam">
          <WebcamComponent />
        </Route>
      </Switch>
    </Router>
  );
}


export default App;
