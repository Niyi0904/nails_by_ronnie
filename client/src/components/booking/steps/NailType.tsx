"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setSubServiceType, setStep } from "@/redux/features/bookingSlice";
import { IoArrowBack } from "react-icons/io5";
import {FaCheck } from "react-icons/fa";
import Image from "next/image";


const nails = [
  {
    id: "1",
    name: "Normal manicure",
    price: 1000,
    image: "/services/manicure.jpg",
  },
  {
    id: "2",
    name: "Acrylic manicure",
    price: 1000,
    image: "/services/manicure.jpg",
  },
  {
    id: "3",
    name: "French manicure",
    price: 2000,
    image: "/services/pedicure.jpg",
  },
  {
    id: "4",
    name: "Gel manicure",
    price: 3000,
    image: "/services/nails.jpg",
  },
  {
    id: "5",
    name: "American manicure",
    price: 4000,
    image: "/services/nails.jpg",
  },
]


export default function Nailstep() {
  const dispatch = useAppDispatch();
  const { subServiceType } = useAppSelector((state) => state.booking);
  const handleBack = () => {
    dispatch(setStep(1));
  };

  const handleNext = () => {
    if (subServiceType) {
      dispatch(setStep(3));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Type Of Nails polish</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {nails.map((service) => (
          <div
            key={service.id}
            onClick={() => dispatch(setSubServiceType(service))}
            className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all
              ${subServiceType?.id === service.id ? "border-pink-500" : "border-transparent hover:border-pink-200"}`}
          >
            <Image
              src={service.image}
              alt={service.name}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            {subServiceType?.id === service.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <FaCheck className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="p-3">
              <h4 className="font-medium">{service.name}</h4>
              <p className="text-sm text-gray-600">&#8358;{service.price.toLocaleString()}+</p>
            </div>
          </div>
        ))}
      </div>
              

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button onClick={handleBack}
          >
            <IoArrowBack className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleNext}
          disabled={!subServiceType}
          className="text-white px-5 py-2 rounded-lg primary flex justify-center disabled:cursor-not-allowed items-center-safe">
          Next
        </button>
      </div>
    </div>
  );
}