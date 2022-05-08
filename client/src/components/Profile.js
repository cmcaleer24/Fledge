import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useAppContext } from '../store';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { storage } from '../firebase/index';
import { Card } from 'react-bootstrap';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';

function Profile(props) {
  const [progress, setProgress] = useState(0);
  const isLoggedIn = props.status === 'logged in';
  const propUser = props.userName;
  const [thisUser, setThisUser] = useState(undefined);
  const [thisPropUser, setThisPropUser] = useState(undefined);
  const { user } = useParams(undefined);
  const [showForm, setShowForm] = useState(false);
  const [sightingsArray, setSightingsArray] = useState([]);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [showTextForm, setShowTextForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [showProgress, setShowProgress] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [userId, setUserId] = useState();
  const [propId, setPropId] = useState();
  const [text, setText] = useState();
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  const formHandler = async (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    await uploadFiles(file);
    window.location.reload(false);
  };

  const uploadFiles = async (file) => {
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('URL ', downloadURL, 'User: ', user);
          sendUrl(downloadURL);
        });
      }
    );
    await uploadTask;
  };

  const sendUrl = async (downloadURL) => {
    await Axios.post('http://localhost:3001/api/submitUserPhoto', {
      url: downloadURL,
      user,
    });
    // navigate(`/profile/${user}`);
  };

  const addDescription = () => {
    Axios.post('http://localhost:3001/api/addDescription', {
      user,
      text,
    });
    navigate(`/profile/${user}`);
  };

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getUser/${user}`).then((response) => {
      setThisUser(response.data);
      setUserId(response.data.id);
    });
  }, []);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getPropUser/${propUser}`).then(
      (response) => {
        setThisPropUser(response.data);
        setPropId(response.data.id);
      }
    );
  }, []);

  const addMessage = () => {
    Axios.post('http://localhost:3001/api/addMessage', {
      propId,
      userId,
      text,
    });
    navigate(`/profile/${user}`);
  };

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getUserSightingsNotNull/${user}`).then(
      (response) => {
        setSightingsArray(response.data);
      }
    );
  }, []);

  const renderUser = ({ username, photo, description }) => {
    return (
      <>
        <div className="main-body">
          <div className="heroProfile">
            <h1 class="display-4"> {username} </h1>
          </div>

          {propUser && propUser != user && !showForm && (
            <>
              <div className="container">
                <br></br>
                <br></br>
                <a
                  class="btn-add-reply"
                  role="button"
                  onClick={() => {
                    setShowForm(true);
                  }}
                >
                  Send Message to {user}
                </a>
              </div>
            </>
          )}

          {showForm && (
            <>
              <div className="dark-form">
                <Card.Body>
                  <div align="center">
                    <h5 className="text-titles">Send Message to {user}</h5>
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
                        class="btn-add-reply"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </Card.Body>
              </div>
            </>
          )}

          <div className="container">
            {!showTextForm && (
              <div className="column-left">
                <div>
                  <h5>About Me</h5>
                  <p>{description}</p>
                </div>
                {propUser === user && (
                  <>
                    {!showTextForm && (
                      <button
                        type="submit"
                        class="btn-add-reply"
                        onClick={() => {
                          setShowTextForm(true);
                        }}
                      >
                        Update your Description
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {showTextForm && (
              <div className="column-left">
                <>
                  <>
                    <div className="dark-form-full">
                      <Card.Body>
                        <form>
                          <div
                            class="form-group"
                            className="text-area-assign-height"
                          >
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea1"
                              rows="3"
                              placeholder="Say a little about yourself..."
                              onChange={(e) => {
                                setText(e.target.value);
                              }}
                            ></textarea>
                          </div>
                          <button
                            onClick={addDescription}
                            type="submit"
                            class="btn-add-reply"
                          >
                            Update About Me
                          </button>
                        </form>
                      </Card.Body>
                    </div>
                  </>
                </>
              </div>
            )}

            <div classname="column-right">
              <div>
                <img className="profile-image" src={photo} />
              </div>
              {propUser === user ? (
                <>
                  {!showPhotoForm && (
                    <div>
                      <button
                        type="submit"
                        class="btn-add-reply"
                        onClick={() => {
                          setShowPhotoForm(true);
                        }}
                      >
                        Change Picture
                      </button>
                    </div>
                  )}

                  {showPhotoForm && (
                    <>
                      <div className="dark-form">
                        <Card.Body>
                          <form onSubmit={formHandler}>
                            <input
                              type="file"
                              class="input"
                              className="text-titles"
                              onChange={changeHandler}
                            />
                            {isSelected ? (
                              <div>
                                <p className="text-titles">
                                  <strong>Filetype: </strong>
                                  {selectedFile.type}
                                </p>
                                <p className="text-titles">
                                  <strong>Size: </strong>
                                  {selectedFile.size}
                                </p>
                              </div>
                            ) : (
                              <p className="text-titles">
                                Select a file to show details
                              </p>
                            )}
                            <button
                              type="submit"
                              class="btn-add-reply"
                              onClick={() => {
                                setShowProgress(true);
                              }}
                            >
                              Upload
                            </button>
                          </form>
                          {showProgress && (
                            <p className="text-titles">
                              Uploading done {progress}%
                            </p>
                          )}
                        </Card.Body>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <br></br>
              )}
            </div>
          </div>

          <div className="border-box">
            <h5>Sightings</h5>
            <details>
              <summary>
                <span>Map</span>
              </summary>
              <div>
                <WrappedMap
                  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,
                places&key=AIzaSyCFH_I3zm7FCNWfCNp7jyYtX3QcHspsdVM"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `400px` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                ></WrappedMap>
              </div>
            </details>
          </div>

          <div className="border-box">
            <h5>Photo Album</h5>
            <details>
              <summary>
                <span>View</span>
              </summary>
              <section class="basic-grid">
                {sightingsArray.map((sighting) => {
                  return (
                    <>
                      <Link to={`../Bird/${sighting.bird_id}`} class="gridCard">
                        <Card.Img
                          variant="top"
                          src={sighting.photo}
                          class="cardImg"
                        />
                        <Card.Body>
                          <Card.Title> {sighting.name} </Card.Title>
                          <Card.Text>
                            <em> {sighting.date} </em>
                          </Card.Text>
                        </Card.Body>
                      </Link>
                    </>
                  );
                })}
              </section>
            </details>
          </div>
        </div>

        {/* <div>
          <form onSubmit={formHandler}>
            <input type="file" className="btn-main" />
            <button type="submit">Upload</button>
          </form>
          <hr />
          <p>Uploading done {progress}%</p>
        </div> */}
      </>
    );
  };

  return thisUser ? renderUser(thisUser) : <div>Loading...</div>;
}

export default Profile;

function MyMap() {
  const [sightingsArray, setSightingsArray] = useState([]);
  const [thisSighting, setThisSighting] = useState(null);
  const appState = useAppContext();

  const { user } = useParams();

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getUserSightings/${user}`).then(
      (response) => {
        setSightingsArray(response.data);
      }
    );
  }, []);

  return (
    <GoogleMap
      defaultZoom={5.1}
      defaultCenter={{ lat: 54.8, lng: -4.7 }}
      onClick={(ev) => {
        appState.setLatitude(ev.latLng.lat());
        appState.setLongitude(ev.latLng.lng());
      }}
    >
      {sightingsArray.map((sighting) => (
        <Marker
          key={sighting.bird_id}
          position={{ lat: sighting.latitude, lng: sighting.longitude }}
          onClick={() => {
            setThisSighting(sighting);
          }}
        />
      ))}

      {thisSighting && (
        <InfoWindow
          position={{
            lat: thisSighting.latitude,
            lng: thisSighting.longitude,
          }}
          onCloseClick={() => {
            setThisSighting(null);
          }}
        >
          <>
            <a href={`../Bird/${thisSighting.bird_id}`}>
              <h5>{thisSighting.name}</h5>
            </a>

            <div>{thisSighting.date}</div>
            {thisSighting.photo && (
              <img className="map-image" src={thisSighting.photo} />
            )}
          </>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(MyMap));
