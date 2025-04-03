"use client";
import { useContext } from 'react';
import Image from 'next/image';
import { TrackingContext } from '../Context/Tracking';

const Services = () => {
  const { currentUser } = useContext(TrackingContext);

  const services = [
    {
      title: "Complete Shipment",
      description: "Complete your shipment and track it in real time with our platform",
      image: "/3.jpg"
    },
    {
      title: "Get Shipment",
      description: "View all your shipments and their current status",
      image: "/2.jpg"
    },
    {
      title: "Start Shipment",
      description: "Start a new shipment and get real-time updates",
      image: "/4.jpg"
    },
    {
      title: "User Profile",
      description: "Start a new shipment and get real-time updates",
      image: "/5.jpg"
    },
    {
      title: "Shipments Count",
      description: "Start a new shipment and get real-time updates",
      image: "/1.jpg"
    },
    {
      title: "Send Shipment",
      description: "Start a new shipment and get real-time updates",
      image: "/6.jpg"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Track and manage your shipments with ease
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 w-full mb-6">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="rounded-lg object-cover"
                  priority={index === 0}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
