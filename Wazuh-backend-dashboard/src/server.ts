import 'dotenv/config'; // This must be the first import
import app from './app';
import connectDB from './config/db';

connectDB(); // Initialize DB connection

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
