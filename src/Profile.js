import axios from "./axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import "./Profile.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

function Profile() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({});
  const handleClickOpen = (riders, requested) => {
    setInfo({ riders: riders, requested: requested });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function ProfilePopup({ info }) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Requests`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {info.requested &&
              info.requested.map((req) => (
                <div key={req._id}>{req.username}</div>
              ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

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
      <ProfilePopup info={info} />
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
          <div
            className="myRide"
            onClick={() => handleClickOpen(ride.riders, ride.requested)}
          >
            <h4>{new Date(ride.pickupTime).toLocaleString("en-SG")}</h4>
            {`${ride.pickup} to ${ride.dropoff}`}
          </div>
        ))}
      </div>
      <div className="profileContent" value={value} hidden={value !== 1}>
        {historyRides.map((ride) => (
          <div
            className="myRide"
            onClick={() => handleClickOpen(ride.riders, ride.requested)}
          >
            <h4>{new Date(ride.pickupTime).toLocaleString("en-SG")}</h4>
            {`${ride.pickup} to ${ride.dropoff}`}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
