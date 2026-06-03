import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import ResultPage from './pages/ResultPage';
import SkillPage from './pages/SkillPage';
import SkillResultPage from './pages/SkillResultPage';
import ProfilePage from './pages/ProfilePage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import { AnimatePresence, motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
        <Route path="/analyze" element={<PageTransition><AnalyzePage /></PageTransition>} />
        <Route path="/result" element={<PageTransition><ResultPage /></PageTransition>} />
        <Route path="/skill" element={<PageTransition><SkillPage /></PageTransition>} />
        <Route path="/skill-result" element={<PageTransition><SkillResultPage /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/history/:careerId" element={<PageTransition><HistoryDetailPage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
