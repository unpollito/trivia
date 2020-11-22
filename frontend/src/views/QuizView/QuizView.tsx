import React, { useEffect, useState } from "react";
import { loadQuestions } from "../../api/loadQuestions";
import QuizViewQuestion from "./Sections/QuizViewQuestion";
import QuestionFeedback from "./Sections/QuestionFeedback";
import { answerQuestion } from "../../api/answerQuestion";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import { Redirect } from "react-router-dom";
import { ClientQuestion } from "../../../../shared/model/Question";

interface QuizViewProps {
  isChallenge: boolean;
}

function QuizView(props: QuizViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([] as ClientQuestion[]);
  const [lastSuccess, setLastSuccess] = useState(true);
  const [isAnswering, setIsAnswering] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      return;
    }
    loadQuestions({ isChallenge: props.isChallenge }).then((questions) => {
      setQuestions(questions);
      setIsLoading(false);
    });
  }, [props.isChallenge, questions]);

  const onAnswer = async (answer: string) => {
    const question = questions[currentQuestionIndex];
    const { isCorrect } = await answerQuestion({
      questionId: question.id,
      answer,
    });
    setLastSuccess(isCorrect);
    setIsAnswering(false);
  };

  const onNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswering(true);
    } else {
      setIsFinished(true);
    }
  };

  let child;
  if (isLoading) {
    child = <LoadingIndicator />;
  } else if (isFinished) {
    child = <Redirect to="/" />;
  } else if (isAnswering) {
    child = (
      <QuizViewQuestion
        onAnswer={onAnswer}
        question={questions[currentQuestionIndex]}
      />
    );
  } else {
    child = (
      <QuestionFeedback
        isCorrect={lastSuccess}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
        onNextQuestion={onNextQuestion}
      />
    );
  }

  return <div className="s-view">{child}</div>;
}

export default QuizView;
