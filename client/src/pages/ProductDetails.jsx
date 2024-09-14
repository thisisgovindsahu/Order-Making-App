import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  // get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/product/get-product/${params.slug}`
      );
      console.log(data);
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row container">
        <div className="col-md-6 mt-5">
          <img
            src={`http://localhost:8000/api/v1/product/product-photo/${product._id}`}
            className="product-img card-img-top"
            alt={product.name}
          />
        </div>
        <div className="col-md-6 mt-5">
          <h2 className="text-center mb-3">Product Details</h2>
          <p>Name: {product?.name}</p>
          <p>Description: {product?.description}</p>
          <p>Price: {product?.price}</p>
          {product.category ? (
            <p>Category: {product?.category.name}</p>
          ) : (
            "Loading..."
          )}
          <button className="btn btn-secondary ms-1">ADD</button>
        </div>
      </div>
      <hr />
      <div className="row">
        <h2>Similar Products</h2>
        {relatedProducts.length < 1 && <p>No similar products</p>}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div
              className="product-link"
              // to={`/dashboard/admin/product/${p.slug}`}
              key={p._id}>
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
                  <button className="btn btn-secondary ms-1">ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
