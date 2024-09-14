import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/layout/Price";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Card";
import { useAuth } from "../context/auth";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [error, setError] = useState("");

  const [cart, setCart] = useCart();
  const [auth] = useAuth();

  const navigate = useNavigate();

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

  // get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/category/get-category"
      );

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/product/get-product`
      );
      // console.log(data);
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Ecommerce App - Best Offers"}>
      <div className="row mt-3">
        <div className="col-md-3">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column ms-4">
            <p onClick={() => setCategory("")}>All</p>
            {categories?.map((c) => (
              <p key={c._id} onClick={() => setCategory(c.name)}>
                {c.name}
              </p>
            ))}
          </div>

          <div className="d-flex flex-column ms-4">
            <button
              className="btn btn-primary mt-4"
              onClick={() => window.location.reload()}>
              RESET CATEGORY
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Product</h1>
          <div className="d-flex flex-wrap">
            {products
              ?.filter((product) => product.category.name.includes(category))
              .map((p) => (
                <div className="product-link" key={p._id}>
                  <div className="card m-2" style={{ width: "18rem" }}>
                    <img
                      src={`http://localhost:8000/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">
                        {p.description.substring(0, 30)} ...
                      </p>
                      <p className="card-text">${p.price}</p>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => navigate(`/product/${p.slug}`)}>
                        More Details
                      </button>
                      <button
                        className="btn btn-secondary ms-1"
                        onClick={() => {
                          setCart([...cart, p]);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                          );
                          toast.success("Item Added to Cart");
                        }}>
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          style={{ display: `${cart.length ? "unset" : "none"}` }}
          className="confirm-box col-md-4 text-center">
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
    </Layout>
  );
};

export default Home;
