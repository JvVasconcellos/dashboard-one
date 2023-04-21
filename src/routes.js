import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export default function RoutesConfig(){
    return (
      <BrowserRouter>
          <Routes>
              <Route exact path={"/"} element={<Dashboard />} />
          </Routes>
      </BrowserRouter>
    );
  }