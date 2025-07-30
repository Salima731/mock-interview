import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./usersSlice";
import eventReducer from "./eventSlice";

const store = configureStore({
    reducer:{
        usersState:userReducer,
        eventState: eventReducer
    }
})

export default store;