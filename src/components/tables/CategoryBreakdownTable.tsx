import React from 'react';
import { CategorySpendBreakdown } from '@models/insights';
import { formatCurrency, formatPercent } from '@shared/formatters';

interface CategoryBreakdownTableProps {
  rows: CategorySpendBreakdown[];
  currency: string;
}

const CategoryBreakdownTable: React.FC<CategoryBreakdownTableProps> = ({ rows, currency }) => {
  if (!rows.length) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-500" aria-label="No category breakdown table">
        No category breakdown data available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm" aria-label="Category breakdown table">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Category
            </th>
            <th scope="col" className="px-3 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Amount
            </th>
            <th scope="col" className="px-3 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
              % of total
            </th>
            <th scope="col" className="px-3 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Transactions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.categoryId} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-900">{row.categoryName}</td>
              <td className="px-3 py-2 text-right text-gray-900">{formatCurrency(row.amount, currency)}</td>
              <td className="px-3 py-2 text-right text-gray-900">{formatPercent(row.percentage)}</td>
              <td className="px-3 py-2 text-right text-gray-900">{row.transactionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryBreakdownTable;
