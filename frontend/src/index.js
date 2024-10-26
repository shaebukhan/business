import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'antd/dist/reset.css';
import {
  BrowserRouter,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/Auth';
import { SearchProvider } from './context/Search';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <SearchProvider>
      <BrowserRouter>
        <ToastContainer />
        <App />
      </BrowserRouter>
    </SearchProvider>
  </AuthProvider>

);

