import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { InvoiceList } from './components/invoices/InvoiceList';
import { CreateInvoice } from './components/invoices/CreateInvoice';
import { InvoiceDetail } from './components/invoices/InvoiceDetail';
import { SettlementQueue } from './components/settlements/SettlementQueue';
import { AuditReports } from './components/audit/AuditReports';
import { Settings } from './components/settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'invoices', element: <InvoiceList /> },
      { path: 'invoices/create', element: <CreateInvoice /> },
      { path: 'invoices/:id', element: <InvoiceDetail /> },
      { path: 'settlement', element: <SettlementQueue /> },
      { path: 'audit', element: <AuditReports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
