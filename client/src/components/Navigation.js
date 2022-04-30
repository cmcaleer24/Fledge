import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import Axios from 'axios';

function Navigation(props) {
  const isLoggedIn = props.status === 'logged in';
  const user = props.userName;
  const [photo, setPhoto] = useState(undefined);

  // useEffect(() => {
  //   Axios.get(`http://localhost:3001/api/getUser/${user}`).then((response) => {
  //     setPhoto(response.data.photo);
  //   });
  // }, []);

  return (
    <div>
      <div className="navigation">
        <Navbar
          bg="dark"
          variant="dark"
          sticky="top"
          expand="sm"
          collapseOnSelect
        >
          <Navbar.Brand>
            <Nav.Link as={Link} to="/">
              <img src="/assets/logos/myLogo.png" width="150px" height="40px" />
            </Nav.Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="container-fluid">
              <Nav.Link as={Link} to="/feed">
                Feed
              </Nav.Link>
              <Nav.Link as={Link} to="/info">
                Birds
              </Nav.Link>
              <Nav.Link as={Link} to="/forums">
                Forums
              </Nav.Link>
              <Nav.Link as={Link} to="/guides">
                Guides
              </Nav.Link>

              {!isLoggedIn && (
                <Nav.Link as={Link} className="ms-auto" to="/login">
                  Login
                </Nav.Link>
              )}
              {isLoggedIn && (
                <NavDropdown className="ms-auto" title={user} bg="dark">
                  <NavDropdown.Item as={Link} to={`/profile/${user}`}>
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/messages/${user}`}>
                    Messages
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to={`/logout`}>
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

export default Navigation;
