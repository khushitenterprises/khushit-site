import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 5000;
const MAX_PORT = Number(process.env.MAX_PORT) || 5010;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(compression()); // Compress all responses for faster transfer
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Khushit Backend API',
        version: '1.0.0',
        endpoints: {
            categories: '/api/categories',
            products: '/api/products',
            productsByCategory: '/api/products/category/:categoryId',
            categoryById: '/api/categories/:id',
            featuredProducts: '/api/products/featured',
            registrations: '/api/registrations',
            adminLogin: '/api/admin/login',
            adminRegistrations: '/api/admin/registrations',
            adminProducts: '/api/admin/products',
            adminSliders: '/api/admin/sliders',
            sliders: '/api/sliders'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const startServer = (port) => {
    const server = app.listen(port, HOST, () => {
        console.log(`Server running on http://${HOST}:${port}`);
        console.log(`API available at http://${HOST}:${port}/api`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            if (nextPort > MAX_PORT) {
                throw new Error(`No available port found between ${DEFAULT_PORT} and ${MAX_PORT}`);
            }
            console.warn(`Port ${port} is in use, retrying on ${nextPort}...`);
            startServer(nextPort);
            return;
        }
        throw error;
    });
};

startServer(DEFAULT_PORT);
