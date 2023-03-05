import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Basket,
  BasketItem,
  BasketItemSchema,
  BasketSchema,
  Food,
  FoodSchema,
  Order,
  OrderSchema,
  User,
  UserSchema,
} from './schemas';
import { AuthModule, JWT_CONFIG } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://db/nest'),
    // MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
    MongooseModule.forFeature([{ name: Basket.name, schema: BasketSchema }]),
    MongooseModule.forFeature([
      { name: BasketItem.name, schema: BasketItemSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),

    JwtModule.register(JWT_CONFIG),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, Logger],
})
export class AppModule {}
