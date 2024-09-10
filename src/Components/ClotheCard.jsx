import React, { useState, useEffect } from "react";
import axios from "axios";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Service/FirebaseConnect";
import "./ClotheCard.css";
import PriceRangeSlider from "./SliderRange";
import {useNavigate} from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Clothecard = () => {
  const USERNAME = sessionStorage.getItem("username");
  const navigate = useNavigate();

  const [user_view_type, setClotheview] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [isFilteVisible, setFilterVisible] = useState(false);
  const [FilterContent, setFilterContent] = useState(null);
  const [priceRange, setPriceRange] = useState(0);

  const [select_optionUser, setselected_option] = useState(
    localStorage.getItem("selectedOption") || "BestSales"
  );
  const [Userresult, setresult] = useState(
    localStorage.getItem("selectedResult") || "Best Sales"
  );

  const handleselect_optionUser = (event) => {
    event.preventDefault();
    const value = event.target.value;
    setselected_option(value);
    setLoading(true);

    localStorage.setItem("selectedOption", value);

    const resultText =
      value === "BestSales"
        ? "Best Sales"
        : value === "PriceHighlow"
        ? "Price High to Low"
        : value === "PricelowHigh"
        ? "Price Low to High"
        : "Out Of Stock";

    setresult(resultText);
    localStorage.setItem("selectedResult", resultText);
  };

  const checkFavoriteStatus = async (clothe_id) => {
    try {
      const response = await axios.get("https://userservice-b9cca56d6d11.herokuapp.com/GetFavOrNot", {
        params: {
          user_namefavorite: USERNAME,
          clothe_idfavorite: clothe_id,
        },
      });

      const isFavorite = response.data.length > 0;
      return isFavorite;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      return false;
    }
  };
  const handleAddtofav = async (clothe_id, clothe_Name) => {
    try {
      const response = await axios.post(
        "https://userservice-b9cca56d6d11.herokuapp.com/Addtofavoerite",
        {
          user_namefavorite: USERNAME,
          clothe_idfavorite: clothe_id,
          clothe_Name: clothe_Name,
        }
      );
      console.log(`added to fav`, response.data);
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [clothe_id]: true,
      }));

      localStorage.setItem("refreshFavCount", Date.now());
    } catch (error) {
      console.error("eror ".error);
    }
  };

  const showPopup = (content) => {
    setPopupContent(content);
    setIsPopupVisible(true);
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
  };

  const popupfilter = (content) => {
    setFilterContent(content);
    setFilterVisible(true);
  };

  const hideFilter = () => {
    setFilterVisible(false);
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange(parseInt(event.target.value, 10));
    setLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (select_optionUser === "BestSales") {
          response = await axios.get("https://clothingservice-05aa4e32edda.herokuapp.com/clothes", {
            params: { price_min: priceRange },
          });
        } else if (select_optionUser === "PriceHighlow") {
          response = await axios.get(
            "https://clothingservice-05aa4e32edda.herokuapp.com/sortedByPriceHighToLow",
            {
              params: { price_min: priceRange },
            }
          );
        } else if (select_optionUser === "PricelowHigh") {
          response = await axios.get(
            "https://clothingservice-05aa4e32edda.herokuapp.com/sortedByPriceLowToHigh",
            {
              params: { price_min: priceRange },
            }
          );
        } else {
          response = await axios.get("https://clothingservice-05aa4e32edda.herokuapp.com/OutOfStock", {
            params: { price_min: priceRange },
          });
        }
        const data = response.data;

        // data = data.filter((item) => item.clothe_Price > 200);

        const filteredData = data.filter(
          (item) => item.clothe_Price > priceRange
        );

        setClotheview(filteredData);

        const imagePromises = filteredData.map(async (item) => {
          try {
            const docRef = doc(db, "CLOTHES", item.id.toString());
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const docData = docSnap.data();
              const urls = docData.images || [];

              const imageUrls =
                urls.length > 0
                  ? await Promise.all(
                      urls.map(async (imagePath) => {
                        const imageRef = ref(storage, imagePath);
                        const url = await getDownloadURL(imageRef);
                        return url;
                      })
                    )
                  : [];

              return { id: item.id, imageUrls };
            } else {
              return { id: item.id, imageUrls: [] };
            }
          } catch (error) {
            console.error(`Error fetching images for item ${item.id}:`, error);
            return { id: item.id, imageUrls: [] };
          }
        });

        const imagesData = await Promise.all(imagePromises);
        const imagesMap = imagesData.reduce((acc, { id, imageUrls }) => {
          acc[id] = imageUrls;
          return acc;
        }, {});

        setImages(imagesMap);

        const favoritesStatus = await Promise.all(
          data.map(async (item) => {
            const isFavorite = await checkFavoriteStatus(item.id);
            return { id: item.id, isFavorite };
          })
        );

        const favoritesMap = favoritesStatus.reduce(
          (acc, { id, isFavorite }) => {
            acc[id] = isFavorite;
            return acc;
          },
          {}
        );

        setFavorites(favoritesMap);
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [select_optionUser, priceRange]);

  return (
    <div>
      <div className="selection-container">
        <button className="Filter-button" onClick={() => popupfilter()}>
          filter
          <i class="fa-solid fa-sliders"></i>
        </button>

        <div className="selection-style-container">
          <div className="style-option"></div>
          <div className="style-option"></div>
          <div className="style-option"></div>
          <div className="style-option"></div>
        </div>
        <div>
          <div className="selected-tag">
            <h5 className="user_select">{Userresult}</h5>
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            gap: "120px",
            marginBottom: "800px",
          }}
        >
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="clothing-card-container">
          {user_view_type.map((clothe) => (
            <div key={clothe.id} className="clothe-card">
              <button
                onClick={() => showPopup(clothe)}
                className="quick-view-button"
              >
                <i class="fa-brands fa-codepen"></i>
              </button>

              {favorites[clothe.id] ? (
                <button className="favorite-button-super">
                  <i class="fa-solid fa-heart"></i>
                </button>
              ) : (
                <button
                  onClick={() => handleAddtofav(clothe.id, clothe.clothe_Name)}
                  className="add-to-favorites-button-super"
                >
                  <i class="fa-regular fa-heart"></i>
                </button>
              )}

              <button className="view-container-name-three">
                <i class="fa-solid fa-list"></i>
              </button>

              {clothe.clothe_Quantity === 0 ? (
                <button className="sold-out-view-container-super">
                  Sold out
                </button>
              ) : clothe.clothe_Quantity < 20 ? (
                <button
                  style={{ color: "white" }}
                  className="sold-out-view-container-super"
                >
                  Limited
                </button>
              ) : null}

              <div
                className="Clothe_image_container"
                onClick={() => navigate(`/orderpage/${clothe.id}`)}
              >
                {images[clothe.id] && images[clothe.id].length > 0 ? (
                  <img
                    key={0}
                    src={images[clothe.id][0]}
                    alt={`clothe ${clothe.id} Image 1`}
                  />
                ) : (
                  <p>???</p>
                )}
              </div>

              <div className="clothing-details" onClick={() => navigate(`/orderpage/${clothe.id}`)}>
                <h5 className="clothing-name">{clothe.clothe_Name}</h5>
                <h5 className="clothing-price">LKR {clothe.clothe_Price}.00</h5>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPopupVisible && (
        <div className="popup ">
          <div className="popup-inner">
            <button onClick={hidePopup} className="popup-close-button">
              X
            </button>
            {popupContent && (
              <div className="popup-clothe-details-container">
                <div className="popup-clothe-heder-container">
                  <img
                    src={images[popupContent.id]?.[0] || "default-image.png"}
                    alt={popupContent.clothe_Name}
                  />
                  <h2>{popupContent.clothe_Name}</h2>
                </div>
                <hr className="line-one-space"></hr>
                <div className="popup-clothe-middle-container">
                  <h5>PRICE : Rs {popupContent.clothe_Price}.00</h5>
                  {popupContent.clothe_Quantity === 0 ? (
                    <h5>
                      ON STOCK :{" "}
                      <b style={{ color: "#49CCF5" }}>OUT OF STOCK</b>
                    </h5>
                  ) : popupContent.clothe_Quantity > 50 ? (
                    <h5>
                      ON STOCK : <b style={{ color: "#49CCF5" }}>50+</b>
                    </h5>
                  ) : popupContent.clothe_Quantity > 10 ? (
                    <h5>
                      ON STOCK : <b style={{ color: "#49CCF5" }}>10+</b>
                    </h5>
                  ) : (
                    <h5>
                      ON STOCK : <b style={{ color: "#49CCF5" }}>LAST CHANCE</b>
                    </h5>
                  )}
                  <h5>SIZE : FREE-SIZE</h5>
                  <h5 style={{ color: "#49CCF5" }}>CASH ON DELIEVERY</h5>
                </div>
                <button className="shop-now-button-popup-section">
                  SHOP NOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isFilteVisible && (
        <div className="Fitler-container">
          <div className="Filter-section">
            <div className="Filter-header-section">
              <h2>FILTER</h2>
              <i class="fa-solid fa-sliders"></i>
              <button onClick={hideFilter} className="Filter-close-button">
                <i
                  class="fa-solid fa-chevron-left"
                  style={{
                    marginRight: "10px",
                    fontSize: "25px",
                    marginBottom: "12px",
                  }}
                ></i>
              </button>
            </div>
            <div className="Filter-middle-container">
              <div className="filter-midlle-sections">
                <div className="filter-middle-row-header">
                  <h1>Categories</h1>
                  <i class="fa-solid fa-angle-down"></i>
                </div>

                <hr></hr>
                <div className="filter-middle-row-header">
                  <h1>Availability</h1>
                  <i class="fa-solid fa-angle-up"></i>
                </div>
                <select
                  onChange={handleselect_optionUser}
                  value={select_optionUser}
                >
                  <option value={"BestSales"}>Best Selling</option>
                  <option value={"PriceHighlow"}>Price High to Low</option>
                  <option value={"PricelowHigh"}>Price Low to High</option>
                  <option value={"Outstock"}>Out of Stock</option>
                </select>
                <hr></hr>
                <div className="filter-middle-row-header">
                  <h1>Price Range</h1>
                  <i class="fa-solid fa-angle-up"></i>
                </div>
              </div>
              <PriceRangeSlider
                min={0}
                max={4000}
                step={50}
                value={priceRange}
                onChange={handlePriceRangeChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clothecard;
