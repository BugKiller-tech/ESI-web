// const PDFDocument = require('pdfkit');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
// const sizeOf = require('image-size');
const PDFDocument = require("pdfkit-table");
const puppeteer = require("puppeteer");

const WeekModel = require("../models/WeekModel");
const { DateTime } = require("luxon");

// Helper: download image from S3
async function fetchImageBuffer(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch {
    return null;
  }
}

async function fetchImageBase64(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const base64 = Buffer.from(response.data, "binary").toString("base64");
    const contentType = response.headers["content-type"];
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching image:", error.message);
    return null;
  }
}

async function createInvoicePDFWithPdfKit(order, outputPath) {
  if (!order) {
    return false;
  }

  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(fs.createWriteStream(outputPath));

  // Title
  doc.fontSize(25).text("ESI Invoice", { align: "center" }).moveDown();

  // Customer Info
  doc
    .fontSize(17)
    .text("Customer Information", { underline: true, lineGap: 20 });
  const info = [
    ["Full name", order.firstName + " " + order.lastName],
    ["Email", order.email],
    ["Phone number", order.phoneNumber],
    ["Shipping address", order.shippingAddress],
  ];
  let startX = doc.x;
  let labelWidth = 140; // Adjust this width to align values nicely

  info.forEach(([label, value], index) => {
    const y = doc.y;

    doc.fontSize(12).text(`${label}:`, startX, y);
    doc.fontSize(12).text(value, startX + labelWidth, y);
    doc.moveDown(0.7); // controls vertical spacing between rows
  });
  doc.moveDown();

  doc.x = startX;
  doc.fontSize(17).text("Cart", { underline: true, lineGap: 8 });

  // doc.moveDown();
  // Table setup
  const table = {
    headers: [
      {
        label: "Image",
        property: "image",
        width: 70,
        renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
          const { x, y, width, height } = rectCell;
          console.log(
            "rectCellrectCellrectCellrectCellrectCellrectCell",
            rectCell
          );
          const IMAGE_WIDTH = 40;
          const IMAGE_HEIGHT = 40;
          // Vertical centering
          const offsetY = y + (height - IMAGE_HEIGHT) / 2;
          if (value) {
            doc.image(value, x + 5, offsetY, {
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
            });
          }
        },
      },
      { label: "Week#", property: "weekNumber", width: 100 },
      { label: "Horse #", property: "horseNumber", width: 100 },
      { label: "Style", property: "category", width: 80 },
      { label: "Size", property: "size", width: 65 },
      { label: "Qty", property: "quantity", width: 40 },
      { label: "Price", property: "price", width: 50 },
    ],
    datas: [],
    options: {
      borderWidth: 0.5, // Width of the cell border
      divider: {
        horizontal: { width: 0.5, opacity: 1 },
        vertical: { width: 0.5, opacity: 1 },
      },
    },
  };

  let tempImages = [];
  for (const cartItem of order.cartItems) {
    const { horse, product } = cartItem;
    const imageBuffer = await fetchImageBuffer(horse.thumbnailS3Link);
    // console.log('imagebuffer downloaded is', imageBuffer);
    // const dimensions = sizeOf(imageBuffer);
    const imagePath = `temp_${Date.now()}.jpg`;
    fs.writeFileSync(imagePath, imageBuffer); // Save temporarily
    const imageFullPath = path.join(process.cwd(), imagePath); // Use absolute path
    tempImages.push(imageFullPath);

    week = await WeekModel.findById(horse.week);
    // Add row with image (insert after table)
    table.datas.push({
      image: imageFullPath,
      weekNumber: `${week?.weekNumber || ""} ( ${week?.state || ""} )`,
      horseNumber: `${horse.horseNumber}`,
      category: `${product.category}`,
      size: `${product.name}`,
      quantity: `${cartItem.quantity}`,
      price: `${product.price}`,
    });
  }

  // doc.addPage(); // Optional: move table to new page if needed

  function generateRandomColorHex() {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  }

  console.log(table);
  // Draw the table
  const testColors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

  const FIXED_ROW_HEIGHT = 100;
  await doc.table(table, {
    prepareHeader: () => doc.fontSize(12).font("Helvetica-Bold"),
    prepareRow: (row, i) => doc.fontSize(10).font("Helvetica"),
    // prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
    //     doc.font('Helvetica').fontSize(10);
    //     // simulate fixed row height by drawing a rectangle manually (optional)
    //     doc.rect(rectRow.x, rectRow.y, rectRow.width, FIXED_ROW_HEIGHT)
    //         .strokeColor(testColors[indexRow])
    //         .stroke();
    //     // Adjust text position manually if needed
    //     // doc.y = rectRow.y + 10; // adjust this based on font size to vertically center
    // },
    // minRowHeight: FIXED_ROW_HEIGHT,
  });

  doc.moveDown();

  // Payment Info
  doc.fontSize(17).text("Payment Amount", { underline: true, lineGap: 20 });
  const paymentInfo = [
    ["Sub Total", `$${order.subTotal}`],
    ["Tax", `$${order.taxAmount}`],
    ["Shipping", `$${order.shippingFee}`],
  ];
  startX = doc.x;
  labelWidth = 110; // Adjust this width to align values nicely

  paymentInfo.forEach(([label, value], index) => {
    const y = doc.y;

    doc.fontSize(12).text(`${label}:`, startX, y);
    doc.fontSize(12).text(value, startX + labelWidth, y);
    doc.moveDown(0.7); // controls vertical spacing between rows
  });
  const y = doc.y;
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(startX, y)
    .lineTo(200, y)
    .stroke();
  doc.moveDown();

  const total_paid_y_pos = doc.y;
  doc.fontSize(12).text("Total Order:", startX, total_paid_y_pos);
  doc
    .fontSize(12)
    .text(`$${order.paidTotal}`, startX + labelWidth, total_paid_y_pos);

  doc.moveDown();

  doc.end();

  // Clean up temp files
  tempImages.map((tempPath) => {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  });

  console.log("PDF generated:", outputPath);
  return true;
}

const createInvoicePdfWithPuppeteer = async (order, outputPath) => {
  if (!order) {
    return false;
  }

  let tableData = [];
  for (const cartItem of order.cartItems) {
    const { horse, product } = cartItem;

    week = await WeekModel.findById(horse.week);
    const imageBase64 = await fetchImageBase64(horse.thumbnailS3Link);
    // console.log('image base 64 is like like......');
    // console.log(imageBase64);
    // console.log('-----------------------');
    tableData.push({
      imageBase64: imageBase64,
      imageUrl: horse.thumbnailS3Link,
      weekNumber: `${week?.weekNumber || ""} ( ${week?.state || ""} )`,
      horseNumber: `${horse.horseNumber}`,
      photoName: horse.horseNumber + "_" + horse.originImageName,
      category: `${product.category}`,
      size: `${product.name}`,
      quantity: `${cartItem.quantity}`,
      price: `${product.price}`,
    });
  }

  const orderedAtStr = DateTime.fromJSDate(order.orderedAt, { zone: "utc" }) // parse in UTC
    .setZone("America/New_York") // convert to New York time
    .toFormat("M/d/yyyy h:mma"); // e.g. "6/28/2025 4:15PM"

  const html = `
    <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 60px 40px 0px 40px; }
            h1 { text-align: center; }
            h3 {
              margin-top: 30px;
              margin-bottom: 19px;
            }
            .section { margin-bottom: 30px; }
            .info-grid {
              display: inline-grid;
              grid-template-columns: fit-content(100%) fit-content(100%);
            }
            .info-grid > div {
              padding: 8px 8px 8px 0;
            }
            .info-grid >div.bt {
                border-top: 1px solid #000;
            }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 7px; text-align: center; }
            th { background-color: #f2f2f2; }
            img { height: 50px; object-fit: contain; }
          </style>
        </head>
        <body>
          <h1>ESI Photography</h1>
          <div class="section">
            <div style='display: flex; align-items: center;'>
              <h3 style='flex-grow: 1'>Customer Information</h3>
              <h5>
                ${orderedAtStr}
              </h5>
            </div>
            <div class="info-grid">
              <div>Full name:</div><div>${order.firstName}&nbsp;${
    order.lastName
  }</div>
              <div>Email:</div><div>${order.email}</div>
              <div>Phone number:</div><div>${order.phoneNumber}</div>
              <div>Shipping address:</div><div>${order.shippingAddress}</div>
            </div>
          </div>
    
          <div class="section">
            <h3>Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Week #</th>
                  <th>Horse #</th>
                  <th>Photo name</th>
                  <th>Style</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${tableData
                  .map(
                    (row) => `
                  <tr>
                    <td><img src="${row.imageBase64}" /></td>
                    <td>${row.weekNumber}</td>
                    <td>${row.horseNumber}</td>
                    <td>${row.photoName}</td>
                    <td>${row.category}</td>
                    <td>${row.size}</td>
                    <td>${row.quantity}</td>
                    <td>$${row.price}</td>
                  </tr>
                `
                  )
                  .join("\n")}
              </tbody>
            </table>
          </div>
          <div class="section">
            <h3>Payment Amount</h3>
            <div class="info-grid">
              <div>Sub Total:</div><div>$${order.subTotal.toFixed(2)}</div>
              <div>Tax:</div><div>$${order.taxAmount.toFixed(2)}</div>
              <div>Shipping:</div><div>$${order.shippingFee.toFixed(2)}</div>
              <div class="bt">Total Order:</div><div class="bt">${order.paidTotal.toFixed(
                2
              )}</div>
            </div>
          </div>
        </body>
        </html>
      `;

  fs.writeFileSync("debug.html", html);

  // Using async/await
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let retry = 3;
  while (retry--) {
    // 3 times retry at max to
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      // Wait for all images to load
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        console.log("images found length is like", images.length);
        await Promise.all(
          images.map((img) => {
            if (img.complete) return;
            return new Promise((resolve, reject) => {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve); // resolve anyway to avoid hanging
            });
          })
        );
      });

      // const htmlContent = await page.content();
      // console.log(htmlContent);

      await page.pdf({ path: outputPath, format: "A4" });

      await browser.close();
      console.log("PDF generated at", outputPath);
      return outputPath;
    } catch (error) {
      console.log(error);
      await wait(2000);
      console.log("Retrying to create invoice pdf");
    }
  }
};

// createInvoicePDF(customer, products, 'invoice.pdf');
module.exports = {
  createInvoicePDFWithPdfKit,
  createInvoicePdfWithPuppeteer,
};
