"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setLocation, setStep } from "@/redux/features/bookingSlice";

import { IoArrowBack} from "react-icons/io5";

import GoogleMapComponent from "@/components/goggleMap";


export default function LocationStep() {
  const dispatch = useAppDispatch();
  const { subServiceType, location } = useAppSelector((state) => state.booking);
  const handleBack = () => {
    dispatch(setStep(4));
  };

  const handleNext = () => {
    if (location) {
      dispatch(setStep(6));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLocation(e.target.value));
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Choose Location</h3>

      {/* <div>
        <GoogleMapComponent/>
      </div> */}

      <div>
        <input
          type='text'
          value={location}
          onChange={handleChange}
          placeholder="Input your Location"
          className="w-full h-14 mb-4 focus:ring-1 focus:ring-pink-400 border px-5 rounded-xl border-pink-400"
        />
      </div>
              

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={handleBack}>
            <IoArrowBack className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleNext}
          disabled={!location}
          className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#D77A8B] flex justify-center disabled:cursor-not-allowed items-center-safe hover:text-white bg-[#943F54] dark:bg-[#943F54] dark:hover:bg-[#D77A8B]"
        >
          Next
        </button>
      </div>
    </div>
  );
}