import axios from "./axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import "./Profile.css";

function Profile() {
  const [myRides, setMyRides] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function getMyRides() {
      console.log(currentUser);
      try {
        const res = await axios.get(`/user/${currentUser}`, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });

        setMyRides(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    getMyRides();
    console.log(myRides);
  }, []);

  return (
    <div className="profile">
      <div className="profileHeader">
        <h1>My Rides</h1>
      </div>
      <div className="profileContent">
        {myRides.map((ride) => (
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
