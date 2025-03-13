import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import { Item_t } from '../types'

interface ScanType {
  barcode: string
  quantity: number
  name?: string
  unitMrp?: number
  unitPrice?: number
  price?: number
}
const Sales = () => {
  const [scannedValue, setScannedValue] = useState<ScanType[]>([
    {
      barcode: "",
      quantity: 0,
      name: "",
      unitMrp: 0,
      unitPrice: 0,
      price: 0
    }
  ]);
  const totalPrice = scannedValue.reduce((total, value) => total + value.price, 0);
  const [masterData, setMasterData] = useState<Item_t[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const url = "upi://pay?pa=Q083415724@ybl&pn=PhonePeMerchant&mc=0000&mode=02&purpose=00"

  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost:3000/masterdata'
      const response = await fetch(url)
      const data = await response.json();
      setMasterData(data.masterData);
    };
    fetchData();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // If Enter is pressed, process the scanned data
      const value = myRef.current.value
      // Clear the value for the next scan (optional)
      setScannedValue(prevState => {
        const existingItem = prevState.find(item => item.barcode === value)
        if (existingItem) {
          return prevState.map(item => (item.barcode === value ?
            {
              ...item, quantity: (item.quantity + 1),
              price: (item.unitPrice * (item.quantity + 1)),
              unitMrp: item.unitMrp
            } : item))
        }
        const item = masterData.find(item => item.barcode === value)
        if (!item) {
          window.alert(`Item not found: ${value}`)
          return prevState
        }
        return [...prevState, { barcode: value, quantity: 1, name: item.name, unitMrp:item.mrpPerQuantity, unitPrice: Math.ceil(item.sellingPerQuantity), price: Math.ceil(item.sellingPerQuantity) }]
      });
      myRef.current.value = ''
    }
  };

  const handleGenerateQRCode = () => {
    if (totalPrice > 0) {
      setShowQRCode(true)
    }
  }

  const clearSession = () => {
    setShowQRCode(false)
    setScannedValue([])
  }

  const myRef = React.useRef<any>(null)

  return (
    <div>
      <>
        <p>Purchased Items </p>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit MRP</th>
              <th>Unit Price</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {scannedValue.map((value, index) => {
              return (
                value.barcode &&
                <tr key={index + "" + value.id}>
                  <td >{value.barcode}</td>
                  <td >{value.name}</td>
                  <td >{value.quantity}</td>
                  <td >{value.unitMrp}</td>
                  <td >{value.unitPrice}</td>
                  <td >{value.price}</td>
                </tr>
              )
            })}
            <tr>
              <td colSpan={4}>Total</td>
              <td colSpan={2}>{totalPrice}</td>
            </tr>
          </tbody>
        </table>
      </>
      <br />
      <br />

      <label>Scan Code:</label>
      <input
        type="text"
        ref={myRef}
        onKeyDown={handleKeyDown}
        placeholder="Scan a barcode or QR code"
      />
      {(!showQRCode) && <button onClick={handleGenerateQRCode}>Generate Bill</button>}
      <br />
      <br />

      {(showQRCode && totalPrice > 0) && <QRCode value={`${url}&am=${totalPrice}`} />}
      <br />
      <br />
      {(showQRCode && totalPrice > 0) && <button onClick={clearSession}>Clear Session</button>}

    </div>
  );
};

export default Sales;
