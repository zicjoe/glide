interface CheckoutPageProps {
    params: Promise<{
      invoiceId: string;
    }>;
  }
  
  export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { invoiceId } = await params;
  
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
        <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
            Glide Checkout
          </p>
  
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
            Invoice {invoiceId}
          </h1>
  
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Checkout UI will be expanded into quote preview, payment confirmation,
            and settlement status in a later commit.
          </p>
  
          <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Merchant</dt>
                <dd className="font-medium text-zinc-950">Glide Demo Merchant</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Settlement asset</dt>
                <dd className="font-medium text-zinc-950">USDCx</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Amount due</dt>
                <dd className="font-medium text-zinc-950">$100.00</dd>
              </div>
            </dl>
          </div>
  
          <button
            type="button"
            className="mt-8 w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Pay invoice
          </button>
        </div>
      </main>
    );
  }