// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";
// import { db, storage } from "../Service/FirebaseConnect";
// import "./latestclothe.css";

// function Latestclothe() {
//   const [clothes, setClothes] = useState([]);
//   const [images, setImages] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/LastestClothe");
//         const data = response.data;
//         setClothes(data);

//         const imagePromises = data.map(async (item) => {
//           try {
//             const docRef = doc(db, "CLOTHES", item.id.toString());
//             const docSnap = await getDoc(docRef);

//             if (docSnap.exists()) {
//               const docData = docSnap.data();
//               const urls = docData.images || [];

//               const imageUrls = urls.length
//                 ? await Promise.all(
//                     urls.map(async (imagePath) => {
//                       const imageRef = ref(storage, imagePath);
//                       const url = await getDownloadURL(imageRef);
//                       return url;
//                     })
//                   )
//                 : [];

//               return { id: item.id, imageUrls };
//             } else {
//               return { id: item.id, imageUrls: [] };
//             }
//           } catch (error) {
//             console.error(`Error fetching images for item ${item.id}:`, error);
//             return { id: item.id, imageUrls: [] };
//           }
//         });

//         const imagesData = await Promise.all(imagePromises);
//         const imagesMap = imagesData.reduce((acc, { id, imageUrls }) => {
//           acc[id] = imageUrls;
//           return acc;
//         }, {});

//         setImages(imagesMap);
//       } catch (error) {
//         console.error("Error fetching clothes data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <div className="Latetst-drop-section">
//           {clothes.map((item) => (
//                     <div key={item.id} className="latest-drop-image-container">
//                             {images[item.id] && images[item.id].length > 0 ? (
//                             <img
//                                 src={images[item.id][0]}
//                                 alt={`Clothe ${item.id} Image 1`}
//                             />
//                             ) : (
//                             <p>???</p>
//                             )}
//                     </div>
//                    ))}
//             <div className="latest-drop-description">
//             <h1>NEW DROP</h1>
//             <h2>WE MAKE YOUR DANCE ENJOYABLE</h2>
//             <button>SHOP NOW</button>
//             </div>
//         </div>
//     </div>
//   );
// }

// export default Latestclothe;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Service/FirebaseConnect";
import "./latestclothe.css";

function Latestclothe() {
  const [clothes, setClothes] = useState([]);
  const [images, setImages] = useState({});
  const descriptionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://clothingservice-05aa4e32edda.herokuapp.com/LastestClothe");
        const data = response.data;
        setClothes(data);

        const imagePromises = data.map(async (item) => {
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
      } catch (error) {
        console.error("Error fetching clothes data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          descriptionRef.current.classList.add("scrolled");
        } else {
          descriptionRef.current.classList.remove("scrolled");
        }
      },
      { threshold: 0.1 }
    );

    if (descriptionRef.current) {
      observer.observe(descriptionRef.current);
    }

    return () => {
      if (descriptionRef.current) {
        observer.unobserve(descriptionRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="Latetst-drop-section">
        {clothes.map((item) => (
          <div key={item.id} className="latest-drop-image-container" >
            {images[item.id] && images[item.id].length > 0 ? (
              <img src={images[item.id][0]} alt={`Clothe ${item.id} Image 1`} />
            ) : (
              <p>???</p>
            )}
          </div>
        ))}
        <div className="latest-drop-description" ref={descriptionRef}>
          <h1>NEW DROP</h1>
          <h2>WE MAKE YOUR DANCE ENJOYABLE</h2>
          <button>SHOP NOW</button>
        </div>
      </div>
    </div>
  );
}

export default Latestclothe;
