import React from "react";
import Router from './routes/index'
import './App.css'
import Header from './components/header/header'

const App = () => {
  return (
    <main className="App">
      <Header/>
      <Router />
    </main>
  );
};

export default App;