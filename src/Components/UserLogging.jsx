import { useState } from "react";
import axios from "axios"; 
import "./Userlogging.css";



function Userlogging() {
  const [c_username, setUsername] = useState("");
  const [c_password, setPassword] = useState("");

  const handleUserName = (event) => setUsername(event.target.value); 
  const handlePassword = (event) => setPassword(event.target.value); 

  const userLoginSubmit = async (event) => { 
    event.preventDefault();

    const data = {
      c_username,
      c_password,
    };

    console.log(data);

    try {
      const response = await axios.post("https://userservice-b9cca56d6d11.herokuapp.com/login", data);

      // If login is successful, the API returns the username
      const username = response.data;

      // Save the username into sessionStorage
      sessionStorage.setItem("username", username);

      alert("Login successful");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid username or password");
      } else {
        alert("Network error");
        console.error(error);
      }
    }

  };

  return (
    <div className="user-logging">
      <form className="form_userLoging" onSubmit={userLoginSubmit} autocomplete="off">
        <input
          type="text"
          value={c_username}
          name="user_name"
          placeholder="USER NAME"
          onChange={handleUserName}
          className="userloginsField"
        />
        <input
          type="password"
          value={c_password}
          placeholder="PASSWORD"
          onChange={handlePassword}
          className="userloginsField"
        />
        <button type="submit" className="CREATE_button">
          LOGIN
        </button>
        <h3>Don't have an account?</h3>
      </form>
    </div>
  );

};



export default Userlogging;
