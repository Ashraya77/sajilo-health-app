import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { subscribeToAuthTokenChanges } from '@/services/tokenStorage';
import type { SelectedClinicWorkspace } from '@/types/clinic';

type ClinicWorkspaceContextValue = {
  selectedClinic: SelectedClinicWorkspace | null;
  selectClinic: (clinic: SelectedClinicWorkspace) => void;
  clearSelectedClinic: () => void;
};

const ClinicWorkspaceContext = createContext<ClinicWorkspaceContextValue | null>(null);

/** Owns the single selected clinic used by all clinic-scoped patient requests. */
export function ClinicWorkspaceProvider({ children }: PropsWithChildren) {
  const [selectedClinic, setSelectedClinic] = useState<SelectedClinicWorkspace | null>(null);
  const selectClinic = useCallback((clinic: SelectedClinicWorkspace) => {
    setSelectedClinic(clinic);
  }, []);
  const clearSelectedClinic = useCallback(() => {
    setSelectedClinic(null);
  }, []);

  useEffect(
    () => subscribeToAuthTokenChanges((change) => {
      if (change === 'unauthenticated') setSelectedClinic(null);
    }),
    [],
  );

  const value = useMemo<ClinicWorkspaceContextValue>(() => ({
    selectedClinic,
    selectClinic,
    clearSelectedClinic,
  }), [clearSelectedClinic, selectClinic, selectedClinic]);

  return (
    <ClinicWorkspaceContext.Provider value={value}>
      {children}
    </ClinicWorkspaceContext.Provider>
  );
}

export function useClinicWorkspace(): ClinicWorkspaceContextValue {
  const value = useContext(ClinicWorkspaceContext);

  if (!value) {
    throw new Error('useClinicWorkspace must be used within ClinicWorkspaceProvider.');
  }

  return value;
}
