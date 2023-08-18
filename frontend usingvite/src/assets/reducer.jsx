import React, { useReducer, useContext } from "react";

const initialState = undefined;

const reducer = (state, action) => {
    if (action.type === "USERSDATA") {
        return action.payload;
    }
    return state;
};


const AppContext = React.createContext();
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log({ state: state });

    return <AppContext.Provider value={{ state, dispatch }}>
        {children}
    </AppContext.Provider>;
};

export const useGlobalData = () => {
    return useContext(AppContext);
};


/**
 * 
 * 
name : "Sameep"
password : "123"
cpassword : "123"
number : 1234567891
email : "sameep@gmail.com"
 */

