"use client";

import React, { useState, useEffect, createContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// INTERNAL IMPORT
import tracking from "../Context/Tracking.json";

// Update with your deployed contract address from Ganache
const ContractAddress = "0x45dfE349D886afc169231D246165A4E3F7Af9808";
const ContractABI = tracking.abi;

// Fetching Smart Contract
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

// Create the context
export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(false);

  const createShipment = async (items) => {
    try {
      const { receiver, pickupTime, distance, price } = items;
      
      // Validate price is reasonable (less than 100 ETH for safety)
      const priceValue = parseFloat(price);
      if (isNaN(priceValue)) {
        throw new Error("Invalid price format");
      }
      
      if (priceValue > 100) {
        throw new Error("Price too high! For testing, please use a smaller amount (less than 100 ETH)");
      }
      
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      
      const priceInWei = ethers.utils.parseEther(price.toString());
      const timestamp = Math.floor(new Date(pickupTime).getTime() / 1000);
      
      console.log("Creating shipment with params:", {
        receiver,
        timestamp,
        distance: parseInt(distance),
        price: ethers.utils.formatEther(priceInWei)
      });
      
      // Create the shipment with proper arguments and increased gas limit
      const transaction = await contract.createShipment(
        receiver,
        timestamp,
        parseInt(distance),
        priceInWei,
        {
          value: priceInWei,
          gasLimit: 500000, // Increased gas limit
        }
      );
      
      console.log("Transaction hash:", transaction.hash);
      const receipt = await transaction.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
      return true;
    } catch (error) {
      console.log("Error in createShipment:", error);
      // Check for specific error types
      if (error.code === 4001) {
        console.log("Transaction rejected by user");
      } else if (error.code === -32603) {
        console.log("Internal JSON-RPC error. Check if you have enough ETH and the contract address is correct");
      }
      throw error;
    }
  };

  // Find the getAllShipment function and modify it to handle errors better
  
  // Update the getAllShipment function to handle contract connection issues
  
  // Update the getAllShipment function to properly access the contract
  
  // Update the getAllShipment function to fix the state reference error
  
  // Add this complete implementation of getAllShipment
  const getAllShipment = async () => {
    try {
      console.log("Getting all shipments...");
      
      // Initialize Web3Modal and connect to provider
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      
      // Get contract instance
      const contract = fetchContract(signer);
      
      if (!contract) {
        console.error("Contract not initialized");
        return [];
      }
      
      try {
        // Try to get all transactions
        console.log("Calling getAllTransactions...");
        const transactions = await contract.getAllTransactions();
        console.log("Raw transactions:", transactions);
        
        if (transactions && transactions.length > 0) {
          // Process the transactions
          const items = transactions.map((item) => ({
            sender: item.sender,
            receiver: item.receiver,
            pickupTime: item.pickupTime.toNumber(),
            deliveryTime: item.deliveryTime.toNumber(),
            distance: item.distance.toNumber(),
            price: ethers.utils.formatEther(item.price.toString()),
            status: item.status,
            isPaid: item.isPaid
          }));
          
          return items;
        }
        
        // If no transactions found via getAllTransactions, try to get user-specific shipments
        if (currentUser) {
          try {
            console.log("Attempting to get shipments for current user:", currentUser);
            const count = await contract.getShipmentsCount(currentUser);
            console.log("User shipment count:", count.toNumber());
            
            const userShipments = [];
            for (let i = 0; i < count.toNumber(); i++) {
              const shipment = await contract.getShipment(currentUser, i);
              userShipments.push({
                sender: shipment[0],
                receiver: shipment[1],
                pickupTime: shipment[2].toNumber(),
                deliveryTime: shipment[3].toNumber(),
                distance: shipment[4].toNumber(),
                price: ethers.utils.formatEther(shipment[5].toString()),
                status: shipment[6],
                isPaid: shipment[7]
              });
            }
            return userShipments;
          } catch (error) {
            console.error("Error getting user shipments:", error);
          }
        }
        
        return [];
      } catch (error) {
        console.error("Error in contract calls:", error);
        return [];
      }
    } catch (error) {
      console.error("Error while fetching all shipments:", error);
      return [];
    }
  };

  // Helper function to convert status number to string
  const getStatusString = (status) => {
    const statusMap = ['PENDING', 'IN_TRANSIT', 'DELIVERED'];
    return statusMap[status] || 'PENDING';
  };

  const getShipmentsCount = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentsCount = await contract.getShipmentsCount(accounts[0]);
      return shipmentsCount.toNumber();
    } catch (error) {
      console.log("Error getting shipment count", error);
    }
  };

  const completeShipment = async ({ receiver, index }) => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const transaction = await contract.completeShipment(accounts[0], receiver, index, {
        gasLimit: 300000,
      });
      await transaction.wait();
      console.log(transaction);
    } catch (error) {
      console.log("Error completing shipment", error);
    }
  };

  const getShipment = async (index) => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index);
      return {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };
    } catch (error) {
      console.log("Error fetching shipment", error);
    }
  };

  const startShipment = async ({ receiver, index }) => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      
      console.log(`Starting shipment: receiver=${receiver}, index=${index}`);
      
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      
      // Check the current status of the shipment before attempting to start it
      const shipment = await contract.getShipment(accounts[0], index);
      
      // If shipment is already in transit (status 1), don't process again
      if (shipment[6] === 1) {
        console.log("Shipment is already in transit, skipping transaction");
        return true;
      }
      
      // Call the startShipment function with increased gas limit
      const transaction = await contract.startShipment(accounts[0], receiver, index, {
        gasLimit: 500000,
      });
      
      console.log("Start shipment transaction hash:", transaction.hash);
      const receipt = await transaction.wait();
      console.log("Start shipment confirmed in block:", receipt.blockNumber);
      
      return true;
    } catch (error) {
      console.log("Error starting shipment:", error);
      // Check for specific error types
      if (error.code === 4001) {
        console.log("Transaction rejected by user");
      } else if (error.code === -32603) {
        console.log("Internal JSON-RPC error. Check if you have enough ETH and the contract address is correct");
      }
      throw error;
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");

      // Check if we're on the right network
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      console.log("Current chain ID:", chainId);
      
      // Ganache typically uses chain ID 1337 (0x539)
      if (chainId !== '0x539') {
        console.log("Not connected to Ganache. Attempting to switch network...");
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x539' }], // Chain ID for Ganache
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x539',
                    chainName: 'Ganache',
                    rpcUrls: ['http://127.0.0.1:7545'],
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    }
                  },
                ],
              });
            } catch (addError) {
              console.error("Failed to add Ganache network:", addError);
            }
          }
        }
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentUser(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.log("Error connecting wallet:", error);
    }
  };

  // Check if wallet is already connected
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
      }
    } catch (error) {
      console.log("Error checking wallet connection:", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipment,
        completeShipment,
        getShipment,
        startShipment,
        DappName,
        currentUser,
        loading,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
