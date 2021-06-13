import axios from "./axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import "./Profile.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Avatar } from "@material-ui/core";

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
          {info.requested && info.requested.length === 0 && <p>No requests</p>}
          {info.requested &&
            info.requested.map((req) => (
              <div key={req._id}>{req.username}</div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const [historyRides, setHistoryRides] = useState([]);
  const [activeRides, setActiveRides] = useState([]);
  const [photo, setPhoto] = useState("");
  const [value, setValue] = useState(0);
  const { currentUser } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // get invisible input
  function handleEditPicture() {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  }
  // upload image to db
  async function handleImageChange(event) {
    const image = event.target.files[0];
    if (image) {
      let data = new FormData();
      data.append("file", image, image.name);
      const res = await axios.post("/images/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: localStorage.getItem("token"),
        },
      });

      await axios.patch(
        `/user/${currentUser}`,
        { profileImage: res.data.file.filename },
        {
          headers: { authorization: localStorage.getItem("token") },
        }
      );
      setPhoto(`image/${res.data.file.filename}`);
    }

    // await axios.post(`/user/${currentUser}`, {profileImage: image.})
  }

  useEffect(() => {
    async function getMyRides() {
      try {
        const now = new Date().toISOString();
        // await axios.get("images/")
        const res = await axios.get(`/user/${currentUser}/ride`, {
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
    async function getPhoto() {
      try {
        const res = await axios.get(`/user/${currentUser}/image`, {
          headers: { authorization: localStorage.getItem("token") },
        });
        setPhoto(`image/${res.data.profileImage}`);
      } catch (err) {
        console.error(err);
      }
    }
    getMyRides();
    getPhoto();
  }, []);
  console.log(photo);
  return (
    <div className="profile">
      <ProfilePopup info={info} />
      <div className="profileHeader">
        <h1>My Rides</h1>
        <Avatar
          onClick={handleEditPicture}
          src={`http://localhost:5000/${photo}`}
          alt=""
        />
        <form encType="multipart/form-data">
          <input
            type="file"
            id="imageInput"
            name="avatar"
            hidden="hidden"
            onChange={handleImageChange}
          />
        </form>
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
            key={ride._id}
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
            key={ride._id}
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
