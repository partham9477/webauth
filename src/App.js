import React, { Component } from 'react';

import './App.css';
import { createCreds, validateCreds } from './webauthn';

const buttonStyle = {
  padding: 10,
  margin: 5
}

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">

      
          
          <p>
            welcome to internet banking
          </p>
          
          <button 
            style={buttonStyle} 
            onClick={createCreds}
          >
            Register
          </button>

          <button 
            style={buttonStyle} 
            onClick={validateCreds}
          >
           try login
          </button>

        </header>
      </div>
    );
  }
}

export default App;
