import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';
import Axios from 'axios';
import { useAppContext } from '../store';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const appState = useAppContext();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const login = async () => {
    const response = await Axios.post('http://localhost:3001/api/login', {
      username,
      password,
    });
    if (response.data.message) {
      setLoginErrorMessage(response.data.message);
    } else {
      appState.setStatus('logged in');
      appState.setUserName(response.data[0].username);
      console.log(response.data[0].username);
      navigate('/');
    }
  };

  return (
    <div className="main-body">
      <div className="heroLogin">
        {loginErrorMessage ? (
          <h1 className="display-6"> {loginErrorMessage} </h1>
        ) : (
          <h1 className="display-4"> Login </h1>
        )}
        <form>
          <div className="form-group">
            <label for="exampleUsername">Username</label>
            <input
              className="form-control w-50"
              id="exampleUsername"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
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
          <div className="form-check">
            <input
              onChange={togglePassword}
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1">
              View Password
            </label>
          </div>
          <button
            onClick={async (event) => {
              event.preventDefault();
              await login();
            }}
            type="submit"
            class="btn-trans-log"
          >
            Login
          </button>
        </form>
        <p>
          Don't have an account? Sign up <Link to="/register">here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
