"use client";

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            if (result.length === 0) {
                throw new Error("Interview not found");
            }

            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            setInterviewData(result[0]);
            setMockInterviewQuestion(jsonMockResp);
        } catch (error) {
            console.error("Error fetching interview details:", error);
            setError("Failed to load interview details. Please try again.");
        }
    };

    const handleEndInterview = () => {
        router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
                <p className="text-xl font-semibold text-red-500">{error}</p>
                <Button onClick={() => router.push('/dashboard')} className="mt-4">
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    if (!mockInterviewQuestion) {
        return <div className="text-center py-10">Loading interview...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Mock Interview</h1>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                <QuestionsSection
                    mockInterviewQuestions={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    setActiveQuestionIndex={setActiveQuestionIndex}
                />
                <RecordAnswerSection
                    mockInterviewQuestions={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex justify-between mt-10'>
                <Button 
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    disabled={activeQuestionIndex === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <ArrowLeft size={16} />
                    Previous
                </Button>
                {activeQuestionIndex < (mockInterviewQuestion?.interview_questions.length - 1) ? (
                    <Button 
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                        className="flex items-center gap-2"
                    >
                        Next
                        <ArrowRight size={16} />
                    </Button>
                ) : (
                    <Button onClick={handleEndInterview} variant="default">
                        End Interview
                    </Button>
                )}
            </div>
        </div>
    );
}

export default StartInterview;