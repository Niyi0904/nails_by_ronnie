import React, { useState } from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import SearchBox from "./mapSerchBox";
import { setLocation } from "@/redux/features/bookingSlice";
import { useAppDispatch } from "@/hooks/useReduxHook";


const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128, // New York City Latitude
  lng: -74.0060, // New York City Longitude
};

interface GoogleMapProps {
  apiKey: string;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = () => {
  const [center, setCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const dispatch = useAppDispatch();

  return (
    <div className="relative w-full">
      <LoadScriptNext googleMapsApiKey='' libraries={["places"]}>
        <div className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <input
              type="text"
              onChange={(e) => dispatch(setLocation(e.target.value))}
              className="pl-9 w-full md:w-[300px]"

            />
          </div>

          <div className="relative h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
              <Marker position={markerPosition} />
            </GoogleMap>
          </div>
        </div>
      </LoadScriptNext>
    </div>
  );
};

export default GoogleMapComponent;
