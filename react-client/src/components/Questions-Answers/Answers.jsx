import React, { useEffect, useState } from 'react';
import axios from 'axios';
import header from '../../../../config.js';
import AnswerModals from './AnswerModals.jsx'
import AnswerPicture from './AnswerPicture.jsx'


const Answers = (props) => {
  const [answers, setAnswers] = useState([]);
  const [helpfulClicked, setHelpfulClicked] = useState([])
  const [reportClicked, setReportClicked] =useState([])
  const [moreAnswers, setMoreAnswers] = useState(false)
  const [picmodal, setPicModal] = useState(false)

  useEffect(() => {
    getAnswers();

  }, [helpfulClicked, reportClicked, props.questionInfo]);

  let getAnswers = () => {
    let id = props.id
      axios.get(`http://127.0.0.1:3000/api/qa/questions/${id}/answers`)
      .then((answersList) => {
        setAnswers(answersList.data.results);
      })
      .catch( (err) => {console.error(err)})

  };

  let increaseHelpfulness = (answer) => {
    let id = answer.answer_id || 11111
    setHelpfulClicked(prevArray=> [...prevArray, id])
    axios.put(`http://127.0.0.1:3000/api/qa/answers/${id}/helpful`,null)
    .catch( (err)=> {console.log(err)})

  }

  let reportAnswer = (answer) => {
    let id = answer.answer_id
    setReportClicked(prevArray=> [...prevArray, id])
    axios.put(`http://127.0.0.1:3000/api/qa/answers/${id}/report`,null)
    .catch( (err)=> {console.log(err)})

  }






  let insertAnswers = (answer, index)=> {
    let date = new Date(answer.date)
        return (
          <div className="singleAnswer" key ={index}>
            <span className = 'aInAnswer'>A: </span>
              <span>{answer.body}</span>
            <div>
              <AnswerPicture answer ={answer} key = {index}/>
            </div>
            {answer.answerer_name === "Seller" ?
            <div className="AnswerHelp">
              <p className="answerUser">by <span style = {{fontWeight: 'bold'}}>{answer.answerer_name}</span>, {date.toDateString().substring(4)}</p>
              <div className='helpItem'>{helpfulClicked.indexOf(answer.answer_id) < 0 ? <div> <p onClick = {()=>{increaseHelpfulness(answer)}}> Helpful? <span style ={{textDecorationLine: 'underline'}}>Yes</span>  ({answer.helpfulness})</p> </div>

            : <div> <p>Helpful? Yes ({answer.helpfulness})</p> </div>}</div>
            <div className='helpItem'>{reportClicked.indexOf(answer.answer_id) < 0 ? <div><p onClick = {()=>{reportAnswer(answer)}} style = {{textDecorationLine:'underline'}}> Report</p></div>
            : <div><p onClick = {()=>{reportAnswer(answer)}}>Reported</p></div>}</div>
            </div>
            :<div className="AnswerHelp">
              <p className="answerUser">by {answer.answerer_name}, {date.toDateString().substring(4)} | </p>
              <div className='helpItem'>{helpfulClicked.indexOf(answer.answer_id) < 0 ? <div> <p onClick = {()=>{increaseHelpfulness(answer)}}> Helpful? <span style ={{textDecorationLine: 'underline'}}>Yes</span>  ({answer.helpfulness})</p> </div>
            : <div> <p>Helpful? Yes ({answer.helpfulness})</p> </div>}</div>
            <div className='helpItem'>{reportClicked.indexOf(answer.answer_id) < 0 ? <div><p onClick = {()=>{reportAnswer(answer)}} style = {{textDecorationLine:'underline'}}> Report</p></div>
            : <div><p onClick = {()=>{reportAnswer(answer)}}>Reported</p></div>}</div>
            </div>
            }


            {/* <div>{helpfulClicked.indexOf(answer.answer_id) < 0 ? <div> <p onClick = {()=>{increaseHelpfulness(answer)}}>Helpful? Yes {answer.helpfulness}</p> </div>
            : <div> <p>Helpful? Yes {answer.helpfulness}</p> </div>}</div> */}

            {/* <div>{reportClicked.indexOf(answer.answer_id) < 0 ? <div onClick = {()=>{reportAnswer(answer)}}>Report</div>
            : <div>Reported</div>}</div> */}
         </div>
          )
  }




  return (
    <div className= "AllAnswers">
      {!moreAnswers ?
      <div className="MoreAnswers">
      {answers.slice(0, 2).map( (answer, index) => {
        return insertAnswers(answer, index)
      })}
      {answers.length > 2 ? <button className ="moreButton" onClick={()=>{setMoreAnswers(!moreAnswers)}}>See more Answers</button> : null}
    </div>
    :
    <div className="MoreAnswers">
        {answers.map( (answer, index) => {
          return insertAnswers(answer, index)
        })}
        {answers.length > 2 ? <button button className ="moreButton" onClick={()=>{setMoreAnswers(!moreAnswers)}}>Collpase answers</button> : null}
      </div> }
    </div>
  )
}

export default Answers;