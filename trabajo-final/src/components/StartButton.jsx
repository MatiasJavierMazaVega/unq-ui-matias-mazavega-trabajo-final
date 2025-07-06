import React from 'react';
import '../styles/StartButton.css';  

const StartButton = ({ onClick }) => {
  return (
    <button className="start-button" onClick={onClick}>
      Start
    </button>
  );
};

export default StartButton;