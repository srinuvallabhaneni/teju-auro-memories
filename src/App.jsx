import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MemoryProvider } from './contexts/MemoryContext';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import WeddingJourney from './pages/WeddingJourney';
import EventGallery from './pages/EventGallery';
import Memories from './pages/Memories';
import NewMemory from './pages/NewMemory';
import MemoryDetail from './pages/MemoryDetail';
import Gallery from './pages/Gallery';
import About from './pages/About';

function App() {
  return (
    <MemoryProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <div className="pt-16 md:pt-28">
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/wedding-journey" element={<PageTransition><WeddingJourney /></PageTransition>} />
            <Route path="/event/:eventId" element={<PageTransition><EventGallery /></PageTransition>} />
            <Route path="/memories" element={<PageTransition><Memories /></PageTransition>} />
            <Route path="/memories/new" element={<PageTransition><NewMemory /></PageTransition>} />
            <Route path="/memories/:id" element={<PageTransition><MemoryDetail /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          </Routes>
        </div>
      </Router>
    </MemoryProvider>
  );
}

export default App;
