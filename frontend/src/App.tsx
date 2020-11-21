import React from "react";
import styles from "./App.module.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeView from "./views/HomeView/HomeView";
import QuizView from "./views/QuizView/QuizView";
import QuizCompleteView from "./views/QuizCompleteView/QuizCompleteView";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Switch>
          <Route path="/quiz">
            <QuizView />
          </Route>
          <Route path="/finish">
            <QuizCompleteView />
          </Route>
          <Route path="/">
            <HomeView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
