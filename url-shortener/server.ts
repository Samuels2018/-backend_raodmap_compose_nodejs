import app from './src/app';
import connectDB from './src/config/db';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  console.log('Database connected successfully');
  
  app.listen(PORT, (err) => {
    if (err) {
      console.error('Error starting server:', err);
      return;
    }

    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});