import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
import { Country, State } from "country-state-city";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from "./CheckoutSteps.js";
import {
    EnvironmentOutlined,
    HomeOutlined,
    BankOutlined,
    GlobalOutlined,
    PhoneOutlined,
    SwapOutlined,
} from "@ant-design/icons";

const Shipping = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { shippingInfo } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [state, setState] = useState(shippingInfo.state);
    const [country, setCountry] = useState(shippingInfo.country);
    const [postalCode, setpostalCode] = useState(shippingInfo.postalCode);
    const [phoneNumber, setphoneNumber] = useState(shippingInfo.phoneNumber);

    const shippingSubmit = (e) => {
        e.preventDefault();

        if (phoneNumber.length !== 10) {
            toast.error("Phone Number should be exactly 10 digits long");
            return;
        }

        dispatch(
            saveShippingInfo({ address, city, state, country, postalCode, phoneNumber })
        );
        navigate("/order/confirm");
    };

    return (
        <Fragment>
            <MetaData title="Shipping Details" />

            <CheckoutSteps activeStep={0} />

            <div className="shippingContainer">
                <div className="shippingBox">
                    <h2 className="shippingHeading">Shipping Details</h2>

                    <form
                        className="shippingForm"
                        encType="multipart/form-data"
                        onSubmit={shippingSubmit}
                    >
                        <div>
                            <HomeOutlined />
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div>
                            <BankOutlined />
                            <input
                                type="text"
                                placeholder="City"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>

                        <div>
                            <EnvironmentOutlined />
                            <input
                                type="number"
                                placeholder="Pin Code"
                                required
                                value={postalCode}
                                onChange={(e) => setpostalCode(e.target.value)}
                            />
                        </div>

                        <div>
                            <PhoneOutlined />
                            <input
                                type="number"
                                placeholder="Phone Number"
                                required
                                value={phoneNumber}
                                onChange={(e) => setphoneNumber(e.target.value)}
                                size="10"
                            />
                        </div>

                        <div>
                            <GlobalOutlined />
                            <select
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            >
                                <option value="">Country</option>
                                {Country &&
                                    Country.getAllCountries().map((item) => (
                                        <option key={item.isoCode} value={item.isoCode}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {country && (
                            <div>

                                <SwapOutlined />
                                <select
                                    required
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                >
                                    <option value="">State</option>
                                    {State &&
                                        State.getStatesOfCountry(country).map((item) => (
                                            <option key={item.isoCode} value={item.isoCode}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        <input
                            type="submit"
                            value="Continue"
                            className="shippingBtn"
                            disabled={state ? false : true}
                        />
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Shipping;