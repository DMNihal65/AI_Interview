import { Button } from '@/components/ui/button'
import { Mic, WebcamIcon, AlertCircle, Trash2, Eye, Send } from 'lucide-react'
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
    const [userAnswer, setUserAnswer] = useState('');
    const [showTranscript, setShowTranscript] = useState(false);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        error: speechError,
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
        const transcripts = results.map(result => result?.transcript || '').join(' ');
        setUserAnswer(prevAns => prevAns + ' ' + transcripts);
    }, [results]);

    useEffect(() => {
        if (speechError) {
            setError("Error with speech recognition. Please try again.");
        }
    }, [speechError]);

    const handleRecordToggle = () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            setError(null);
            startSpeechToText();
        }
    };

    const handleDelete = () => {
        setUserAnswer('');
        setResults([]);
        setError(null);
        setShowTranscript(false);
    };

    const handleSubmit = async () => {
        if (userAnswer.trim().length < 10) {
            setError('Answer is too short. Please provide a more detailed response.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const feedbackPrompt = `Question: ${mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question}\nUser Answer: ${userAnswer}\nProvide a rating (1-10) for the answer and feedback on areas of improvement in 3-5 lines. Respond in this JSON format only: {"rating": number, "feedback": "string"}`;

            const result = await chatSession.sendMessage(feedbackPrompt);
            
            let jsonResponse;
            try {
                const mockJsonResponse = result.response.text();
                const extractedJson = mockJsonResponse.match(/{.*}/s)[0];
                jsonResponse = JSON.parse(extractedJson);
            } catch (error) {
                throw new Error('Error processing the API response. Please try again.');
            }

            const resp = await db.insert(userAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestions.interview_questions[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: jsonResponse?.feedback,
                rating: jsonResponse?.rating,
                createdAt: moment().format('DD-MM-YYYY'),
                userEmail: user?.primaryEmailAddress?.emailAddress,
            });

            if (resp) {
                toast.success('Answer saved successfully');
                handleDelete();
            }
        } catch (error) {
            setError(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center w-full max-w-2xl mx-auto'>
            <div className='relative w-full mt-10 bg-slate-200 border rounded-lg p-4 shadow-md'>
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
            <div className="flex gap-2 my-6">
                <Button 
                    disabled={loading} 
                    variant={isRecording ? "destructive" : "default"} 
                    className="flex items-center gap-2"
                    onClick={handleRecordToggle}
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
                <Button
                    variant="outline"
                    onClick={() => setShowTranscript(!showTranscript)}
                    disabled={!userAnswer.trim()}
                >
                    <Eye size={20} />
                </Button>
                <Button
                    variant="outline"
                    onClick={handleDelete}
                    disabled={!userAnswer.trim()}
                >
                    <Trash2 size={20} />
                </Button>
                <Button
                    variant="default"
                    onClick={handleSubmit}
                    disabled={loading || !userAnswer.trim()}
                >
                    <Send size={20} />
                </Button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 mb-4 p-2 bg-red-100 rounded">
                    <AlertCircle size={16} />
                    <p>{error}</p>
                </div>
            )}

            {showTranscript && userAnswer && (
                <div className="w-full p-4 bg-white border rounded-lg shadow-sm mt-4">
                    <h3 className="font-semibold mb-2">Your Answer:</h3>
                    <p className="text-sm text-gray-600">{userAnswer}</p>
                </div>
            )}

            {loading && (
                <div className="mt-4 text-blue-500">
                    Processing your answer...
                </div>
            )}
        </div>
    )
}

export default RecordAnswerSection