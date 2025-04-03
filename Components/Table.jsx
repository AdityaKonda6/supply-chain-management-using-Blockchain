"use client";
import { useContext, useEffect, useState } from 'react';
import { TrackingContext } from '../Context/Tracking';
import { ethers } from 'ethers';

const Table = ({ setCreateShipmentModel }) => {
  const { getAllShipment, currentUser } = useContext(TrackingContext);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShipments = async () => {
      try {
        setLoading(true);
        console.log("Table: Loading shipments...");
        
        // Check if connected to the right network (Ganache)
        if (window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log("Connected to chain ID:", chainId);
          
          // Chain ID 0x539 (1337 in decimal) is Ganache
          if (chainId !== '0x539' && chainId !== '0x1') {
            setError("Please connect to Ganache network in MetaMask");
            setLoading(false);
            return;
          }
        }
        
        // Call getAllShipment with retry logic
        let attempts = 0;
        let data = [];
        
        while (attempts < 3) {
          try {
            data = await getAllShipment();
            console.log(`Table: Attempt ${attempts + 1} - Fetched shipments:`, data);
            if (data && data.length > 0) break;
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
          } catch (error) {
            console.error(`Table: Attempt ${attempts + 1} failed:`, error);
            attempts++;
            if (attempts >= 3) throw error;
          }
        }
        
        setShipments(data || []);
        setError(null);
      } catch (err) {
        console.error("Table: Error loading shipments:", err);
        setError("Failed to load shipments. Make sure your contract is deployed to Ganache.");
        setShipments([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadShipments();
    }
  }, [currentUser, getAllShipment]);

  if (loading) return <div className="text-center py-4">Loading shipments...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  const convertTime = (time) => {
    if (!time || time === 0) return "N/A";
    const newTime = new Date(time * 1000);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(newTime);
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: "PENDING",
      1: "IN_TRANSIT",
      2: "DELIVERED"
    };
    return statusMap[status] || "UNKNOWN";
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Shipments
          </h3>
        </div>
        <div className="mt-3 md:mt-0">
          <button
            onClick={() => setCreateShipmentModel(true)}
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
          >
            Add Tracking
          </button>
        </div>
      </div>
      <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Sender</th>
              <th className="py-3 px-6">Receiver</th>
              <th className="py-3 px-6">Pickup Time</th>
              <th className="py-3 px-6">Distance</th>
              <th className="py-3 px-6">Price</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {shipments.length > 0 ? (
              shipments.map((shipment, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shipment.sender.slice(0, 6)}...{shipment.sender.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shipment.receiver.slice(0, 6)}...{shipment.receiver.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {convertTime(shipment.pickupTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shipment.distance} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shipment.price} ETH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      shipment.status === 0 
                        ? "bg-yellow-100 text-yellow-800" 
                        : shipment.status === 1 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {getStatusText(shipment.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No shipments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
