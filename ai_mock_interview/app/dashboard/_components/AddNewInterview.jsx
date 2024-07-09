"use client"


// import { Button } from '@/components/button'
// import  Button  from '@/components/ui/butto/n'
// import { Button } from '@/Components/ui/button'
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import { ChatSession } from '@google/generative-ai';
import { chatSession } from '@/utils/GeminiAiModle';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
// import clsx from 'clsx';



  

function AddNewInterview() {
  const [openDialog, setOpenDailog] = useState(false);

  const [jobPostion, setJobPostion] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router=useRouter();

  const onsubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    const numQuestions = parseInt(process.env.NEXT_PUBLIC_NO_OF_QUESTIONS) || 5;
  
    const inputprompt = `Generate an interview questionnaire with answers for the following job role. Strictly adhere to this JSON format:
  {
    "interview_questions": [
      {
        "question": "Question text here",
        "answer": "Answer text here"
      }
    ]
  }
  Provide exactly ${numQuestions} questions and answers. Ensure questions are relevant to the role, description, and experience level.
  
  Job Role: ${jobPostion}
  Job Description: ${jobDesc}
  Years of Experience: ${jobExperience}
  
  The candidate should have strong problem-solving skills, coding passion, and ability to work in a fast-paced environment.`;
  
    try {
      const result = await chatSession.sendMessage(inputprompt);
      const responseText = result.response.text();
  
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in the response");
      }
  
      const jsonResponse = JSON.parse(jsonMatch[0]);
  
      // Validate the JSON structure
      if (!jsonResponse.interview_questions || !Array.isArray(jsonResponse.interview_questions) || jsonResponse.interview_questions.length !== numQuestions) {
        throw new Error("Invalid JSON structure or incorrect number of questions");
      }
  
      // Insert into database
      const response = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jobPostion: jobPostion,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        jsonMockResp: jsonResponse,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      }).returning({ mockId: MockInterview.mockId });
  
      if (response && response[0]?.mockId) {
        setOpenDailog(false);
        router.push('/dashboard/interview/' + response[0].mockId);
      } else {
        throw new Error("Failed to insert into database");
      }
  
    } catch (error) {
      console.error("Error:", error.message);
      // Handle the error (e.g., show an error message to the user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='bg-sky-400 text-white p-5 border rounded-lg hover:scale-105 hover:shadow-lg transition-all cursor-pointer'
        onClick={() => setOpenDailog(true)}>
        <h2 className='font-bold text-lg text-slate-600 text-center text-white '>+ Add New Interview</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className='font-bold text-2xl'>Tell us more about the job you are interviewing</DialogTitle>
            <DialogDescription>
              <form onSubmit={onsubmit}>
                <div>
                  <h2>Add More Details about your job position/role, Job Discription and Years of Experice</h2>

                  <div className='mt-7 my-2'>
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Devloper"
                      required
                      onChange={(event) => setJobPostion(event.target.value)}
                    />
                  </div>

                  <div className='my-3'>
                    <label>Job Discription/Tech Stack (In Short)</label>
                    <Textarea placeholder="Ex. React, Angular, Nodejs, Python etc."
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    ></Textarea>
                  </div>

                  <div className='my-3'>
                    <label>Years of Experice</label>
                    <Input placeholder="Ex. 5" type="number" max="20"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    ></Input>
                  </div>
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant="ghost" onClick={() => setOpenDailog(false)}>Cancle</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <><LoaderCircle className='animate-spin' />Generating Questions</> : "Start Interview"}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview;
