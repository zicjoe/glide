import { MapPin, Plus, MoreVertical, Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const destinations = [
  {
    id: 1,
    label: "Operating Wallet",
    asset: "sBTC",
    address: "SP2X0TZ59D5SZ873GBDE...A7QFXKQM",
    type: "Hot Wallet",
    enabled: true,
  },
  {
    id: 2,
    label: "Cold Storage Reserve",
    asset: "sBTC",
    address: "SP3FBR2AGK5H9QBDH3EE...VN73236K",
    type: "Multi-sig",
    enabled: true,
  },
  {
    id: 3,
    label: "Yield Pool Address",
    asset: "sBTC",
    address: "SP1Y5YN8JQX5P5MDHD...2JRKF83QW",
    type: "DeFi Contract",
    enabled: true,
  },
  {
    id: 4,
    label: "Backup Stablecoin",
    asset: "USDCx",
    address: "SP2C2YFP12AJZB4MABJBK...HD2GBK1",
    type: "Hot Wallet",
    enabled: false,
  },
];

export function PayoutDestinations() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Payout Destinations
              </h3>
              <p className="text-sm text-gray-500">
                Saved addresses for treasury bucket payouts
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-9 px-4 text-sm border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-sm font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Destination
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enabled
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {destinations.map((destination) => (
              <tr key={destination.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {destination.label}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                      destination.asset === "sBTC"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {destination.asset}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-gray-600 font-mono">
                      {destination.address}
                    </code>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{destination.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Switch defaultChecked={destination.enabled} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}