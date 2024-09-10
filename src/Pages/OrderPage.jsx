import { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../Service/FirebaseConnect';
import { doc, getDoc } from 'firebase/firestore';
import './OrderPage.css';

const OrderPage = () => {
    const USERNAME = sessionStorage.getItem("username");
    const navigate = useNavigate();

    const { id } = useParams(); // Get the clothing ID from the URL
    const [clothe, setClothe] = useState(null);
    const [imageUrls, setImageUrls] = useState([]); // To store multiple image URLs
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0); // Track active image for slider
    const [quantity, setQuantity] = useState(1); // Initialize quantity to 1

    const handleBuyNow = async () => {
        const orderData = {
            cloth_id: clothe.id,
            quantity: quantity,
            total: clothe.clothe_Price * quantity,
            username: USERNAME,
        };

        try {
            setLoading(true); // Trigger loading screen

            // Place the order
            const orderResponse = await axios.post("https://orderservice-f0ef117404ca.herokuapp.com/order", orderData);

            if (orderResponse.status === 200) {
                // Reduce the clothe quantity
                const reduceQuantityResponse = await axios.put(`https://clothingservice-05aa4e32edda.herokuapp.com/reduceQuantity/${clothe.id}`, null, {
                    params: {
                        quantity: quantity
                    }
                });

                if (reduceQuantityResponse.status === 200) {
                    alert("Your Order Successfully added and quantity reduced");
                    window.location.reload();
                } else {
                    alert("Failed to reduce clothe quantity");
                    window.location.reload();
                }
            } else {
                alert("Failed to add order");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while placing the order or reducing quantity.");
        } finally {
            setLoading(false); // Remove loading screen
        }
    };
// Function to handle increasing the quantity
    const handleIncrease = () => {
        if (quantity < clothe.clothe_Quantity) {
            setQuantity((prevQuantity) => prevQuantity + 1);
        }
    };

// Function to handle decreasing the quantity
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    useEffect(() => {
        if (!id) {
            navigate('/'); // Navigate to the homepage
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch clothing details
                const response = await axios.get(`https://clothingservice-05aa4e32edda.herokuapp.com/clothes/${id}`);
                setClothe(response.data);
                console.log(response);

                // Fetch images from Firebase
                const docRef = doc(db, 'CLOTHES', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const docData = docSnap.data();
                    const imagePaths = docData.images || []; // Get all image paths

                    // Fetch all image URLs
                    const urls = await Promise.all(
                        imagePaths.map(async (imagePath) => {
                            const imageRef = ref(storage, imagePath);
                            return await getDownloadURL(imageRef);
                        })
                    );
                    setImageUrls(urls);
                }
            } catch (error) {
                setError(`Error fetching data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleNext = () => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    const handlePrev = () => {
        setActiveImageIndex((prevIndex) =>
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    const handleThumbnailClick = (index) => {
        setActiveImageIndex(index);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }



    return (
        <div className="order-page-container">
            {clothe ? (
                <>
                    <div className="thumbnail-gallery">
                        {imageUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Thumbnail ${index + 1}`}
                                className={`thumbnail ${index === activeImageIndex ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(index)}
                            />
                        ))}
                    </div>

                    <div className="slider">
                        <div className="slider-images">
                            {imageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Clothing ${index + 1}`}
                                    className={`slider-image ${index === activeImageIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                        <button className="slider-nav prev" onClick={handlePrev}>‹</button>
                        <button className="slider-nav next" onClick={handleNext}>›</button>
                    </div>

                    <div className="product-wrapper">
                        {/* Conditionally render loading screen */}
                        {loading && (
                            <div className="loading-screen">
                                <div className="spinner"></div>  {/* Add some spinner styles if needed */}
                                <p>Processing your order...</p>
                            </div>
                        )}
                        <div className="product-details">
                            <h1>{clothe.clothe_Name || 'Name not available'}</h1>
                            <p className="price">{`Rs ${clothe.clothe_Price}`}</p>
                            <div className="quantity-wrapper">
                                <button onClick={handleDecrease}>-</button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                />
                                <button onClick={handleIncrease}>+</button>
                            </div>

                            <button className="buy-now" onClick={handleBuyNow}>
                                Buy Now – Rs {clothe.clothe_Price * quantity}
                            </button>
                        </div>

                        <div className="product-info">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="" width="31" height="30"
                                     viewBox="0 0 31 30" id="w2v-438">
                                    <path
                                        d="M30 27.6692C29.6992 27.3684 29.0977 27.3684 28.797 27.6692C28.0451 28.4211 26.6917 28.4211 25.9398 27.6692C25.6391 27.3684 25.3383 27.218 24.8872 26.9173L28.4962 17.2932C28.9474 16.2406 28.4962 15.0376 27.594 14.4361L22.6316 10.8271V5.56391C22.6316 4.96241 22.3308 4.3609 21.8797 3.90977C21.4286 3.45865 20.8271 3.15789 20.2256 3.15789H19.0226V2.40601C19.0226 1.05263 17.9699 0 16.6165 0H13.9098C12.5564 0 11.5038 1.05263 11.5038 2.40601V3.15789H10.3008C9.69925 3.15789 9.09774 3.45865 8.64662 3.90977C7.89474 4.3609 7.74436 4.96241 7.74436 5.56391V10.8271L2.4812 14.4361C1.57895 15.0376 1.2782 16.2406 1.57895 17.2932L5.18797 27.0677C4.88722 27.218 4.58647 27.5188 4.28571 27.6692C3.53383 28.4211 2.18045 28.4211 1.42857 27.6692C1.12782 27.3684 0.526316 27.3684 0.225564 27.6692C-0.075188 27.9699 -0.075188 28.5714 0.225564 28.8722C1.72932 30.3759 4.13534 30.3759 5.6391 28.8722C6.39098 28.1203 7.74436 28.1203 8.49624 28.8722C10 30.3759 12.406 30.3759 13.9098 28.8722C14.6617 28.1203 16.015 28.1203 16.7669 28.8722C18.2707 30.3759 20.6767 30.3759 22.1805 28.8722C22.9323 28.1203 24.2857 28.1203 25.0376 28.8722C25.7895 29.6241 26.6917 29.9248 27.7444 29.9248C28.797 29.9248 29.6992 29.4737 30.4511 28.8722C30.4511 28.5714 30.4511 28.1203 30 27.6692ZM13.1579 2.40601C13.1579 2.10526 13.4586 1.80451 13.7594 1.80451H16.4662C16.7669 1.80451 17.0677 2.10526 17.0677 2.40601V3.15789H13.0075V2.40601H13.1579ZM9.54887 5.56391C9.54887 5.41353 9.54887 5.26316 9.69925 5.11278C9.84962 4.96241 10 4.96241 10.1504 4.96241H20.2256C20.3759 4.96241 20.5263 4.96241 20.6767 5.11278C20.8271 5.26316 20.8271 5.41353 20.8271 5.56391V9.47368L15.7143 6.01504C15.4135 5.86466 14.9624 5.86466 14.6617 6.01504L9.54887 9.62406V5.56391ZM3.53383 15.9398L15.1128 7.96992L26.6917 16.0902C26.8421 16.2406 26.9925 16.5414 26.8421 16.8421L25.6391 20.1504L15.7143 13.2331C15.4135 13.0827 14.9624 13.0827 14.6617 13.2331L4.58647 20L3.38346 16.5414C3.23308 16.391 3.23308 16.0902 3.53383 15.9398ZM20.5263 27.6692C19.7744 28.4211 18.4211 28.4211 17.6692 27.6692C16.1654 26.1654 13.7594 26.1654 12.2556 27.6692C11.5038 28.4211 10.1504 28.4211 9.3985 27.6692C8.64662 26.9173 7.74436 26.6165 6.69173 26.6165L4.88722 21.8045L15.1128 15.0376L25.0376 21.9549L23.2331 26.7669C22.1804 26.6165 21.2782 26.9173 20.5263 27.6692Z"
                                        id="w2v-439"></path>
                                </svg>
                                Island-wide Cash-on-Delivery 350 LKR (within 03 working days)
                            </div>
                            <div>
                                <img src="/assets/return-icon.svg" alt="Return" className="info-icon"/>
                                Return within 7 days of purchase. Duties & taxes are non-refundable.
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>Clothing item not found.</div>
            )}
        </div>
    );
};

export default OrderPage;
