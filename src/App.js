import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Component/LoginPage';
import Home from './Component/Home';
import ProtectedRoute from './Component/ProtectedRoute';
import StockManagement from './Component/StockManagement';
import ViewStock from './Component/ViewStock';
import AddStock from './Component/AddStock';
import PriceHistory from './Component/PriceHistory';
import DailyStocks from './Component/TodaysStock';
import TodaysStock from './Component/TodaysStock';
import StockHistory from './Component/StockHistory';
import Setting from './Component/Setting';

function App() {
  const [data, setData] = useState(() => {
    // Load user data from localStorage if it exists
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  });
  
  // Handler to set the user data and store it in localStorage
  const onSetDataHandler = (val) => {
    setData(val);
    localStorage.setItem('userData', JSON.stringify(val)); // Persist user data
  };

  // Clear user data and localStorage on logout
  const handleLogout = () => {
    setData(null);
    localStorage.removeItem('userData');
  };
  const updateUserData = (newData) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,  // Update both username and name
    }));
    localStorage.setItem('userData', JSON.stringify({
      ...data,
      ...newData,  // Persist updated data
    }));
  };
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/"
          element={<LoginPage onSetData={onSetDataHandler} />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home userData={data} onLogout={handleLogout} /> {/* Pass logout handler to Home */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-management"
          element={
            <ProtectedRoute>
              <StockManagement/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-management/view-stock"
          element={
            <ProtectedRoute>
              < ViewStock userData={data}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-management/add-stock"
          element={
            <ProtectedRoute>
              <AddStock userData={data}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/price-history"
          element={
            <ProtectedRoute>
              <PriceHistory/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-stocks"
          element={
            <ProtectedRoute>
              <DailyStocks/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-management/todays-stock"
          element={
            <ProtectedRoute>
              <TodaysStock userData={data}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-management/stock-history"
          element={
            <ProtectedRoute>
              <StockHistory/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Setting userData={data} updateUserData={updateUserData}/>
            </ProtectedRoute>
          }
        />
        {/* Redirect if user is already logged in */}
        <Route
          path="*"
          element={data ? <Navigate to="/home" replace /> : <Navigate to="/" replace />}
        />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
