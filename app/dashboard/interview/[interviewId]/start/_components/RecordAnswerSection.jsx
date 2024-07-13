import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, WebcamIcon, AlertCircle, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModle';
import { db } from '@/utils/db';
import { userAnswer } from '@/utils/schema';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';
import { ReactMic } from 'react-mic';

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
    const [UserAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showTranscription, setShowTranscription] = useState(true);
    const [isRecording, setIsRecording] = useState(false);

    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            setError("Browser does not support speech recognition. Please try a different browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setUserAnswer(prevAns => prevAns + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognition.onerror = (event) => {
            setError('Error with speech recognition. Please try again.');
        };

        recognitionRef.current = recognition;
    }, []);

    const startSpeechToText = () => {
        setIsRecording(true);
        recognitionRef.current?.start();
    };

    const stopSpeechToText = () => {
        setIsRecording(false);
        recognitionRef.current?.stop();
    };

    const handleStopRecording = () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const submitUserAnswer = async () => {
        if (UserAnswer?.length < 10) {
            setError('Answer is too short. Please record again.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const feedbackPrompt = `Question: ${mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question}\nUser Answer: ${UserAnswer}\nDepending on the Question and user answer, please give a rating for the answer and feedback on the area of improvement in just 3 to 5 lines in the JSON format with "rating" and "feedback" fields only. The feedback should be in range 1-10 using only numbers (e.g., feedback: 7).`;

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
                setUserAnswer('');
            }
        } catch (error) {
            setError(error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const deleteRecording = () => {
        setUserAnswer('');
        setError(null);
    };

    const toggleTranscription = () => {
        setShowTranscription(!showTranscription);
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
            <div className="flex flex-row gap-2 my-6">
                <Button 
                    disabled={loading} 
                    variant={isRecording ? "destructive" : "default"} 
                    className="flex items-center gap-2"
                    onClick={handleStopRecording}
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
                    disabled={loading} 
                    variant="secondary" 
                    className="flex items-center gap-2"
                    onClick={deleteRecording}
                >
                    <Trash2 />
                    Delete Recording
                </Button>

                <Button 
                    variant="secondary" 
                    className="flex items-center gap-2"
                    onClick={toggleTranscription}
                >
                    {showTranscription ? <EyeOff /> : <Eye />}
                    {showTranscription ? 'Hide Transcription' : 'Show Transcription'}
                </Button>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 mb-4">
                    <AlertCircle size={16} />
                    <p>{error}</p>
                </div>
            )}

            {showTranscription && UserAnswer && (
                <div className="w-full max-w-md p-4 bg-white border rounded-lg shadow-sm mb-4">
                    <h3 className="font-semibold mb-2">Your Answer:</h3>
                    <p className="text-sm text-gray-600">{UserAnswer}</p>
                </div>
            )}

            {!isRecording && UserAnswer && (
                <Button 
                    variant="primary" 
                    className="my-6 flex items-center gap-2"
                    onClick={submitUserAnswer}
                >
                    <CheckCircle />
                    Submit Answer
                </Button>
            )}
        </div>
    );
}

export default RecordAnswerSection;