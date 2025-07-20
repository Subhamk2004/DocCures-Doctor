import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "../redux/AppointmentSlice.mjs";
import doctorReducer from "../redux/DoctorSlice.mjs";

export const Store = configureStore({
  reducer: {
    doctor: doctorReducer,
    appointments: appointmentsReducer
  }
});