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
import Contact from './components/Contact';
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

function App() {
  const [status, setStatus] = useState('not logged in');
  const [userName, setUserName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    Axios.get('http://localhost:3001/api/login', {
      withCredentials: true,
    }).then((response) => {
      console.log(response);
      if (response.data.loggedIn === true) {
        //console.log(response);
        setStatus('logged in');
        setUserName(response.data.user[0].username);
        console.log('starting...', status);
      }
    });
  }, []);

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
              <Route path="/login" element={<Login />} />
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
              <Route path="/contact" element={<Contact />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
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
