import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useAppContext } from '../store';
import ShowComments from './ShowComments';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function Feed(props) {
  const isLoggedIn = props.status === 'logged in';
  const user = props.userName;
  const [sightingsArray, setSightingsArray] = useState([]);
  // const [includesPhoto, setIncludesPhoto] = useState(false);
  const [commentState, setCommentState] = useState({});
  const [commentForm, setCommentForm] = useState(false);
  const [commentFormState, setCommentFormState] = useState({});
  const [commentText, setCommentText] = useState('');
  const [sightingId, setSightingId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getAllUserSightings`).then(
      (response) => {
        setSightingsArray(response.data);
        console.log('Sightings array:', sightingsArray);
      }
    );
  }, []);

  const addComment = () => {
    // console.log('postId: ', postId);
    // console.log('user: ', user);
    // console.log('commentText: ', commentText);
    Axios.post(`http://localhost:3001/api/addSightingComment`, {
      sightingId,
      user,
      commentText,
    });
    navigate('/feed');
  };

  return (
    <div className="main-body-dark">
      <div className="heroFeed">
        <h1 class="display-4">Feed</h1>
        <hr class="my-4"></hr>
      </div>

      {sightingsArray.map((sighting) => {
        return (
          <>
            <Card className="myCard4">
              <Card.Body>
                <Nav.Link
                  as={Link}
                  className="ms-auto"
                  to={`/profile/${sighting.user}`}
                >
                  <Card.Title>
                    <div className="inline-container">
                      <img
                        class="profile-image-forum"
                        src={sighting.user_photo}
                      ></img>
                      <div>&nbsp;{sighting.user}</div>
                    </div>
                    {/* <span style="float:right;">
                      <p>
                        <em>{sighting.date}</em>
                      </p>
                    </span> */}
                  </Card.Title>
                </Nav.Link>
                {sighting.photo === undefined || sighting.photo === null ? (
                  <>
                    <Card.Title>
                      <div className="inline-container">
                        <div>Spotted</div>
                        <Nav.Link as={Link} to={`/bird/${sighting.bird_id}`}>
                          <div>{sighting.name}</div>
                        </Nav.Link>
                      </div>
                      <div>
                        <WrappedMap
                          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,
                          places&key=AIzaSyCFH_I3zm7FCNWfCNp7jyYtX3QcHspsdVM"
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `200px` }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                          id={sighting.id}
                          lat={sighting.latitude}
                          long={sighting.longitude}
                        ></WrappedMap>
                      </div>
                    </Card.Title>
                  </>
                ) : (
                  <>
                    <Card.Title>
                      <div className="inline-container">
                        <div>Took a photo of</div>
                        <Nav.Link as={Link} to={`/bird/${sighting.bird_id}`}>
                          <div>{sighting.name}</div>
                        </Nav.Link>
                      </div>
                    </Card.Title>
                    <div className="container-empty">
                      <div className="column-left-50">
                        <WrappedMap
                          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,
                          places&key=AIzaSyCFH_I3zm7FCNWfCNp7jyYtX3QcHspsdVM"
                          loadingElement={<div style={{ height: `100%` }} />}
                          containerElement={<div style={{ height: `27vw` }} />}
                          mapElement={<div style={{ height: `100%` }} />}
                          id={sighting.id}
                          lat={sighting.latitude}
                          long={sighting.longitude}
                        ></WrappedMap>
                      </div>
                      <div className="column-right-50">
                        <Card.Img
                          variant="top"
                          src={sighting.photo}
                          class="cardImg"
                        />
                      </div>
                    </div>
                  </>
                )}

                {isLoggedIn && !commentForm && (
                  <div align="right">
                    <br></br>
                    <a
                      class="btn-add-reply"
                      role="button"
                      onClick={
                        () => {
                          setSightingId(sighting.id);
                          setCommentForm(true);
                          setCommentFormState({
                            ...commentFormState,
                            [sighting.id]: commentFormState[sighting.id]
                              ? !commentFormState[sighting.id]
                              : true,
                          });
                        }
                        //if replyState[val.id] exists, return the opposite boolean
                        //if not then its the first time its been clicked, so it is true
                      }
                    >
                      Add Comment
                    </a>
                  </div>
                )}
                {commentFormState[sighting.id] && (
                  <>
                    <br></br>
                    <div className="forum-card-reversed">
                      <Card.Body>
                        <div align="center">
                          <h5 className="text-titles">Add a Comment</h5>
                        </div>
                        <form>
                          <div class="form-group">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea1"
                              rows="3"
                              placeholder="your comment here..."
                              onChange={(e) => {
                                setCommentText(e.target.value);
                              }}
                            ></textarea>
                          </div>
                          <div align="right">
                            <button
                              onClick={addComment}
                              type="submit"
                              class="btn-add-post"
                            >
                              Submit Comment
                            </button>
                          </div>
                        </form>
                      </Card.Body>
                    </div>
                  </>
                )}
                <details>
                  <summary
                    onClick={() =>
                      //if commentState[sighting.id] exists, return the opposite boolean
                      //if not then its the first time its been clicked, so it is true
                      setCommentState({
                        ...commentState,
                        [sighting.id]: commentState[sighting.id]
                          ? !commentState[sighting.id]
                          : true,
                      })
                    }
                  >
                    <span>View Comments</span>
                    {commentState[sighting.id] && (
                      <ShowComments id={sighting.id} />
                    )}
                  </summary>
                </details>
              </Card.Body>
            </Card>
          </>
        );
      })}
    </div>
  );
}

export default Feed;

function MyMap(props) {
  const [thisSighting, setThisSighting] = useState(null);
  const appState = useAppContext();

  const { id, lat, long } = props;

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getThisSighting/${id}`).then(
      (response) => {
        setThisSighting(response.data);
      }
    );
  }, []);

  return (
    <GoogleMap defaultZoom={10.5} defaultCenter={{ lat: lat, lng: long }}>
      <Marker key={id} position={{ lat, lng: long }} />
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap((props) => <MyMap {...props} />));
