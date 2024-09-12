import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewArrivalsCard from "../Components/NewArrivalscard";
import BestSalescard from "../Components/BestSalescard.jsx";
import "./HomePage.css";
function HomePage() {
  const navigate = useNavigate();
  //
  const [isVisible, setIsVisible] = useState(false);
  const teeSoonRef = useRef(null);

  const GotoClothmenu = () => {
    navigate("/ClotheMenu");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (teeSoonRef.current) {
      observer.observe(teeSoonRef.current);
    }

    return () => {
      if (teeSoonRef.current) {
        observer.unobserve(teeSoonRef.current);
      }
    };
  }, []);

  //

  return (
    <div>
      <div className="message_box">
        <img src="./src/images/Chat Bubble.png" alt="Chat Bubble" />
      </div>
      {/* header-section */}

      <div className="header-section">
        <h1 className="head-section-title">Essential Gear</h1>
        <button
          className="header-section-shopNow-button"
          onClick={GotoClothmenu}
        >
          SHOP NOW
        </button>
        <img
          src="./src/images/banner-2.webp"
          className="header-section-banner"
        />
      </div>

      <h3 className="section-title">NEW ARRIVALS</h3>
      <h5 className="section-desciption">
        Shop the Latest Styles: Stay ahead of the curve with our newest arrivals
      </h5>

      <NewArrivalsCard />

      <div className="tee-section" ref={teeSoonRef}>
        <div className="tee-image-container">
          <img
            src="./src/images/Artboard1_750x.png.webp"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          />
        </div>
        <div className="tee-text">
          <h1
            className="transperent-text"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          >
            DROPPING SOON.
          </h1>
          <h1
            className="transperent-text"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          >
            DROPPING SOON.
          </h1>
          <h1
            className="colored-text"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          >
            DROPPING SOON.
          </h1>
        </div>
        <div className="tee-details">
          <div className="tee-image-small">
            <img
              src="./src/images/Artboard4_750x.png (1).webp"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            />
          </div>
        </div>
        <div className="tee-collection-bar">
          <div className="tee-collection-bar-image">
            <img
              src="./src/images/5D4_2757copy_750x.webp"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            />
          </div>
        </div>
        <div></div>
      </div>

      <h3 className="section-title">BEST SELLERS</h3>
      <h5 className="section-desciption">
        Shop the best sellers: Stay ahead of the curve with our best sellers
      </h5>

       <BestSalescard />
{/* 
      <div>
      <img src="./src/images/END.jpg" className="ending-img"/>
      </div> */}

      <h1 className="customer_heardername">AS SEEN ON YOU</h1>
      <h5 className="customer_heaederdec">
        Show us how you #LiveinLevis #metofashon @NexTrend.OnInsta
      </h5>

      <div className="customer_imagebar">
        <div className="Onecustomer_imagedive">
          <i class="fa-brands fa-instagram"></i>
          <img src="./src/images/insta5.jpg" />
        </div>

        <div className="Onecustomer_imagedive">
          <i class="fa-brands fa-instagram"></i>
          <img src="./src/images/insta3.jpg" />
        </div>

        <div className="Onecustomer_imagedive">
          <i class="fa-brands fa-instagram"></i>
          <img src="./src/images/instaim1.webp" />
        </div>

        <div className="Onecustomer_imagedive">
          <i class="fa-brands fa-instagram"></i>
          <img src="./src/images/images (11).jpg" />
        </div>

        <div className="Onecustomer_imagedive">
          <i class="fa-brands fa-instagram"></i>
          <img src="./src/images/16_n.jpg" />
        </div>

        <div className="Onecustomer_imagedive">
          <i class="fa-brands fa-instagram"></i>
          <img src="./src/images/image34.webp" />
        </div>
      </div>

      {/* <div className="brandSaleImage">
        <div className="contentUnder_sale">
          <h1>SHOP LATEST</h1>
          <h3>HAND CUT | SLIDES | TEEE | FREE SIZE | AND MORE ..</h3>

          <button className="shop_butonUnderSale" onClick={GotoClothmenu}>
            SHOP NOW
            <img src="./src/images/Forwardblack.png" />
          </button>
        </div>
        <div>
          <img src="./src/images/WhatsApp_Image_2024-01-28_at_14.29.17_900x.webp" />
        </div>
      </div>

       <div className="brand_flexibility">
        <div className="delivery_container">
          <img src="./src/images/Delivery Scooter.png" />
          <h2>Cash On Delivery</h2>
          <h5>Island-wide cash on delivery available</h5>
        </div>
        <div className="delivery_container">
          <img src="../src/images/Card Security.png" />
          <h2>Flexible Payment</h2>
          <h5>Pay installments with Mintpay available</h5>
        </div>
        <div className="delivery_container">
          <img src="./src/images/Previous Location.png" />
          <h2>7 Day Returns</h2>
          <h5>Within 7 days for an exchange available</h5>
        </div>
        <div className="delivery_container">
          <img src="./src/images/Headset.png" />
          <h2>Premium Support</h2>
          <h5>Outstanding premium support available</h5>
        </div>
      </div> */}
    </div>
  );
}

export default HomePage;
