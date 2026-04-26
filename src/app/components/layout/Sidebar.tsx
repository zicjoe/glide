import { Link, useLocation } from 'react-router';

const navigation = [
  { name: 'Dashboard', path: '/app/dashboard', icon: '📊' },
  { name: 'Invoices', path: '/app/invoices', icon: '📄' },
  { name: 'Create Invoice', path: '/app/invoices/create', icon: '➕' },
  { name: 'Settlement Queue', path: '/app/settlement', icon: '🔄' },
  { name: 'Audit Reports', path: '/app/audit', icon: '📋' },
  { name: 'Settings', path: '/app/settings', icon: '⚙️' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-sidebar-border">
        <img
          src="/logo.png"
          alt="Glide"
          className="h-8 w-auto"
        />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/app/dashboard' && location.pathname === '/app');

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Environment: <span className="text-foreground">DevNet</span></div>
          <div>Version: <span className="text-foreground">1.0.0</span></div>
        </div>
      </div>
    </div>
  );
}
