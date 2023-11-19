import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom'
import Tier from "../Tier";

//Customer オブジェクトのインターフェースを定義する
interface Customer {
  _id: string;
  customerId: string; // 顧客ID
  customername: string; // 顧客名
  reward: string; // 褒美
  totalamount: number; // 総支出額
  lastdate: string; // 最終日
  [key: string]: string | number;
}

const Customers: React.FC = (props) => {
  const history = useHistory();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [arrow, setArrow] = useState<boolean>(true);

  // 注文データを取得する関数を定義します
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/customers');
      setCustomers(response.data);

    } catch (error) {
      console.error('注文の取得中にエラーが発生しました:', error);
    }
  }, []);

  // コンポーネントの初回レンダリング時に注文データを取得します
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // テーブルの行がクリックされたときの処理を定義します
  const handleRowClick = (el: any) => {
    history.push(`/customers/${el.customerId}`);
  };

  // データをソートする関数を定義します
  const sortData = (property: string) => {
    const sortedData = [...customers].sort((a, b) => {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });
  
    if (arrow) {
      setCustomers(sortedData);
    } else {
      setCustomers(sortedData.reverse());
    }
    setArrow(!arrow);
  };

  // コンポーネントのレンダリング
  return <>
    <h1 className="headerTitle">顧客テーブル</h1>
    <table id="customers">
      <thead>
        <tr>
          <th onClick={() => sortData('customerId')}>顧客 Id</th>
          <th onClick={() => sortData('customerName')}>顧客名</th>
          <th onClick={() => sortData('totalSpent')}>褒美</th>
          <th onClick={() => sortData('totalSpent')}>総支出額</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((el, index) => <tr key={index} onClick={() => handleRowClick(el)}>
          <td>{el.customerId}</td>
          <td>{el.customerName}</td>
          <td><Tier tier={el.tierName} /></td>
          <td>${el.totalSpent}</td>
        </tr>)}
      </tbody>
    </table>
  </>
}

export default Customers;