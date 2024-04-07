import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User{

  @Prop() 
  id: string; 

  @Prop({
    require: false
    }) 
  name: string; 

  @Prop({
    require: false
    }) 
  email: string; 

  @Prop({
    require: false
    }) 
  password: string;

  @Prop({
    require: false
    }) 
  signupVerifyToken: string;
 
}

export const UserSchema = SchemaFactory.createForClass(User);