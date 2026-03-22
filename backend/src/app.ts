import express from 'express';
import routes from './routes';
import todoRoutes from './routes/todo.route';
import authRoutes from './routes/auth.route';
import { errorMiddleware } from './middleware/error.middleware';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

import './config/passport'; // just execute file

const app = express();

app.use(express.json());
app.use(passport.initialize()); // ✅ REQUIRED
app.use('/api', routes);
app.use('/api/todos', todoRoutes);

app.use('/api/auth', authRoutes);

app.get('/', () => {
  console.log('Api is working ...');
});

// ✅ Error middleware MUST be last
app.use(errorMiddleware);

export default app;
