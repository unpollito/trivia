import React from "react";
import styles from "./App.module.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeView from "./views/HomeView/HomeView";
import QuizView from "./views/QuizView/QuizView";
import LoginView from "./views/LoginView/LoginView";
import { RouteProps } from "react-router";
import { Redirect } from "react-router-dom";
import { getLoginData } from "./helpers/loginData";
import ProfileView from "./views/ProfileView/ProfileView";

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginView />
          </Route>
          <PrivateRoute path="/quiz">
            <QuizView isChallenge={false} />
          </PrivateRoute>
          <PrivateRoute path="/profile">
            <ProfileView />
          </PrivateRoute>
          <PrivateRoute path="/">
            <HomeView />
          </PrivateRoute>
        </Switch>
      </Router>
    </div>
  );
}

// https://reactrouter.com/web/example/auth-workflow
function PrivateRoute(props: RouteProps) {
  const { children, ...rest } = props;
  const isLoggedIn = !!getLoginData();
  return (
    <Route
      {...rest}
      render={() => (isLoggedIn ? children : <Redirect to="/login" />)}
    />
  );
}

export default App;
