import Image from "next/image";
import {motion} from 'framer-motion';

type services= {
    id: number,
  type: string;
  src: string;
  alt: string;
  description: string;
};

const Services: services[] = [
    {
      id: 1,
      type: 'Manicure',
      src: '/services/manicure.jpg',
      alt: 'manicure service image',
      description: 'Experience expert manicure services tailored to enhance the natural beauty of your hands. From classic nail grooming to luxurious treatments, we provide precise shaping, gentle cuticle care, and flawless polish application — all delivered in a clean, relaxing environment. Your hands deserve the best.',
    },
  {
    id: 2,
    type: 'Pedicure',
    src: '/services/pedicure.jpg',
    alt: 'pedicure service image',
    description: 'Indulge in premium pedicure treatments designed to refresh and rejuvenate your feet. Our service includes deep cleansing, nail trimming, cuticle care, exfoliation, and a relaxing massage — all finished with a smooth, polished look. Step out with confidence and comfort, every time.',
  },
  {
    id: 3,
    type: "Nails",
    src: '/services/nails.jpg',
    alt: 'nails service image',
    description: 'Our expert nail technicians specialize in creating stunning, customized nail designs that reflect your unique style. From classic manicures to intricate nail art, acrylics, gel extensions, and more — we combine creativity, precision, and top-quality products to deliver flawless results that last.',
  }
];


export default function OurServices () {
    return (
        <div className="relative flex flex-col items-center rounded-xl min-h-96 mt-20">
            <h1 className="text-4xl font-extrabold">Our Services</h1>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative w-full flex space-y-10 flex-col lg:flex-row justify-center mt-10 gap-5"
            >
                {Services.map(service => (
                    <div key={service.id} className="flex grow flex-col w-full min-h-96 space-y-5">
                        <div className="relative w-full h-80">
                            <Image 
                                src={service.src}
                                fill
                                alt={service.alt}
                                className="object-cover rounded-2xl"
                            />
                        </div>
                        <div className="relative text-center rounded-xl flex flex-col justify-center min-w-[30%] px-4">
                            <h2 className="text-2xl lg:text-4xl font-bold">{service.type}</h2>
                            <p className="text-md lg:text-base mt-2">{service.description}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}