export type MerchantRow = {
    merchant_id: number;
    owner: string;
    active: number;
    created_at: number;
    updated_at: number;
  };
  
  export type TreasuryPolicyRow = {
    merchant_id: number;
    settlement_asset: number;
    auto_split: number;
    idle_yield: number;
    yield_threshold: number;
    updated_at: number;
  };
  
  export type PayoutDestinationRow = {
    merchant_id: number;
    destination_id: number;
    label: string;
    asset: number;
    destination: string;
    destination_type: number;
    enabled: number;
    created_at: number;
  };
  
  export type TreasuryBucketRow = {
    merchant_id: number;
    bucket_id: number;
    name: string;
    allocation_bps: number;
    destination_id: number;
    idle_mode: number;
    enabled: number;
    created_at: number;
  };
  
  export type ActivityEventRow = {
    id?: number;
    merchant_id: number | null;
    event_type: string;
    entity_type: string;
    entity_id: string;
    payload_json: string;
    created_at: number;
  };