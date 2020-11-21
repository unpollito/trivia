import React from "react";
import styles from "./QuestionFeedback.module.css";
import Button from "../../../components/Button/Button";

interface QuestionFeedbackProps {
  isCorrect: boolean;
  isLastQuestion: boolean;
  onNextQuestion: () => void;
}

function QuestionFeedback(props: QuestionFeedbackProps) {
  const errorStyle = props.isCorrect ? "" : styles.errorStyle;
  const feedbackText = props.isCorrect
    ? "Well done! That was correct."
    : "Whoops! That wasn't the right answer.";
  const buttonText = props.isLastQuestion ? "Finish" : "Next question";
  return (
    <div className={`s-view ${errorStyle}`}>
      <h1 className={styles.feedbackMessage}>{feedbackText}</h1>
      <Button
        colorVariant="second"
        onClick={props.onNextQuestion}
        large={true}
        text={buttonText}
      />
    </div>
  );
}

export default QuestionFeedback;
