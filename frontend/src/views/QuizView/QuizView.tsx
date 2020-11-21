import React from "react";
import { loadQuestions } from "../../api/loadQuestions";

function QuizView() {
  loadQuestions({ isChallenge: false }).then((questions) =>
    console.log(questions)
  );

  return <div className="s-quiz-view" />;
}

export default QuizView;
