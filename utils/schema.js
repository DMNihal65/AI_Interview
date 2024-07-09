import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";


export const MockInterview = pgTable('mockInterview',
    {
        id:serial('id').primaryKey(),
        jsonMockResp:text('jsonMockResp').notNull(),
        jobPostion:varchar('jobPostion').notNull(),
        jobDesc:varchar('jobDesc').notNull(),
        jobExperience:varchar('jobExperience').notNull(),
        createdBy:varchar('createdBy').notNull(),
        createdAt:varchar('createdAt'),
        mockId:varchar('mockId').notNull(),
        
        
    }
)

export const userAnswer = pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockIdRef').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt'),
})