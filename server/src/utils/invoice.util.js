export const generateInvoiceNumber = async (OrderModel) => {
  const lastOrder = await OrderModel.findOne()
    .sort({ createdAt: -1 })
    .select("orderNumber");

  const year = new Date().getFullYear();

  if (!lastOrder) return `INV-${year}-0001`;

  const lastSeq = parseInt(lastOrder.orderNumber.split("-")[2]);
  const nextSeq = String(lastSeq + 1).padStart(4, "0");

  return `INV-${year}-${nextSeq}`;
};
