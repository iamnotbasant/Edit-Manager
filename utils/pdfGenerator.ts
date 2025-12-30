import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Invoice } from '../types';
import { DEFAULT_INVOICE_SETTINGS } from '../constants';

/**
 * Generates an invoice PDF.
 * 
 * @param invoiceData The data object of the invoice.
 * @param elementId (Optional) If provided, captures the DOM element visually. 
 *                  If omitted, generates a PDF programmatically using data.
 */
export const generateInvoicePDF = async (invoiceData: Invoice, elementId?: string) => {
    try {
      // METHOD 1: Visual Capture (High Fidelity - "Looks like the HTML")
      // Use this when the invoice is currently visible on screen (e.g., Detail Modal)
      if (elementId) {
          const element = document.getElementById(elementId);
          if (element) {
              const canvas = await html2canvas(element, {
                  scale: 2, // Higher scale for better resolution
                  useCORS: true, // Allow loading cross-origin images (like avatars)
                  logging: false,
                  backgroundColor: '#ffffff'
              });

              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF('p', 'mm', 'a4');
              
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = pdf.internal.pageSize.getHeight();
              
              const imgWidth = canvas.width;
              const imgHeight = canvas.height;
              
              // Calculate ratio to fit A4 width
              const ratio = pdfWidth / imgWidth;
              const finalHeight = imgHeight * ratio;

              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
              pdf.save(`${invoiceData.id}.pdf`);
              return;
          }
      }

      // METHOD 2: Programmatic Generation (Fallback)
      // Use this when the invoice is NOT visible (e.g., Quick Create Modal)
      const doc = new jsPDF();
      
      // Use stored agency details or fall back to default for old invoices
      const agency = invoiceData.agencyDetails || DEFAULT_INVOICE_SETTINGS;
      const currencyCode = invoiceData.currency || 'INR';
      const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';

      // Helper to format money based on invoice currency
      const formatMoney = (amount: number) => {
          return new Intl.NumberFormat(locale, {
              style: 'currency',
              currency: currencyCode,
              maximumFractionDigits: 2
          }).format(amount);
      };

      // Color Constants
      const primaryColor = [79, 70, 229]; // #4F46E5

      // --- Header ---
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("INVOICE", 14, 25);

      // Company Info (Left)
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "bold");
      doc.text(agency.companyName, 14, 35);
      doc.setFont("helvetica", "normal");
      
      const addressLines = agency.address.split('\n');
      let yPos = 40;
      addressLines.forEach(line => {
          doc.text(line, 14, yPos);
          yPos += 5;
      });
      doc.text(agency.email, 14, yPos);
      doc.text(agency.phone, 14, yPos + 5);

      // Invoice Meta (Right)
      const rightAlignX = 140;
      doc.setFont("helvetica", "bold");
      doc.text("Invoice ID:", rightAlignX, 35);
      doc.setFont("helvetica", "normal");
      doc.text(invoiceData.id, rightAlignX + 30, 35);

      doc.setFont("helvetica", "bold");
      doc.text("Date:", rightAlignX, 40);
      doc.setFont("helvetica", "normal");
      doc.text(invoiceData.date, rightAlignX + 30, 40);
      
      if (invoiceData.dueDate) {
          doc.setFont("helvetica", "bold");
          doc.text("Due Date:", rightAlignX, 45);
          doc.setFont("helvetica", "normal");
          doc.text(invoiceData.dueDate, rightAlignX + 30, 45);
      }

      // --- Bill To ---
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 60, 196, 60); // Horizontal line

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Bill To:", 14, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(invoiceData.clientName, 14, 78);
      if (invoiceData.clientAddress) {
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(invoiceData.clientAddress, 14, 84);
      }

      // --- Table ---
      const tableColumn = ["Item & Description", "Qty", "Rate", "Amount"];
      const tableRows = invoiceData.items.map(item => [
          `${item.description}\n${item.details || ''}`,
          item.qty,
          formatMoney(item.rate),
          formatMoney(item.qty * item.rate)
      ]);

      autoTable(doc, {
          startY: 95,
          head: [tableColumn],
          body: tableRows,
          theme: 'grid',
          headStyles: { 
              fillColor: [79, 70, 229],
              textColor: 255,
              fontSize: 10,
              fontStyle: 'bold'
          },
          styles: { 
              fontSize: 10, 
              cellPadding: 4,
              valign: 'middle'
          },
          columnStyles: {
              0: { cellWidth: 90 }, // Description column wider
              3: { halign: 'right' } // Amount aligned right
          }
      });

      // --- Totals ---
      const finalY = (doc as any).lastAutoTable?.finalY || 150;
      const totalsY = finalY + 10;
      const totalsX = 140;
      const valuesX = 196; // Right align anchor

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      // Subtotal
      doc.text("Subtotal:", totalsX, totalsY);
      doc.text(formatMoney(invoiceData.subtotal), valuesX, totalsY, { align: 'right' });
      
      // Discount
      if (invoiceData.discount > 0) {
          doc.text("Discount:", totalsX, totalsY + 6);
          doc.text(`- ${formatMoney(invoiceData.discount)}`, valuesX, totalsY + 6, { align: 'right' });
      }

      // Tax
      doc.text(`Tax (${invoiceData.taxRate}%):`, totalsX, totalsY + 12);
      doc.text(formatMoney(invoiceData.taxAmount), valuesX, totalsY + 12, { align: 'right' });
      
      // Total
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text("Total:", totalsX, totalsY + 22);
      doc.text(invoiceData.amount, valuesX, totalsY + 22, { align: 'right' });

      // --- Notes ---
      if (invoiceData.notes) {
          doc.setTextColor(0,0,0);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("Notes / Terms:", 14, totalsY + 35);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text(invoiceData.notes, 14, totalsY + 42, { maxWidth: 100 });
      }
      
      // --- Footer ---
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(agency.footerMessage, 105, pageHeight - 10, { align: 'center' });

      doc.save(`${invoiceData.id}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
};