// CreateShipment.jsx
"use client";
import { useState, useContext } from 'react';
import { Str1 } from './SVG/Index';
import { TrackingContext } from '../Context/Tracking';
import { ethers } from 'ethers';

const CreateShipment = ({ createShipmentModel, setCreateShipmentModel, onSuccess }) => {
  const { createShipment } = useContext(TrackingContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiver: '',
    pickupTime: '',
    distance: '',
    price: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Update the handleSubmit function to better handle the transaction completion
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { receiver, pickupTime, distance, price } = formData;
      if (!receiver || !pickupTime || !distance || !price) {
        throw new Error("Please fill all fields");
      }
  
      if (!ethers.utils.isAddress(receiver)) {
        throw new Error("Invalid receiver address");
      }
  
      // Ensure price is a valid number and convert to string
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error("Price must be a positive number");
      }
      
      // Limit price to a reasonable amount for testing
      if (priceValue > 1) {
        throw new Error("For testing, please use a smaller price (less than 1 ETH)");
      }
  
      const priceInWei = ethers.utils.parseEther(priceValue.toString());
      const pickupTimeStamp = Math.floor(new Date(pickupTime).getTime() / 1000);
      const distanceInKm = parseInt(distance);
  
      // Call createShipment with the correct parameters
      const result = await createShipment({
        receiver,
        pickupTime: pickupTimeStamp,
        distance: distanceInKm,
        price: priceValue.toString() // Pass as string to avoid precision issues
      });
  
      if (result) {
        alert("Transaction successful!");
        setCreateShipmentModel(false);
        // Clear form data
        setFormData({
          receiver: '',
          pickupTime: '',
          distance: '',
          price: ''
        });
        
        console.log("Transaction successful, attempting to refresh shipments...");
        
        // Add a longer delay to allow the blockchain to update
        // Update the setTimeout in handleSubmit to give more time for the blockchain to update
        
        setTimeout(() => {
          try {
            // Check if onSuccess is a function before calling it
            if (typeof onSuccess === 'function') {
              console.log("Calling onSuccess callback to refresh shipments...");
              onSuccess();
              
              // Add a second refresh after a delay to ensure data is updated
              setTimeout(() => {
                console.log("Performing second refresh to ensure data is updated...");
                onSuccess();
              }, 5000);
            } else {
              console.log("No onSuccess callback provided, manually refreshing page");
              window.location.reload(); // Fallback to page reload if no callback
            }
          } catch (error) {
            console.error("Error calling onSuccess:", error);
            window.location.reload(); // Fallback to page reload if error
          }
        }, 15000); // Increased delay to 15 seconds to give more time for blockchain update
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(error.message || "Error creating shipment");
    } finally {
      setIsLoading(false);
    }
  };

  if (!createShipmentModel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                <div className="flex items-center justify-between pb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Create Shipment
                  </h3>
                  <button onClick={() => setCreateShipmentModel(false)} className="text-gray-400 hover:text-gray-500">
                    <Str1 />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mt-2">
                  <div className="grid gap-4">
                    <input type="text" name="receiver" placeholder="Receiver Address" value={formData.receiver} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                    <input type="datetime-local" name="pickupTime" value={formData.pickupTime} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                    <input type="number" name="distance" placeholder="Distance (Km)" value={formData.distance} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                    <input type="text" name="price" placeholder="Price (ETH)" value={formData.price} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded" />
                    <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Create Shipment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;
