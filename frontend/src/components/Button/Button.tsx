import React from "react";
import styles from "./Button.module.css";

export type ColorVariant = "first" | "second" | "third" | "fourth";
export type SizeVariant = "small" | "medium" | "large";

interface ButtonProps {
  colorVariant: ColorVariant;
  onClick?: () => void;
  sizeVariant?: SizeVariant;
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
  let sizeVariant = "";
  if (props.sizeVariant === "small") {
    sizeVariant = styles.buttonSmall;
  } else if (props.sizeVariant === "large") {
    sizeVariant = styles.buttonLarge;
  }

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
