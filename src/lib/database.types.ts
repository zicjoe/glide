export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          title: string;
          customer_name: string;
          payer_party_id: string;
          observer_party_id: string;
          amount: number;
          asset: 'CC' | 'USDCx';
          settlement_destination: string;
          due_date: string;
          description: string;
          status:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED';
          created_at: string;
          updated_at: string;
          business_id: string;
          canton_reference: string | null;
          canton_workflow_id: string | null;
          canton_sync_status: 'PENDING' | 'READY' | 'SUBMITTED' | 'ACCEPTED' | 'FINALIZED' | 'FAILED';
          canton_last_error: string | null;
        };
        Insert: {
          id: string;
          title: string;
          customer_name: string;
          payer_party_id: string;
          observer_party_id: string;
          amount: number;
          asset: 'CC' | 'USDCx';
          settlement_destination: string;
          due_date: string;
          description?: string;
          status?:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED';
          created_at?: string;
          updated_at?: string;
          business_id: string;
          canton_reference?: string | null;
          canton_workflow_id?: string | null;
          canton_sync_status?: 'PENDING' | 'READY' | 'SUBMITTED' | 'ACCEPTED' | 'FINALIZED' | 'FAILED';
          canton_last_error?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          customer_name?: string;
          payer_party_id?: string;
          observer_party_id?: string;
          amount?: number;
          asset?: 'CC' | 'USDCx';
          settlement_destination?: string;
          due_date?: string;
          description?: string;
          status?:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED';
          created_at?: string;
          updated_at?: string;
          business_id?: string;
          canton_reference?: string | null;
          canton_workflow_id?: string | null;
          canton_sync_status?: 'PENDING' | 'READY' | 'SUBMITTED' | 'ACCEPTED' | 'FINALIZED' | 'FAILED';
          canton_last_error?: string | null;
        };
      };
      audit_events: {
        Row: {
          id: string;
          invoice_id: string;
          action: string;
          actor_role: 'BUSINESS' | 'PAYER' | 'SETTLEMENT_OPERATOR' | 'OBSERVER';
          event_timestamp: string;
          previous_status:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED'
            | null;
          new_status:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED';
          asset: 'CC' | 'USDCx';
          amount: number;
          reference_id: string;
          metadata: Json;
        };
        Insert: {
          id: string;
          invoice_id: string;
          action: string;
          actor_role: 'BUSINESS' | 'PAYER' | 'SETTLEMENT_OPERATOR' | 'OBSERVER';
          event_timestamp?: string;
          previous_status?:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED'
            | null;
          new_status:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED';
          asset: 'CC' | 'USDCx';
          amount: number;
          reference_id: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          action?: string;
          actor_role?: 'BUSINESS' | 'PAYER' | 'SETTLEMENT_OPERATOR' | 'OBSERVER';
          event_timestamp?: string;
          previous_status?:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED'
            | null;
          new_status?:
            | 'DRAFT'
            | 'ISSUED'
            | 'PAYMENT_PENDING'
            | 'PAYMENT_CONFIRMED'
            | 'SETTLEMENT_PENDING'
            | 'SETTLED'
            | 'FULFILLED'
            | 'CANCELLED'
            | 'DISPUTED';
          asset?: 'CC' | 'USDCx';
          amount?: number;
          reference_id?: string;
          metadata?: Json;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      asset_type: 'CC' | 'USDCx';
      invoice_status:
        | 'DRAFT'
        | 'ISSUED'
        | 'PAYMENT_PENDING'
        | 'PAYMENT_CONFIRMED'
        | 'SETTLEMENT_PENDING'
        | 'SETTLED'
        | 'FULFILLED'
        | 'CANCELLED'
        | 'DISPUTED';
      user_role: 'BUSINESS' | 'PAYER' | 'SETTLEMENT_OPERATOR' | 'OBSERVER';
      canton_sync_status: 'PENDING' | 'READY' | 'SUBMITTED' | 'ACCEPTED' | 'FINALIZED' | 'FAILED';
    };
  };
};
