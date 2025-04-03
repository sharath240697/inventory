const SystemReceiptPrinter = require('@point-of-sale/system-receipt-printer');
const express = require("express");
const cors = require("cors");
const app = express();

const ReceiptPrinterEncoder = require('@point-of-sale/receipt-printer-encoder');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const printer = new SystemReceiptPrinter({
  name: 'Caysn_CK811_UWB',
  type: 'epson',
  port: 'COM1',
  baudRate: 9600,
  paperWidth: 80 // 80mm paper width
});

// Add event listener for printer connection
printer.addEventListener('connected', device => {
  console.log(`Connected to printer: ${device.name}`);
});

// Add error listener
printer.addEventListener('error', error => {
  console.error('Printer error:', error);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/masterdata", (req, res) => {
  res.sendFile(__dirname + "/masterdata.json");
});

app.post("/print-barcode", async (req, res) => {
  try {
    const { data, height = 25, width = 1, textPosition = 'below' } = req.body;

    // Initialize the receipt printer
    const encoder = new ReceiptPrinterEncoder({
      columns: 32,
      feedBeforeCut: 1
    });

    // Print barcode
    const receipt = encoder
      .initialize()
      .newline()
      .align('center')
      .barcode(data, 'code93', {
        height: height,
        width: width,
        text: true
      })
      .barcode(data, 'code93', {
        height: height,
        width: width,
        text: true
      })
      .barcode(data, 'code93', {
        height: height,
        width: width,
        text: true
      })
      .barcode(data, 'code93', {
        height: height,
        width: width,
        text: true
      })
      .newline()
      .newline()
      .cut();

    const result = receipt.encode();
    await printer.connect();
    console.log('Printer connected successfully');

    // Print the receipt
    const printResult = await printer.print(result);
    console.log('Print result:', printResult);

    // Disconnect after printing
    await printer.disconnect();

    res.json({
      success: true,
      message: 'Barcode generated successfully',
      data: result.toString('base64')
    });

  } catch (error) {
    console.error('Error generating barcode:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating barcode',
      error: error.message
    });
  }
});

app.post("/print-bill", async (req, res) => {
  try {
    const { items, customerName, customerMobile, orderNumber } = req.body;

    const total = items.reduce((total, item) => total + item.quantity * item.price, 0);
    // Initialize the receipt printer
    const encoder = new ReceiptPrinterEncoder({
      columns: 48
    });

    // Start building the receipt
    encoder.initialize()
      .newline()
      .align('center')
      .line('Spandana Neighbours Store', { size: { width: 2, height: 2 } })
      .line('#92 Spandanalayam Suvarna Nagar')
      .line('Tel: +91 8095922403 Bangalore 560073')
      .align('left')
      .newline()
      .line(`Date: ${new Date().toLocaleString()}`)
      .table([
        { width: 25, marginRight: 2, align: 'left' },
        { width: 20, marginRight: 0, align: 'right' }
      ], [[
        `Customer: ${customerName}`,
        `Mobile: ${customerMobile}`
      ]])
      .line(`Order #: ${orderNumber}`)
      .line('------------------------------------------------')

    itemsTable = [['Item', 'Q', 'MRP', 'UPrice', 'Price']]
    items.forEach(item => {
      itemsTable.push([item.name.length > 15 ? `${item.name.slice(0, 15)}...` : item.name,
      `${item.quantity}x`, `${item.mrp}`, `${item.price}`, `${item.quantity * item.price}`])
    })
    encoder.table([
      { width: 18, marginRight: 2, align: 'left', size: { width: 1, height: 1 } },
      { width: 3, marginRight: 2, align: 'right', size: { width: 1, height: 1 } },
      { width: 5, marginRight: 2, align: 'right', size: { width: 1, height: 1 } },
      { width: 6, marginRight: 2, align: 'right', size: { width: 1, height: 1 } },
      { width: 6, marginRight: 2, align: 'right', size: { width: 1, height: 1 } }
    ], itemsTable, { rowHeight: 1 });

    encoder
      .line('------------------------------------------------')
      .align('left')
      .text(`Total: `)
      .align('right')
      .text(`${total.toFixed(2)}`, { size: { width: 1, height: 2 } })
      .newline()
      .align('center')
      // .text('Scan QR code to pay via UPI')
      // .newline()
      // Add QR code for UPI payment
      // .qrcode(`upi://pay?pa=Q083415724@ybl&pn=PhonePeMerchant&mc=0000&mode=02&purpose=00&tn=${orderNumber}&am=${total}`, {
      //   model: 2,
      //   size: 8,
      //   errorLevel: 'L'
      // })
      .newline()
      .text('Thank you for your purchase!', { size: { width: 2, height: 2 } })
      .text('\n\n\n\n\n')
      .cut();

    const result = encoder.encode();

    try {
      // Try to connect to the printer
      await printer.connect();
      console.log('Printer connected successfully');

      // Print the receipt
      const printResult = await printer.print(result);
      console.log('Print result:', printResult);

      // Disconnect after printing
      await printer.disconnect();

      res.json({
        success: true,
        message: 'Receipt printed successfully',
        data: result.toString('base64'),
        printResult: printResult
      });
    } catch (printError) {
      console.error('Error printing receipt:', printError);

      // Return the encoded data even if printing fails
      res.json({
        success: false,
        message: 'Failed to print receipt',
        error: printError.message,
        data: result.toString('base64')
      });
    }

  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating receipt',
      error: error.message
    });
  }
});

app.get("/printers", (req, res) => {
  try {
    // Get available printers
    const printers = SystemReceiptPrinter.getPrinters();

    // Try to connect to the printer
    printer.connect().then(() => {
      console.log('Printer connected successfully');
      res.json({
        success: true,
        printers: printers,
        status: 'connected'
      });
    }).catch(error => {
      console.error('Error connecting to printer:', error);
      res.json({
        success: false,
        printers: printers,
        status: 'disconnected',
        error: error.message
      });
    });
  } catch (error) {
    console.error('Error getting printers:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
