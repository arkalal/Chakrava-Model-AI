import React from "react";
import styles from "./SkeletonBox.module.scss";

const SkeletonBox = () => {
  return (
    <div className={styles.skeleton - box}>
      <div className={styles.skeleton - header}></div>
      <div className={styles.skeleton - content}></div>
    </div>
  );
};

export default SkeletonBox;
