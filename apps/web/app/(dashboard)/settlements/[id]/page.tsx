export default async function SettlementDetailPage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
  
    return (
      <div className="min-h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{id}</h1>
          <p className="text-sm text-gray-600">
            Settlement detail placeholder for linked demo navigation.
          </p>
        </div>
  
        <div className="px-8 py-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-700">
              This is a placeholder settlement detail page. Next step is wiring real settlement data here.
            </div>
          </div>
        </div>
      </div>
    );
  }