import React from 'react';

import './question-card.style.css';

export const answerChecker = (wrong_id: number) => {
    let myAnswer = document.getElementsByClassName('one_answer');

    for(let i = 0; i < myAnswer.length; i++){
        if(wrong_id === i){
            myAnswer[i].classList.add('redButton');
        }
    }
}

type Props = {
    question: string;
    answers: string[];
    callback: any;
    userAnswer: any;
    questionNr: number;
    totalQuestions: number;
    correctAnswer: string | null;
    wrongAnswer: string | null;
}

const QuestionCard: React.FC<Props> = ({
    question,
    answers,
    callback,
    userAnswer,
    questionNr,
    totalQuestions,
    correctAnswer,
    wrongAnswer
}) => (
    <div className="question-card">
        <p className="number">
            Question: {questionNr} / {totalQuestions}
        </p>

        <div className="question_answer">
            <div className="question">
                <p dangerouslySetInnerHTML={{ __html: question}}/>
            </div>

            <div className="answer">
                {answers.map((answer, idx) => (
                    <div key={idx} >
                        <button    
                            id={`${idx}`} 
                            className={`one_answer ${correctAnswer === answer ?  'greenButton' : null} ${wrongAnswer === answer ? 'redButton' : null}`} 
                            disabled={!!userAnswer} 
                            value={answer} 
                            onClick={callback}>
                                <span dangerouslySetInnerHTML={{ __html: answer}} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

    </div>
);

export default QuestionCard;
