import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { InputAdornment, MenuItem } from "@material-ui/core";
import axios from "./axios";

function CreateForm({ pickup, dropoff }) {
  const [open, setOpen] = useState(false);
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPickupTime("");
    setDropoffTime("");
    setDate("");
    setSeats(0);
    setError("");
  };
  // create new ride post req
  function handleSubmit() {
    if (pickupTime > dropoffTime)
      return setError("Pickup cannot be later than dropoff");
    if (date < new Date().toISOString().slice(0, 10))
      return setError("Date is invalid");
    if (!seats) return setError("Must have available seats");

    axios.post("/ride/add", {
      pickup: pickup,
      dropoff: dropoff,
      pickupTime: `${date} ${pickupTime}`,
      dropoffTime: `${date} ${dropoffTime}`,
      seats: seats,
      price: price,
    });
  }

  return (
    <div>
      <button className="searchBtn" onClick={handleClickOpen}>
        CREATE<span class="material-icons-outlined">add</span>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form action="">
          <DialogTitle id="form-dialog-title">New Ride</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: "red" }}>
              {error}
            </DialogContentText>
            <TextField
              onChange={(e) => setDate(e.target.value)}
              id="date"
              required={true}
              label="Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogContent>
            <TextField
              id="picktime"
              required={true}
              onChange={(e) => setPickupTime(e.target.value)}
              label="Pickup Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ marginLeft: "1em" }}
              id="droptime"
              required
              onChange={(e) => setDropoffTime(e.target.value)}
              label="Dropoff Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogContent style={{ display: "flex" }}>
            <TextField
              id="select"
              onChange={(e) => setSeats(e.target.value)}
              value={seats}
              label="Seats"
              InputLabelProps={{
                shrink: true,
              }}
              select
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
            </TextField>
            <TextField
              style={{ marginLeft: "1em" }}
              onChange={(e) => setPrice(e.target.value)}
              id="price"
              required
              label="Price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} type="submit" color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default CreateForm;
