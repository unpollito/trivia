import React from "react";
import styles from "./HomeView.module.css";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

function HomeView() {
  return (
    <div className="s-view">
      <h1 className={styles.title}>Trivia</h1>
      <Link className={styles.link} to="/quiz">
        <Button
          colorVariant="second"
          sizeVariant="large"
          text="Practice mode"
        />
      </Link>
    </div>
  );
}

export default HomeView;
