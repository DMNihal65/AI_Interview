"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        user && GetInterviewList();
    }, [user]);

    const GetInterviewList = async () => {
        try {
            setLoading(true);
            const result = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(MockInterview.id));

            setInterviewList(result);
        } catch (error) {
            console.error(error);
            setError("Failed to load interview list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading interviews...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className='bg-white p-4 sm:p-6 rounded-lg shadow-lg'>
            <h2 className='font-semibold text-xl sm:text-2xl mb-4 sm:mb-6 text-primary'>Previous Mock Interviews</h2>
            {interviewList.length === 0 ? (
                <p className='text-center font-medium text-lg text-slate-600 py-8'>
                    No previous interviews found. Start your first interview now!
                </p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 sm:gap-6'>
                    {interviewList.map((interview, index) => (
                        <InterviewItemCard key={index} interview={interview} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default InterviewList;