import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Footer from "./Components/Footer";
import ClotheMenu from "./Pages/ClotheMenu";
import UserAccount from "./Pages/UserAccount";
import Navbar from "./Components/Navbar";
import Favoritepage from "./Pages/Favoritepage";
import OrderHistoryPage from "./Pages/OrderHistoryPage.jsx";
import "./index.css";
import OrderPage from "./Pages/OrderPage.jsx";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ClotheMenu" element={<ClotheMenu />} />
            <Route path="/favorite" element={<Favoritepage />} />
            <Route path="/Useraccount" element={<UserAccount />} />
            <Route path="/orderhistory" element={<OrderHistoryPage />} />
            <Route path="/orderpage/:id" element={<OrderPage />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
