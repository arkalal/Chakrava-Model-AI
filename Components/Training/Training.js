"use client";

import React from "react";
import axios from "../../axios/api";

const Training = () => {
  const handleTrain = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/train", {
        dataset: "dataset.jsonl", // Path relative to the project root
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Lets Train GPT-4 o to generate CODE!! 🚀</h2>

      <button onClick={handleTrain}>Train the Model</button>
    </div>
  );
};

export default Training;
