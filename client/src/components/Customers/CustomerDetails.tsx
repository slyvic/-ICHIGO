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
        console.error('Error fetching customer:', error);
      }
    };

    fetchCustomer();
  }, [customerId]);

  if (!customer) {
    return <div>Loading...</div>;
  }
  console.log(customer.nextYearTier)
  const progressbarwidth = (customer.thisYearSpent / 500) * 100

  // Render the component with the data
  return (
    <>
      <p className='headerTitle'>Order Details</p>
      <div className='customerpanel'>
        <p>Customer ID: {customer.customerId}</p>
        <p>Customer Name: {customer.customerName}</p>
        <p>Tier Name: <Tier tier={customer.tierName} /></p>
        <p>Start Date: {customer.startDate}</p>
        <p>Total Spent: $ {customer.totalSpent}</p>
        <p>This Year Spent: $ {customer.thisYearSpent}</p>
        <p>Amount for Next Tier: $ {customer.amountForNextTier}</p>
        <p>Next Year Tier:{customer.nextYearTier === null ? <Tier tier={customer.tierName} /> : <Tier tier={customer.nextYearTier} />} </p>
        <p>End Date: {customer.endDate}</p>
        <p>Amount for Keep Tier: ${customer.amountForKeepTier}</p>
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