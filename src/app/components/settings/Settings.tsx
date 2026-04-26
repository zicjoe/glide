import { useState, useEffect } from 'react';
import type { SystemStatus } from '../../../lib/types';
import { getSystemStatus, resetDemoData } from '../../../lib/api';
import { getSystemStatusColor } from '../../../lib/format';

export function Settings() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState('https://api.glide.example.com');
  const [resetStatus, setResetStatus] = useState<'idle' | 'resetting' | 'done'>('idle');

  useEffect(() => {
    getSystemStatus().then(setSystemStatus);
  }, []);

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset all local Glide demo workflow data?')) return;

    setResetStatus('resetting');
    await resetDemoData();
    setResetStatus('done');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configuration and system status for Glide workflow platform
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl mb-4 text-foreground">System Status</h2>
        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusItem label="API Status" value={systemStatus.api} />
            <StatusItem label="Canton Status" value={systemStatus.canton} />
            <div>
              <div className="text-sm text-muted-foreground mb-2">Environment</div>
              <div className="px-3 py-2 rounded-lg bg-muted text-foreground">
                {systemStatus.environment}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Last Checked</div>
              <div className="px-3 py-2 rounded-lg bg-muted text-foreground">
                {new Date(systemStatus.lastChecked).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl mb-4 text-foreground">Supported Assets</h2>
        <div className="space-y-3">
          {systemStatus?.supportedAssets.map((asset) => (
            <div key={asset} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                ✓
              </div>
              <div className="flex-1">
                <div className="text-foreground">{asset}</div>
                <div className="text-sm text-muted-foreground">
                  Canton-based settlement asset
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl mb-4 text-foreground">Backend Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-foreground mb-2">API Base URL</label>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground font-mono text-sm"
              placeholder="https://api.glide.example.com"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Configure the backend API endpoint for production deployment
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-foreground mb-3">API Routes Reference</h3>
            <div className="space-y-2 font-mono text-sm">
              <RouteItem method="GET" path="/api/health" />
              <RouteItem method="GET" path="/api/system/status" />
              <RouteItem method="GET" path="/api/dashboard/metrics" />
              <RouteItem method="GET" path="/api/invoices" />
              <RouteItem method="POST" path="/api/invoices" />
              <RouteItem method="GET" path="/api/invoices/:id" />
              <RouteItem method="POST" path="/api/invoices/:id/confirm-payment" />
              <RouteItem method="POST" path="/api/invoices/:id/route-settlement" />
              <RouteItem method="POST" path="/api/invoices/:id/mark-settled" />
              <RouteItem method="POST" path="/api/invoices/:id/mark-fulfilled" />
              <RouteItem method="POST" path="/api/invoices/:id/cancel" />
              <RouteItem method="POST" path="/api/invoices/:id/dispute" />
              <RouteItem method="GET" path="/api/invoices/:id/audit" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl mb-4 text-foreground">Workflow Configuration</h2>
        <div className="space-y-4">
          <ConfigItem
            label="Invoice Workflow Mode"
            value="Canton-based payment and settlement"
          />
          <ConfigItem
            label="Settlement Policy"
            value="Manual operator approval required"
          />
          <ConfigItem
            label="Audit Trail"
            value="Complete state change recording enabled"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl mb-4 text-foreground">Demo Data</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Reset the local invoice workflow state back to the seeded CC and USDCx demo records.
          This only clears browser demo data and does not affect any backend or Canton deployment.
        </p>
        <button
          type="button"
          onClick={handleResetDemoData}
          disabled={resetStatus === 'resetting'}
          className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          {resetStatus === 'resetting' ? 'Resetting...' : 'Reset Local Demo Data'}
        </button>
        {resetStatus === 'done' && (
          <p className="text-sm text-primary mt-3">
            Demo workflow data has been reset. Refresh dashboard pages to reload seeded records.
          </p>
        )}
      </div>

      <div className="bg-muted rounded-xl p-6">
        <h3 className="text-foreground mb-2">About Glide</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Glide currently supports CC and USDCx workflow modeling for Canton based invoice,
          settlement, fulfillment, and audit flows.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Version:</span>{' '}
            <span className="text-foreground">1.0.0</span>
          </div>
          <div>
            <span className="text-muted-foreground">Environment:</span>{' '}
            <span className="text-foreground">{systemStatus?.environment || 'DevNet'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, value }: { label: string; value: 'online' | 'offline' | 'degraded' }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className={`px-3 py-2 rounded-lg border inline-flex ${getSystemStatusColor(value)}`}>
        {value}
      </div>
    </div>
  );
}

function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function RouteItem({ method, path }: { method: string; path: string }) {
  const methodColors = {
    GET: 'text-blue-400',
    POST: 'text-green-400',
  };

  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className={`w-12 ${methodColors[method as keyof typeof methodColors]}`}>
        {method}
      </span>
      <span className="text-foreground">{path}</span>
    </div>
  );
}
