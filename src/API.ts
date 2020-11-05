import axios from 'axios';
import { shuffleArray } from './utils';

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
}

export type QuestionState = Question & { answer: string[] };

// export enum Difficulty {
//     EASY = 'easy',
//     MEDIUM = 'medium',
//     HARD = 'hard'
// }

const checkCategory = (category: string) => {
    if(category === 'any'){
        return '';
    }
    else {
        return `&category=${category}`
    }
}

export const fetchQuizQuestions = async (amount: number, difficulty: string, category: string) => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}${checkCategory(category)}`;
    
   return await axios.get(endpoint)
    .then((res: any) => res.data.results.map((question: Question) => (
            {
               ...question,
                answer: shuffleArray([...question.incorrect_answers, question.correct_answer])
            }
    )));
};
