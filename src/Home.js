import React from "react";
import "./Home.css";
import Selects from "./Selects";
import RideTable from "./RideTable";
import { useApp } from "./contexts/AppContext";

function Home() {
  const { rides } = useApp();

  return (
    <div className="home">
      <h1>NTU Carpool</h1>
      <Selects />
      <RideTable rows={rides} />
    </div>
  );
}

export default Home;
