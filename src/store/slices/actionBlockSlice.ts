import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ActionBlockState {
  buildingName: string;
  managerName: string;
  managerPhone: string;
  status: string;
  apartments: {
    id?: number;
    roomName: string;
    type: string;
    area: number;
    floor: number;
  }[];
  totalFloors: number;
  apartmentsPerFloor: number;
  areasPerApartment: number;
  typesOfApartment: string;
  hasResidents: boolean;
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
  hasResidents: false,
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
      const totalFloors = action.payload.apartments.reduce(
        (max, apt) => Math.max(max, apt.floor),
        0,
      );
      state.totalFloors = totalFloors;
      state.apartments = action.payload.apartments;
    },
    handleStepThree: (state) => {
      (state.apartments = []),
        (state.buildingName = ""),
        (state.managerName = ""),
        (state.managerPhone = ""),
        (state.status = ""),
        (state.totalFloors = 1),
        (state.apartmentsPerFloor = 1),
        (state.areasPerApartment = 1),
        (state.typesOfApartment = ""),
        (state.hasResidents = false);
    },
    setHasResidents: (state, action: PayloadAction<boolean>) => {
      state.hasResidents = action.payload;
    },
    initializeUpdateBlock: (
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
        apartments: ActionBlockState["apartments"];
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
      state.apartments = action.payload.apartments;
    },
  },
});

export const {
  handleStepOne,
  handleStepTwo,
  handleStepThree,
  setHasResidents,
  initializeUpdateBlock,
} = actionBlockSlice.actions;
export default actionBlockSlice.reducer;
