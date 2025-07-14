import React from 'react';
import '../styles/SurrenderButton.css'

const SurrenderButton = ({ onClick }) => (
  <div className="surrender-button-container">
    <button className="surrender-button" onClick={onClick}>
      Rendirse
    </button>
  </div>
);

export default SurrenderButton;
