import React, { useState } from "react";
import styles from "./HomeView.module.css";
import { Link, Redirect } from "react-router-dom";
import Button from "../../components/Button/Button";
import { setLoginToken } from "../../helpers/loginData";

function HomeView() {
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  const logout = () => {
    setLoginToken(null);
    setHasLoggedOut(true);
  };

  if (hasLoggedOut) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="s-view">
      <div onClick={logout} className={styles.logout}>
        Logout
      </div>
      <div className={styles.profile}>
        <Link to="/profile" className={styles.profileLink}>
          Profile
        </Link>
      </div>
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
