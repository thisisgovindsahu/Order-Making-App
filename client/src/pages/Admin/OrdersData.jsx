import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";

const OrdersData = () => {
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/product/get-orders"
      );
      if (data?.success) {
        setOrders(data?.orders);
        // setHistory(data?.orders);
        // console.log(data?.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrders = async (oid, order) => {
    setHistory([order]);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/product/orders-history",
        { history: [order], orderId: oid } // Include order ID here
      );
      if (data.success) {
        const { data } = await axios.delete(
          `http://localhost:8000/api/v1/product/delete-order/${oid}`
        );
        getOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Layout title="Orders - Ecommerce App">
      <div className="container-fluid p-1">
        {orders?.map((order) => (
          <div className="order-data-container" key={order._id}>
            <h1>Order from Table No. {order.tableNumber}</h1>
            {order.products.map((product) => (
              <div key={product._id} className="container">
                <h4>
                  Name:{product.name}
                  {","} Category: {product.category.name}
                </h4>
              </div>
            ))}
            <h5>Customer Name: {order.buyer.name}</h5>
            <button
              className="btn btn-primary"
              onClick={() => {
                // console.log(order);
                handleOrders(order._id, order);
              }}>
              DONE
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default OrdersData;
