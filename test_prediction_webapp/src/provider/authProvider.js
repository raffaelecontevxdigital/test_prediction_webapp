import React, { useState } from "react";
import { AuthContext } from "../App";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setuser] = useState(null);
  const [role, setRole] = useState(null);

  let signin = async (newUser, callback) => {
    setuser(newUser.username)
    setToken(localStorage.getItem('token'));
    setRole(JSON.parse(localStorage.getItem('user'))?.role);
    return callback()
  };

  let signout = (callback) => {
    setToken(null)
    setuser(null)
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    return callback()
  };

  let value = { token, signin, signout, user, role };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}