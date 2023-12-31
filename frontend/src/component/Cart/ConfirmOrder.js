import React, { Fragment } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import { useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
    const navigate = useNavigate();
    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    const shippingCharges = subtotal > 2500 ? 0 : 250;

    const tax = subtotal * 0.18;

    const totalPrice = subtotal + tax + shippingCharges;

    const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice,
        };

        sessionStorage.setItem("orderInfo", JSON.stringify(data));

        navigate("/process/payment");
    };

    return (
        <Fragment>
            <MetaData title="Confirm Order" />
            <CheckoutSteps activeStep={1} />
            <div className="confirmOrderPage">
                <div>
                    <div className="confirmshippingArea">
                        <Typography>Shipping Info</Typography>
                        <div className="confirmshippingAreaBox">
                            <div>
                                <p>Name:</p>
                                <span>{user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phoneNumber}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{address}.<br/>(Free delivery over 2500 shopping in all over Pakistan)</span>
                            </div>
                        </div>
                    </div>
                    <div className="confirmCartItems">
                        <Typography>Your Cart Items:</Typography>
                        <div className="confirmCartItemsContainer">
                            {cartItems &&
                                cartItems.map((item) => (
                                    <div key={item.product}>
                                        <img src={item.image} alt="Product" />
                                        <Link to={`/product/${item.product}`}>
                                            {item.name}
                                        </Link>{" "}
                                        <span>
                                            {item.quantity} X PKR {item.price} ={" "}
                                            <p className="totalhere">PKR {item.price * item.quantity}</p>
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                {/*  */}
                <div>
                    <div className="orderSummary">
                        <Typography>Order Summery</Typography>
                        <div>
                            <div>
                                <p>Subtotal:</p>
                                <span>PKR {subtotal}</span>
                            </div>
                            <div>
                                <p>Shipping Charges:</p>
                                <span>PKR {shippingCharges}</span>
                            </div>
                            
                            <div>
                                <p>VAT, GST, and Sales Tax:</p>
                                <span>PKR {tax}</span>
                            </div>
                        </div>

                        <div className="orderSummaryTotal">
                            <p>Total:</p>
                            <span>PKR {totalPrice}</span>
                        </div>

                        <button onClick={proceedToPayment}>Checkout with Stripe</button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ConfirmOrder;