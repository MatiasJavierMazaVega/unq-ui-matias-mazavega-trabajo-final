import React from 'react';

const StartDiffSelectionPage = () => {
  const handleStartClick = () => {
    console.log('Start clicked');
  };

  return (
    <div>
      <h1>Wordle</h1>
      <button onClick={handleStartClick}>Start</button>
    </div>
  );
};

export default StartDiffSelectionPage;