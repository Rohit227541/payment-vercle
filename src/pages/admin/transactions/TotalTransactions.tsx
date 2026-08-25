import React from 'react';
import AdminTransactions from '../Transactions';

export default function TotalTransactions() {
  return <AdminTransactions title="Total Transactions" endpoint="/admin/transactions" />;
}

