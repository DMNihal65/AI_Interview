/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://ai_interview_owner:pIf2jnB6XvFG@ep-crimson-glitter-a59ijgnq.us-east-2.aws.neon.tech/ai_interview?sslmode=require',
    }
  };