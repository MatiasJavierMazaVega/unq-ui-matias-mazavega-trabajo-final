import React from 'react';
import fondoVideo from '../assets/miVideo.mp4';
import '../styles/FondoVideo.css'; 

const FondoVideo = () => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fondo-video"
      >
        <source src={fondoVideo} type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>
      <div className="video-overlay"></div>
    </>
  );
};

export default FondoVideo;