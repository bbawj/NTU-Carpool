import React, { useState } from "react";
import Select from "react-select";
import "./Selects.css";

const customStyles = {
  container: (provided) => ({
    ...provided,
    border: "3px solid #A6E3E9",
    borderRadius: "5px",
  }),
  control: () => ({
    display: "flex",
  }),
  option: (provided, state) => ({
    ...provided,
    "&:hover": {
      color: "var(--special)",
    },
    color: state.isSelected && "var(--special)",
    fontSize: "0.75rem",
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
  }),
};

function Selects() {
  const [role, setRole] = useState("");
  console.log(role);
  return (
    <div className="selectContainer">
      <Select
        onChange={setRole}
        className="role"
        styles={customStyles}
        options={[
          { value: "rider", label: "Rider" },
          { value: "driver", label: "Driver" },
        ]}
      />
      <Select
        className="pickup"
        styles={customStyles}
        options={[
          { value: "rider", label: "Rider" },
          { value: "driver", label: "Driver" },
        ]}
      />
      <Select
        className="dropoff"
        styles={customStyles}
        options={[
          { value: "rider", label: "Rider" },
          { value: "driver", label: "Driver" },
        ]}
      />
      <button className="searchBtn">
        SEARCH<span class="material-icons-outlined">search</span>
      </button>
    </div>
  );
}

export default Selects;
