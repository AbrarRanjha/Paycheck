/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const User = require('../modules/user/model.js');

const authenticate = async (request, reply, next) => {
  try {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      reply.status(401).send({ message: 'Unauthorized: No token provided' });
      return;
    }
    const token = authorizationHeader.split(' ')?.[1];
    if (!token) {
      reply.status(401).send({ message: 'Unauthorized: Invalid token format' });
      return;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.API_SECRET);
      console.log('decodedToken:', decodedToken);
      if (decodedToken.userId) {
        const userId = decodedToken.userId;
        const user = await User.findOne({ where: { id: userId } });
        console.log('user', userId);
        if (!user) {
          reply.status(401).send({ message: 'Unauthorized: User not found' });
        } else {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
            reply.status(401).send({ message: 'Unauthorized: Token expired' });
          } else {
            request.user = user;
            return next();
          }
        }
      } else {
        reply.status(401).send({ message: 'Unauthorized: Invalid token' });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      reply.status(401).send({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  }
};
const adminAuthenticate = async (request, reply, next) => {
  try {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      reply.status(401).send({ message: 'Unauthorized: No token provided' });
      return;
    }
    const token = authorizationHeader.split(' ')?.[1];
    if (!token) {
      reply.status(401).send({ message: 'Unauthorized: Invalid token format' });
      return;
    }

    try {
      const decodedToken = jwt.verify(token, process.env.API_SECRET);
      console.log('decodedToken:', decodedToken);
      if (decodedToken.userId) {
        const userId = decodedToken.userId;
        const user = await User.findOne({ where: { id: userId } });
        console.log('user', userId);
        if (!user) {
          reply.status(401).send({ message: 'Unauthorized: User not found' });
        } else {
          const currentTimestamp = Math.floor(Date.now() / 1000);
          if (
            (decodedToken.exp && decodedToken.exp < currentTimestamp) ||
            user?.role != 'admin'
          ) {
            reply.status(401).send({ message: 'Unauthorized' });
          } else {
            request.user = user;
            return next();
          }
        }
      } else {
        reply.status(401).send({ message: 'Unauthorized: Invalid token' });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      reply.status(401).send({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = { authenticate, adminAuthenticate };
