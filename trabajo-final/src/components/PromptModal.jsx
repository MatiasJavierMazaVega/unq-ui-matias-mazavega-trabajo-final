import React from 'react';
import '../styles/PromptModal.css'

const PromptModal = ({ prompt, onRetry, onHome }) => {
  const isSessionError = prompt.message.includes('sesión no existe') || prompt.message.includes('Error al cargar');

  return (
    <div className="prompt-overlay">
      <div className="prompt">
        <p>{prompt.message}</p>
        {(prompt.type === 'win' || prompt.type === 'lose') && (
          <div className="prompt-buttons">
            {!isSessionError && <button onClick={onRetry}>Volver a jugar</button>}
            <button onClick={onHome}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptModal;

