import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store';

function Register() {
  const navigate = useNavigate();
  const appState = useAppContext();
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailAdd, setEmailAdd] = useState('');

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const register = () => {
    Axios.post('http://localhost:3001/api/register', {
      username,
      password,
      emailAdd,
    });
    appState.setStatus('logged in');
    appState.setUserName(username);
    navigate('/');
  };

  return (
    <div className="main-body-dark">
      <div className="heroRegister">
        <h1 class="display-4"> Register </h1>
        <form>
          <div class="form-group">
            <label for="exampleUsername">Username</label>
            <input
              class="form-control w-50"
              id="exampleUsername"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input
              type="email"
              class="form-control w-50"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              onChange={(e) => {
                setEmailAdd(e.target.value);
              }}
            />
            <small id="emailHelp">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input
              input
              type={passwordShown ? 'text' : 'password'}
              class="form-control w-50"
              id="exampleInputPassword1"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div class="form-check">
            <input
              onChange={togglePassword}
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1">
              View Password
            </label>
          </div>
          <button onClick={register} type="submit" class="btn-trans-log">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
