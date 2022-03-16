const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const ConflictingRequestError = require('../errors/conflicting-request-error');
const NotFoundError = require('../errors/not-found-error');
// const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  return User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      throw err;
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email })
    .then((mail) => {
      if (mail) {
        throw new ConflictingRequestError('Пользователь с таким email уже зарегистрирован');
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            name, email, password: hash,
          })
            .then((user) => res
              .status(201)
              .send({
                data: {
                  email: user.email,
                  name: user.name,
                  _id: user._id,
                },
              }))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                throw new BadRequestError('Введены некорректные данные');
              } else {
                next(err);
              }
            })
            .catch(next);
        });
      return true;
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'my-super-secret-key',
        { expiresIn: '7d' },
      );
      // eslint-disable-next-line no-console
      console.log('token', token);
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      })
        .status(200).send({ token, user });
    })
    // .catch(() => {
    //   throw new UnauthorizedError('Необходима авторизация');
    // })
    .catch(next);
};

const logout = (req, res) => res.clearCookie('jwt').send({ message: 'Вы вышли из приложения' });

module.exports = {
  getUser,
  updateUserInfo,
  createUser,
  login,
  logout,
};
