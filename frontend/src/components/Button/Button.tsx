import React from "react";
import styles from "./Button.module.css";

type Variant = "first" | "second" | "third" | "fourth";

interface ButtonProps {
  text: string;
  variant: Variant;
}

const variantMap = {
  first: styles.buttonFirst,
  second: styles.buttonSecond,
  third: styles.buttonThird,
  fourth: styles.buttonFourth,
};

function Button(props: ButtonProps) {
  let variant = variantMap[props.variant as Variant] ?? styles.buttonFirst;
  return <div className={`${styles.Button} ${variant}`}>{props.text}</div>;
}

export default Button;
