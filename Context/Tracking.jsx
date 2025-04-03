import { ethers } from "ethers";

export const createShipment = async (receiver, pickupTime, distance, price, contract) => {
  try {
    if (!contract) {
      alert("Please wait for contract connection");
      return false;
    }

    console.log("createShipment called with:", { receiver, pickupTime, distance, price });

    if (price === undefined || price === null || isNaN(parseFloat(price))) {
      throw new Error("Invalid price value. Price must be a valid number.");
    }

    console.log("Validated price:", price, "Type:", typeof price); // Debug log for price

    const pickupTimeStamp = Math.floor(new Date(pickupTime).getTime() / 1000);
    const priceInWei = ethers.utils.parseEther(price.toString()); // Ensure price is a string

    const transaction = await contract.createShipment(
      receiver,
      pickupTimeStamp,
      distance,
      priceInWei,
      {
        value: priceInWei.toString(),
        gasLimit: 300000,
      }
    );

    console.log("Transaction sent:", transaction.hash);
    const receipt = await transaction.wait();
    console.log("Transaction confirmed:", receipt);

    return true;
  } catch (error) {
    console.error("Error in createShipment:", error);
    alert(`Error: ${error.message}`);
    return false;
  }
};