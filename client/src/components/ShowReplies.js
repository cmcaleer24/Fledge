import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Nav } from 'react-bootstrap';
import Axios from 'axios';

function ShowReplies(props) {
  const [repliesArray, setRepliesArray] = useState([]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getForumReplies/${props.id}`).then(
      (response) => {
        setRepliesArray(response.data);
      }
    );
  }, []);

  return (
    <>
      {repliesArray.length === 0 && <p>There are no replies yet!</p>}
      {repliesArray.map((val) => {
        console.log(repliesArray);
        return (
          <>
            <Card className="reply-card">
              <Card.Body>
                <Nav.Link as={Link} to={`/profile/${val.username}`}>
                  <Card.Title>
                    <div className="inline-container">
                      <img class="profile-image-reply" src={val.photo}></img>
                      <span>&nbsp;{val.username}</span>
                    </div>
                  </Card.Title>
                </Nav.Link>
                <Card.Text>
                  <em> {val.message} </em>
                </Card.Text>
              </Card.Body>
            </Card>
          </>
        );
      })}
    </>
  );
}

export default ShowReplies;
