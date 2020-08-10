import React from 'react';
import './App.css';
//components
import MainPage from './MainPage'
import {BrowserRouter as Router,
Link,
Routes,
Route
} from 'react-router-dom';
import {GlobalStyle,Wrapper} from './App.styles';



function App() {
  return (
    <>
        <GlobalStyle/>
        <Wrapper>   
    <Router>
      
      <Link  to= "/quiz"><h1>Welcome to the Quiz App</h1></Link>
      <Routes>
        <Route path="quiz" element={<MainPage />} >
        </Route>
      </Routes>
    </Router>
    </Wrapper>
    </>
  );
}

export default App;
