import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Tier from "../Tier";

interface Customer {
  customerId: string;
  customerName: string;
  tierName: string;
  startDate: string;
  totalSpent: number;
  thisYearSpent: number;
  amountForNextTier: number;
  nextYearTier: string;
  endDate: string;
  amountForKeepTier: number;
}

const CustomerDetails: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);

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

  if (!customer) {
    return <div>読み込み中...</div>;
  }
  
  const progressbarwidth = (customer.thisYearSpent / 500) * 100

  // Render the component with the data
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

          <div className='meter'>
            <span style={{ width: `${progressbarwidth}%` }}></span>
          </div>

        </div>
      </div>
    </>
  );
};

export default CustomerDetails;