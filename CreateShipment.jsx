import React, { useState } from "react";
import { createShipment } from "./Context/Tracking";

const CreateShipment = ({ contract }) => {
  const [receiver, setReceiver] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const receiver = event.target.receiver.value;
    const pickupTime = event.target.pickupTime.value;
    const distance = event.target.distance.value;
    let price = event.target.price.value;

    console.log("handleSubmit called with:", { receiver, pickupTime, distance, price });

    // Validate price
    if (!price || isNaN(parseFloat(price))) {
      alert("Invalid price value. Please enter a valid number.");
      return;
    }

    price = price.trim(); // Remove any extra spaces
    price = parseFloat(price).toFixed(18); // Ensure price is a valid decimal string
    console.log("Validated price in handleSubmit:", price);

    try {
      const success = await createShipment(receiver, pickupTime, distance, price, contract);
      if (success) {
        alert("Shipment created successfully!");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Receiver:</label>
        <input
          type="text"
          name="receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
      </div>
      <div>
        <label>Pickup Time:</label>
        <input
          type="datetime-local"
          name="pickupTime"
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
        />
      </div>
      <div>
        <label>Distance:</label>
        <input
          type="text"
          name="distance"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="text"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <button type="submit">Create Shipment</button>
    </form>
  );
};

export default CreateShipment;