import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Service/FirebaseConnect";
import axios from "axios";
import "./AddClothee.css";

const Addclothe = () => {
  const [clothe_Name, SetClothe_Name] = useState("");
  const [clothe_Description, SetClothe_Description] = useState("");
  const [clothe_Quantity, SetClothe_Quantity] = useState("");
  const [clothe_Price, SetClothe_Price] = useState("");

  //   Image
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);

  const [maxId, setMaxId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://clothingservice-05aa4e32edda.herokuapp.com/max-id")
      .then((response) => {
        setMaxId(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const HandleClothe_Name = (event) => SetClothe_Name(event.target.value);
  const HandleClothe_Description = (event) =>
    SetClothe_Description(event.target.value);
  const HandleClothe_Quantity = (event) =>
    SetClothe_Quantity(event.target.value);
  const HandleClothe_Price = (event) => SetClothe_Price(event.target.value);

  const handleImageChange1 = (event) =>
    setImages1(Array.from(event.target.files));
  const handleImageChange2 = (event) =>
    setImages2(Array.from(event.target.files));

  const uploadImages = async (newId) => {
    if (images1.length === 0 && images2.length === 0) {
      setError("No images selected.");
      return;
    }

    const imageUrls = [];

    const uploadImage = async (image, index, folder) => {
      const uniqueId = `${newId}_${folder}_${index}`;
      const storageRef = ref(storage, `CLOTHES/${newId}/image_${uniqueId}`);
      try {
        const snapshot = await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log(`Uploaded ${folder} image ${index}: ${downloadURL}`);

        imageUrls.push(downloadURL);
      } catch (uploadError) {
        console.error(
          `Error uploading ${folder} image ${index}: ${uploadError.message}`
        );
        setError(
          `Error uploading ${folder} image ${index}: ${uploadError.message}`
        );

        return;
      }
    };

    // Upload 1 im
    for (let i = 0; i < images1.length; i++) {
      await uploadImage(images1[i], i, "input1");
    }

    // Upload  2 im
    for (let i = 0; i < images2.length; i++) {
      await uploadImage(images2[i], i, "input2");
    }

    try {
      const userDocRef = doc(db, "CLOTHES", newId.toString());
      await setDoc(userDocRef, { images: imageUrls }, { merge: true });

      console.log("Image URLs saved to Firestore:", imageUrls);
    } catch (firestoreError) {
      console.error(
        "Error saving image URLs to Firestore:",
        firestoreError.message
      );

      setError(
        `Error saving image URLs to Firestore: ${firestoreError.message}`
      );
    }
  };

  const saveEmployees = async (event) => {
    event.preventDefault();

    if (
      !clothe_Name ||
      !clothe_Description ||
      !clothe_Price ||
      !clothe_Quantity
    ) {
      alert("All fields must be Filled out");
      return;
    }

    if (maxId === null) {
      alert("Max ID not loaded yet.");
      return;
    }

    const newId = maxId + 1;

    await uploadImages(newId);

    const data = {
      clothe_Name,
      clothe_Description,
      clothe_Quantity,
      clothe_Price,
    };
    console.log("Data being sent:", data); // Add this line to debug

    try {
      await axios.post("https://clothingservice-05aa4e32edda.herokuapp.com/Clothesave", {
        ...data,
        id: newId,
      });

      alert("Data saved successfully!");
    } catch (apiError) {
      console.error("Error saving data: ", apiError);
      alert("Failed to save data.");
    }
  };

  return (
    <div>
      <form onSubmit={saveEmployees}>
        <input
          type="text"
          placeholder="Clothe name"
          value={clothe_Name}
          onChange={HandleClothe_Name}
          className="inputField"
        ></input>
        <input
          type="text"
          placeholder="Clothe_Description"
          value={clothe_Description}
          onChange={HandleClothe_Description}
          className="inputField"
        ></input>
        <input
          type="text"
          placeholder="Clothe_Quantity"
          value={clothe_Quantity}
          onChange={HandleClothe_Quantity}
          className="inputField"
        ></input>
        <input
          type="text"
          placeholder="Clothe_Price"
          value={clothe_Price}
          onChange={HandleClothe_Price}
          className="inputField"
        ></input>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange1}
          className="inputField"
        ></input>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange2}
          className="inputField"
        ></input>
        <p>
          {loading
            ? "Loading..."
            : error
            ? `Error: ${error.message}`
            : `Maximum ID: ${maxId !== null ? maxId : "No ID found"}`}
        </p>
        <button type="submit" className="inputField" >ADD TO STORE</button>
      </form>
    </div>
  );
};

export default Addclothe;
