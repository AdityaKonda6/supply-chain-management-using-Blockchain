"use client";

import { NavBar, Footer } from "../../Components/Index";
import { TrackingProvider } from "../../Context/Tracking";

const LayoutClient = ({ children }) => {
  return (
    <TrackingProvider>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </TrackingProvider>
  );
};

export default LayoutClient;