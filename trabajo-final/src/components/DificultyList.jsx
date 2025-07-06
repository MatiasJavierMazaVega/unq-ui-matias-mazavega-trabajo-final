import React from 'react';
import '../styles/DifficultyList.css'

const DifficultyList = ({ difficulties }) => {
  return (
    <div className="difficulty-list">
      {difficulties.map((difficulty) => (
        <button key={difficulty.id}>{difficulty.name}</button>
      ))}
    </div>
  );
};

export default DifficultyList;