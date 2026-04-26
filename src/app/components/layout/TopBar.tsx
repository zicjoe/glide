import { useState, useEffect } from 'react';
import type { SystemStatus, UserRole } from '../../../lib/types';
import { getSystemStatus } from '../../../lib/api';
import { getSystemStatusColor } from '../../../lib/format';

const roles: UserRole[] = ['BUSINESS', 'PAYER', 'SETTLEMENT_OPERATOR', 'OBSERVER'];

export function TopBar() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('BUSINESS');

  useEffect(() => {
    getSystemStatus().then(setSystemStatus);
  }, []);

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg text-foreground">Business Payment Workflows</h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
            {systemStatus?.environment || 'DevNet'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {systemStatus && (
          <div className="flex items-center gap-3">
            <StatusBadge label="API" status={systemStatus.api} />
            <StatusBadge label="Canton" status={systemStatus.canton} />
          </div>
        )}

        <select
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value as UserRole)}
          className="px-3 py-1.5 rounded-lg bg-input-background border border-input text-foreground text-sm"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function StatusBadge({ label, status }: { label: string; status: 'online' | 'offline' | 'degraded' }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span className={`px-2 py-0.5 rounded border text-xs ${getSystemStatusColor(status)}`}>
        {status}
      </span>
    </div>
  );
}
