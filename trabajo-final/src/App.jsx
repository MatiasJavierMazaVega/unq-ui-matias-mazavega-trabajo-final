import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StartDiffSelectionPage from './pages/StartDiffSelectionPage';
import SessionPage from './pages/SessionPage';
import FondoVideo from './components/FondoVideo';

function App() {
  return (
    <>    
      <FondoVideo />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartDiffSelectionPage />} />
          <Route path="/session/difficulty/:id" element={<SessionPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
