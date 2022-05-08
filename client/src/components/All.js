import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

function All() {
  const [birdArray, setBirdArray] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/api/getAll').then((response) => {
      setBirdArray(response.data);
    });
  }, []);

  return (
    <div>
      <div className="main-body">
        <div className="heroInfo">
          <h1 class="display-4"> Birds A-Z </h1>
          <hr class="my-4"></hr>
          <Link to={`../Info`}>
            <button class="btn-trans-main" href="/info" role="button">
              Search by Category
            </button>
          </Link>
        </div>
      </div>
      <section class="basic-grid">
        {birdArray.map((bird) => {
          return (
            <>
              <Link to={`../Bird/${bird.id}`} class="gridCard">
                <Card.Img variant="top" src={bird.img} class="cardImg" />
                <Card.Body>
                  <Card.Title> {bird.name} </Card.Title>
                  <Card.Text>
                    <em> {bird.sciName} </em>
                  </Card.Text>
                </Card.Body>
              </Link>
            </>
          );
        })}
      </section>
    </div>
  );
}

export default All;
