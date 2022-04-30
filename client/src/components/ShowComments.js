import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Nav } from 'react-bootstrap';
import Axios from 'axios';

function ShowComments(props) {
  const [commentsArray, setCommentsArray] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getSightingComments/${props.id}`).then(
      (response) => {
        setCommentsArray(response.data);
      }
    );
  }, []);

  return (
    <>
      {commentsArray.length === 0 && <p>There are no comments yet!</p>}
      {commentsArray.map((val) => {
        console.log(commentsArray);
        return (
          <>
            <Card className="reply-card">
              <Card.Body>
                <Nav.Link as={Link} to={`/profile/${val.user}`}>
                  <Card.Title>
                    <div className="inline-container">
                      <img class="profile-image-reply" src={val.photo}></img>
                      <span>&nbsp;{val.user}</span>
                    </div>
                  </Card.Title>
                </Nav.Link>
                <Card.Text>
                  <em> {val.comment} </em>
                </Card.Text>
              </Card.Body>
            </Card>
          </>
        );
      })}
    </>
  );
}

export default ShowComments;
