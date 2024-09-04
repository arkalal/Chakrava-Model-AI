import React from "react";
import styles from "../Chat.module.scss";

const SliderControl = ({ label, value, setValue, min, max, step = 1 }) => {
  const handleChange = (e) => {
    setValue(parseFloat(e.target.value));
  };

  return (
    <div className={styles.sliderControl}>
      <div className={styles.sliderControlHead}>
        <label>{label}</label>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={styles.sliderInput}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SliderControl;
