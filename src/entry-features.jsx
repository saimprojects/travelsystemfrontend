import { renderToString } from 'react-dom/server';
import { Route, Routes, StaticRouter } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import Features from './pages/Features';

export function renderFeatures() {
  return renderToString(
    <StaticRouter location="/features">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/features" element={<Features />} />
        </Route>
      </Routes>
    </StaticRouter>,
  );
}
