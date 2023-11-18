import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Tier from "../Tier";

//Customer オブジェクトのインターフェースを定義する
interface Customer {
  customerId: string; // 顧客ID
  customerName: string; // 顧客名
  tierName: string; // ティア名
  startDate: string; // 開始日
  totalSpent: number; // 総支出額
  thisYearSpent: number; // 今年の支出額
  amountForNextTier: number; // 次のティアの金額
  nextYearTier: string; // 来年のティア
  endDate: string; // 終了日
  amountForKeepTier: number; // ティアを維持するための金額
}

const CustomerDetails: React.FC = () => {
  // URLパラメータからcustomerIdを取得します
  const { customerId } = useParams<{ customerId: string }>();

  // customerステート変数とそのセッター関数を定義します
  const [customer, setCustomer] = useState<Customer | null>(null);

  // APIエンドポイントから顧客データを取得します
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/customers/${customerId}`);
        setCustomer(response.data);
      } catch (error) {
        console.error('注文の取得中にエラーが発生しました:', error);
      }
    };

    fetchCustomer();
  }, [customerId]);

  // 顧客データがまだ読み込み中の場合、ローディングメッセージを表示します
  if (!customer) {
    return <div>読み込み中...</div>;
  }
  
  // プログレスバーの幅を計算します（thisYearSpentを500で割った比率）
  const progressbarwidth = (customer.thisYearSpent / 500) * 100;

  // 顧客データを使ってコンポーネントをレンダリングします
  return (
    <>
      <p className='headerTitle'>注文詳細</p>
      <div className='customerpanel'>
        <p>お客様 ID: {customer.customerId}</p>
        <p>顧客名: {customer.customerName}</p>
        <p>ティア名: <Tier tier={customer.tierName} /></p>
        <p>開始日: {customer.startDate}</p>
        <p>総支出額: $ {customer.totalSpent}</p>
        <p>今年過ごした年: $ {customer.thisYearSpent}</p>
        <p>次の階層の金額: $ {customer.amountForNextTier}</p>
        <p>来年のティア:{customer.nextYearTier === null ? <Tier tier={customer.tierName} /> : <Tier tier={customer.nextYearTier} />} </p>
        <p>終了日: {customer.endDate}</p>
        <p>キープ層の金額: ${customer.amountForKeepTier}</p>
        <div className='flex'>
          <div className={`meter`}>
            <span style={{ width: `${progressbarwidth}%` }}></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;