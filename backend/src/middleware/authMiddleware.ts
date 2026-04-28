import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token = req.cookies?.jwt;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      
      // Extract managed member ID from headers
      const managedMemberId = req.headers['x-managed-member-id'];
      if (managedMemberId) {
        req.user.memberId = managedMemberId;
      } else {
        req.user.memberId = null;
      }
      
      next();
    } catch (error) {
      console.log('JWT Verification Failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No JWT token found in cookies');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
