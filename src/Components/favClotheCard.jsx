import { useState, useEffect } from "react";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Service/FirebaseConnect";
import "./favClothecard.css";
import {useNavigate} from "react-router-dom";

const FavClotheCard = () => {
  const USERNAME = sessionStorage.getItem("username");
  const [clothes, setClothes] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleDeleteFromFav = async (fav_id) => {
    try {
      const response = await axios.delete(
        `https://userservice-b9cca56d6d11.herokuapp.com/favoritedelete/${fav_id}`
      );

      console.log("Delet:", response.data);

      setClothes(clothes.filter((clothe) => clothe.id !== fav_id));
    } catch (error) {
      console.error("Erro:", error);
    }

    localStorage.setItem("refreshFavCount", Date.now());
  };

  useEffect(() => {
    if (!USERNAME) {
      // Navigate to /favorite if username is found
      navigate("/Useraccount");
    }
    const fetchData = async () => {
      try {
        console.log(`uyser: ${USERNAME}`);
        const response = await axios.get(
          "https://userservice-b9cca56d6d11.herokuapp.com/GetAllUserfav",
          {
            params: {
              userNameFavorite: USERNAME,
            },
          }
        );
        const data = response.data;
        console.log("Fetched data:", data);

        if (data.length === 0) {
          setClothes([]);
          setLoading(false);
          return;
        }

        setClothes(data);

        const imagePromises = data.map(async (clothe) => {
          try {
            const clotheId = clothe.clothe_idfavorite;
            if (!clotheId) {
              console.error("clothe_id the items:", clothe);
              return { id: undefined, imageUrls: [] };
            }

            const docRef = doc(db, "CLOTHES", clotheId.toString());
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

              return { id: clotheId, imageUrls };
            } else {
              return { id: clotheId, imageUrls: [] };
            }
            // eslint-disable-next-line no-unused-vars
          } catch (error) {
            return { id: clothe.clothe_idfavorite, imageUrls: [] };
          }
        });

        const imagesData = await Promise.all(imagePromises);
        const imagesMap = imagesData.reduce((acc, { id, imageUrls }) => {
          if (id) {
            acc[id] = imageUrls;
          }
          return acc;
        }, {});

        setImages(imagesMap);
        console.log("Fetched images data:", imagesMap);
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
      <h4 className="header_name">YOUR WISHLIST</h4>

      {loading ? (
        <div
          style={{
            display: "flex",
            gap: "120px",
            marginBottom: "500px",
          }}
        >
          <div className="loader"></div>
          {/* <div className="loader"></div> */}
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : clothes.length === 0 ? (
        <div className="empty-wishlist">
          <h3 className="empty-wishlist-header">{USERNAME}'s Wishlist is empty.</h3>
          <h6 className="empty-wishlist-description">
            You don't have any products in the wishlist yet. You will find a lot
            of interesting products on our "Shop page".
          </h6>
          <img src="./src/images/Heart Puzzle.png" />
        </div>
      ) : (
        <div>
          <div className="clothing-card-container">
            {clothes.map((clothe) => (
              <div key={clothe.clothe_idfavorite} className="clothe-card">
                <button
                  className="favClothe-delete-button"
                  onClick={() => handleDeleteFromFav(clothe.id)}
                >
                  <i class="fa-solid fa-trash-can"></i>{" "}
                </button>
                <div className="Clothe_image_container">
                  {images[clothe.clothe_idfavorite] &&
                  images[clothe.clothe_idfavorite].length > 0 ? (
                    <img
                      src={images[clothe.clothe_idfavorite][0]}
                      alt={`Clothe ${clothe.clothe_idfavorite} Image 1`}
                    />
                  ) : (
                    <p>No Image Available</p>
                  )}
                </div>
                <div className="clothing-details">
                  <h5 className="clothing-name">{clothe.clothe_Name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavClotheCard;
