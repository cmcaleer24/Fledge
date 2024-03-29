import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function Home(props) {
  const isLoggedIn = props.status === 'logged in';
  const user = props.userName;

  return (
    <div className="main-body">
      {isLoggedIn ? (
        <div className="hero">
          <h1 class="display-4">Welcome back {user}!</h1>
          <hr class="my-4"></hr>
        </div>
      ) : (
        <div className="hero">
          <h1 class="display-4">Welcome to fledge!</h1>
          <p class="lead">The birdwatching companion app.</p>
          <hr class="my-4"></hr>
          <p>Take flight on your journey today</p>
          <Nav.Link as={Link} to="/register">
            <a class="btn-trans-main" role="button">
              Get Started
            </a>
          </Nav.Link>
        </div>
      )}

      <Nav.Link as={Link} to="/Info">
        <Card className="my-card-2">
          <Card.Img
            className="home-card-image"
            variant="bottom"
            src="https://cdn.pixabay.com/photo/2017/11/30/11/57/barn-owl-2988291_1280.jpg"
          />
          <Card.Body>
            <Card.Title>Birds</Card.Title>
            <Card.Text>
              Find out statistics and check out photos and sightings of a
              particular bird
            </Card.Text>
          </Card.Body>
        </Card>
      </Nav.Link>

      <Nav.Link as={Link} to="/Feed">
        <Card className="my-card-2">
          <Card.Img
            className="home-card-image"
            variant="bottom"
            src="https://cdn.pixabay.com/photo/2018/11/30/10/13/winter-feeding-3847425__340.jpg"
          />
          <Card.Body>
            <Card.Title>Feed</Card.Title>
            <Card.Text>See what our Fledgelings have been up to!</Card.Text>
          </Card.Body>
        </Card>
      </Nav.Link>

      <Nav.Link as={Link} to="/Forums">
        <Card className="my-card">
          <Card.Img
            className="home-card-image"
            variant="bottom"
            src="https://cdn.pixabay.com/photo/2017/09/17/21/59/sparrows-2759978__340.jpg"
          />
          <Card.Body>
            <Card.Title>Forums</Card.Title>
            <Card.Text>
              Got a burning question or topic to discuss? Check out the forums
            </Card.Text>
          </Card.Body>
        </Card>
      </Nav.Link>

      <Nav.Link as={Link} to="/Guides">
        <Card className="my-card">
          <Card.Img
            className="home-card-image"
            variant="bottom"
            src="https://cdn.pixabay.com/photo/2014/05/06/19/00/adler-339125_960_720.jpg"
          />
          <Card.Body>
            <Card.Title>Guides</Card.Title>
            <Card.Text>
              Our place for advice and guidance on all things birdwatching
            </Card.Text>
          </Card.Body>
        </Card>
      </Nav.Link>
    </div>
  );
}

export default Home;
