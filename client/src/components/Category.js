import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Link, useParams } from 'react-router-dom';
import { Card } from 'react-bootstrap';

function Category() {
  const [headers, setHeaders] = useState([]);
  const [objectArray, setObjectArray] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getCatHeaders/${id}`).then(
      (response) => {
        setHeaders(response.data);
      }
    );
  }, []);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getCategory/${id}`).then(
      (response) => {
        setObjectArray(response.data);
      }
    );
  }, []);

  return (
    <div>
      <div className="main-body">
        <div
          className="heroInfo"
          style={{ backgroundImage: 'url(' + headers.photo + ')' }}
        >
          <h1 class="display-4"> {headers.category} </h1>
          <p></p>
          <Link to={`../All`}>
            <button class="btn-trans-main" href="/info" role="button">
              Back to Categories
            </button>
          </Link>
        </div>
      </div>
      <section class="basic-grid">
        {objectArray.map((val) => {
          return (
            <>
              <Link to={`../Bird/${val.id}`} class="gridCard">
                <Card.Img variant="top" src={val.img} class="cardImg" />
                <Card.Body>
                  <Card.Title> {val.name} </Card.Title>
                  <Card.Text>
                    <em> {val.sciName} </em>
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

export default Category;
