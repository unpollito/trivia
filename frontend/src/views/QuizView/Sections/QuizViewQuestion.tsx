import React from "react";
import styles from "./QuizViewQuestion.module.css";
import { ClientQuestion } from "../../../../../shared/model/Question";
import Button, { ColorVariant } from "../../../components/Button/Button";

interface QuizViewQuestionProps {
  onAnswer: (answer: string) => any;
  question: ClientQuestion;
}

const buttonVariants: ColorVariant[] = ["first", "second", "third", "fourth"];

function QuizViewQuestion(props: QuizViewQuestionProps) {
  const answers = props.question.answers.map((answer, index) => {
    return (
      <div className={styles.answer} key={index}>
        <Button
          colorVariant={buttonVariants[index]}
          onClick={() => props.onAnswer(answer)}
          text={answer}
        />
      </div>
    );
  });

  return (
    <div className="s-view">
      <div className={styles.titleWrapper}>
        <div className={styles.title}>{props.question.question}</div>
      </div>
      <div className={styles.answers}>{answers}</div>
    </div>
  );
}

export default QuizViewQuestion;
