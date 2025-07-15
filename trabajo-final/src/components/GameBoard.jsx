import React from 'react';
import '../styles/GameBoard.css'

const MAX_ATTEMPTS = 6;

const GameBoard = ({ wordLength, guesses, currentGuess, isChecking }) => {
  const renderCell = (letter, status, idx) => (
    <div className={`cell ${status || ''}`} key={idx}>
      {letter}
    </div>
  );

  const renderRow = (guessObj, rowIndex) => {
    const { guess, feedback } = guessObj;
    return (
      <div className="row" key={rowIndex}>
        {Array.from({ length: wordLength }).map((_, i) =>
          renderCell(guess[i] || '', feedback?.[i]?.solution, i)
        )}
      </div>
    );
  };

  const renderEmptyRow = (rowIndex) => (
    <div className="row" key={rowIndex}>
      {Array.from({ length: wordLength }).map((_, i) => {
        const isCurrent = i === currentGuess.length && !isChecking;

        return (
          <div
            className={`cell ${isChecking ? 'loading-cell' : ''} ${isCurrent ? 'current-cell' : ''}`}
            key={i}
          >
            {currentGuess[i] || ''}
          </div>
        );
      })}
    </div>
  );


  const rows = [];

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (i < guesses.length) {
      rows.push(renderRow(guesses[i], i));
    } else if (i === guesses.length) {
      rows.push(renderEmptyRow(i));
    } else {
      rows.push(renderRow({ guess: '', feedback: [] }, i));
    }
  }

  return <div className="board">{rows}</div>;
};

export default GameBoard;
