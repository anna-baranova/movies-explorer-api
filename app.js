const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { errors } = require('celebrate');
const rootRouter = require('./routes');
const serverError = require('./middlewares/serverError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: [
    'https://movie-search.nomoredomains.work',
    'http://movie-search.nomoredomains.work',
    'http://localhost:3000',
  ],
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger); // подключаем логгер запросов

app.use('/', rootRouter); // подключаем все роуты
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(serverError); // централизованный обработчик ошибок

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
