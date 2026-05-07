type SendInvoiceEmailParams = {
  imageUri: string;
  provider: string;
  invoiceNumber: string;
  comment?: string;
  apiUrl: string;
  toEmail?: string;
};

export async function sendInvoiceEmail({
  imageUri,
  provider,
  invoiceNumber,
  comment,
  apiUrl,
  toEmail,
}: SendInvoiceEmailParams) {
  const formData = new FormData();

  formData.append('provider', provider.trim());
  formData.append('invoiceNumber', invoiceNumber.trim());
  formData.append('comment', comment?.trim() || '');

  if (toEmail) {
    formData.append('toEmail', toEmail);
  }

  formData.append('invoiceImage', {
    uri: imageUri,
    name: `factura-${invoiceNumber}.jpg`,
    type: 'image/jpeg',
  } as any);

  const response = await fetch(`${apiUrl}/api/send-invoice-email`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'No se pudo enviar la factura.');
  }

  return result;
}