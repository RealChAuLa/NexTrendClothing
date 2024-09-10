import React, { useState } from "react";
import UserCreatingAc from "../Components/UserCreateAc";
import Userlogging from "../Components/UserLogging";

function UserAccount() {
  const [step, setStep] = useState(1);

  const MoveToCraeteAC = () => {
    setStep(step + 1);
  };

  const MoveToLogin = () => {
    setStep(step - 1);
  };
  return (
    <div>
      {step === 1 && (
        <div>
          <Userlogging />
          <button
            onClick={MoveToCraeteAC}
            style={{
              marginLeft: "630px",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              opacity: "0.6",
              marginBottom: "70px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Creat Account
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <UserCreatingAc />
          <button
            onClick={MoveToLogin}
            style={{
              marginLeft: "630px",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              opacity: "0.6",
              cursor: "pointer",
              marginTop: "-40px",
            }}
          >
            login here
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAccount;
