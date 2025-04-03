"use client";
import { useState, useEffect, useContext } from 'react';
import { TrackingContext } from '../Context/Tracking';
import CreateShipment from './CreateShipment';
import { ethers } from 'ethers';

const Shipments = () => {
  const { getAllShipment, currentUser, startShipment } = useContext(TrackingContext);
  const [shipments, setShipments] = useState([]);
  const [createShipmentModel, setCreateShipmentModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(null);

  // Update the fetchShipments function to handle empty arrays better and add retry logic
  
  const fetchShipments = async () => {
    try {
      setLoading(true);
      console.log("Fetching shipments...");
      
      // Get all shipments with retry logic
      let attempts = 0;
      let allShipments = [];
      
      while (attempts < 3) {
        try {
          allShipments = await getAllShipment();
          console.log(`Attempt ${attempts + 1}: Fetched shipments:`, allShipments);
          
          if (allShipments && Array.isArray(allShipments) && allShipments.length > 0) {
            break; // Successfully got shipments, exit the retry loop
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));
          attempts++;
        } catch (error) {
          console.error(`Attempt ${attempts + 1} failed:`, error);
          attempts++;
          if (attempts >= 3) throw error; // Rethrow after max attempts
        }
      }
      
      if (allShipments && Array.isArray(allShipments) && allShipments.length > 0) {
        console.log("Setting shipments:", allShipments);
        setShipments(allShipments);
      } else {
        console.log("No shipments found or empty array returned");
        setShipments([]);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchShipments when the component mounts and when currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchShipments();
    }
  }, [currentUser]);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "0") return "N/A";
    try {
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Fix the price formatting function to handle both string and BigNumber inputs
  const formatPrice = (price) => {
    try {
      // Check if price is already a string with decimal point
      if (typeof price === 'string' && price.includes('.')) {
        // Already formatted, just return it
        return price;
      }
      
      // If it's a BigNumber object, format it properly
      if (price && price._isBigNumber) {
        return ethers.utils.formatEther(price);
      }
      
      // If it's a string that represents a BigNumber (no decimal)
      if (typeof price === 'string' && !price.includes('.')) {
        return ethers.utils.formatEther(price);
      }
      
      // Fallback
      return price ? price.toString() : '0';
    } catch (error) {
      console.error("Error formatting price:", error);
      return '0'; // Return a default value on error
    }
  };

  // Get status text
  const getStatusText = (status) => {
    const statusMap = {
      0: "PENDING",
      1: "IN_TRANSIT",
      2: "DELIVERED"
    };
    return statusMap[status] || "UNKNOWN";
  };

  // Add this function to handle starting a shipment
  const handleStartShipment = async (shipment, index) => {
    try {
      setProcessingAction(`start-${index}`);
      console.log(`Starting shipment at index ${index} for receiver ${shipment.receiver}`);
      
      // Check if the shipment is already in transit
      if (shipment.status === 1) {
        alert("This shipment is already in transit!");
        return;
      }
      
      const result = await startShipment({
        receiver: shipment.receiver,
        index: index
      });
      
      console.log("Start shipment result:", result);
      
      // Add a delay before refreshing to allow the blockchain to update
      setTimeout(() => {
        fetchShipments();
      }, 5000);
      
    } catch (error) {
      console.error("Error starting shipment:", error);
      alert(`Error: ${error.message || "Could not start shipment"}`);
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <button 
          onClick={() => setCreateShipmentModel(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Tracking
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading shipments...</p>
      ) : shipments.length === 0 ? (
        <p className="text-center py-4">No shipments found. Create one to get started!</p>
      ) : (
        <div className="overflow-x-auto shadow-sm border rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-6 text-left">Sender</th>
                <th className="py-3 px-6 text-left">Receiver</th>
                <th className="py-3 px-6 text-left">Pickup Time</th>
                <th className="py-3 px-6 text-left">Distance</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {shipments.map((shipment, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{shipment.sender.slice(0, 6)}...{shipment.sender.slice(-4)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shipment.receiver.slice(0, 6)}...{shipment.receiver.slice(-4)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(shipment.pickupTime)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shipment.distance} km</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatPrice(shipment.price)} ETH</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusText(shipment.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shipment.status === 0 && (
                      <button
                        onClick={() => handleStartShipment(shipment, idx)}
                        disabled={processingAction === `start-${idx}`}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        {processingAction === `start-${idx}` ? 'Processing...' : 'Start Shipment'}
                      </button>
                    )}
                    {shipment.status === 1 && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Complete Shipment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {createShipmentModel && (
        <CreateShipment 
          createShipmentModel={createShipmentModel}
          setCreateShipmentModel={setCreateShipmentModel}
          onSuccess={fetchShipments}
        />
      )}
    </div>
  );
};

export default Shipments;