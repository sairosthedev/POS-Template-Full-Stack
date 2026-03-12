/**
 * Receipt Generation Utility
 */
exports.formatReceiptText = (sale, companySettings) => {
  let receipt = `--------------------------------\n`;
  receipt += `        ${companySettings.companyName || 'MICCS POS'}        \n`;
  receipt += `        ${companySettings.address || ''}        \n`;
  receipt += `--------------------------------\n`;
  receipt += `Date: ${new Date(sale.createdAt).toLocaleString()}\n`;
  receipt += `Cashier: ${sale.cashierName || 'Staff'}\n`;
  receipt += `Receipt #: ${sale._id.toString().slice(-6)}\n`;
  receipt += `--------------------------------\n`;

  sale.items.forEach(item => {
    receipt += `${item.name}\n`;
    receipt += `${item.quantity} x $${item.price.toFixed(2)}    $${(item.quantity * item.price).toFixed(2)}\n`;
  });

  receipt += `--------------------------------\n`;
  receipt += `TOTAL: $${sale.total.toFixed(2)}\n`;
  receipt += `Payment: ${sale.paymentMethod}\n`;
  receipt += `--------------------------------\n\n`;
  receipt += `     THANK YOU FOR SHOPPING     \n\n\n`;

  return receipt;
};
