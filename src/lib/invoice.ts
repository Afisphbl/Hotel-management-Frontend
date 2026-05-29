export function escapeHtml(str: unknown) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function printInvoice(invoice: any) {
  try {
    const title = escapeHtml(invoice.invoiceNumber || invoice.id || 'Invoice');
    const guestName = escapeHtml(
      invoice?.booking?.guest?.fullName || invoice?.booking?.guest?.name || 'Guest',
    );
    const bookingId = escapeHtml(invoice.bookingId || '');
    const createdAt = escapeHtml(invoice.createdAt || '');
    const dueDate = escapeHtml(invoice.dueDate || '');
    const currency = escapeHtml(invoice.currency || 'ETB');

    const lineItems = (invoice.lineItems || []).map((it: any) => ({
      description: escapeHtml(it.description || ''),
      quantity: Number(it.quantity || 0),
      unitPrice: Number(it.unitPrice || 0),
      total: Number(it.total || 0),
      taxRate: typeof it.taxRate === 'number' ? it.taxRate : null,
    }));

    const subtotal = Number(invoice.subtotal || 0);
    const taxTotal = Number(invoice.taxTotal || 0);
    const amount = Number(invoice.amount || 0);

    const styles = `
      body{font-family: Arial, Helvetica, sans-serif;padding:24px;color:#0F1B2D}
      .invoice{max-width:800px;margin:0 auto}
      header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
      h1{font-size:20px;margin:0}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{padding:8px;border:1px solid #e5e7eb;text-align:left}
      .right{text-align:right}
      .totals{margin-top:12px;width:100%}
      .notes{margin-top:16px;padding:12px;background:#f8fafc;border:1px solid #e6edf3}
    `;

    const rows = lineItems
      .map(
        (it: any) =>
          `<tr><td>${it.description}</td><td class="right">${it.quantity}</td><td class="right">${new Intl.NumberFormat('en-ET',{style:'currency',currency}).format(it.unitPrice)}</td><td class="right">${new Intl.NumberFormat('en-ET',{style:'currency',currency}).format(it.total)}</td></tr>`,
      )
      .join('');

    const html = `<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="invoice">
          <header>
            <div>
              <h1>Invoice: ${title}</h1>
              <div>Booking: ${bookingId}</div>
              <div>Guest: ${guestName}</div>
            </div>
            <div style="text-align:right">
              <div>Created: ${createdAt}</div>
              <div>Due: ${dueDate}</div>
              <div style="font-weight:700;margin-top:8px">Amount: ${new Intl.NumberFormat('en-ET',{style:'currency',currency}).format(amount)}</div>
            </div>
          </header>

          <main>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="right">Qty</th>
                  <th class="right">Unit</th>
                  <th class="right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${rows || '<tr><td colspan="4">No line items</td></tr>'}
              </tbody>
            </table>

            <div class="totals">
              <table style="width:100%">
                <tbody>
                  <tr><td style="border:none"></td><td style="border:none;width:200px">
                    <table style="width:100%">
                      <tr><td>Subtotal</td><td class="right">${new Intl.NumberFormat('en-ET',{style:'currency',currency}).format(subtotal)}</td></tr>
                      <tr><td>Tax</td><td class="right">${new Intl.NumberFormat('en-ET',{style:'currency',currency}).format(taxTotal)}</td></tr>
                      <tr style="font-weight:700"><td>Total</td><td class="right">${new Intl.NumberFormat('en-ET',{style:'currency',currency}).format(amount)}</td></tr>
                    </table>
                  </td></tr>
                </tbody>
              </table>
            </div>

            ${invoice.notes ? `<div class="notes"><strong>Notes:</strong><div>${escapeHtml(invoice.notes)}</div></div>` : ''}

          </main>
        </div>
      </body>
      </html>`;

    const w = window.open('', '_blank');
    if (!w) {
      alert('Popup blocked. Please allow popups to print the invoice.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    // Give the browser a short moment to render before printing
    setTimeout(() => {
      w.print();
    }, 300);
  } catch (err) {
    // best-effort
    console.error('Failed to print invoice', err);
    alert('Failed to print invoice');
  }
}
