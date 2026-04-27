import { useEffect, useState } from 'react';
import type { UserRole } from './types';

const ROLE_STORAGE_KEY = 'glide.demo.role.v1';
const ROLE_CHANGE_EVENT = 'glide-demo-role-change';

export const demoRoles: UserRole[] = ['BUSINESS', 'PAYER', 'SETTLEMENT_OPERATOR', 'OBSERVER'];

function isUserRole(value: string | null): value is UserRole {
  return value === 'BUSINESS' || value === 'PAYER' || value === 'SETTLEMENT_OPERATOR' || value === 'OBSERVER';
}

export function getStoredDemoRole(): UserRole {
  if (typeof window === 'undefined') return 'BUSINESS';

  const storedRole = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return isUserRole(storedRole) ? storedRole : 'BUSINESS';
}

export function setStoredDemoRole(role: UserRole) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new CustomEvent<UserRole>(ROLE_CHANGE_EVENT, { detail: role }));
}

export function useDemoRole() {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => getStoredDemoRole());

  useEffect(() => {
    const handleStorage = () => setCurrentRoleState(getStoredDemoRole());
    const handleRoleChange = (event: Event) => {
      const customEvent = event as CustomEvent<UserRole>;
      if (customEvent.detail) setCurrentRoleState(customEvent.detail);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(ROLE_CHANGE_EVENT, handleRoleChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(ROLE_CHANGE_EVENT, handleRoleChange);
    };
  }, []);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setStoredDemoRole(role);
  };

  return { currentRole, setCurrentRole, roles: demoRoles };
}
