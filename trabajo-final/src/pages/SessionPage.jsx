import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getDifficultyById } from '../services/getDifficultyByIdService';
import { checkWord } from '../services/checkWordService';
import '../styles/SessionPage.css';

const MAX_ATTEMPTS = 6;

const SessionPage = () => {
  const { id } = useParams();
  const [sessionId, setSessionId] = useState(null);
  const [wordLength, setWordLength] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await getDifficultyById(id);
        setSessionId(res.sessionId);
        setWordLength(res.wordLenght); 
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    };

    if (id) fetchSession();
  }, [id]);

  const handleKeyDown = useCallback(async (e) => {
    if (gameOver || !wordLength) return;
    const key = e.key.toLowerCase();

    if (key === 'enter') {
      if (currentGuess.length !== wordLength) return;

      try {
        const feedback = await checkWord(sessionId, currentGuess);
        const newGuesses = [...guesses, { guess: currentGuess, feedback }];
        setGuesses(newGuesses);
        setCurrentGuess('');

        const isWin = feedback.every((l) => l.solution === 'correct');
        if (isWin) {
          setGameOver(true);
          setMessage('¡Ganaste!');
        } else if (newGuesses.length === MAX_ATTEMPTS) {
          setGameOver(true);
          setMessage('¡Perdiste!');
        }

      } catch (err) {
        if (err.response?.status === 400) {
          setMessage('La palabra no existe en el diccionario.');
        } else if (err.response?.status === 404) {
          setMessage('Sesión no encontrada.');
        } else {
          setMessage('Error desconocido al verificar palabra.');
        }
      }

    } else if (key === 'backspace') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[a-z]$/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess((prev) => prev + key);
    }
  }, [currentGuess, sessionId, wordLength, guesses, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
      {Array.from({ length: wordLength }).map((_, i) =>
        renderCell(currentGuess[i] || '', '', i)
      )}
    </div>
  );

  const renderBoard = () => {
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

    return rows;
  };

  return (
    <div className="game-container">
      <h1>Wordle</h1>xasa
      <div className="board">
        {wordLength ? renderBoard() : <p>Cargando sesión...</p>}
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SessionPage;

