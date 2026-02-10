"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook"
import { setServiceType } from "@/redux/features/bookingSlice"
import { FaInfoCircle, FaMapMarkerAlt, FaHome, FaChevronRight } from "react-icons/fa";
import Image from "next/image"

const locations = [
  {
    id: "home",
    name: "Home Service",
    type: "home",
    image: "/services/manicure.jpg",
    description: "I'll come to your doorstep with all necessary equipment.",
    note: 'Additional fee may apply based on your distance'
  },
  {
    id: "ikeja",
    name: "Ikeja Plaza Studio",
    type: "onsite",
    location: "No 29B, Afolabi Aina, Ikeja Lagos",
    image: "/services/pedicure.jpg",
    description: "Visit our main studio for a full pampering experience.",
  },
  {
    id: "magodo",
    name: "Magodo Branch",
    type: "onsite",
    location: "No 64, Adekunle Banjo Magodo",
    image: "/services/nails.jpg",
    description: "A cozy, private space for your nail artistry.",
  },
]

export default function ServiceTypeStep() {
  const dispatch = useAppDispatch()
  const { serviceType } = useAppSelector((state) => state.booking)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#1c1c1c] dark:text-white mb-2">
          Select Location
        </h3>
        <p className="text-gray-500 text-sm">
          Where would you like Ronnie to work her magic today?
        </p>
      </div>

      <div className="space-y-4">
        {locations.map((item) => {
          const isSelected = serviceType === item.name;

          return (
            <div
              key={item.id}
              onClick={() => dispatch(setServiceType(item.name))}
              className={`group relative flex items-center p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 
                ${isSelected 
                  ? "border-[#D77A8B] bg-pink-50/30 dark:bg-[#D77A8B]/5 shadow-md" 
                  : "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] hover:border-[#D77A8B]/30"}`}
            >
              {/* Image Thumbnail */}
              <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2">
                  {item.type === 'home' ? (
                    <FaHome className="text-[#D77A8B] text-sm" />
                  ) : (
                    <FaMapMarkerAlt className="text-[#D77A8B] text-sm" />
                  )}
                  <h4 className="font-bold text-[#1c1c1c] dark:text-white">
                    {item.name}
                  </h4>
                </div>
                
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {item.location || item.description}
                </p>

                {item.note && (
                  <div className="flex mt-2 items-center gap-1.5 text-[#943F54]">
                    <FaInfoCircle size={10} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {item.note}
                    </p>
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all
                ${isSelected ? "bg-[#943F54] text-white rotate-0" : "bg-gray-50 dark:bg-gray-800 text-gray-300 -rotate-90 opacity-0 group-hover:opacity-100"}`}>
                <FaChevronRight size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Badge */}
      <div className="mt-10 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
           <FaChevronRight className="rotate-90 text-[10px]"/>
        </div>
        <p className="text-[11px] text-gray-400 leading-tight">
          All locations follow strict hygiene protocols. Tools are sterilized after every single session.
        </p>
      </div>
    </div>
  )
}