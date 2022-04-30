import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Axios from 'axios';

function Logout() {
  const history = useNavigate();

  const logout = async () => {
    await Axios.post('http://localhost:3001/api/logout');
    history('/');
  };

  return (
    <div className="main-body">
      <div className="heroLogout">
        <h5 class="display-6"> Are you sure you want to Log Out ? </h5>{' '}
        <h1 class="display-5"> </h1> <h1 class="display-5"> </h1>{' '}
        <h1 class="display-5"> </h1>{' '}
        <div class="row">
          <div class="column">
            <a class="btn-trans-main" href="/" role="button" onClick={logout}>
              Yes{' '}
            </a>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
    </div>
  );
}

export default Logout;
