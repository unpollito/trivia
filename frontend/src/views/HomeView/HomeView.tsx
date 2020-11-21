import React from "react";
import styles from "./HomeView.module.css";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

function HomeView() {
  return (
    <div className={styles.HomeView}>
      <h1 className={styles.title}>Trivia</h1>
      <Link className={styles.link} to="/quiz">
        <Button text="Practice mode" variant="second" />
      </Link>
    </div>
  );
}

export default HomeView;
