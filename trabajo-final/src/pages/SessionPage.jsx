import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDifficultyById } from '../services/getDifficultyByIdService';
import { checkWord } from '../services/checkWordService';
import '../styles/SessionPage.css';

const MAX_ATTEMPTS = 6;

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [wordLength, setWordLength] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [prompt, setPrompt] = useState(null); 

  const [isChecking, setIsChecking] = useState(false);


  const fetchSession = useCallback(async () => {
    try {
      const res = await getDifficultyById(id);
      setSessionId(res.sessionId);
      setWordLength(res.wordLenght); 
      setGuesses([]);
      setCurrentGuess('');
      setGameOver(false);
      setPrompt(null);
    } catch (err) {
      console.error('Error fetching session:', err);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchSession();
  }, [id, fetchSession]);


  useEffect(() => {
    if (prompt?.type === 'invalid') {
      const timeout = setTimeout(() => setPrompt(null), 1500); 
      return () => clearTimeout(timeout);
    }
  }, [prompt]);

  const handleKeyDown = useCallback(async (e) => {
    if (gameOver || !wordLength) return;
    const key = e.key.toLowerCase();

    if (key === 'enter') {
      if (currentGuess.length !== wordLength) return;
      setIsChecking(true);
      try {
        const feedback = await checkWord(sessionId, currentGuess);
        setIsChecking(false);
        const newGuesses = [...guesses, { guess: currentGuess, feedback }];
        setGuesses(newGuesses);
        setCurrentGuess('');
        setPrompt(null);

        const isWin = feedback.every((l) => l.solution === 'correct');
        if (isWin) {
          setGameOver(true);
          setPrompt({ type: 'win', message: '¡Ganaste!' });
        } else if (newGuesses.length === MAX_ATTEMPTS) {
          setGameOver(true);
          setPrompt({ type: 'lose', message: '¡Perdiste!' });
        }

      } catch (err) {
        setIsChecking(false);
        if (err.response?.status === 400) {
          setPrompt({ type: 'invalid', message: 'La palabra no existe en el diccionario.' });
        } else if (err.response?.status === 404) {
          setGameOver(true);
          setPrompt({ type: 'lose', message: 'Sesión no encontrada.' });
        } else {
          setGameOver(true);
          setPrompt({ type: 'lose', message: 'Error desconocido al verificar palabra.' });
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
      <div
        className={`cell ${isChecking ? 'loading-cell' : ''}`}
        key={i}
      >
        {currentGuess[i] || ''}
      </div>
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

  const handleRetry = () => {
    fetchSession(); 
  };

  const handleHome = () => navigate('/');

  const handleGiveUp = () => {
    setGameOver(true);
    setPrompt({ type: 'lose', message: 'Te rendiste. ¡Suerte la próxima!' });
  };

  return (
    <div className="game-container">
      <h1>Wordle</h1>

      <div className="board">
        {wordLength ? renderBoard() : <p className="loading-text">Cargando sesión...</p>}
      </div>


      {!gameOver && wordLength > 0 && (
        <div className="surrender-button-container">
          <button className="surrender-button" onClick={handleGiveUp}>
            Rendirse
          </button>
        </div>
      )}


      {prompt && (
        <div className="prompt-overlay">
          <div className="prompt">
            <p>{prompt.message}</p>

            {(prompt.type === 'win' || prompt.type === 'lose') && (
              <div className="prompt-buttons">
                <button onClick={handleRetry}>Volver a jugar</button>
                <button onClick={handleHome}>Volver al inicio</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionPage;






