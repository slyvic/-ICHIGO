import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Plus from '../../img/Plus.svg';
import OrdersSettings from "./OrdersSettings";

interface Order {
    customerId: string;
    orderId: string;
    customerName: string;
    totalInCents: number;
    date: string;
    [key: string]: string | number;
}

const Orders: React.FC = (props) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [status, setStatus] = useState<string>('Table');
    const [current, setCurrent] = useState<boolean>(false);
    const [click, setClick] = useState<number>(0);
    const [customerId, setCustomerId] = useState<string>('');
    const [arrow, setArrow] = useState<boolean>(true);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/orders', {
                customerId: customerId,
            });
            setOrders(response.data);

            // Calculate total pages based on the response data
        } catch (error) {
            console.error('注文の取得中にエラーが発生しました:', error);
        }
    }, [customerId]);

    useEffect(() => {
        fetchOrders();
    }, [current, customerId, fetchOrders, click]);


    const sortData = (property: string) => {
        const sortedData = [...orders].sort((a, b) => {
            if (a[property] < b[property]) {
                return -1;
            }
            if (a[property] > b[property]) {
                return 1;
            }
            return 0;
        });

        if (arrow) {
            setOrders(sortedData);
        } else {
            setOrders(sortedData.reverse());
        }
        setArrow(!arrow);
    };

    const addNewOrder = () => {
        setStatus('Add');
    };

    switch (status) {
        case 'Table': {
            return (
                <>
                    {/* Search bar and new order button */}
                    <div className="bar">
                        <input
                            type="number"
                            id="customerId"
                            className="searchbar"
                            placeholder="顧客IDで検索"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                        />

                        <button className="addOrderButton" onClick={addNewOrder}>
                            新規注文
                            <div className="imgPlus">
                                <img src={Plus} alt="plus" />
                            </div>
                        </button>
                    </div>

                    {/* Page size selection */}

                    {/* Orders table */}
                    <table id="customers">
                        <thead>
                            <tr>
                                <th onClick={() => sortData('orderId')}>
                                    番号
                                </th>
                                <th onClick={() => sortData('customerId')}>
                                    顧客 ID
                                </th>
                                <th onClick={() => sortData('customerName')}>
                                    顧客名
                                </th>
                                <th onClick={() => sortData('totalInCents')}>額</th>
                                <th onClick={() => sortData('date')}>注文日</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders.map((el, index) =>
                                    <tr key={index}>
                                        <td>{el.orderId}</td>
                                        <td>{el.customerId}</td>
                                        <td>{el.customerName}</td>
                                        <td>${el.totalInCents}</td>
                                        <td>{el.date}</td>
                                    </tr>
                                )}
                        </tbody>
                    </table>

                    {/* Pagination */}

                </>
            );
        }
        case 'Add': {
            return (
                <OrdersSettings
                    isNew={true}
                    setClick={setClick}
                    click={click}
                    setCurrent={setCurrent}
                    setStatus={setStatus}
                />
            );
        }
        default: {
            return <h1>エラー</h1>;
        }
    }
};

export default Orders;
