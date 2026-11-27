import { useLayoutEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import content from './content/content.json';
import TrainingPage from './pages/TrainingPage.jsx';

export default function App() {
  const { key } = useLocation();
  const hasMounted = useRef(false);
  const focusOnEntry = hasMounted.current;
  useLayoutEffect(() => { hasMounted.current = true; }, [key]);

  return (
    <Routes>
      {content.pages.map(page => (
        <Route key={page.path} path={page.path} element={<TrainingPage key={page.path} page={page} focusOnEntry={focusOnEntry} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}