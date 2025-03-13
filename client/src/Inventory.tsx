import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import { Item_t } from '../types'

interface InventoryItem_t {
  barcode: string
  hsnCode: string
  quantity: number
  name?: string
  unitPrice?: number
  price?: number
}
const Inventory = () => {
  const [scannedValue, setScannedValue] = useState<InventoryItem_t[]>([
    {
      barcode: "",
      quantity: 0,
      hsnCode: "",
      name: "",
      unitPrice: 0,
      price: 0
    }
  ]);
  const TotalPrice = scannedValue.reduce((total, value) => total + value.price, 0);
  const [masterData, setMasterData] = useState<Item_t[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const url = "upi://pay?pa=Q083415724@ybl&pn=PhonePeMerchant&mc=0000&mode=02&purpose=00"

  useEffect(() => {
    const fetchData = async () => {
      const fetchData = async () => {
        const url = 'http://localhost:3000/masterdata'
        const response = await fetch(url)
        const data = await response.json();
        setMasterData(data.masterData);
      };
      fetchData();
    };
    fetchData();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // If Enter is pressed, process the scanned data
      const value = myRef.current.value
      setShowQRCode(true)
      // Clear the value for the next scan (optional)
      setScannedValue(prevState => {
        const existingItem = prevState.find(item => item.id === value)
        if (existingItem) {
          return prevState.map(item => (item.barcode === value ?
            {
              ...item, quantity: (item.quantity + 1),
              price: (item.unitPrice * (item.quantity + 1))
            } : item))
        }
        const item = masterData.find(item => item.barcode === value)
        if (!item) {
          throw new Error(`Item not found: ${value}`)
        }
        return [...prevState, { barcode: value, quantity: 1, name: item.name, unitPrice: item.mrpPerQuantity, price: item.mrpPerQuantity }]
      });
      myRef.current.value = ''
    }
  };

  const handleGenerateQRCode = () => {
    setShowQRCode(true)
  }

  const clearSession = () => {
    setShowQRCode(false)
    setScannedValue([])
  }

  const myRef = React.useRef<any>(null)

  return (
    <div>
      <>
        <p>Added Items </p>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {scannedValue.map((value, index) => {
              return (
                value.barcode &&
                <tr key={index + "" + value.barcode}>
                  <td >{value.barcode}</td>
                  <td >{value.name}</td>
                  <td >{value.quantity}</td>
                  <td >{value.unitPrice}</td>
                  <td >{value.price}</td>
                </tr>
              )
            })}
            <tr>
              <td colSpan={4}>Total</td>
              <td colSpan={2}>{TotalPrice}</td>
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
      <br />
      <br />

      {(showQRCode && TotalPrice > 0) && <QRCode value={`${url}&am=${TotalPrice}`} />}
      <br />
      <br />
      <button onClick={clearSession}>Clear Session</button>
    </div>
  );
};

export default Inventory;
