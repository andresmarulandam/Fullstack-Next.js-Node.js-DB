import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { initializeDatabase } from './db/init';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  initializeDatabase()
    .then(() =>
      app.listen(PORT, () =>
        console.log(`🚀 Server on http://localhost:${PORT}`),
      ),
    )
    .catch((err) => {
      console.error('❌ Error:', err);
      process.exit(1);
    });
}

export default app;
