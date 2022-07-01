import React from "react";
export const SignupContext = React.createContext();

const SignupProvider = ({ children }) => {
  const [signupData, setSignupData] = React.useState(null);
  return (
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};

export default SignupProvider;
