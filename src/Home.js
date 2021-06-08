import React from "react";
import "./Home.css";
import Selects from "./Selects";

function Home() {
  return (
    <div className="home">
      <h1>NTU Carpool</h1>
      <Selects />
      <div className="tableHeaders">
        <p>Driver</p>
        <p>Pickup</p>
        <p>Dropoff</p>
        <p>Time</p>
        <p>Price</p>
        <p>Available Seats</p>
      </div>
    </div>
  );
}

export default Home;
