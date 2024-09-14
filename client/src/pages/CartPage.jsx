import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useCart } from "../context/Card";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // console.log(cart);

  //   total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //   delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // handle orders function
  const handleOrder = async () => {
    if (tableNumber === "") {
      setError("Table Number is Required");
      return;
    }

    const orderData = {
      products: cart,
      tableNumber,
      buyer: auth?.user,
      total: totalPrice(),
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/product/client-orders",
        orderData
      );
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Your Order is Confirmed");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Shopping Cart - Ecommerce App">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-center bg-light p-2">
              HELLO{"  "}
              <span style={{ textTransform: "uppercase", color: "#1e81b0" }}>
                {auth?.token ? auth?.user?.name : "Dear User"}
              </span>
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {cart?.map((p) => (
              <div key={p._id} className="row mt-2 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`http://localhost:8000/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    height={"150px"}
                    width={"100px"}
                  />
                </div>
                <div className="col-md-8 p-3">
                  <h4>Name: {p.name}</h4>
                  <p>Description: {p.description.substring(0, 30)}...</p>
                  <p>Price: ${p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <div
              style={{
                margin: "5px",
              }}>
              <p style={{ color: "red" }}>{error}</p>
              <input
                style={{ border: "none", outline: "none" }}
                type="number"
                required
                value={tableNumber}
                placeholder="Table Number"
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
            <h4>Total: {totalPrice()}</h4>
            <div className="mt-2">
              <button
                disabled={!auth?.user || !cart.length}
                className="btn btn-primary"
                onClick={handleOrder}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
