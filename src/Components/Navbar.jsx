import { useState, useEffect } from "react";
import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const USERNAME = sessionStorage.getItem("username");
  const [favCount, setFavCount] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (USERNAME) {
      // Navigate to /favorite if username is found
      navigate("/favorite");
    } else {
      // Navigate to /Useraccount if not found
      navigate("/Useraccount");
    }
  };

  const handleNavigation2 = () => {
    if (USERNAME) {
      // Navigate to /favorite if username is found
      navigate("/OrderHistory");
    } else {
      // Navigate to /Useraccount if not found
      navigate("/Useraccount");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://userservice-b9cca56d6d11.herokuapp.com/usernameFavCount",
          {
            params: {
              username: USERNAME,
            },
          }
        );
        console.log("API Response:", response.data);
        setFavCount(response.data);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };

    fetchData();

    const checkForRefresh = () => {
      const refreshFlag = localStorage.getItem("refreshFavCount");
      if (refreshFlag) {
        fetchData();
        localStorage.removeItem("refreshFavCount");
      }
    };

    const interval = setInterval(checkForRefresh, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="">
      <nav className="nav">
        <span className="logo">NEXTREND</span>
        <ul className="nav-features">
          <li className="activeTab">
            <a href="" onClick={() => navigate("/")}>
              HOME
            </a>
          </li>
          <li>
            <a href="" onClick={() => navigate("/ClotheMenu")}>
              MENU
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handleNavigation()}>
              WISHLIST
            </a>
          </li>
        </ul>

        <div className="fav_section">
          <div
            style={{
              position: "absolute",
              marginLeft: "12px",
              alignItems: "center",
              width: "20px",
              height: "20px",
              backgroundColor: "#49ccf5",
              borderRadius: "50%",
            }}
          >
            <h5
              style={{
                marginLeft: "6px",
                marginTop: "2px",
                fontFamily: "sans-serif",
                color: "white",
              }}
            >
              {favCount}
            </h5>
          </div>
          <div>
            <i
              className="fa-regular fa-heart"
              onClick={() => handleNavigation()}
            ></i>
          </div>
          <i
            className="fa-regular fa-user"
            onClick={() => handleNavigation2()}
          ></i>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
