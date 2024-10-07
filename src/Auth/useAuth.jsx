import React, { createContext, useContext, useState } from "react";
import { Ability } from "@casl/ability";
import { defineRulesFor } from "./ability";
import { useStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useStorage("use", null);

  const login = (userData) => {
    const ability = new Ability(defineRulesFor(userData));
    setUser({ ...userData, ability });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
