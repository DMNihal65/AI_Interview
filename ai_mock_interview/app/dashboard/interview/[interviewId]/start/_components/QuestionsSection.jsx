"use client"
import React, { useEffect } from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {

    useEffect(() => {
        console.log("mock questions in final page");
        console.log(mockInterviewQuestions[activeQuestionIndex]);
    }, [mockInterviewQuestions, activeQuestionIndex]);


    const textToSpeech=(text)=>{
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }
        else{
            alert('Sorry Your Browser Doesnot Suport Text to Speech')
        }
    }
    

    return mockInterviewQuestions && (
        <div className='p-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {mockInterviewQuestions.interview_questions.map((question, index) => (
                    <div key={index}>
                        <h2 
                            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer 
                            ${activeQuestionIndex === index ? 'bg-sky-500 text-white' : ''}`} 
                            onClick={() => setActiveQuestionIndex(index)}>
                            Question No #{index + 1}
                        </h2>
                    </div>
                ))}
            </div>

            <h2 className='my-5 text-md md:text-lg'>
                {mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question}
            </h2>
            <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question)}/>
            
            <div className='border rounded-lg bg-blue-200 p-5 mt-20'>
                <h2 className='flex gap-2 items-center text-slate-600'>
                    <Lightbulb />
                    <strong>Note :</strong>
                </h2>
                <h2 className='text-sm text-primary my-2'>
                    Click on Record Answer when you want to answer the question. At the end of the interview we will give you the feedback along with correct answer for each of the questions and your answers to compare it.
                </h2>
            </div>
        </div>
    );
}

export default QuestionsSection;
