import React, { useState } from "react";
import axios from "axios";

// OrdersSettings オブジェクトのインターフェースを定義する
interface OrdersSettingsProps {
  isNew: boolean; // 新規注文かどうかを示すフラグ
  setClick: React.Dispatch<React.SetStateAction<number>>; // clickステート変数のセッター関数
  click: number; // clickステート変数
  setStatus: React.Dispatch<React.SetStateAction<string>>; // statusステート変数のセッター関数
  setCurrent: React.Dispatch<React.SetStateAction<boolean>>; // currentステート変数のセッター関数
}

const OrdersSettings: React.FC<OrdersSettingsProps> = (props) => {
  let [customerName, setCustomername] = useState<string>('');
  let [customerId, setCustomerid] = useState<string>('');
  let [orderId, setOrderid] = useState<string>('');
  let [totalInCents, setTotalincents] = useState<string>('');
  let [date, setDate] = useState<string>('');

  let head;
  if (props.isNew) {
    head = '新規注文';
  }

  // データを保存する関数を定義します
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
            alert("注文に失敗しました");
          }
        }).catch(er => alert(`データは送信されませんでした。 ${er}`));
      }
    } else {
      alert("入力がありません");
      e.preventDefault();
    }
  };

  // コンポーネントのレンダリング
  return (
    <>
      <form className="mainForm">
        <div>
          <h1 className="headerTitle">{head}</h1>
          <div className="panel">
            <label>顧客 Id</label>
            <input className="bigInput" type="number" onChange={event => setCustomerid(event.target.value)} />
            <label>顧客名</label>
            <input className="bigInput" type="text" onChange={event => setCustomername(event.target.value)} />
            <label>注文 ID</label>
            <input className="bigInput" type="text" onChange={event => setOrderid(event.target.value)} />
            <label>額</label>
            <input className="bigInput" type="number" onChange={event => setTotalincents(event.target.value)} />
            <label>注文日</label>
            <input className="bigInput" type="date" onChange={event => setDate(event.target.value)} />
          </div>
        </div>
        <div className="footer">
          <input type="button" className="cancelButton" value={"キャンセル"} onClick={() => props.setStatus('Table')} />
          <input type="submit" className="saveButton" value={"提出する"} onClick={(e:any) => { saveData(e) }} />
        </div>
      </form>
    </>
  );
};

export default OrdersSettings;