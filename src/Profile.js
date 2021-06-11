import axios from "./axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import "./Profile.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

function Profile() {
  const [historyRides, setHistoryRides] = useState([]);
  const [activeRides, setActiveRides] = useState([]);
  const [value, setValue] = useState(0);
  const { currentUser } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getMyRides() {
      try {
        const now = new Date().toISOString();
        const res = await axios.get(`/user/${currentUser}`, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        setActiveRides(res.data.filter((ride) => ride.pickupTime > now));
        setHistoryRides(res.data.filter((ride) => ride.pickupTime < now));
      } catch (err) {
        console.error(err);
      }
    }
    getMyRides();
  }, []);

  return (
    <div className="profile">
      <div className="profileHeader">
        <h1>My Rides</h1>
      </div>
      <Tabs
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
      >
        <Tab color="primary" label="Active Rides" />
        <Tab label="History" />
      </Tabs>
      <div className="profileContent" value={value} hidden={value !== 0}>
        {activeRides.map((ride) => (
          <div className="myRide">
            <h4>{new Date(ride.pickupTime).toLocaleString("en-SG")}</h4>
            {`${ride.pickup} to ${ride.dropoff}`}
          </div>
        ))}
      </div>
      <div className="profileContent" value={value} hidden={value !== 1}>
        {historyRides.map((ride) => (
          <div className="myRide">
            <h4>{new Date(ride.pickupTime).toLocaleString("en-SG")}</h4>
            {`${ride.pickup} to ${ride.dropoff}`}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
