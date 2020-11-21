import React, { ChangeEvent, useState } from "react";
import { Redirect } from "react-router-dom";
import { getLoginData, setLoginToken } from "../../helpers/loginData";
import styles from "./LoginView.module.css";
import Button from "../../components/Button/Button";
import { sha256 } from "js-sha256";
import { login } from "../../api/login";
import { AxiosError } from "axios";
import { register } from "../../api/register";

export default function LoginView() {
  const hasStoredLoginData = !!getLoginData();
  const [loginFailed, setLoginFailed] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const handleChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    if (target.name === "username") {
      setUsername(target.value);
    } else {
      setPassword(target.value);
    }
  };

  const tryLogin = async () => {
    // It's not strictly necessary to apply a hash function here, but it's nice to the user
    // to make sure that not even the server can see their plaintext password, to reduce the
    // likelihood of attacks exploiting password reuse.
    const hashedPassword = sha256(password);
    try {
      const { token } = await login({ username, password: hashedPassword });
      setLoginToken(token);
      setHasLoggedIn(true);
    } catch (e: any) {
      if ((e as AxiosError)?.response?.status === 401) {
        // Unauthorized
        setLoginFailed(true);
        setRegisterFailed(false);
      } else {
        throw e;
      }
    }
  };

  const tryRegister = async () => {
    const hashedPassword = sha256(password);
    try {
      const { token } = await register({ username, password: hashedPassword });
      setLoginToken(token);
      setHasLoggedIn(true);
    } catch (e: any) {
      if ((e as AxiosError)?.response?.status === 409) {
        // Conflict (username exists)
        setLoginFailed(false);
        setRegisterFailed(true);
      } else {
        throw e;
      }
    }
  };

  if (hasStoredLoginData || hasLoggedIn) {
    return <Redirect to="/" />;
  }

  let loginErrorLabel = null;
  if (loginFailed) {
    loginErrorLabel = (
      <label className={styles.error}>
        The given username and password do not match.
      </label>
    );
  }
  let registrationErrorLabel = null;
  if (registerFailed) {
    registrationErrorLabel = (
      <label className={styles.error}>
        There is already a user with that username.
      </label>
    );
  }

  return (
    <div className="s-view">
      <h1 className={styles.title}>Trivia</h1>
      <form className={styles.form}>
        {loginErrorLabel}
        {registrationErrorLabel}
        <input
          name="username"
          type="text"
          maxLength={20}
          className={styles.input}
          placeholder="Username"
          value={username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          maxLength={20}
          className={styles.input}
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <div className={styles.buttonWrapper}>
          <Button
            colorVariant="second"
            onClick={tryLogin}
            sizeVariant="small"
            text="Login"
          />
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            colorVariant="third"
            onClick={tryRegister}
            sizeVariant="small"
            text="Register"
          />
        </div>
      </form>
    </div>
  );
}
