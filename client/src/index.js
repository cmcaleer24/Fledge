import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import Feed from './components/Feed';
import Forums from './components/Forums';
import Guides from './components/Guides';
import Info from './components/Info';
import All from './components/All';
import Category from './components/Category';
import Login from './components/Login';
import Register from './components/Register';
import Bird from './components/Bird';
import Profile from './components/Profile';
import Logout from './components/Logout';
import Messages from './components/Messages';
import Birdwatching from './components/Birdwatching';
import Legislation from './components/Legislation';
import Equipment from './components/Equipment';
import Axios from 'axios';
import { AppContext } from './store';

//PRIMARY APP FUNCTION
function App() {
  Axios.defaults.withCredentials = true;

  //INITIALISE CONTEXT VARIABLES
  const [status, setStatus] = useState('not logged in');
  const [userName, setUserName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  //SET LOGGED IN AND USERNAME
  useEffect(() => {
    if (!userName) {
      Axios.get('http://localhost:3001/api/login').then((response) => {
        if (response.data.loggedIn === true) {
          setStatus('logged in');
          setUserName(response.data.user[0].username);
          console.log('starting...', status, 'user...', userName);
        }
      });
    }
  }, [userName, status]);

  // useEffect(() => {
  //   console.log('THIS STATUS:: ', status, 'THIS USERNAME: ', userName);
  // });

  return (
    <>
      <AppContext.Provider
        value={{ setStatus, setUserName, setLatitude, setLongitude }}
      >
        <Router>
          <Navigation status={status} userName={userName} />
          <>
            <Routes>
              <Route
                path="/"
                element={<Home status={status} userName={userName} />}
              />
              <Route
                path="/forums"
                element={<Forums status={status} userName={userName} />}
              />
              <Route
                path="/feed"
                element={<Feed status={status} userName={userName} />}
              />
              <Route path="/guides" element={<Guides />} />
              <Route path="/info" element={<Info />} />
              <Route path="/all" element={<All />} />
              <Route path="/birdwatching" element={<Birdwatching />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/legislation" element={<Legislation />} />
              <Route path="/category/:id" element={<Category />} />
              <Route
                path="/login"
                element={<Login status={status} userName={userName} />}
              />
              <Route
                path="/bird/:id"
                element={
                  <Bird
                    status={status}
                    userName={userName}
                    latitude={latitude}
                    longitude={longitude}
                  />
                }
              />
              <Route
                path="/logout"
                element={<Logout status={status} userName={userName} />}
              />
              <Route
                path="/register"
                element={<Register status={status} userName={userName} />}
              />
              <Route
                path="/messages/:user"
                element={<Messages status={status} userName={userName} />}
              />
              <Route
                path="/profile/:user"
                element={<Profile status={status} userName={userName} />}
              />
            </Routes>
          </>
          <Footer />
        </Router>
      </AppContext.Provider>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
