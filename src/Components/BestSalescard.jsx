import React, { useState, useEffect } from "react";
import axios from "axios";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Service/FirebaseConnect";
import "./Newarivalscard.css";

const BestSalescard = () => {
  const USERNAME = sessionStorage.getItem("username");
  const [clothes, setClothes] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});

  const checkFavoriteStatus = async (clothe_id) => {
    try {
      const response = await axios.get("http://localhost:8081/GetFavOrNot", {
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
    // alert(`clotheid ${USERNAME}`);
    try {
      const response = await axios.post(
        "http://localhost:8081/Addtofavoerite",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First API call to get best sales
        const salesResponse = await axios.get(
            "https://orderservice-f0ef117404ca.herokuapp.com/orders/bestsales"
        );
        const salesData = salesResponse.data; // Assuming this is an array of best sales
        const clotheIds = salesData.map((item) => item.clothe_id); // Extract clothe_ids

        // Fetch details for each clothe_id
        const detailsPromises = clotheIds.map(async (id) => {
          try {
            const response = await axios.get(
                `https://clothingservice-05aa4e32edda.herokuapp.com/clothes/${id}`
            );
            return response.data; // Full clothing details for each item
          } catch (error) {
            console.error(`Error fetching details for item ${id}:`, error);
            return null; // Handle error by returning null
          }
        });

        const clothesData = await Promise.all(detailsPromises); // Get full clothing details
        const filteredClothesData = clothesData.filter((item) => item !== null); // Filter out any null items
        setClothes(filteredClothesData); // Set the clothing data in state

        // Fetch images for each clothing item
        const imagePromises = filteredClothesData.map(async (item) => {
          try {
            const docRef = doc(db, "CLOTHES", item.id.toString());
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const docData = docSnap.data();
              const urls = docData.images || [];

              const imageUrls = urls.length
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

        // Fetch favorites status for each clothing item
        const favoritesStatus = await Promise.all(
            filteredClothesData.map(async (item) => {
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
  }, []);


  return (
    <div>
      {loading ? (
        <div
          style={{
            display: "flex",
            gap: "120px",
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
          {clothes.map((clothe) => (
            <div key={clothe.id} className="clothe-card">
              {favorites[clothe.id] ? (
                <button className="favorite-button">
                  <i class="fa-solid fa-heart"></i>
                </button>
              ) : (
                <button
                  onClick={() => handleAddtofav(clothe.id, clothe.clothe_Name)}
                  className="add-to-favorites-button"
                >
                  <i class="fa-regular fa-heart"></i>
                </button>
              )}
              {clothe.clothe_Quantity === 0 ? (
                <button className="sold-out-view-container">Sold out</button>
              ) : clothe.clothe_Quantity < 20 ? (
                <button
                  className="sold-out-view-container"
                  style={{ color: "white" }}
                >
                  Limited
                </button>
              ) : null}
              <div className="Clothe_image_container">
                {images[clothe.id] && images[clothe.id].length > 0 ? (
                  <img
                    src={images[clothe.id][0]}
                    alt={`Clothe ${clothe.id} Image 1`}
                  />
                ) : (
                  <p>???</p>
                )}
              </div>
              <div className="clothing-details">
                <h5 className="clothing-name">{clothe.clothe_Name}</h5>
                <h5 className="clothing-price">LKR {clothe.clothe_Price}.00</h5>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSalescard;
