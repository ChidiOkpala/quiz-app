import React, { useState } from 'react';

import { QuestionState, fetchQuizQuestions } from './API';

import './App.css';
import QuestionCard from './components/Question-Card/question-card.component';


type AnswerObject = {
  question : string;
  answer : string;
  correct : boolean;
  correctAnswer : string;
};


const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  // to set colors for  wrong and correct answers
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  // for settings
  const [settings, setSettings] = useState<boolean>(false);
  // total questions
  const [totalQuestions, setTotalQuestions] = useState<any>(5)
  // set difficulty
  const [difficulty, setDifficulty] = useState<string>('easy');
  // set category
  const [category, setCategory] = useState<string>('9');


  const trueSettings = () => {
    setSettings(true);
  }

  const startTrivia = async ( ) => {
    setScore(0);
    setSettings(false);
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      totalQuestions,
      difficulty,
      category
    );

    setQuestions(newQuestions);
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

    if(number + 1 === parseInt(totalQuestions, 10)){
      setGameOver(true);
    }
    else {
      setNumber(prev => prev + 1); 
    }
  }

  const settingsForm = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTrivia();
  }
  
  const handleDifficultyChange = (e: any) => {
    setDifficulty(e.currentTarget.value)
  }

  const handleCategoryChange = (e: any) => {
    setCategory(e.currentTarget.value)
  }

  return (
    <div className="quiz-app">
      <h1> QUIZ APP </h1>

      {
        gameOver || (number + 1 === parseInt(totalQuestions, 10)) ?
        <div className="start-settings">
          {
            !settings &&
            <button className="start" onClick={startTrivia}> start </button>
          }
          {
            !settings &&
            <button className="start" onClick={trueSettings} disabled={settings}> settings </button>
          }
          </div>
          : null
      }

      {
        !gameOver && !settings &&
          <p className="score"> score: {score}</p>
      }

      {
        loading &&
          <p> Loading Questions ...</p>
      }

      {
        !loading && !gameOver && !settings &&
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={totalQuestions}
            question={questions[number].question}
            answers={questions[number].answer}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
            correctAnswer={correctAnswer}
            wrongAnswer={wrongAnswer}
          />
      }

      {
        settings && 
        <div className="settings-block">
          <button className="start" disabled={settings}> settings </button>
          <form onSubmit={settingsForm} className="form">
            <div className="settings-block">
              <label>Number of Questions</label>
              <input 
                value={totalQuestions}
                className="totalquestion"
                type="number" 
                placeholder="maximum number is 50" 
                max="50" id="totalQuestions" 
                required
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => 
                  setTotalQuestions(e.currentTarget.value)}
                />
            </div>

            <div className="settings-block">
              <label>
                Difficulty
              </label>
              <select
                className="start"
                onChange={
                  (e: React.FormEvent<HTMLSelectElement>) =>
                    {handleDifficultyChange(e)} /* TODO: push change to form values */
                }
                value={difficulty}
              >
                <option value="easy">
                  EASY
                </option>
                <option value="medium">
                  MEDIUM
                </option>
                <option value="hard">
                  HARD
                </option>
              </select>
            </div>

            <div className="settings-block">
              <label>
                Category  
              </label>            
              <select name="trivia_category"
                className="start"
                onChange={
                  (e: React.FormEvent<HTMLSelectElement>) =>
                    {handleCategoryChange(e)}
                }
                value={category}
              >
                <option value="any">Any Category</option>
                <option value="9">General Knowledge</option>
                <option value="10">Entertainment: Books</option>
                <option value="11">Entertainment: Film</option>
                <option value="12">Entertainment: Music</option>
                <option value="13">Entertainment: Musicals &amp; Theatres</option>
                <option value="14">Entertainment: Television</option>
                <option value="15">Entertainment: Video Games</option>
                <option value="16">Entertainment: Board Games</option>
                <option value="17">Science &amp; Nature</option>
                <option value="18">Science: Computers</option>
                <option value="19">Science: Mathematics</option>
                <option value="20">Mythology</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
                <option value="24">Politics</option>
                <option value="25">Art</option>
                <option value="26">Celebrities</option>
                <option value="27">Animals</option>
                <option value="28">Vehicles</option>
                <option value="29">Entertainment: Comics</option>
                <option value="30">Science: Gadgets</option>
                <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
                <option value="32">Entertainment: Cartoon &amp; Animations</option>		
              </select>
            </div>

              <button className="submit" type="submit"> Submit </button>
          </form>
        </div>
      }
      
      {
        !gameOver && !loading && number + 1 !== parseInt(totalQuestions,10) && !settings &&
        <button className="next" onClick={nextQuestion}> Next Question </button>
      }

    </div>
  );
}

export default App;
