"use client"
import { db } from '@/utils/db';
import { userAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Star, Check, X, AlertCircle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";

function Feedback({ params }) {
    const [feedbackList, setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        GetFeedback();
    }, []);

    const GetFeedback = async () => {
        try {
            setLoading(true);
            const result = await db.select()
                .from(userAnswer)
                .where(eq(userAnswer.mockIdRef, params.interviewId))
                .orderBy(userAnswer.id);

            if (result.length > 0) {
                setFeedbackList(result);
                calculateOverallRating(result);
            } else {
                setError("No feedback found for this interview.");
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while fetching your feedback. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const calculateOverallRating = (feedback) => {
        const totalRating = feedback.reduce((acc, item) => acc + item.rating, 0);
        const averageRating = totalRating / feedback.length;
        setOverallRating(averageRating);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <RefreshCcw className="animate-spin h-10 w-10 text-primary mb-4" />
                <p className="text-lg text-slate-600">Loading your feedback...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">{error}</h2>
                <Button
                    onClick={() => router.replace('/dashboard')}
                    variant="outline"
                    className="hover:bg-primary hover:text-white transition-all"
                >
                    <Home className="mr-2 h-4 w-4" /> Go to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto p-6 md:p-10'>
            <h1 className='text-4xl font-bold text-emerald-500 mb-4'>Congratulations!</h1>
            <h2 className='text-2xl font-semibold text-slate-700 mb-6'>Here's your detailed interview feedback</h2>
            
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <h3 className='text-xl font-bold text-primary mb-4'>
                    Overall Interview Rating
                </h3>
                <div className="flex items-center mb-2">
                    <Star className="h-8 w-8 text-yellow-400 mr-2" />
                    <span className="text-3xl font-bold text-slate-800">{overallRating.toFixed(1)}</span>
                    <span className="text-xl text-slate-600">/10</span>
                </div>
                <Progress value={overallRating * 10} className="w-full h-2" />
            </div>

            <div className="space-y-6">
                {feedbackList.map((item, index) => (
                    <Collapsible key={index} className='bg-white shadow-md rounded-lg overflow-hidden'>
                        <CollapsibleTrigger className='p-4 w-full text-left flex justify-between items-center hover:bg-slate-50 transition-colors'>
                            <div>
                                <span className="text-sm font-semibold text-slate-500">Question {index + 1}</span>
                                <p className="text-lg font-medium text-slate-800">{item.question}</p>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2 font-semibold text-primary">{item.rating}/10</span>
                                <ChevronsUpDown className='h-5 w-5 text-slate-400' />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className='p-4 bg-slate-50'>
                            <div className='space-y-4'>
                                <FeedbackItem
                                    icon={<Check className="h-5 w-5 text-green-500" />}
                                    title="Your Answer"
                                    content={item.userAns}
                                    bgColor="bg-green-50"
                                />
                                <FeedbackItem
                                    icon={<Star className="h-5 w-5 text-yellow-500" />}
                                    title="Example Correct Answer"
                                    content={item.correctAns}
                                    bgColor="bg-yellow-50"
                                />
                                <FeedbackItem
                                    icon={<AlertCircle className="h-5 w-5 text-blue-500" />}
                                    title="Feedback"
                                    content={item.feedback}
                                    bgColor="bg-blue-50"
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>

            <div className="mt-10 text-center">
                <Button
                    onClick={() => router.replace('/dashboard')}
                    variant="outline"
                    size="lg"
                    className="hover:bg-primary hover:text-white transition-all"
                >
                    <Home className="mr-2 h-5 w-5" /> Back to Dashboard
                </Button>
            </div>
        </div>
    );
}

function FeedbackItem({ icon, title, content, bgColor }) {
    return (
        <div className={`${bgColor} p-3 rounded-lg`}>
            <div className="flex items-center mb-2">
                {icon}
                <h3 className="ml-2 font-semibold text-slate-700">{title}</h3>
            </div>
            <p className="text-slate-600">{content}</p>
        </div>
    );
}

export default Feedback;