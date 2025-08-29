"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { setSubServiceType, setStep, removeSubServiceType } from "@/redux/features/bookingSlice";
import { IoArrowBack } from "react-icons/io5";
import { FaCheck, FaPlus,  } from "react-icons/fa";
import { MdRemove } from "react-icons/md";
import Image from "next/image";
import { SubServiceType } from "@/redux/features/bookingSlice";
import Link from "next/link";


const manicures = [
  {
    id: "1",
    name: "Normal manicure",
    price: 10000,
    duration: '1hr 30mins',
    description: "A simple, clean, and elegant treatment that keeps your natural nails healthy and polished.",
    image: "/services/manicure.jpg",
  },
  {
    id: "2",
    name: "Acrylic manicure",
    price: 20000,
    duration: '1hr 30mins',
    description: "A simple, clean, and elegant treatment that keeps your natural nails healthy and polished.",
    image: "/services/manicure.jpg",
  },
  {
    id: "3",
    name: "French manicure",
    price: 7000,
    duration: '1hr 30mins',
    description: "Timeless elegance with crisp white tips and a glossy, sheer base.",
    image: "/services/pedicure.jpg",
  },
  {
    id: "4",
    name: "Gel manicure",
    price: 5000,
    duration: '1hr 30mins',
    description: "Long-lasting shine and chip-free finish for nails that stay flawless for weeks.",
    image: "/services/nails.jpg",
  },
  {
    id: "5",
    name: "American manicure",
    price: 7000,
    duration: '1hr 30mins',
    description: "Soft and natural with creamy tips and a nude base—perfect for an effortless, classy look.",
    image: "/services/nails.jpg",
  },
  {
    id: "5",
    name: "Baby Boomer (French Ombre)",
    duration: '1hr 30mins',
    price: 7000,
    description: "A modern ombré blend of pink and white for a subtle yet stunning effect.",
    image: "/services/nails.jpg",
  },
]



export default function ManicureStep() {
  const [activeSection, setActiveSection] = useState('');
  const dispatch = useAppDispatch();
  const { subServiceType } = useAppSelector((state) => state.booking);
  const handleBack = () => {
    dispatch(setStep(1));
  };

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const scrollContainer = document.querySelector(".scroll-container");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      })
    },
    {
      root: scrollContainer as Element | null,
      threshold: 0.3}
  )

  sections.forEach((section) => observer.observe(section));

  return () => {
    sections.forEach((section) => observer.unobserve(section));
  }
  }, [])

  function findService(id: string): boolean {
    return subServiceType.some(service => service.id === id);
  }

  const handleNext = () => {
    if (subServiceType) {
      dispatch(setStep(3));
    }
  };

  return (
    <div className="relative min-h-screen">

      <div className="flex justify-center py-1 items-center drop-shadow-xl shadow-sm rounded-md">
        <div className="flex font-semibold relative w-full justify-center space-x-16 px-2  items-center">
          <div className={activeSection === 'manicure' ? "px-5 py-2 text-white rounded-lg primary" : ''}>Manicure</div>
          <div className={activeSection === 'pedicure' ? "px-5 py-2 text-white rounded-lg primary" : ''}>Pedicure</div>
          <div className={activeSection === 'nail-polish' ? "px-5 py-2 text-white rounded-lg primary" : ''}>Nail Polish</div>
        </div>
      </div>

      <div className="mt-2 space-y-10 flex flex-col max-h-[500px] scroll-container overflow-y-auto pr-2">
        <section id="manicure">
          <h3 className="text-lg font-semibold mb-2">Manicure</h3>
          <div className="flex flex-col space-y-2">
            {manicures.map((service) => (
              <div
                key={service.id}
                className={`relative flex items-center p-1 rounded-lg overflow-hidden border-2 justify-between border-gray-200 transition-all
                  ${findService(service.id) ? "border-pink-500" : "border-gray-200 hover:border-pink-200"}`}
              >
                <div className="flex items-center">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={60}
                    height={60}
                    className="h-14 object-cover rounded-full"
                  />

                  <div className="p-3">
                    <h4 className="font-normal">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    <p className="text-sm text-gray-500 mt-4">{service.duration}</p>
                    <p className="font-normal mt-2">&#8358; {service.price.toLocaleString()}+</p>
                  </div>
                </div>

                {
                  findService(service.id) ? (
                    <div className="p-2" onClick={() => dispatch(removeSubServiceType(service.id))}>
                      <div className="w-6 h-6 primary rounded-md flex items-center justify-center">
                        <MdRemove className="w-5 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-2" onClick={() => dispatch(setSubServiceType(service))}>
                      <div className="w-6 h-6 primary rounded-md flex items-center justify-center">
                        <FaPlus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )
                }
              </div>
            ))}
          </div>
        </section>
                

        <section id="pedicure">
          <h3 className="text-lg font-semibold mb-2">Pedicure</h3>
          <div className="flex flex-col space-y-2">
            {manicures.map((service) => (
              <div
                key={service.id}
                className={`relative flex items-center p-1 rounded-lg overflow-hidden border-2 justify-between border-gray-200 transition-all
                  ${findService(service.id) ? "border-pink-500" : "border-gray-200 hover:border-pink-200"}`}
              >
                <div className="flex items-center">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={60}
                    height={60}
                    className="h-14 object-cover rounded-full"
                  />

                  <div className="p-3">
                    <h4 className="font-normal">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    <p className="text-sm text-gray-500 mt-4">{service.duration}</p>
                    <p className="font-normal mt-2">&#8358; {service.price.toLocaleString()}+</p>
                  </div>
                </div>

                {
                  findService(service.id) ? (
                    <div className="p-2" onClick={() => dispatch(removeSubServiceType(service.id))}>
                      <div className="w-6 h-6 primary rounded-md flex items-center justify-center">
                        <MdRemove className="w-5 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-2" onClick={() => dispatch(setSubServiceType(service))}>
                      <div className="w-6 h-6 primary rounded-md flex items-center justify-center">
                        <FaPlus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )
                }
              </div>
            ))}
          </div>
        </section>

        <section id="nail-polish">
          <h3 className="text-lg font-semibold mb-2">Nail Polish</h3>

          <div className="flex flex-col space-y-2">
            {manicures.map((service) => (
              <div
                key={service.id}
                className={`relative flex items-center p-1 rounded-lg overflow-hidden border-2 justify-between border-gray-200 transition-all
                  ${findService(service.id) ? "border-pink-500" : "border-gray-200 hover:border-pink-200"}`}
              >
                <div className="flex items-center">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={60}
                    height={60}
                    className="h-14 object-cover rounded-full"
                  />

                  <div className="p-3">
                    <h4 className="font-normal">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.description}</p>
                    <p className="text-sm text-gray-500 mt-4">{service.duration}</p>
                    <p className="font-normal mt-2">&#8358; {service.price.toLocaleString()}+</p>
                  </div>
                </div>

                {
                  findService(service.id) ? (
                    <div className="p-2" onClick={() => dispatch(removeSubServiceType(service.id))}>
                      <div className="w-6 h-6 primary rounded-md flex items-center justify-center">
                        <MdRemove className="w-5 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-2" onClick={() => dispatch(setSubServiceType(service))}>
                      <div className="w-6 h-6 primary rounded-md flex items-center justify-center">
                        <FaPlus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )
                }
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex relative mt-1.5 justify-between items-center">
        <div className="flex gap-2">
          <button onClick={handleBack}
          >
            <IoArrowBack className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={handleNext}
          disabled={subServiceType.length === 0}
          className="text-white px-5 py-2 rounded-lg primary flex justify-center disabled:cursor-not-allowed items-center-safe">
          Next
        </button>
      </div>
    </div>
  );
}