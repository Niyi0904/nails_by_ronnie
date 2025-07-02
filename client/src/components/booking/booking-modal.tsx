"use client";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { closeModal } from "@/redux/features/bookingSlice";
import ServiceTypeStep from "./steps/service-type-step";
import { MdOutlineCancel } from "react-icons/md";
import ManicureStep from "./steps/manicureType";
import PedicureStep from "./steps/pedicureType";
import NotesStep from "./steps/notes-step";
import LocationStep from "./steps/location-step";
import BookingPreview from "./booking-preview";
import Nailstep from "./steps/NailType";


const DateStep = dynamic(() => import('./steps/date-step'), {
  ssr: false,
})
const TimeStep = dynamic(() => import("./steps/time-step"), {
  ssr: false,
});

export default function BookingModal() {
  const dispatch = useAppDispatch();
  const { isModalOpen, step, serviceType } = useAppSelector((state) => state.booking);

  if (!isModalOpen) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ServiceTypeStep />;
      case 2:
        if(serviceType?.name === 'Manicure') {
          return <ManicureStep/>
        } else if (serviceType?.name === 'Pedicure') {
          return <PedicureStep/>
        } else if (serviceType?.name === 'Nail Polish') {
          return <Nailstep/>
        }
      case 3:
        return <DateStep />;
      case 4:
        return <TimeStep />;
      case 5:
        return <LocationStep/>
      case 6: 
        return <NotesStep/>;
      case 7: 
        return <BookingPreview/>;
      default:
        return <ServiceTypeStep />;
    }
  };

 
  const showHeader = step < 7;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FCE4EC] dark:bg-[#1E1B23] shadow-2xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.6), 0 50px 100px -20px rgba(0, 0, 0, 0.4)' }}>
        {showHeader && (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Book a New Service</h2>
              <button
                onClick={() => dispatch(closeModal())}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdOutlineCancel className=" h-6 w-6"/>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {renderStep()}
            </div>
          </>
        )}

        {!showHeader && (
          <div className="p-6 flex-1 overflow-y-auto">{renderStep()}</div>
        )}
      </div>
    </div>
  );
}
