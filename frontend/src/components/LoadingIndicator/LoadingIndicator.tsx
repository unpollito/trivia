import React from "react";
// https://projects.lukehaas.me/css-loaders/
import styles from "./LoadingIndicator.module.css";

function LoadingIndicator() {
  return <div className={styles.loader} />;
}

export default LoadingIndicator;
