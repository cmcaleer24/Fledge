import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function Footer() {
  const rspb = 'https://www.rspb.org.uk/';
  const nbn = 'https://nbnatlas.org/';
  const bto = 'https://www.bto.org/';
  const react = 'https://www.reactjs.org/';
  const monster = 'https://www.monsterenergy.com/';

  return (
    <div className="footer">
      <div class="row">
        <div class="column-footer">
          <p className="footerHead">
            <strong> Our Partners: </strong>
          </p>
          <a href={bto}>
            <img src="/assets/logos/bto.png" width="82px" height="30px" />
          </a>
        </div>

        <div class="column-footer">
          <p className="footerHead">
            <strong className="emptyFoot"> Our Partners </strong>
          </p>
          <a href={rspb}>
            <img src="/assets/logos/rspb.jpg" width="50x" height="50px" />
          </a>
        </div>

        <div class="column-footer">
          <p className="footerHead">
            <strong className="emptyFoot"> Our Partners </strong>
          </p>
          <a href={nbn}>
            <img src="/assets/logos/nbn.webp" width="95px" height="30px" />
          </a>
        </div>

        <div class="column-footer">
          <p className="footerHead">
            <strong className="emptyFoot"> Our Partners </strong>
          </p>
          <a href={react}>
            <img src="/assets/logos/logo192.png" width="44px" height="44px" />
          </a>
        </div>

        <div class="column-footer">
          <p className="footerHead">
            <strong className="emptyFoot"> Our Partners </strong>
          </p>
          <a href={monster}>
            <img src="/assets/logos/monster.png" width="95px" height="40px" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
