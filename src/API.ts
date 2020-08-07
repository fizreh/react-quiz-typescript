import {ShuffleArray} from './Utils';


export type Question = {
    category :  string;
    correct_answer: string;
    difficulty:string;
    incorrect_answers: string[];
    question:string;
    type:string;

}



export enum Difficulty{
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export type QuestionsState = Question & { answers: string[] };


export const fetchQuizQuestions =async (amount: number, difficulty:Difficulty )=>{

    const endPoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;
   // console.log("EndPoint",endPoint);
    const data = await(await fetch(endPoint)).json();
    return data.results.map((question : Question)=>({
    ...question,answers: ShuffleArray([...question.incorrect_answers,question.correct_answer])
    }));
    }
export const fetchQuizQuestionsWithCategory =async (amount: number, difficulty:Difficulty, category: number )=>{
        console.log("Category",category);
        
        const endPoint = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
        

        //console.log("EndPoint",endPoint);
        const data = await(await fetch(endPoint)).json();
        return data.results.map((question : Question)=>({
        ...question,answers: ShuffleArray([...question.incorrect_answers,question.correct_answer])
        }));
        }

export const fetchCategory = async () => {
    const endpoint = `https://opentdb.com/api_category.php`;
    const data = await (await fetch(endpoint)).json();
  
    return data.trivia_categories;
  };