import { Link } from 'react-router';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img
            src="/logo-on-dark.png"
            alt="Glide"
            className="h-12 w-auto"
          />
          <div className="flex gap-3">
            <Link
              to="/app/invoices/create"
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              Create Invoice
            </Link>
            <Link
              to="/app/dashboard"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl mb-4 text-foreground">
            Business payment workflows on Canton
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create invoices, confirm CC or USDCx payments, route settlement, record fulfillment,
            and keep a clear audit trail.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link
              to="/app/dashboard"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground text-lg hover:opacity-90 transition-opacity"
            >
              Open Dashboard
            </Link>
            <Link
              to="/app/invoices/create"
              className="px-6 py-3 rounded-lg border border-border text-foreground text-lg hover:bg-muted transition-colors"
            >
              Create Invoice
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-8 mb-12">
          <h2 className="text-2xl mb-6 text-center text-foreground">Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'Create invoice', desc: 'Set up invoice details with amount and asset' },
              { step: '2', title: 'Confirm payment', desc: 'Payer confirms CC or USDCx payment' },
              { step: '3', title: 'Route settlement', desc: 'Settlement operator routes funds' },
              { step: '4', title: 'Record fulfillment', desc: 'Mark delivery complete' },
              { step: '5', title: 'Generate audit trail', desc: 'Complete state change record' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-xl border border-border p-8">
            <h2 className="text-2xl mb-4 text-foreground">Supported Assets</h2>
            <div className="space-y-3">
              {['CC', 'USDCx'].map((asset) => (
                <div key={asset} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <span className="text-foreground">{asset}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-8">
            <h2 className="text-2xl mb-4 text-foreground">Roles</h2>
            <div className="space-y-3">
              {['Business', 'Payer', 'Settlement Operator', 'Observer'].map((role) => (
                <div key={role} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    👤
                  </div>
                  <span className="text-foreground">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            Glide currently supports CC and USDCx workflow modeling for Canton based invoice,
            settlement, fulfillment, and audit flows.
          </p>
        </div>
      </div>
    </div>
  );
}
