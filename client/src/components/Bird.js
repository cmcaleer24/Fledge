import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Card, Nav } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { storage } from '../firebase/index';
import { useAppContext } from '../store';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';

function Bird(props) {
  const [progress, setProgress] = useState(0);
  const isLoggedIn = props.status === 'logged in';
  const user = props.userName;
  const lat = props.latitude;
  const long = props.longitude;
  const [sightingsArray, setSightingsArray] = useState([]);
  const [thisSighting, setThisSighting] = useState(null);
  const [showSightForm, setShowSightForm] = useState(false);
  const [bird, setBird] = useState(undefined);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState();
  const [showProgress, setShowProgress] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;
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
      (error) => console.log('HERE: ', error),
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
    await Axios.post('http://localhost:3001/api/addSighting', {
      url: downloadURL,
      user,
      lat,
      long,
      date,
      id,
    });
    navigate(`/bird/${id}`);
  };

  const sendWithoutUrl = () => {
    Axios.post('http://localhost:3001/api/addSightingOnly', {
      user,
      lat,
      long,
      date,
      id,
    });
    navigate(`/bird/${id}`);
  };

  // const [viewport, setViewport] = useState({
  //   width: '200px',
  //   height: '200px',
  //   latitude: 53.469,
  //   longitude: 2.24,
  //   zoom: 10,
  // });

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getSightingsNotNull/${id}`).then(
      (response) => {
        setSightingsArray(response.data);
      }
    );
  }, []);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getBird/${id}`).then((response) => {
      setBird(response.data);
      //setInterval(setBird(response.data), 3000);
    });
  }, []);

  const renderBird = ({
    name,
    sciName,
    genus,
    img,
    weight,
    length,
    consStatus,
    desc,
    diet,
    wingspan,
    ukPop,
    illustration,
    spotTips,
  }) => {
    return (
      <>
        <div className="main-body-dark">
          <div></div>
          <div
            className="heroBird"
            style={{ backgroundImage: 'url(' + img + ')' }}
          >
            <h1 class="display-4"> {name} </h1>
            <h4>
              <em>{sciName}</em>
            </h4>
            <hr class="my-4"></hr>
          </div>
        </div>
        <div class="border-box">
          <div>
            <p class="birdItem">
              <b>Genus:</b> {genus}
            </p>
          </div>

          <hr class="my-3"></hr>

          <div class="birdItem">
            <h4>About:</h4>
            <p>{desc}</p>
          </div>

          <hr class="my-2"></hr>

          <div class="birdItem">
            <h4>Statistics:</h4>
            <p></p>
            <div>
              <p class="birdItem">
                <b>Conservation Status:</b> {consStatus}
              </p>
              <p class="birdItem">
                <b>Weight:</b> {weight}
              </p>
              <p class="birdItem">
                <b>Length:</b> {length}
              </p>
              <p class="birdItem">
                <b>Wingspan:</b> {wingspan}
              </p>
              <p class="birdItem">
                <b>Diet:</b> {diet}
              </p>
              <p class="birdItem">
                <b>UK Population:</b> {ukPop}
              </p>
            </div>
          </div>

          <hr class="my-2"></hr>

          <div class="birdItem">
            <h4>Spotting Tips:</h4>
            <p>{spotTips}</p>
            <img src={illustration} class="birdItem"></img>
          </div>
        </div>

        <div className="border-box">
          <h4>Sightings:</h4>

          <div>
            <WrappedMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,
                places&key=AIzaSyCFH_I3zm7FCNWfCNp7jyYtX3QcHspsdVM"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `500px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            ></WrappedMap>
          </div>

          {isLoggedIn && !lat && (
            <>
              <br></br>
              <button class="btn-sighting">
                Select a Point on the Map to Add Sighting
              </button>
            </>
          )}

          {isLoggedIn && lat && (
            <>
              <div className="forum-card-reversed">
                <Card.Body>
                  <div align="center">
                    <h5 className="text-titles">Add Sighting</h5>
                  </div>
                  <br></br>
                  <div className="text-titles">
                    <strong>Latitude Selected: </strong>
                    {lat}
                  </div>
                  <div className="text-titles">
                    <strong>Longitude Selected: </strong>
                    {long}
                  </div>
                  <br></br>
                  <div className="text-titles">
                    <strong>(Optional) Add your {name} photo</strong>
                  </div>
                  <form onSubmit={formHandler}>
                    <input
                      className="text-titles"
                      type="file"
                      name="file"
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
                        <p className="text-titles">
                          <strong>Date: </strong>
                          {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-titles">
                        Select a file to show details
                      </p>
                    )}
                    {isSelected ? (
                      <button
                        class="btn-add-post"
                        type="submit"
                        onClick={() => {
                          setShowProgress(true);
                        }}
                      >
                        Add Sighting With Photo
                      </button>
                    ) : (
                      <button class="btn-add-post" onClick={sendWithoutUrl}>
                        Add Sighting Without Photo
                      </button>
                    )}
                  </form>
                  {showProgress && (
                    <p className="text-titles">Uploading done {progress}%</p>
                  )}
                </Card.Body>
              </div>
            </>
          )}
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
                    <Link to={`../Profile/${sighting.user}`} class="gridCard">
                      <Card.Img
                        variant="top"
                        src={sighting.photo}
                        class="cardImg"
                      />
                      <Card.Body>
                        <Card.Title>
                          <div className="inline-container">
                            <img
                              class="profile-image-forum"
                              src={sighting.user_photo}
                            ></img>
                            <div>&nbsp;{sighting.user}</div>
                          </div>
                        </Card.Title>
                        <div>{sighting.date}</div>
                      </Card.Body>
                    </Link>
                  </>
                );
              })}
            </section>
          </details>
        </div>
      </>
    );
  };

  return bird ? renderBird(bird) : <div>Loading...</div>;
}

export default Bird;

function MyMap() {
  const [sightingsArray, setSightingsArray] = useState([]);
  const [thisSighting, setThisSighting] = useState(null);
  const appState = useAppContext();

  const { id } = useParams();

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getSightings/${id}`).then(
      (response) => {
        setSightingsArray(response.data);
      }
    );
  }, []);

  return (
    <GoogleMap
      defaultZoom={5.3}
      defaultCenter={{ lat: 55, lng: -4.7 }}
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
            <div>Date: {thisSighting.date}</div>
            {thisSighting.user && (
              <>
                <a href={`/profile/${thisSighting.user}`}>
                  <div>
                    <h5>{thisSighting.user}</h5>
                  </div>
                </a>
              </>
            )}
            {thisSighting.photo && (
              <>
                <div>
                  <img className="map-image" src={thisSighting.photo} />
                </div>
              </>
            )}
          </>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(MyMap));
