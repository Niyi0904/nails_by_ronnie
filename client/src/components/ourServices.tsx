"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    type: "Manicure",
    src: "/services/manicure.jpg",
    description: "Expert grooming, precise shaping, and flawless polish application.",
  },
  {
    id: 2,
    type: "Pedicure",
    src: "/services/pedicure.jpg",
    description: "Rejuvenating treatments with exfoliation and relaxing massage.",
  },
  {
    id: 3,
    type: "Custom Nails",
    src: "/services/nails.jpg",
    description: "Bespoke nail art and extensions crafted with premium products.",
  }
];

export default function OurServices() {
  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[#D77A8B] font-bold tracking-widest uppercase text-xs mb-1">Menu</h2>
          <h1 className="text-3xl font-bold dark:text-white">Our Services</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800"
            >
              {/* Shorter Image Aspect Ratio (Video style 16:9) */}
              <div className="relative w-full aspect-video overflow-hidden">
                <Image
                  src={service.src}
                  fill
                  alt={service.type}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Compact Text Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 dark:text-white group-hover:text-[#D77A8B] transition-colors">
                  {service.type}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}