import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { AssetType, CreateInvoicePayload } from '../../../lib/types';
import { createInvoice } from '../../../lib/api';

export function CreateInvoice() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateInvoicePayload>({
    title: '',
    customerName: '',
    payerPartyId: '',
    observerPartyId: '',
    amount: 0,
    asset: 'USDCx',
    settlementDestination: '',
    dueDate: '',
    description: '',
  });

  const handleChange = (field: keyof CreateInvoicePayload, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const invoice = await createInvoice(formData);
      navigate(`/app/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl text-foreground">Create Invoice</h1>
        <p className="text-muted-foreground mt-2">
          Create a new invoice for CC or USDCx payment workflow.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-8 space-y-6">
        <div>
          <label className="block text-foreground mb-2">Invoice Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground"
            placeholder="Q1 Consulting Services"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-foreground mb-2">Customer/Payer Name</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground"
              placeholder="Acme Corp"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">Payer Party ID</label>
            <input
              type="text"
              required
              value={formData.payerPartyId}
              onChange={(e) => handleChange('payerPartyId', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground"
              placeholder="PARTY-ACME-001"
            />
          </div>
        </div>

        <div>
          <label className="block text-foreground mb-2">Observer Party ID</label>
          <input
            type="text"
            required
            value={formData.observerPartyId}
            onChange={(e) => handleChange('observerPartyId', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground"
            placeholder="PARTY-OBS-001"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-foreground mb-2">Amount</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground"
              placeholder="50000"
            />
          </div>

          <div>
            <label className="block text-foreground mb-2">Asset</label>
            <select
              required
              value={formData.asset}
              onChange={(e) => handleChange('asset', e.target.value as AssetType)}
              className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground"
            >
              <option value="USDCx">USDCx</option>
              <option value="CC">CC</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-foreground mb-2">Settlement Destination</label>
          <input
            type="text"
            required
            value={formData.settlementDestination}
            onChange={(e) => handleChange('settlementDestination', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground font-mono text-sm"
            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
          />
        </div>

        <div>
          <label className="block text-foreground mb-2">Due Date</label>
          <input
            type="date"
            required
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground"
          />
        </div>

        <div>
          <label className="block text-foreground mb-2">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-input-background border border-input text-foreground placeholder-muted-foreground resize-none"
            placeholder="Professional consulting services for Q1 2026"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/invoices')}
            className="px-6 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
