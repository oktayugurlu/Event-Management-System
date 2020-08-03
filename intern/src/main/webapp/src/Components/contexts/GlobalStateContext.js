
import React from "react";

export const GlobalStateContext = React.createContext({
    createdEvents:[],
    setCreatedEvents: ()=>{}
});