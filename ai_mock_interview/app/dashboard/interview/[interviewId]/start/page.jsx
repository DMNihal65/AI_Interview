"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // Default to the first question

    useEffect(() => {
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            setInterviewData(result[0]);
            setMockInterviewQuestion(jsonMockResp);
            console.log(result[0]);
            console.log(jsonMockResp);
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                {mockInterviewQuestion && (
                    <QuestionsSection
                        mockInterviewQuestions={mockInterviewQuestion}
                        activeQuestionIndex={activeQuestionIndex}
                        setActiveQuestionIndex={setActiveQuestionIndex}
                    />
                )}
                {/* Video and audio Recording */}
                <RecordAnswerSection
                     mockInterviewQuestions={mockInterviewQuestion}
                     activeQuestionIndex={activeQuestionIndex}
                     interviewData={interviewData}
                />
            </div>
            <div className='flex justify-end gap-6'>
               {activeQuestionIndex > 0 && <Button
               onClick={()=>setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question

               </Button>} 

               {activeQuestionIndex != mockInterviewQuestion?.length &&
               <Button

               onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question

               </Button>}


                {activeQuestionIndex==mockInterviewQuestion?.length-1&&<Button>End Interview</Button>}
            </div>
        </div>
    );
}

export default StartInterview;
