import Clothecard from "../Components/ClotheCard";
import { useLocation } from "react-router-dom";


function ClotheMenu() {
  const location = useLocation();
  const username = location.state?.username; 

  console.log(username);

  return (
    <div>
       <div className="message_box">
        <img src="./src/images/Chat Bubble.png" alt="Chat Bubble" />
      </div>
      <Clothecard />
    </div>
  );
}

export default ClotheMenu;
