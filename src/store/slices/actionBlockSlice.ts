import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ActionBlockState {
  buildingName: string;
  managerName: string;
  managerPhone: string;
  status: string;
  apartments: {
    roomName: string;
    type: string;
    area: number;
    floor: number;
  }[];
  totalFloors: number;
  apartmentsPerFloor: number;
  areasPerApartment: number;
  typesOfApartment: string;
}

const initialState: ActionBlockState = {
  buildingName: "",
  managerName: "",
  managerPhone: "",
  status: "",
  apartments: [],
  //
  totalFloors: 1,
  apartmentsPerFloor: 1,
  areasPerApartment: 1,
  typesOfApartment: "",
};

const actionBlockSlice = createSlice({
  name: "actionBlock",
  initialState,
  reducers: {
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    handleStepOne: (
      state,
      action: PayloadAction<{
        buildingName: string;
        managerName: string;
        managerPhone: string;
        status: string;
        totalFloors: number;
        apartmentsPerFloor: number;
        areasPerApartment: number;
        typesOfApartment: string;
      }>,
    ) => {
      state.buildingName = action.payload.buildingName;
      state.managerName = action.payload.managerName;
      state.managerPhone = action.payload.managerPhone;
      state.status = action.payload.status;
      state.totalFloors = action.payload.totalFloors;
      state.apartmentsPerFloor = action.payload.apartmentsPerFloor;
      state.areasPerApartment = action.payload.areasPerApartment;
      state.typesOfApartment = action.payload.typesOfApartment;
    },
    handleStepTwo: (
      state,
      action: PayloadAction<{ apartments: ActionBlockState["apartments"] }>,
    ) => {
      state.apartments = action.payload.apartments;
    },
  },
});

export const { handleStepOne, handleStepTwo } = actionBlockSlice.actions;
export default actionBlockSlice.reducer;
