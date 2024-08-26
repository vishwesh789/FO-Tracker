export interface LatLong {
  latitude: number;
  longitude: number;
}

export interface Location extends LatLong {
  heading: number | null;
}



export interface DealerLocation extends LatLong {
  id: number;
  checkedIn: boolean;
  isVisited: boolean;
  checkInTime: string;
  checkOutTime: string;
  isReadyForCheckout: boolean;
}

export type FoJourney = {
  date: string;
  dealers: DealerLocation[];
  locations: Location[];
  clockIn: string;
  clockOut: string;
};
