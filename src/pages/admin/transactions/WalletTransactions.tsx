import React from 'react';
import AdminTransactions from '../Transactions';

export default function WalletTransactions() {
  return <AdminTransactions title="Wallet Transactions" endpoint="/admin/wallet" />;
}

