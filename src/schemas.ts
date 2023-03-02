import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, ObjectId } from 'mongoose';

export type FoodDocument = HydratedDocument<Food>;

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true, type: String, unique: true })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;
}

export const FoodSchema = SchemaFactory.createForClass(Food);

@Schema()
export class BasketItem {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Number, default: 0 })
  amount: number;

  @Prop({ required: true, type: Number, default: 0 })
  price: number;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  foodId: ObjectId;
}

export const BasketItemSchema = SchemaFactory.createForClass(BasketItem);
export type BasketItemDocument = HydratedDocument<BasketItem>;

@Schema({ timestamps: true })
export class Basket {
  @Prop({ required: true, type: String, unique: true })
  userID: string;

  @Prop({ required: true, type: [BasketItemSchema] })
  items: BasketItemDocument[];
}

export type BasketDocument = HydratedDocument<Basket>;
export const BasketSchema = SchemaFactory.createForClass(Basket);

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
