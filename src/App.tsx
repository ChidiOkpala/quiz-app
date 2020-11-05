import React, { useState } from 'react';

import { Difficulty, QuestionState, fetchQuizQuestions } from './API';

import './App.css';
import QuestionCard from './components/Question-Card/question-card.component';


type AnswerObject = {
  question : string;
  answer : string;
  correct : boolean;
  correctAnswer : string;
};

const TOTAL_QUESTIONS = 5;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);

  const startTrivia = async ( ) => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //get the chosen answer
      let answer = e.currentTarget.value;
      // compare the chosen answer with the correct answer
      let correct = answer === questions[number].correct_answer;
      // if its correct, set score
      if(correct) {
        setScore(prev => prev + 1)
        setCorrectAnswer(answer);
        // set chosen button to true
      } else {
        // to give the  wrong answer a green background
        setCorrectAnswer(questions[number].correct_answer);

        // to give the  wrong answer a red background
        setWrongAnswer(answer)
      }


      // save answer in answerObject
      // save answer in object
      const AnswerObject = {
        question : questions[number].question,
        answer,
        correct,
        correctAnswer : questions[number].correct_answer
      }
      // add answer above to userAnswer
      setUserAnswers((prev) => [...prev, AnswerObject]);

    }
  };

  const nextQuestion = () => {
    setNumber(prev => prev + 1);
  }

  return (
    <div className="quiz-app">
      <h1> QUIZ APP </h1>

      {
        gameOver || number + 1 === TOTAL_QUESTIONS ?
          <button className="start" onClick={startTrivia}> start </button>
          : null
      }

      {
        !gameOver &&
          <p className="score"> score: {score}</p>
      }

      {
        loading &&
          <p> Loading Questions ...</p>
      }

      {
        !loading && !gameOver &&
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answer}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
            correctAnswer={correctAnswer}
            wrongAnswer={wrongAnswer}
          />
      }
      
      {
        !gameOver && !loading && number + 1 !== TOTAL_QUESTIONS &&
        <button className="next" onClick={nextQuestion}> Next Question </button>
      }

    </div>
  );
}

export default App;
