import React from "react";

const authData = {
  signedIn: false,
  access_token: null
};

export default React.createContext({authData: {...authData}, setAuthData: (val) => {}});
