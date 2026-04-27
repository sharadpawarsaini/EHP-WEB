import { Request, Response } from 'express';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: any) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // Always true for cross-site cookies in modern browsers
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, fullName, dob, gender, bloodGroup } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    if (user) {
      if (fullName && dob && gender && bloodGroup) {
        await Profile.create({
          userId: user._id,
          fullName,
          dob,
          gender,
          bloodGroup,
        });
      }

      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = (req: Request, res: Response): void => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
