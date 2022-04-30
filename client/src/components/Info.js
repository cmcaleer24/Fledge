import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

function Info() {
  const [objectArray, setObjectArray] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/api/getCategories').then((response) => {
      setObjectArray(response.data);
    });
  }, []);

  return (
    <div className="main-body">
      <div className="heroInfo">
        <h1 class="display-4"> Birds by Category </h1>
        <hr class="my-4"></hr>
        <p></p>
        <Link to={`../All`}>
          <button class="btn-trans-main" href="/info" role="button">
            Search A-Z
          </button>
        </Link>
      </div>

      <section class="basic-grid">
        {objectArray.map((val) => {
          return (
            <>
              <Link to={`../category/${val.id}`} className="gridCard">
                <Card.Img variant="top" src={val.photo} className="cardImg" />
                <Card.Body>
                  <Card.Title> {val.category} </Card.Title>
                </Card.Body>
              </Link>
            </>
          );
        })}
      </section>
      <br></br>
    </div>
  );
}

export default Info;
