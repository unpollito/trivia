import React from "react";
import styles from "./App.module.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeView from "./views/HomeView";
import QuizView from "./views/QuizView";
import QuizCompleteView from "./views/QuizCompleteView";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Switch>
          <Route path="/">
            <HomeView />
          </Route>
          <Route path="/quiz">
            <QuizView />
          </Route>
          <Route path="/finish">
            <QuizCompleteView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
