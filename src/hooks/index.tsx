import React, { ReactNode } from 'react';

import { AuthProvider } from './auth';

interface AppProviderProps {
  children: ReactNode;
}

//centralizar todos os hooks
function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export { AppProvider };