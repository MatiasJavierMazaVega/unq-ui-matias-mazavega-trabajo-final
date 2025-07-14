import React from 'react';
import '../styles/PromptModal.css'

const PromptModal = ({ prompt, onRetry, onHome }) => (
  <div className="prompt-overlay">
    <div className="prompt">
      <p>{prompt.message}</p>
      {(prompt.type === 'win' || prompt.type === 'lose') && (
        <div className="prompt-buttons">
          <button onClick={onRetry}>Volver a jugar</button>
          <button onClick={onHome}>Volver al inicio</button>
        </div>
      )}
    </div>
  </div>
);

export default PromptModal;
