/ src/main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './index.css';                    // Your custom Tailwind + theme CSS
import { router } from './router.jsx'; 
import { AuthContextProvider } from './Context/AuthContext.jsx'; 
import ErrorBoundary from './Components/common/ErrorBoundary.jsx'; // We'll create this soon

/**
 * Main Entry Point of the Daycare Application
 * 
 * - Wraps the entire app with StrictMode for better development experience
 * - Provides global AuthContext
 * - Sets up React Router via RouterProvider
 * - Includes top-level ErrorBoundary for production resilience
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AuthContextProvider>
  </StrictMode>
);

