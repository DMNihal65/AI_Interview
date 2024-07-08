import { Button } from '@/components/ui/button'
import { Mic, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModle';
import { db } from '@/utils/db';
import { userAnswer } from '@/utils/schema';
import moment from 'moment';
import { useUser } from '@clerk/nextjs';
// import { userAnswer } from '@/utils/schema';

function RecordAnswerSection({mockInterviewQuestions,activeQuestionIndex,interviewData}) {

    const [UserAnswer,setUserAnswer] =useState('');

    const {user}=useUser();

    const [loading,setLoading] = useState(false);

    const {
        error,
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

      useEffect(()=>{
        results.map((result)=>{
            setUserAnswer(prevAns=>prevAns+result?.transcript)
      })
      },[results])

      const SaveUserAnswer=async()=>{
        if(isRecording){
            setLoading(true)
            stopSpeechToText()
            if(UserAnswer?.length<10){
                setLoading(false)
                toast('Error While saving Answer, Please Record Again')
                return
            }
            const feedbackPrompt = "Question"+mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question+"User Answer :"+UserAnswer+"Depending on the Question and user answer Please give a rating for the answer and the feedback on the area if the inprovement in just 3 to5 lines to imporve it in the json format with the rating filed and feedback filed";
            const result = await chatSession.sendMessage(feedbackPrompt);

            const mockJsonResponse=result.response.text().replace('```json', "").replace('```', "");
            // const formattedResponse = 
            const jsonResponse = JSON.parse(mockJsonResponse);
            // console.log(jsonResponse);

            const resp = await db.insert(userAnswer).values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestions.interview_questions[activeQuestionIndex]?.question,
                correctAns:mockInterviewQuestions.interview_questions[activeQuestionIndex]?.answer,
                userAns:UserAnswer,
                feedback:jsonResponse?.feedback,
                rating:jsonResponse?.rating,
                createdAt:moment().format('DD-MM-YYYY'),
                userEmail:user?.primaryEmailAddress?.emailAddress,
                          
            })

            if(resp){
                
                toast('Answer Saved Successfully')
                setResults([]);
            }
            setResults([]);

            setLoading(false)

        }
        else{
            startSpeechToText()
        }
      }


  return (
    <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col mt-20 justify-center items-center bg-slate-300 border rounded-lg p-5  '>
        <WebcamIcon width={200} height={200} className='absolute'/>
        <Webcam
        mirrored={true}
            style={{
                height:300,
                width:'100%',
                zIndex:10,
            }}
        />
    </div>
    <Button disabled={loading} variant="outline" className="my-10 flex "
    onClick={SaveUserAnswer}>
    {isRecording?
    <h2 className='flex p-2 text-red-500'>
        <Mic/>Stop Recording
    </h2>
    :'Record Answer'
    }
   </Button>

   {/* <Button onClick={()=>console.log(UserAnswer)}>Show the user Answer</Button>
     */}
    
    </div>
    
  )
}

export default RecordAnswerSection