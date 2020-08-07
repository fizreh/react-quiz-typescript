import React, { useState, useEffect } from 'react';
import { fetchQuizQuestions, fetchQuizQuestionsWithCategory } from './API';
//components
import QuestionCard from './components/QuestionCard';
import {QuestionsState} from './API';
//types
import {Difficulty,fetchCategory} from './API'
// Styles
import {GlobalStyle,Wrapper} from './MainPage.styles';



type categoryArray = {
    id: number;
    name: string;
  };
export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;
let  newQuestions: any;
const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories,setCategories] = useState([]);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [category,setCategory] = useState(0);
  const [difficulty,setDifficulty] = useState(Difficulty.EASY);
  

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    if(category>0){
        newQuestions = await fetchQuizQuestionsWithCategory(TOTAL_QUESTIONS,difficulty,category);}
        else{
            newQuestions = await fetchQuizQuestions(
                TOTAL_QUESTIONS,
                difficulty
              );
            }
    setQuestions(newQuestions);
   // console.log(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
   if(!gameOver){
       //USer answer
       const answer = e.currentTarget.value;
       //Check answer against correct answer
       const correct = questions[number].correct_answer === answer;
       //managing Score
       if(correct) setScore(prev =>(prev + 1));
       //saving the question
       const answerObject = {
           question : questions[number].question,
           answer,
           correct,
           correctAnswer: questions[number].correct_answer
       };
       setUserAnswers(prev=>[...prev,answerObject]);


   }
  };

  const nextQuestion = () => {
    //moving to the next question if not last
    const nextQuestion = number +1;
    if(nextQuestion === TOTAL_QUESTIONS)
    setGameOver(true);
    else{
        setNumber(nextQuestion);
    }
  };

  function onChangeCategory(e:any){
    setCategory(e.target.value);

}
function onChangeDifficulty(e:any){
    setDifficulty(e.target.value);
}
function handleSelectDifficulty(e:any){
    setDifficulty(e.target.value);
}

function handleSelectCategory(e:any){
    setCategory(e.target.value);
}
async function fetchReq(){
    setLoading(true);
    const fetchedData= await fetchCategory();
    await setCategories(fetchedData);
    setLoading(false);
}

const percentage = score/TOTAL_QUESTIONS * 100;
function Winner(){
    if(score>5 && userAnswers.length===TOTAL_QUESTIONS){
        return true;
        }
        else 
        return false;
        
}

console.log("Winner",Winner());
console.log("Answers equal",userAnswers.length === TOTAL_QUESTIONS);



useEffect(() => {
    fetchReq();
  }, []);

//console.log(difficulty,category);
 

  return (
    <>
      <GlobalStyle/>
      <Wrapper>
        <label>Select the level</label>
    {"  "}
        <select onChange = {onChangeDifficulty} onSelect = {handleSelectDifficulty} >
              <option value={Difficulty.EASY}>Easy</option>
              <option value={Difficulty.MEDIUM}>Medium</option>
              <option value={Difficulty.HARD}>Hard</option>
          </select>
          {"        "}{"        "}

          <label>Select category</label>
        {"  "}
        <select onChange = {onChangeCategory} onSelect={handleSelectCategory} >
    
        {categories.map((category: categoryArray,index)=>{  
            
            return (   
                     
        <option key={index} value={category.id}>{category.name}</option>
        );
        })}   
        </select>
        {"        "}{"        "}
        {gameOver || userAnswers.length === TOTAL_QUESTIONS? (
          <button className='start' onClick={startTrivia}>
            Start
          </button>):null}
        {!gameOver? <p className = "score" >Your Score {score}/{TOTAL_QUESTIONS} {" "} ({percentage}%)</p> : null }
        {loading && <p>Loading Questions...</p>}
        
          {!loading && !gameOver && <QuestionCard
    questionNr = {number + 1}
    totalQuestions = {TOTAL_QUESTIONS}
    question = {questions[number].question}
    answers = {questions[number].answers}
    userAnswer = {userAnswers? userAnswers[number]:undefined}
    callback = {checkAnswer}
    />}
    
    {!loading && !gameOver && userAnswers.length === number +1 && number !== TOTAL_QUESTIONS-1 ?<button className="next" onClick={nextQuestion}>
      Next Question
    </button> : null}
          {Winner() && userAnswers.length === TOTAL_QUESTIONS ? <p>Congratulations!! You have a great IQ. You got {percentage}% result.</p> : !Winner() && userAnswers.length === TOTAL_QUESTIONS ?<p>Please Try again. You have got {percentage}% result. </p>:null}
        
        

    


    </Wrapper>

    </>
  );
};

export default App;