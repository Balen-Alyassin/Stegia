import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import { BrowserRouter, Routes, Route } from 'react-router-dom';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Create a root.

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

