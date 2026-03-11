import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './components/AuthContext';
import Top from './pages/Top';
import PatternList from './pages/PatternList';
import Workspace from './pages/Workspace';
import MyPage from './pages/MyPage';

import { ProtectedRoute } from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Top />} />
        <Route path="/patterns" element={
            <ProtectedRoute>
                <PatternList />
            </ProtectedRoute>
        } />
        <Route path="/workspace/:id" element={
            <ProtectedRoute>
                <Workspace />
            </ProtectedRoute>
        } />
        <Route path="/mypage" element={
            <ProtectedRoute>
                <MyPage />
            </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
