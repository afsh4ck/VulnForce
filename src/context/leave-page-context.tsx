'use client';

import React from 'react';

type UseLeavePageHook = (hasChanges: boolean) => void;

export const LeavePageContext = React.createContext<{
  setHasUnsavedChanges: UseLeavePageHook;
  handleRequestLeave: (path: string) => void;
} | null>(null);

export const useLeavePage = () => {
  const context = React.useContext(LeavePageContext);
  if (!context) {
    throw new Error('useLeavePage must be used within a LeavePageProvider');
  }
  return context.setHasUnsavedChanges;
};
