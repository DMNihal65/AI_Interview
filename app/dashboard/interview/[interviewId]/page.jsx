"use client";
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, Camera, Mic, Info, CheckCircle, ArrowRightCircle, Loader2, BriefcaseIcon, ClockIcon, FileTextIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      setInterviewData(result[0]);
    } catch (err) {
      setError("Failed to load interview details. Please try again.");
      toast.error("Error loading interview details");
    } finally {
      setLoading(false);
    }
  };

  const enableWebcam = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setWebCamEnabled(true);
      toast.success("Webcam enabled successfully");
    } catch (err) {
      toast.error("Failed to enable webcam. Please check your permissions.");
    }
  };

  const enableMicrophone = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicEnabled(true);
      toast.success("Microphone enabled successfully");
    } catch (err) {
      toast.error("Failed to enable microphone. Please check your permissions.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading interview details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-10">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='container mx-auto my-10 px-6 max-w-7xl'>
      <h1 className='font-bold text-4xl text-center mb-8 text-primary'>Welcome to Your AI Mock Interview</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BriefcaseIcon className="h-6 w-6" /> Interview Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-primary" />
              <strong>Job Position:</strong> {interviewData.jobPostion}
            </div>
            <div className="flex items-start gap-2">
              <FileTextIcon className="h-5 w-5 text-primary mt-1" />
              <div>
                <strong>Job Description:</strong>
                <p className="mt-1">{interviewData.jobDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-primary" />
              <strong>Years of Experience:</strong> {interviewData.jobExperience}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border border-yellow-400">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-yellow-500">
              <Lightbulb className="h-6 w-6 text-yellow-500" /> Important Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm ">
            <p>Before we begin, please ensure that your webcam and microphone are enabled.</p>
            <p>We do not record your video or audio. All information collected is anonymous and confidential.</p>
            <p>Our system is designed to ensure your safety and security, complying with all relevant data protection regulations.</p>
            <p>By proceeding, you acknowledge that you have read and understood our terms and conditions.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Camera className="h-6 w-6" /> Device Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {webCamEnabled ? (
            <Webcam
              className='my-5 bg-secondary border p-2 rounded-lg shadow-lg'
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored
              style={{
                height: 288,
                width: 600,
              }}
            />
          ) : (
            <div className="bg-secondary p-10 rounded-lg border mb-5 flex items-center justify-center">
              <Camera className="h-32 w-32 text-gray-400" />
            </div>
          )}
          <div className="flex gap-4">
            <Button
              variant={webCamEnabled ? "outline" : "default"}
              className="flex items-center gap-2"
              onClick={enableWebcam}
              disabled={webCamEnabled}
            >
              <Camera className="h-4 w-4" />
              {webCamEnabled ? "Webcam Enabled" : "Enable Webcam"}
            </Button>
            <Button
              variant={micEnabled ? "outline" : "default"}
              className="flex items-center gap-2"
              onClick={enableMicrophone}
              disabled={micEnabled}
            >
              <Mic className="h-4 w-4" />
              {micEnabled ? "Microphone Enabled" : "Enable Microphone"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end mt-8'>
        <Link href={'/dashboard/interview/' + params.interviewId + '/start'}>
          <Button 
            className='px-6 py-3 text-lg flex items-center gap-2'
            disabled={!webCamEnabled || !micEnabled}
          >
            Start Interview <ArrowRightCircle className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;