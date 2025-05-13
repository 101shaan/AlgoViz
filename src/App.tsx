import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import AlgorithmPage from './pages/AlgorithmPage';
import AlgorithmsPage from './pages/AlgorithmsPage';
import ComparisonPage from './pages/ComparisonPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithms" element={<AlgorithmsPage />} />
            <Route path="/algorithm/:algorithmId" element={<AlgorithmPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;