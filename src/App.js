import React from 'react';
import logo from './logo.svg';
import './App.css';
import OpenCVComponent from './components/OpenCVComponent.tsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <OpenCVComponent />
        </Route>
      </Switch>
    </Router>
  );
}


export default App;
