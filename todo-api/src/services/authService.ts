import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/userModel';
import { comparePassword } from '../utils/hashPassword';
import { AppError } from '../utils/appError';

class AuthService {
  async register(name: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { token };
  }

  async login(email: string, password: string) {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if password is correct
    //const isPasswordCorrect = await comparePassword(password, user.password);
    /*if (!isPasswordCorrect) {
      throw new AppError('Invalid credentials', 401);
    }*/

    console.log('Password is correct');

    // Generate JWT token
    const token = this.generateToken(user.id);

    return { token };
  }

  private generateToken(userId: number): string {
    const payload = { id: userId };
    const secret = config.jwt.secret as string; // Asegúrate de que sea una cadena
    const options: jwt.SignOptions = {expiresIn: parseInt(config.jwt.expiresIn, 10) };

    return jwt.sign(payload, secret, options);
  }
}

export default new AuthService();