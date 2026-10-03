import dotenv from 'dotenv'
dotenv.config()
export const env={PORT:Number(process.env.PORT||5000),NODE_ENV:process.env.NODE_ENV||'development',MONGO_URI:process.env.MONGO_URI||'mongodb://127.0.0.1:27017/nexus_erp',JWT_SECRET:process.env.JWT_SECRET||'dev-secret',CLIENT_URL:process.env.CLIENT_URL||'http://localhost:5173'}
