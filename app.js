const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');

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

app.use(cors);

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
