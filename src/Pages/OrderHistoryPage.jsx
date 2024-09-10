import { useState, useEffect } from "react";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Service/FirebaseConnect.jsx";
import "./orderHistoryPage.css";
import {useNavigate} from "react-router-dom";

const OrderHistoryPage = () => {
    const USERNAME = sessionStorage.getItem("username");
    const [orders, setOrders] = useState([]);
    const [clothDetails, setClothDetails] = useState({});
    const [images, setImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch orders and cloth details
    useEffect(() => {
        if (!USERNAME) {
            // Navigate to /favorite if username is found
            navigate("/Useraccount");
        }
        const fetchOrders = async () => {
            try {
                const orderResponse = await axios.get(
                    `https://orderservice-f0ef117404ca.herokuapp.com/orders/username/${USERNAME}`
                );
                const orderData = orderResponse.data;
                setOrders(orderData);

                // Fetch cloth details for each order
                const clothPromises = orderData.map(async (order) => {
                    try {
                        const clothResponse = await axios.get(
                            `https://clothingservice-05aa4e32edda.herokuapp.com/clothes/${order.cloth_id}`
                        );
                        return {
                            id: order.cloth_id,
                            details: clothResponse.data,
                        };
                    } catch (clothError) {
                        console.error(`Error fetching cloth info: ${clothError}`);
                        return { id: order.cloth_id, details: null };
                    }
                });

                const clothDetailsArr = await Promise.all(clothPromises);
                const clothMap = clothDetailsArr.reduce((acc, cloth) => {
                    if (cloth.details) acc[cloth.id] = cloth.details;
                    return acc;
                }, {});
                setClothDetails(clothMap);

                // Fetch images for each cloth from Firebase Storage
                const imagePromises = clothDetailsArr.map(async (cloth) => {
                    try {
                        const clothId = cloth.id;
                        if (!clothId) return { id: undefined, imageUrls: [] };

                        const docRef = doc(db, "CLOTHES", clothId.toString());
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            const docData = docSnap.data();
                            const imagePaths = docData.images || [];

                            const imageUrls = imagePaths.length
                                ? await Promise.all(
                                    imagePaths.map(async (imagePath) => {
                                        const imageRef = ref(storage, imagePath);
                                        const url = await getDownloadURL(imageRef);
                                        return url;
                                    })
                                )
                                : [];

                            return { id: clothId, imageUrls };
                        } else {
                            return { id: clothId, imageUrls: [] };
                        }
                    } catch (error) {
                        console.error(`Error fetching image for cloth ${cloth.id}: ${error}`);
                        return { id: cloth.id, imageUrls: [] };
                    }
                });

                const imagesData = await Promise.all(imagePromises);
                const imagesMap = imagesData.reduce((acc, { id, imageUrls }) => {
                    if (id) acc[id] = imageUrls;
                    return acc;
                }, {});
                setImages(imagesMap);
            } catch (err) {
                setError(`Error fetching orders: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [USERNAME]);

    return (
        <div className="order-page-container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <div>Error: {error}</div>
            ) : orders.length === 0 ? (
                <div className="empty-wishlist">
                    <h3 className="empty-wishlist-header">No Orders Have been Placed.</h3>
                    <h6 className="empty-wishlist-description">
                        You don't have any products Purchased yet. You will find a lot
                        of interesting products on our "Shop page".
                    </h6>
                    <img src="./src/images/ShoppingCart.png"/>
                </div>
            ) : (
                <div>
                    <h4 className="header_name">Your Past Orders</h4>

                    <div className="clothing-card-container">
                        {orders.map((order) => {
                            const cloth = clothDetails[order.cloth_id];
                            return (
                                <div key={order.cloth_id} className="clothe-card">
                                    {cloth ? (
                                        <>
                                        <div className="Clothe_image_container">
                                            {images[order.cloth_id] &&
                                            images[order.cloth_id].length > 0 ? (
                                                <img
                                                    src={images[order.cloth_id][0]}
                                                    alt={`Cloth ${order.cloth_id} Image`}
                                                />
                                            ) : (
                                                <p>No Image Available</p>
                                            )}
                                        </div>
                                        <div className="clothing-details">
                                            <h5 className="clothing-name">
                                                {cloth.clothe_Name}
                                            </h5>
                                            <h4 className="clothing-price">Quantity: {order.quantity}</h4>
                                            <h4 className="clothing-price">Total Amount: {order.total} LKR</h4>
                                        </div>
                                        </>
                                        ) : (
                                        <p>Loading cloth details...</p>
                                        )}
                                        </div>
                                    );
                                    })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
