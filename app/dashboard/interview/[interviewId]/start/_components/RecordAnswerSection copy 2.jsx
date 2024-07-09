import { Button } from '@/components/ui/button'
import { Mic, WebcamIcon, AlertCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModle';
import { db } from '@/utils/db';
import { userAnswer } from '@/utils/schema';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
    const [UserAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        error: speechError,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => {
            setUserAnswer(prevAns => prevAns + result?.transcript)
        })
    }, [results])

    useEffect(() => {
        if (speechError) {
            setError("Error with speech recognition. Please try again.");
        }
    }, [speechError]);

    const SaveUserAnswer = async () => {
        if (isRecording) {
            setLoading(true);
            stopSpeechToText();

            if (UserAnswer?.length < 10) {
                setLoading(false);
                setError('Answer is too short. Please record again.');
                return;
            }

            try {
                const feedbackPrompt = `Question: ${mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question}\nUser Answer: ${UserAnswer}\nDepending on the Question and user answer, please give a rating for the answer and feedback on the area of improvement in just 3 to 5 lines in the JSON format with "rating" and "feedback" fields only.`;

                const result = await chatSession.sendMessage(feedbackPrompt);
                
                let jsonResponse;
                try {
                    const mockJsonResponse = result.response.text();
                    const extractedJson = mockJsonResponse.match(/{.*}/s)[0];
                    jsonResponse = JSON.parse(extractedJson);
                } catch (error) {
                    throw new Error('Error while processing the API response.');
                }

                const resp = await db.insert(userAnswer).values({
                    mockIdRef: interviewData?.mockId,
                    question: mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question,
                    correctAns: mockInterviewQuestions.interview_questions[activeQuestionIndex]?.answer,
                    userAns: UserAnswer,
                    feedback: jsonResponse?.feedback,
                    rating: jsonResponse?.rating,
                    createdAt: moment().format('DD-MM-YYYY'),
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                });

                if (resp) {
                    toast('Answer Saved Successfully');
                    setResults([]);
                    setUserAnswer('');
                }
            } catch (error) {
                setError(error.message || 'An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            startSpeechToText();
        }
    };

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='relative w-full max-w-md mt-10 bg-slate-200 border rounded-lg p-4 shadow-md'>
                <WebcamIcon width={50} height={50} className='absolute top-2 right-2 text-slate-500' />
                <Webcam
                    mirrored={true}
                    style={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '16/9',
                    }}
                />
            </div>
            <Button 
                disabled={loading} 
                variant={isRecording ? "destructive" : "default"} 
                className="my-6 flex items-center gap-2"
                onClick={SaveUserAnswer}
            >
                {isRecording ? (
                    <>
                        <Mic className="animate-pulse" />
                        Stop Recording
                    </>
                ) : (
                    <>
                        <Mic />
                        Record Answer
                    </>
                )}
            </Button>

            {error && (
                <div className="flex items-center gap-2 text-red-500 mb-4">
                    <AlertCircle size={16} />
                    <p>{error}</p>
                </div>
            )}

            {UserAnswer && (
                <div className="w-full max-w-md p-4 bg-white border rounded-lg shadow-sm">
                    <h3 className="font-semibold mb-2">Your Answer:</h3>
                    <p className="text-sm text-gray-600">{UserAnswer}</p>
                </div>
            )}
        </div>
    )
}

export default RecordAnswerSection