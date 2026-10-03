import { Server } from 'socket.io';
import { env } from './env.js';

let io = null;

/**
 * Initialize Socket.IO Server
 */
export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: env.CLIENT_URL || '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on('connection', (socket) => {
        const clientIp = socket.handshake.address;
        console.log(`🔌 [SOCKET.IO]: Client connected [ID: ${socket.id}] from ${clientIp}`);

        // Join specific branch or role rooms
        socket.on('join_branch', (branchId) => {
            if (branchId) {
                socket.join(`branch_${branchId}`);
                console.log(`Socket ${socket.id} joined room branch_${branchId}`);
            }
        });

        socket.on('join_user', (userId) => {
            if (userId) {
                socket.join(`user_${userId}`);
                console.log(`Socket ${socket.id} joined user room user_${userId}`);
            }
        });

        socket.on('leave_branch', (branchId) => {
            if (branchId) {
                socket.leave(`branch_${branchId}`);
            }
        });

        // Ping / Pong healthcheck
        socket.on('ping_server', () => {
            socket.emit('pong_server', { timestamp: Date.now() });
        });

        socket.on('disconnect', (reason) => {
            console.log(`🔌 [SOCKET.IO]: Client disconnected [ID: ${socket.id}], reason: ${reason}`);
        });
    });

    return io;
}

/**
 * Real-time event emission helpers
 */
export const realTime = {
    getIO: () => io,

    // Broadcast to all connected clients
    broadcast(event, payload) {
        if (!io) return;
        io.emit(event, {
            ...payload,
            timestamp: new Date().toISOString()
        });
    },

    // Emit to a specific branch room
    emitToBranch(branchId, event, payload) {
        if (!io || !branchId) return;
        io.to(`branch_${branchId}`).emit(event, {
            ...payload,
            branchId,
            timestamp: new Date().toISOString()
        });
    },

    // Emit to a specific user
    emitToUser(userId, event, payload) {
        if (!io || !userId) return;
        io.to(`user_${userId}`).emit(event, {
            ...payload,
            timestamp: new Date().toISOString()
        });
    },

    // Specific ERP Event emitters
    notifyStockAlert(data) {
        this.broadcast('inventory:stock_alert', data);
    },

    notifySaleCreated(data) {
        this.broadcast('sales:order_created', data);
    },

    notifyPurchaseCreated(data) {
        this.broadcast('purchases:order_created', data);
    },

    notifyVoucherPosted(data) {
        this.broadcast('accounting:voucher_posted', data);
    },

    notifyAuditLog(data) {
        this.broadcast('audit:action_logged', data);
    }
};

export default realTime;
