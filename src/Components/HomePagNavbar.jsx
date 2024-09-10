// import React, { useState, useEffect } from "react";
// import "./homepagenavbar.css";

// const HomepageNavbar = () => {
//   const [bgColor, setBgColor] = useState("transparent");
//   const [fontcolor, SetFontcolor] = useState("black");

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 100) {
//         setBgColor("#111111");
//         SetFontcolor("white");
//       } else {
//         setBgColor("transparent");
//         SetFontcolor("black");
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//     <div className="homepage_nav">
//       <nav
//         className="nav"
//         style={{
//           backgroundColor: bgColor,
//           transition: "background-color 0.3s ease",
//           color: fontcolor,
//           a: fontcolor,
//         }}
//       >
//         <span className="logo">LOGO</span>
//         <ul className="nav-features">
//           <li className="activeTab">
//             <a href="" style={{ color: fontcolor, fontSize: "18px" }}>
//               HOME
//             </a>
//           </li>
//           <li>
//             <a href="" style={{ color: fontcolor, fontSize: "18px" }}>
//               MENU
//             </a>
//           </li>
//           <li>
//             <a href="" style={{ color: fontcolor, fontSize: "18px" }}>
//               CART
//             </a>
//           </li>
//           <li>
//             <a href="" style={{ color: fontcolor, fontSize: "18px" }}>
//               CATEGORIES
//             </a>
//           </li>
//         </ul>
//         <div className="fav_section">
//           <i style={{ color: fontcolor }} class="fa-regular fa-heart"></i>
//           <i style={{ color: fontcolor }} class="fa-solid fa-cart-shopping"></i>
//           <i style={{ color: fontcolor }} class="fa-regular fa-user"></i>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default HomepageNavbar;
