import React from "react";
import styles from "./Button.module.css";

export type ColorVariant = "first" | "second" | "third" | "fourth";

interface ButtonProps {
  colorVariant: ColorVariant;
  large?: boolean;
  onClick?: () => void;
  text: string;
}

const variantMap = {
  first: styles.buttonFirst,
  second: styles.buttonSecond,
  third: styles.buttonThird,
  fourth: styles.buttonFourth,
};

function Button(props: ButtonProps) {
  const colorVariant =
    variantMap[props.colorVariant as ColorVariant] ?? styles.buttonFirst;
  const sizeVariant = props.large ? styles.buttonLarge : "";
  return (
    <div
      className={`${styles.Button} ${colorVariant} ${sizeVariant}`}
      onClick={() => (props.onClick ? props.onClick() : null)}
    >
      {props.text}
    </div>
  );
}

export default Button;
