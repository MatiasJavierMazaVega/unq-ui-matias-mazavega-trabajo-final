import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DifficultyList.css';

const DifficultyList = ({ difficulties }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/session/difficulty/${id}`);
  };

  return (
    <div className="difficulty-list">
      {difficulties.map((difficulty) => (
        <button key={difficulty.id} onClick={() => handleClick(difficulty.id)}>
          {difficulty.name}
        </button>
      ))}
    </div>
  );
};

export default DifficultyList;
