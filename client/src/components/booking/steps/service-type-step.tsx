"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook"
import { setServiceType, setStep } from "@/redux/features/bookingSlice"
import { FaBackward, FaForward, FaCheck } from "react-icons/fa";
import { closeModal } from "@/redux/features/bookingSlice";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import Image from "next/image"

const services = [
  {
    id: "1",
    name: "Manicure",
    price: 5000,
    image: "/services/manicure.jpg",
  },
  {
    id: "2",
    name: "Pedicure",
    price: 3000,
    image: "/services/pedicure.jpg",
  },
  {
    id: "3",
    name: "Nail Polish",
    price: 3000,
    image: "/services/nails.jpg",
  },
]

export default function ServiceTypeStep() {
  const dispatch = useAppDispatch()
  const { serviceType } = useAppSelector((state) => state.booking)

  const handleNext = () => {
    if (serviceType) {
      dispatch(setStep(2))
    }
  }


  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Choose Type Of Service </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => dispatch(setServiceType(service))}
            className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all text-center
              ${serviceType?.id === service.id ? "border-pink-500" : "border-transparent hover:border-gray-200"}`}
          >
            <Image
              src={service.image}
              alt={service.name}
              width={300}
              height={200}
              className="w-full rounded-b-lg h-40 object-cover"
            />
            {serviceType?.id === service.id && (
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
          <button onClick={() => dispatch(closeModal())}
          >
            <IoArrowBack className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleNext}
          disabled={!serviceType}
          className="text-white dark:text-[#F2F2F2] px-5 py-2 rounded-lg hover:bg-[#D77A8B] flex justify-center items-center-safe hover:text-white bg-[#943F54] dark:bg-[#943F54] dark:hover:bg-[#D77A8B]"        >
          Next
        </button>
      </div>
    </div>
  )
}

