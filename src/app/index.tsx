import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page') as HTMLElement;
  const root = createRoot(container);
  root.render(<App />);
});