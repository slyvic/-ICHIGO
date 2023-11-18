import React, { useState } from "react";
import axios from "axios";

interface OrdersSettingsProps {
  isNew: boolean;
  setClick: React.Dispatch<React.SetStateAction<number>>;
  click: number;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setCurrent: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrdersSettings: React.FC<OrdersSettingsProps> = (props) => {
  let [customerName, setCustomername] = useState<string>('');
  let [customerId, setCustomerid] = useState<string>('');
  let [orderId, setOrderid] = useState<string>('');
  let [totalInCents, setTotalincents] = useState<string>('');
  let [date, setDate] = useState<string>('');

  let head;
  if (props.isNew) {
    head = 'New Order';
  }

  const saveData = (e: React.FormEvent<HTMLFormElement>) => {
    if (customerId !== '' && customerName !== '' && orderId !== '' && totalInCents !== '' && date !== '') {
      e.preventDefault();
      if (props.isNew) {
        axios.post('http://localhost:8000/api/newOrder', {
          customerName: customerName.toString(),
          customerId: customerId,
          orderId: orderId,
          totalInCents: parseInt(totalInCents),
          date: date
        }).then((res) => {
          
          if (res.status === 200) {
            props.setClick(props.click + 1);
            props.setStatus('Table');
          } else {
            alert("Order Failed");
          }
        }).catch(er => alert(`The data was not sent. ${er}`));
      }
    } else {
      alert("Missing Input");
      e.preventDefault();
    }
  };

  return (
    <>
      <form className="mainForm">
        <div>
          <h1 className="headerTitle">{head}</h1>
          <div className="panel">
            <label>CustomerId</label>
            <input className="bigInput" type="number" onChange={event => setCustomerid(event.target.value)} />
            <label>Customername</label>
            <input className="bigInput" type="text" onChange={event => setCustomername(event.target.value)} />
            <label>OrderId</label>
            <input className="bigInput" type="text" onChange={event => setOrderid(event.target.value)} />
            <label>Amount</label>
            <input className="bigInput" type="number" onChange={event => setTotalincents(event.target.value)} />
            <label>OrderDate</label>
            <input className="bigInput" type="date" onChange={event => setDate(event.target.value)} />
          </div>
        </div>
        <div className="footer">
          <input type="button" className="cancelButton" value={"Cancel"} onClick={() => props.setStatus('Table')} />
          <input type="submit" className="saveButton" value={"Submit"} onClick={(e:any) => { saveData(e) }} />
        </div>
      </form>
    </>
  );
};

export default OrdersSettings;