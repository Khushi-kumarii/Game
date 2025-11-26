const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://khushik7698_db_user:KjVyCxIyc7LZnPju@tictoe.bnfflto.mongodb.net/tictactoe?retryWrites=true&w=majority',
)
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log(err));

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
