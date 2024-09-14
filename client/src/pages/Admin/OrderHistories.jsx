import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";

const OrderHistories = () => {
  const [histories, setHistories] = useState([]);

  //   get histories
  const getAllHistories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/product/get-history"
      );
      setHistories(data.histories);
    //   const [history] = histories[0].history;
    } catch (error) {
      console.log(error);
    }
  };

  //   delete histories
  const handleDelete = async () => {
    try {
      await axios.delete(
        "http://localhost:8000/api/v1/product/delete-histories"
      );
      getAllHistories();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllHistories();
  }, []);

  return (
    <Layout title="Order Histories - Ecommerce App">
      <div className="container-fluid p-1">
        {histories?.map((history) => (
          <div key={history._id} className="order-data-container">
            <p>
              Table No. {history.history[0].tableNumber}, Name:{" "}
              {history.history[0].buyer.name}
            </p>
          </div>
        ))}
        <button onClick={handleDelete} className="btn btn-danger">
          Delete All History
        </button>
      </div>
    </Layout>
  );
};

export default OrderHistories;
