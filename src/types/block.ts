interface Block {
  id: number;
  buildingName: string;
  status: string;
  totalFloors: number;
  managerName: string;
  managerPhone: string;
  totalRooms: number;
  roomDetails: {
    studio: number;
    oneBedroom: number;
    twoBedroom: number;
    penthouse: number;
  };
}
export type { Block };
