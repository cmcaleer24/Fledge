import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import './App.css';

function Guides() {
  return (
    <div className="main-body">
      <div className="heroGuides">
        <h1 class="display-4"> Guides </h1>
        <hr class="my-4"></hr>
      </div>

      <div>
        <Nav.Link as={Link} to="/Birdwatching">
          <Card className="myCard3">
            <Card.Img
              className="home-card-image"
              variant="bottom"
              src="https://media.istockphoto.com/photos/young-female-hunter-using-binoculars-for-bird-spotting-with-hungarian-picture-id1347188341?k=20&m=1347188341&s=612x612&w=0&h=yCd8O8Z6nEQwygNk_UPjhQw8WrfRLvYUJ4AKk7E6rAU="
            />
            <Card.Body>
              <Card.Title>Birdwatching</Card.Title>
              <Card.Text>
                How to get the most out of your birdwatching session
              </Card.Text>
            </Card.Body>
          </Card>
        </Nav.Link>

        <Nav.Link as={Link} to="/Equipment">
          <Card className="myCard3">
            <Card.Img
              className="home-card-image"
              variant="bottom"
              src="https://cdn.pixabay.com/photo/2020/06/04/07/16/telescope-5257599_960_720.jpg"
            />
            <Card.Body>
              <Card.Title>Equipment</Card.Title>
              <Card.Text>
                How to manage and care for your birdwartching equipment
              </Card.Text>
            </Card.Body>
          </Card>
        </Nav.Link>

        <Nav.Link as={Link} to="/Legislation">
          <Card className="myCard3">
            <Card.Img
              className="home-card-image"
              variant="bottom"
              src="https://cdn.pixabay.com/photo/2018/09/09/18/04/judge-3665164__340.jpg"
            />
            <Card.Body>
              <Card.Title>Legislation</Card.Title>
              <Card.Text>
                Information on the Widlife & Countryside Act 1981
              </Card.Text>
            </Card.Body>
          </Card>
        </Nav.Link>
      </div>
    </div>
  );
}

export default Guides;
