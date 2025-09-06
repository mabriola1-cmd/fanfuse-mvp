// File: app/creators/[id]/wallet/page.jsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CreatorWalletPage({ params }) {
  const { id } = params;
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`/api/wallet/balance?userId=${id}`);
        const data = await res.json();
        setBalance(data.balance);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Creator Wallet</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p className="mb-2">Your current wallet balance:</p>
          <div className="text-3xl font-semibold text-green-600">
            {balance !== null ? `${balance} Atoms` : 'Unavailable'}
          </div>
          <div className="mt-4">
            <Button>Withdraw Funds</Button>
          </div>
        </div>
      )}
    </div>
  );
}
