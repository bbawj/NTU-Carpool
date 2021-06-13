import axios from "./axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import "./Profile.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Avatar } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";

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
  const [error, setError] = useState(false);
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
    try {
      const image = event.target.files[0];
      if (image) {
        let data = new FormData();
        data.append("file", image, image.name);
        const res = await axios.post("/image/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: localStorage.getItem("token"),
          },
        });
        //update USER object with image/filename & image/ID
        const oldId = await axios.patch(
          `/user/${currentUser}`,
          {
            profileImageName: res.data.file.filename,
            profileImageId: res.data.file.id,
          },
          {
            headers: { authorization: localStorage.getItem("token") },
          }
        );
        setPhoto(`image/${res.data.file.filename}`);
        console.log(oldId);
        await axios.delete(`image/${oldId.data.prevId}`, {
          headers: { authorization: localStorage.getItem("token") },
        });
      }
    } catch (err) {
      setError(true);
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
        setPhoto(`image/${res.data.profileImageName}`);
      } catch (err) {
        console.error(err);
      }
    }
    getMyRides();
    getPhoto();
  }, []);

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setError(false);
  };
  return (
    <div className="profile">
      <Snackbar open={error} autoHideDuration={6000} onClose={handleErrorClose}>
        Failed to update profile picture.
      </Snackbar>
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
