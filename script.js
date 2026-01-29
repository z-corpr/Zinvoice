function generatePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });

  const brand = document.getElementById("brand").value;
  const productsText = document.getElementById("products").value;
  const date = document.getElementById("date").value;
  const logoInput = document.getElementById("logoInput");

  const seller = document.getElementById("seller").value;
  const sellerAddress = document.getElementById("sellerAddress").value;
  const customer = document.getElementById("customer").value;
  const payment = document.getElementById("payment").value;

  if (!logoInput || !logoInput.files[0]) {
    alert("Seleziona un logo prima di generare la ricevuta");
    return;
  }

  // Numero ricevuta progressivo
  let receiptNumber = localStorage.getItem("receiptNumber");
  receiptNumber = receiptNumber ? parseInt(receiptNumber) + 1 : 1;
  localStorage.setItem("receiptNumber", receiptNumber);
  const receiptCode = "RCP-" + receiptNumber.toString().padStart(6, "0");

  const file = logoInput.files[0];
  const imgType = file.type.includes("png") ? "PNG" : "JPEG";
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function () {

    // ===== LOGO =====
    const logoWidth = 35;
    const logoHeight = 18;
    const centerX = (210 - logoWidth) / 2;
    pdf.addImage(reader.result, imgType, centerX, 12, logoWidth, logoHeight);

    // ===== BRAND =====
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(brand.toUpperCase(), 105, 38, { align: "center" });

    // ===== SELLER / CUSTOMER =====
    const leftX = 20;
    const rightX = 120;
    let infoY = 48;

    pdf.setFontSize(9);

    // SELLER
    pdf.setTextColor(120);
    pdf.setFont("Helvetica", "bold");
    pdf.text("SELLER", leftX, infoY);
    pdf.setTextColor(0);

    pdf.setFont("Helvetica", "normal");
    const sellerText = pdf.splitTextToSize(
      seller + "\n" + sellerAddress,
      80
    );
    pdf.text(sellerText, leftX, infoY + 5);

    // CUSTOMER
    pdf.setTextColor(120);
    pdf.setFont("Helvetica", "bold");
    pdf.text("CUSTOMER", rightX, infoY);
    pdf.setTextColor(0);

    pdf.setFont("Helvetica", "normal");
    pdf.text(customer, rightX, infoY + 5);

    // ===== HEADER INFO =====
    let headerY = infoY + 22;
    pdf.text("Receipt", 20, headerY);
    pdf.text("Receipt No: " + receiptCode, 20, headerY + 5);
    pdf.text("Date: " + date, 20, headerY + 10);

    pdf.setLineWidth(0.3);
    pdf.line(20, headerY + 14, 190, headerY + 14);
    pdf.setLineWidth(1);

    // ===== COLONNE =====
    let y = headerY + 22;
    pdf.text("ITEM", 20, y);
    pdf.text("PRICE", 170, y, { align: "right" });
    pdf.line(20, y + 2, 190, y + 2);

    y += 10;
    let subtotal = 0;

    const lines = productsText.split("\n");
    lines.forEach(line => {
      const parts = line.split("-");
      if (parts.length === 2) {
        const name = parts[0].trim();
        const price = parseFloat(parts[1].trim());
        if (!isNaN(price)) {
          subtotal += price;
          pdf.text(name, 20, y);
          pdf.text("€" + price.toFixed(2), 170, y, { align: "right" });
          y += 7;
        }
      }
    });

    pdf.line(20, y - 3, 190, y - 3);

    // ===== TOTALI =====
    const vat = subtotal * 0.22;
    const total = subtotal + vat;

    y += 6;
    pdf.text("Subtotal", 120, y);
    pdf.text("€" + subtotal.toFixed(2), 170, y, { align: "right" });

    y += 6;
    pdf.text("VAT (22%)", 120, y);
    pdf.text("€" + vat.toFixed(2), 170, y, { align: "right" });

    y += 8;
    pdf.setFontSize(11);
    pdf.setFont("Helvetica", "bold");
    pdf.text("TOTAL", 120, y);
    pdf.setFontSize(9);
    pdf.text("€" + total.toFixed(2), 170, y, { align: "right" });

    // ===== PAGAMENTO =====
    y += 12;
    pdf.setFont("Helvetica", "normal");
    pdf.text("Payment Method: " + payment, 20, y);

    // ===== FOOTER =====
    y += 10;
    pdf.setTextColor(150);
    pdf.setFontSize(8);
    pdf.text("Thank you for your purchase.", 105, y, { align: "center" });
    pdf.text("This document is generated electronically.", 105, y + 4, { align: "center" });
    pdf.setTextColor(0);

    pdf.save("receipt_" + receiptCode + ".pdf");
  };
}

