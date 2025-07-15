import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDifficultyById } from '../services/getDifficultyByIdService';
import { checkWord } from '../services/checkWordService';
import GameBoard from '../components/GameBoard';
import PromptModal from '../components/PromptModal';
import SurrenderButton from '../components/SurrenderButton';
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
    if (err.response?.status === 404) {
      setGameOver(true);
      setPrompt({ type: 'lose', message: 'La sesión no existe o ha expirado.' });
    } else {
      setGameOver(true);
      setPrompt({ type: 'lose', message: 'Error al cargar la sesión.' });
    }
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
          setCurrentGuess(''); 
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
    } else if (/^[a-zñ]$/.test(key) && currentGuess.length < wordLength) {
      setCurrentGuess((prev) => prev + key);
    }
  }, [currentGuess, sessionId, wordLength, guesses, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleRetry = () => fetchSession();
  const handleHome = () => navigate('/');
  const handleGiveUp = () => {
    setGameOver(true);
    setPrompt({ type: 'lose', message: 'Te rendiste. ¡Suerte la próxima!' });
  };

  return (
    <div className="game-container">
      <h1>Wordle</h1>
      {wordLength ? (
        <GameBoard
          wordLength={wordLength}
          guesses={guesses}
          currentGuess={currentGuess}
          isChecking={isChecking}
        />
      ) : (
          <div className="loading-container">
            <p className="loading-text">Cargando sesión...</p>
          </div>
      )}
     {!gameOver && wordLength > 0 && guesses.length === 0 && currentGuess.length === wordLength && (
      <div className="floating-hint">
        Presiona <strong>Enter</strong> para enviar tu palabra
      </div>
      )}

      {!gameOver && wordLength > 0 && (
        <SurrenderButton onClick={handleGiveUp} />
      )}

      {prompt && (
        <PromptModal
          prompt={prompt}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
    </div>
  );
};

export default SessionPage;







