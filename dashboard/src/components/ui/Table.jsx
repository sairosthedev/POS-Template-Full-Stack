import React from 'react';

export const Table = ({ children }) => (
  <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
    <table className="w-full text-left border-collapse">
      {children}
    </table>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-[#f8fafc] text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
    {children}
  </thead>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
    {children}
  </tbody>
);

export const TableRow = ({ children }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    {children}
  </tr>
);

export const TableHeader = ({ children, className = '' }) => (
  <th className={`px-6 py-4 ${className}`}>{children}</th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);
