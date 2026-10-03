import http from 'http';
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initSocket } from './config/socket.js';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.js';

const app = express();
const httpServer = http.createServer(app);

// Initialize Real-time Socket.IO
initSocket(httpServer);

// Security & Core Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Static uploads serving
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Rate limiting
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

// Health check endpoint
app.get('/api/health', (req, res) =>
    res.json({
        success: true,
        data: {
            service: 'nexus-erp-api',
            status: 'healthy',
            version: '2.0.0',
            time: new Date().toISOString(),
            features: {
                redisCaching: true,
                socketIO: true,
                multerUploads: true,
                auditTrail: true
            }
        }
    })
);

// Central API Router
app.use('/api', apiRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Launch DB, Redis, and HTTP Server
async function bootstrap() {
    try {
        await connectDB();
        await connectRedis();

        httpServer.listen(env.PORT, () => {
            console.log(`🚀 Nexus ERP Enterprise API & Socket Server running on port ${env.PORT}`);
        });
    } catch (err) {
        console.error('Bootstrap failure:', err.message);
    }
}

bootstrap();

export { app, httpServer };
