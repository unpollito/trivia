import React, { useEffect, useState } from "react";
import { UserStats, UserTokenData } from "../../../../shared/model/Login";
import { getUserStats } from "../../api/getUserStats";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import styles from "./ProfileView.module.css";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { getLoginData } from "../../helpers/loginData";

export default function ProfileView() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null as UserStats | null);

  useEffect(() => {
    if (!stats) {
      getUserStats().then((fetchedStats) => {
        setStats(fetchedStats);
        setIsLoading(false);
      });
    }
  });

  let statsText = ["", ""];
  if (stats) {
    if (stats.answered_question_count > 0) {
      const percentage = (
        (stats.correct_question_count / stats.answered_question_count) *
        100
      ).toFixed(1);
      statsText[0] = `You have answered ${stats.answered_question_count} times.`;
      statsText[1] = `From these, ${stats.correct_question_count} (${percentage} %) were correct.`;
    } else {
      statsText[0] = `You haven't answered any questions yet.`;
      statsText[1] = `Play more to see your stats here.`;
    }
  }
  const username = (getLoginData() as UserTokenData).username;

  let child;
  if (isLoading) {
    child = <LoadingIndicator />;
  } else {
    child = (
      <div>
        <h1 className={styles.username}>{username}</h1>
        <p className={styles.statsText}>{statsText[0]}</p>
        <p className={styles.statsText}>{statsText[1]}</p>
        <Link className={styles.link} to="/">
          <Button colorVariant="second" text="Home" />
        </Link>
      </div>
    );
  }

  return <div className="s-view">{child}</div>;
}
