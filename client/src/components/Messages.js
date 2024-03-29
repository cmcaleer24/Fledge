import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { Card, Nav } from 'react-bootstrap';

function Messages(props) {
  const [recArray, setRecArray] = useState([]);
  const [sentArray, setSentArray] = useState([]);
  const user = props.userName;
  const [showSent, setShowSent] = useState(false);
  const [replyForm, setReplyForm] = useState(false);
  const [replyFormState, setReplyFormState] = useState({});
  const [userId, setUserId] = useState('');
  const [propId, setPropId] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getMessages/${user}`).then(
      (response) => {
        setRecArray(response.data);
      }
    );
  }, [user]);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getSentMessages/${user}`).then(
      (response) => {
        setSentArray(response.data);
      }
    );
  }, [user]);

  const addMessage = () => {
    Axios.post('http://localhost:3001/api/addMessageReply', {
      propId,
      userId,
      text,
    }).then(navigate(`/messages/${user}`));
  };

  return (
    <div className="main-body">
      <div className="heroMessages">
        <h1 class="display-4"> Your Message History </h1>{' '}
      </div>{' '}
      {!showSent ? (
        <div className="forum-card-select">
          <div class="row">
            <div class="column" className="button-column">
              <button
                onClick={() => {
                  setShowSent(false);
                }}
                type="submit"
                class="btn-message-select-dark"
              >
                <h5>Received</h5>
              </button>
            </div>
            <div class="column" className="button-column">
              <button
                onClick={() => {
                  setShowSent(true);
                }}
                type="submit"
                class="btn-message-select"
              >
                <h5>Sent</h5>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="forum-card-select">
          <div class="row">
            <div class="column" className="button-column">
              <button
                onClick={() => {
                  setShowSent(false);
                }}
                type="submit"
                class="btn-message-select"
              >
                <h5>Received</h5>
              </button>
            </div>
            <div class="column" className="button-column">
              <button
                onClick={() => {
                  setShowSent(true);
                }}
                type="submit"
                class="btn-message-select-dark"
              >
                <h5>Sent</h5>
              </button>
            </div>
          </div>
        </div>
      )}
      {!showSent &&
        recArray.map((message) => {
          return (
            <>
              <Card className="my-card-2">
                <Card.Body>
                  <Nav.Link
                    as={Link}
                    className="ms-auto"
                    to={`/profile/${message.from_user_username}`}
                  >
                    <Card.Title>
                      <div className="inline-container">
                        <img
                          class="profile-image-forum"
                          src={message.from_user_photo}
                        ></img>
                        <div>&nbsp;{message.from_user_username}</div>
                      </div>
                    </Card.Title>
                  </Nav.Link>
                  <Card.Text>
                    <em> {message.message} </em>
                  </Card.Text>
                  {!replyForm && (
                    <>
                      <div align="right">
                        <a
                          class="btn-add-reply"
                          role="button"
                          onClick={() => {
                            setPropId(message.from_user_id);
                            setUserId(message.to_id);
                            setReplyForm(true);
                            setReplyFormState({
                              ...replyFormState,
                              [message.id]: replyFormState[message.id]
                                ? !replyFormState[message.id]
                                : true,
                            });
                          }}
                        >
                          Reply
                        </a>
                      </div>
                    </>
                  )}

                  {replyFormState[message.id] && (
                    <>
                      <div className="dark-form">
                        <Card.Body>
                          <div align="center">
                            <h5 className="text-titles">
                              Reply to {message.from_user_username}
                            </h5>
                          </div>
                          <form>
                            <br></br>
                            <div class="form-group">
                              <textarea
                                class="form-control"
                                id="exampleFormControlTextarea1"
                                rows="3"
                                placeholder="Your message here"
                                onChange={(e) => {
                                  setText(e.target.value);
                                }}
                              ></textarea>
                            </div>
                            <div align="right">
                              <button
                                onClick={addMessage}
                                type="submit"
                                class="btn-add-post"
                              >
                                Send Reply
                              </button>
                            </div>
                          </form>
                        </Card.Body>
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </>
          );
        })}
      {showSent &&
        sentArray.map((val) => {
          return (
            <>
              <Card className="my-card-2">
                <Card.Body>
                  <Nav.Link
                    as={Link}
                    className="ms-auto"
                    to={`/profile/${val.to_user_username}`}
                  >
                    <Card.Title>
                      <div className="inline-container">
                        <img
                          class="profile-image-forum"
                          src={val.to_user_photo}
                        ></img>
                        <div>&nbsp;{val.to_user_username}</div>
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
      <br></br>
    </div>
  );
}

export default Messages;
