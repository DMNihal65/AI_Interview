"use client"

import React from 'react';
import { Lightbulb, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Sorry, your browser does not support Text to Speech');
        }
    }

    if (!mockInterviewQuestions) {
        return <div className="p-5 text-center">Loading questions...</div>;
    }

    return (
        <div className='p-5 border rounded-lg my-10 shadow-md'>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                {mockInterviewQuestions.interview_questions.map((question, index) => (
                    <Button
                        key={index}
                        variant={activeQuestionIndex === index ? "default" : "outline"}
                        className={`p-2 text-xs sm:text-sm text-center ${activeQuestionIndex === index ? 'bg-primary text-white' : ''}`}
                        onClick={() => setActiveQuestionIndex(index)}
                    >
                        Q{index + 1}
                    </Button>
                ))}
            </div>

            <div className='my-5 p-4 bg-secondary rounded-lg'>
                <h2 className='text-md md:text-lg font-semibold mb-2'>
                    {mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question}
                </h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => textToSpeech(mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question)}
                            >
                                <Volume2 className='w-5 h-5' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Read question aloud</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className='border rounded-lg bg-blue-100 p-5 mt-10'>
                <h2 className='flex gap-2 items-center text-slate-700 font-semibold'>
                    <Lightbulb className="w-5 h-5" />
                    <span>Instructions</span>
                </h2>
                <p className='text-sm text-slate-600 my-2'>
                    To answer each question, click on the 'Record Answer' button when you're ready to respond. This will allow you to record your answer and submit it for evaluation.
                </p>
                <p className='text-sm text-slate-600 my-2'>
                    After completing the interview, you will receive feedback on your answers, including the correct answers for each question. You will also be able to compare your responses with the correct answers, allowing you to reflect on your performance and identify areas for improvement.
                </p>
            </div>
        </div>
    );
}

export default QuestionsSection;