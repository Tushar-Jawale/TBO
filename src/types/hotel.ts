export interface Hotel {
  hotel_code: string;
  CityID: string;
  Name: string;
  StarRating: number;
  Address: string;
  Facilities: string[]; // JSON in backend, parsed to array here
  ImageUrls: string[]; // JSON in backend, parsed to array here
  Occupancy: number;
}

export interface RoomOffer {
  ID: string;
  HotelID: string;
  Name: string;
  BookingCode: string;
  MaxCapacity: number;
  TotalFare: number;
  Currency: string;
  IsRefundable: boolean;
  CancelPolicies: any; // JSON
  Count: number;
}

export interface BanquetHall {
  ID: number;
  HotelID: string;
  Name: string;
  Capacity: number;
  PricePerDay: number;
  ImageUrls: string[]; // JSON in backend
}

export interface CateringMenu {
  ID: number;
  HotelID: string;
  Name: string;
  Type: string;
  PricePerPlate: number;
  ImageUrls: string[]; // JSON in backend
}

export interface HotelResponse {
    status: string;
    count: number;
    data: Hotel[];
}

export interface RoomResponse {
    status: string;
    count: number;
    data: RoomOffer[];
}
