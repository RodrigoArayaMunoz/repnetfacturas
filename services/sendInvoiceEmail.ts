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
  const normalizedApiUrl = apiUrl.replace(/\/+$/, '');
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

  const response = await fetch(`${normalizedApiUrl}/api/send-invoice-email`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  });

  const responseText = await response.text();
  const contentType = response.headers.get('content-type') ?? '';
  let result: { message?: string } | null = null;

  if (responseText) {
    const looksLikeJson =
      contentType.includes('application/json') ||
      contentType.includes('application/problem+json') ||
      responseText.trim().startsWith('{') ||
      responseText.trim().startsWith('[');

    if (looksLikeJson) {
      try {
        result = JSON.parse(responseText) as { message?: string };
      } catch {
        throw new Error(
          'El servidor devolvio una respuesta invalida. Revisa que el backend responda JSON valido.'
        );
      }
    }
  }

  if (!response.ok) {
    if (result?.message) {
      throw new Error(result.message);
    }

    if (responseText.trim().startsWith('<')) {
      throw new Error(
        `El servidor respondio HTML en lugar de JSON (HTTP ${response.status}). Revisa la URL del backend y que la ruta /api/send-invoice-email exista y acepte POST.`
      );
    }

    throw new Error(
      responseText || `No se pudo enviar la factura. El servidor respondio con HTTP ${response.status}.`
    );
  }

  if (!result) {
    return { success: true };
  }

  return result;
}
