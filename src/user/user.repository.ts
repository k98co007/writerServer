import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<any> {
    try {
      const result = await this.userModel.findOne({ id }).lean();
      return result;
    } catch (err) {
      console.log('error...');
    }
  }

  async findByName(userName: string): Promise<any> {
      try {
        const result = await this.userModel.findOne({ userName }).lean();
        return result;
      } catch (err) {
        console.log('error...');
      }
    }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.userModel.findOne({  where: { email } }).lean();
      return result;
    } catch (err) {
      console.log('error...');
      return null;
    }
  }

  async findBySignupVerifyToken(signupVerifyToken: string): Promise<User | null> {
    const userEntity = await this.userModel.findOne({
      where: { signupVerifyToken }
    });
    if (!userEntity) {
      return null;
    }
  }
}