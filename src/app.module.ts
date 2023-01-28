import { Module } from '@nestjs/common';
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
} from './schemas';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://db/nest'),
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
    MongooseModule.forFeature([{ name: Basket.name, schema: BasketSchema }]),
    MongooseModule.forFeature([
      { name: BasketItem.name, schema: BasketItemSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
