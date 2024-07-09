import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, Calendar, PlayCircle, FileText } from 'lucide-react';

function InterviewItemCard({ interview }) {
    const router = useRouter();

    const onStart = () => {
        router.push('/dashboard/interview/' + interview?.mockId);
    };

    const onFeedback = () => {
        router.push('/dashboard/interview/' + interview?.mockId + "/feedback");
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                    <Briefcase className="h-5 w-5" />
                    {interview?.jobPostion}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className='flex items-center text-slate-700'>
                        <Clock className="h-4 w-4 mr-2 text-slate-500" />
                        {interview?.jobExperience} years of Experience
                    </p>
                    <p className='flex items-center text-slate-500 text-sm'>
                        <Calendar className="h-4 w-4 mr-2" />
                        Created: {new Date(interview?.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                <Button variant="outline" className="w-full sm:w-1/2 flex items-center justify-center gap-2" onClick={onFeedback}>
                    <FileText className="h-4 w-4" /> Feedback
                </Button>
                <Button className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark" onClick={onStart}>
                    <PlayCircle className="h-4 w-4" /> Retake Test
                </Button>
            </CardFooter>
        </Card>
    );
}

export default InterviewItemCard;