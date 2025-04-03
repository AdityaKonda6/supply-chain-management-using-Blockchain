"use client";
import { useState, useEffect, useContext } from 'react';
import { TrackingContext } from '../../Context/Tracking';
import { Services, Shipments } from "../../Components/Index";

export default function Home() {
  return (
    <div>
      <Services />
      <Shipments />
    </div>
  );
}