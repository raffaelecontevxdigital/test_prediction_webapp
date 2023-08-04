import React from "react";
import { AuthContext } from "../App";

export function useAuth() {
    return React.useContext(AuthContext);
  }