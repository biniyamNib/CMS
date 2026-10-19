// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import User from '../models/userModel.js';
// import Role from '../models/roleModel.js';
// import UserRoleMapping from '../models/userRoleMappingModel.js';

// export const protect = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       if (!token || token === 'undefined' || token === 'null') {
//         res.status(401);
//         throw new Error('Not authorized, invalid token');
//       }
//       if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
//         res.status(401);
//         throw new Error('Not authorized, malformed token');
//       }
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findByPk(decoded.userId, {
//         attributes: { exclude: ['password'] },
//         include: [
//           { model: Role, as: 'PrimaryRole', attributes: ['RoleName'] },
//           { model: Role, as: 'Roles', through: { model: UserRoleMapping, attributes: [] }, attributes: ['RoleName'] },
//         ],
//       });
//       if (!user) {
//         res.status(401);
//         throw new Error('Not authorized, user not found');
//       }
//       req.user = {
//         userId: user.userId,
//         username: user.username,
//         email: user.email,
//         role: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName,
//         roles: user.Roles.map(r => r.RoleName),
//       };
//       next();
//     } catch (error) {
//       console.error('Auth middleware error:', { 
//         message: error.message, 
//         stack: error.stack, 
//         token: token ? `${token.slice(0, 10)}...` : 'none',
//         authHeader: req.headers.authorization ? `${req.headers.authorization.slice(0, 20)}...` : 'none'
//       });
//       res.status(401);
//       next(new Error(`Not authorized, ${error.message.toLowerCase() || 'token failed'}`));
//     }
//   } else {
//     console.error('Auth middleware error: No authorization header', { headers: req.headers });
//     res.status(401);
//     next(new Error('Not authorized, no token'));
//   }
// });

// export const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !req.user.roles.some(role => roles.includes(role))) {
//       res.status(403);
//       next(new Error('Not authorized, insufficient permissions'));
//     }
//     next();
//   };
// };




// Latest

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import UserRoleMapping from '../models/userRoleMappingModel.js';
import UserCompany from '../models/userCompanyModel.js';
import Company from '../models/companyModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token || token === 'undefined' || token === 'null') {
        res.status(401);
        throw new Error('Not authorized, invalid token');
      }
      if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)) {
        res.status(401);
        throw new Error('Not authorized, malformed token');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] },
        include: [
          { model: Role, as: 'PrimaryRole', attributes: ['RoleName'] },
          { model: Role, as: 'Roles', through: { model: UserRoleMapping, attributes: [] }, attributes: ['RoleName'] },
          { model: Company, as: 'Companies', through: { model: UserCompany, attributes: [] }, attributes: ['CompanyId'] },
        ],
      });
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      req.user = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        primaryRole: user.PrimaryRole?.RoleName || user.Roles[0]?.RoleName,
        roles: user.Roles.map(r => r.RoleName),
        CompanyId: user.Companies[0]?.CompanyId || null, // Single company for Admin
      };
      next();
    } catch (error) {
      console.error('Auth middleware error:', { 
        message: error.message, 
        stack: error.stack, 
        token: token ? `${token.slice(0, 10)}...` : 'none',
        authHeader: req.headers.authorization ? `${req.headers.authorization.slice(0, 20)}...` : 'none'
      });
      res.status(401);
      next(new Error(`Not authorized, ${error.message.toLowerCase() || 'token failed'}`));
    }
  } else {
    console.error('Auth middleware error: No authorization header', { headers: req.headers });
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles.some(role => roles.includes(role))) {
      res.status(403);
      next(new Error('Not authorized, insufficient permissions'));
    }
    next();
  };
};