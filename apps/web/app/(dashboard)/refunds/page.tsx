import { RefundsHeader } from "@/components/refunds/refunds-header";
import { RefundSummary } from "@/components/refunds/refund-summary";
import { RefundRecords } from "@/components/refunds/refund-records";
import { RefundApproval } from "@/components/refunds/refund-approval";
import { RefundHealth } from "@/components/refunds/refund-health";
import { RefundActivity } from "@/components/refunds/refund-activity";

export default function RefundsPage() {
  return (
    <div className="min-h-full">
      <RefundsHeader />

      <div className="px-8 py-6 space-y-6">
        <RefundSummary />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <RefundRecords />
            <RefundApproval />
          </div>

          <div className="col-span-1 space-y-6">
            <RefundHealth />
            <RefundActivity />
          </div>
        </div>
      </div>
    </div>
  );
}