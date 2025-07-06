import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartDiffSelectionPage from './pages/StartDiffSelectionPage';
import FondoVideo from './components/FondoVideo';

function App() {
  return (
    <>
      {/* Fondo de video global */}
      <FondoVideo />

      {/* Contenido de tu app */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartDiffSelectionPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
