import app from './src/app';
import config from './src/config/config';
import { sequelize } from './src/models/index';

const PORT = config.port;

const startServer = async () => {
  
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

// Test database connection and sync models
/*sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
*/