import React from "react";
import styles from "./SkeletonBox.module.scss";

const SkeletonBox = () => {
  return (
    <div className={styles.skeletonBox}>
      <div className={styles.skeletonHeader}></div>
      <div className={styles.skeletonContent}></div>
    </div>
  );
};

export default SkeletonBox;
