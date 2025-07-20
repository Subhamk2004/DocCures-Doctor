import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    email: '',
    phone: '',
    speciality:'',
    isAuthenticated: false,
    image: null,
    address: '',
    name: '',
    degree:'',
    xp:0,
    available:null,
    fees:0
};

export const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        logoutDoctor: (state) => {
            state.email = ''
            state.phone = ''
            state.image = null
            state.address = ''
            state.available = null
            state.fees = 0
            state.xp = 0
            state.degree = ''
            state.speciality = ''
            state.isAuthenticated = false
        },
        authenticate: (state, action) => {
            console.log(action.payload);
            state.email = action.payload.doctor.email
            state.name = action.payload.doctor.name
            state.phone = action.payload.doctor.phone
            state.image = action.payload.doctor.image
            state.address = action.payload.doctor.address
            state.available = action.payload.doctor.available
            state.degree = action.payload.doctor.degree
            state.xp = action.payload.doctor.xp
            state.fees = action.payload.doctor.fees
            state.speciality = action.payload.doctor.speciality
            state.isAuthenticated = true
        },
        updateDoctor: (state, action) => {
            console.log(action.payload);
            state.email = action.payload.email
            state.name = action.payload.name
            state.phone = action.payload.phone
            state.image = action.payload.image
            state.address = action.payload.address
            state.available = action.payload.available
            state.degree = action.payload.degree
            state.xp = action.payload.xp
            state.fees = action.payload.fees
            state.speciality = action.payload.speciality
            state.isAuthenticated = true
        },
        setDisplayAlert: (state, action) => {
            console.log(action.payload);
            state.displayAlert = action.payload
        },
        clearAppointments:(state, action) => {
            console.log('clearing');
            
        }
    }
})

export const { logoutDoctor, authenticate, setDisplayAlert, updateDoctor, clearAppointments } = doctorSlice.actions;
let doctorReducer = doctorSlice.reducer;
export default doctorReducer;