insert into public.businesses (id, name)
values ('BIZ-001', 'Glide Demo Business')
on conflict (id) do update set name = excluded.name;

insert into public.invoices (
  id, title, customer_name, payer_party_id, observer_party_id, amount, asset,
  settlement_destination, due_date, description, status, business_id, canton_reference,
  created_at, updated_at
) values
('INV-001', 'Q1 Consulting Services', 'Acme Corp', 'PARTY-ACME-001', 'PARTY-OBS-001', 50000, 'USDCx', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '2026-05-15', 'Professional consulting services for Q1 2026', 'PAYMENT_CONFIRMED', 'BIZ-001', 'GLIDE-CN-INV-001', '2026-04-01T10:00:00Z', '2026-04-20T14:30:00Z'),
('INV-002', 'Software License Annual Renewal', 'TechStart Inc', 'PARTY-TECH-002', 'PARTY-OBS-002', 25000, 'CC', '0x8ba1f109551bD432803012645Ac136ddd64DBA72', '2026-05-01', 'Annual software license renewal for enterprise platform', 'SETTLEMENT_PENDING', 'BIZ-001', 'GLIDE-CN-INV-002', '2026-04-10T09:00:00Z', '2026-04-22T11:00:00Z'),
('INV-003', 'Hardware Equipment Purchase', 'BuildRight LLC', 'PARTY-BUILD-003', 'PARTY-OBS-001', 75000, 'USDCx', '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t', '2026-04-30', 'Server hardware and networking equipment', 'PAYMENT_PENDING', 'BIZ-001', 'GLIDE-CN-INV-003', '2026-04-15T08:00:00Z', '2026-04-23T10:00:00Z'),
('INV-004', 'Marketing Services Package', 'GrowthHub Co', 'PARTY-GROWTH-004', 'PARTY-OBS-002', 15000, 'CC', '0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g', '2026-06-01', 'Comprehensive digital marketing campaign', 'SETTLED', 'BIZ-001', 'GLIDE-CN-INV-004', '2026-03-20T12:00:00Z', '2026-04-18T16:00:00Z'),
('INV-005', 'Cloud Infrastructure Q2', 'DataFlow Systems', 'PARTY-DATA-005', 'PARTY-OBS-001', 42000, 'USDCx', '0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0', '2026-05-20', 'Cloud hosting and infrastructure services', 'FULFILLED', 'BIZ-001', 'GLIDE-CN-INV-005', '2026-03-25T11:00:00Z', '2026-04-25T09:00:00Z'),
('INV-006', 'Training Workshop Series', 'SkillBoost Academy', 'PARTY-SKILL-006', 'PARTY-OBS-002', 8500, 'CC', '0xf1e2d3c4b5a6978685746352413021908776655', '2026-05-10', 'Employee training and development workshops', 'ISSUED', 'BIZ-001', 'GLIDE-CN-INV-006', '2026-04-18T13:00:00Z', '2026-04-18T13:00:00Z')
on conflict (id) do update set
  title = excluded.title,
  customer_name = excluded.customer_name,
  payer_party_id = excluded.payer_party_id,
  observer_party_id = excluded.observer_party_id,
  amount = excluded.amount,
  asset = excluded.asset,
  settlement_destination = excluded.settlement_destination,
  due_date = excluded.due_date,
  description = excluded.description,
  status = excluded.status,
  business_id = excluded.business_id,
  canton_reference = excluded.canton_reference,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.audit_events (id, invoice_id, action, actor_role, event_timestamp, previous_status, new_status, asset, amount, reference_id) values
('AUD-INV-001-001', 'INV-001', 'Invoice Created', 'BUSINESS', '2026-04-01T10:00:00Z', null, 'DRAFT', 'USDCx', 50000, 'GLIDE-CN-INV-001'),
('AUD-INV-001-002', 'INV-001', 'Invoice Issued', 'BUSINESS', '2026-04-01T10:05:00Z', 'DRAFT', 'ISSUED', 'USDCx', 50000, 'GLIDE-CN-INV-001'),
('AUD-INV-001-003', 'INV-001', 'Payment Request Generated', 'BUSINESS', '2026-04-01T10:10:00Z', 'ISSUED', 'PAYMENT_PENDING', 'USDCx', 50000, 'GLIDE-CN-INV-001'),
('AUD-INV-001-004', 'INV-001', 'Payment Confirmed', 'PAYER', '2026-04-20T14:30:00Z', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'USDCx', 50000, 'GLIDE-CN-INV-001'),
('AUD-INV-002-001', 'INV-002', 'Invoice Created', 'BUSINESS', '2026-04-10T09:00:00Z', null, 'DRAFT', 'CC', 25000, 'GLIDE-CN-INV-002'),
('AUD-INV-002-002', 'INV-002', 'Invoice Issued', 'BUSINESS', '2026-04-10T09:05:00Z', 'DRAFT', 'ISSUED', 'CC', 25000, 'GLIDE-CN-INV-002'),
('AUD-INV-002-003', 'INV-002', 'Payment Request Generated', 'BUSINESS', '2026-04-10T09:10:00Z', 'ISSUED', 'PAYMENT_PENDING', 'CC', 25000, 'GLIDE-CN-INV-002'),
('AUD-INV-002-004', 'INV-002', 'Payment Confirmed', 'PAYER', '2026-04-22T10:40:00Z', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'CC', 25000, 'GLIDE-CN-INV-002'),
('AUD-INV-002-005', 'INV-002', 'Settlement Routed', 'SETTLEMENT_OPERATOR', '2026-04-22T11:00:00Z', 'PAYMENT_CONFIRMED', 'SETTLEMENT_PENDING', 'CC', 25000, 'GLIDE-CN-INV-002')
on conflict (id) do nothing;
