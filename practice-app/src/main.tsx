import React from 'react';
import ReactDOM from 'react-dom/client';
import { GraphPage } from './pages/GraphPage';
import { withChakra } from './app/providers/with-chakra';
import './index.css';

const App = withChakra(GraphPage);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
