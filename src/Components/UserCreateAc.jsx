import { useState } from "react";
import axios from "axios";
import "./userCreateAc.css";

function UserCreatingAc() {
  const [c_username, Set_username] = useState("");
  const [c_password, set_password] = useState("");
  const [c_email, set_email] = useState("");
  const [c_address, set_address] = useState("");

  const handleuser_name = (event) => Set_username(event.target.value);
  const handle_password = (event) => set_password(event.target.value);
  const handle_email = (event) => set_email(event.target.value);
  const handle_address = (event) => set_address(event.target.value);

  const saveuserdetails = async (event) => {
    event.preventDefault();

    if (!c_username || !c_password || !c_email || !c_address) {
      alert("evrey field must be filled");
      return;
    }

    const data = {
      c_username,
      c_password,
      c_email,
      c_address,
    };
    console.log(data);

    try {
      const response = await axios.post("https://userservice-b9cca56d6d11.herokuapp.com/saveUser", data);
      alert("user saved suucefully");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("User with this username already exists");
      } else {
        alert("Error creating user");
        console.error(error);
      }
    }
  };

  return (
    <div className="createacc-form">
      <form onSubmit={saveuserdetails} className="form_userRegister">
        <input
          type="text"
          value={c_username}
          name="user_name"
          placeholder="USER NAME"
          onChange={handleuser_name}
          className="userloginsField"
        ></input>
        <input
          type="password"
          value={c_password}
          placeholder="PASSWORD"
          onChange={handle_password}
          className="userloginsField"
        ></input>
        <input
          type="email"
          value={c_email}
          placeholder="EMAIL"
          onChange={handle_email}
          className="userloginsField"
        ></input>
        <input
          type="text"
          placeholder="STREET ADDRESS"
          value={c_address}
          onChange={handle_address}
          className="userloginsField"
        ></input>
        <button type="submit" className="CREATE_button">
          REGISTER
        </button>
        <h3>IF register before?</h3>
      </form>
    </div>
  );
}

export default UserCreatingAc;
