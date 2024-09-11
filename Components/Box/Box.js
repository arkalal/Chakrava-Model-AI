import React from "react";
import styles from "./Box.module.scss";

const Box = ({ data }) => {
  return (
    <div className={styles.box}>
      <h3>Training Data</h3>
      <p>{data}</p> {/* Display training data */}
    </div>
  );
};

export default Box;
