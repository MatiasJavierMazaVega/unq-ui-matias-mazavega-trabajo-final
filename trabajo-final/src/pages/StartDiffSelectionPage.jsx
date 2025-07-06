import React, { useState } from 'react';
import StartButton from '../components/StartButton';
import DifficultyList from '../components/DificultyList';
import { getDifficulties } from '../services/difficultyService';
import '../styles/StartDiffSelectionPage.css'

const StartDiffSelectionPage = () => {
  const [showDifficulties, setShowDifficulties] = useState(false);
  const [difficulties, setDifficulties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStartClick = async () => {
    setLoading(true);
    try {
      const data = await getDifficulties();
      setDifficulties(data);
      setShowDifficulties(true);
    } catch (err) {
      setError('No se pudieron cargar las dificultades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="page-container">
    <h1 className="page-title">Wordle</h1>

    {loading && <p className="loading-text">Cargando dificultades...</p>}
    {error && <p>{error}</p>}

    {!loading && !error && (
      showDifficulties ? (
        <DifficultyList difficulties={difficulties} />
      ) : (
        <StartButton onClick={handleStartClick} />
      )
    )}
  </div>
);
};

export default StartDiffSelectionPage;