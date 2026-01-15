export interface Apartment {
  id: number;
  roomName: string;
  type: string;
  block: string;
  floor: number;
  area: string;
  owner: string;
  status: string;
}
export interface ApartmentDetail {
  generalInfo: {
    apartmentName: string;
    building: string;
    floor: number;
    area: string;
    type: string;
    status: string;
  };
  owner: {
    fullName: string;
    phone: string;
    identityCard: string;
  };
  residents: {
    id: number;
    fullName: string;
    gender: string;
    phone: string;
    relationship: string;
  }[];
}
