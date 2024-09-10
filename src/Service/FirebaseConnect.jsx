// import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import axios from 'axios';

const firebaseConfig = {
  apiKey: "AIzaSyDQerTEizK1m700I_0mRFruifDzxHkfuLQ",
  authDomain: "allstockimages-6340a.firebaseapp.com",
  projectId: "allstockimages-6340a",
  storageBucket: "allstockimages-6340a.appspot.com",
  messagingSenderId: "802831554734",
  appId: "1:802831554734:web:0f8913c5779117223d353f",
  measurementId: "G-DYZB5S99P2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };