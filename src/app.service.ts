import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppResponse, BasketItemDto, FoodDto, FoodEntity } from './app.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Basket,
  BasketDocument,
  BasketItem,
  BasketItemDocument,
  Food,
  FoodDocument,
} from './schemas';
import { Model, Schema } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
    @InjectModel(Basket.name) private basketModel: Model<BasketDocument>,
    @InjectModel(BasketItem.name)
    private basketItemModel: Model<BasketItemDocument>,
  ) {}

  async create(data: FoodDto): Promise<AppResponse<FoodDocument>> {
    try {
      const food = new this.foodModel(data);
      await food.save();

      return { data: food, message: 'Food successfully created.' };
    } catch (error) {
      throw error;
    }
  }

  async addToBasket(
    data: BasketItemDto,
    foodId: string,
    userID: string,
  ): Promise<AppResponse<BasketDocument>> {
    try {
      const basket = await this.basketModel.findOne({ userID }).exec();
      if (!basket) {
        const food = await this.foodModel.findById(foodId);
        const newBasketItem = new this.basketItemModel({
          title: food.title,
          amount: data.amount,
          price: food.price,
          foodId: food._id,
        });

        const newBasket = new this.basketModel({
          userID,
          items: [newBasketItem],
        });

        await newBasket.save();

        return { data: newBasket };
      }

      // ------------------------------

      const food = await this.foodModel.findById(foodId);

      if (basket.items.find((item) => item.foodId.toString() === foodId)) {
        basket.items = basket.items.map((item) => {
          if (item.foodId.toString() === foodId) {
            item.amount += data.amount;
          }

          return item;
        });
      } else {
        basket.items.push(
          new this.basketItemModel({
            title: food.title,
            amount: data.amount,
            price: food.price,
            foodId: food._id,
          }),
        );
      }

      await basket.save();

      return { data: basket };
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<AppResponse<FoodDocument[]>> {
    try {
      const foods = await this.foodModel.find().exec();
      return { data: foods };
    } catch (error) {
      throw error;
    }
  }

  async getBasket(userID: string): Promise<AppResponse<BasketDocument>> {
    try {
      const basket = await this.basketModel.findOne({ userID }).exec();

      if (!basket) {
        const newBasket = new this.basketModel({
          userID,
          items: [],
        });

        await newBasket.save();

        return { data: newBasket };
      }

      return { data: basket };
    } catch (error) {
      throw error;
    }
  }

  async deleteBasketItem(
    userID: string,
    basketItemId: string,
  ): Promise<AppResponse<BasketDocument>> {
    try {
      const basket = await this.basketModel.findOne({ userID }).exec();

      basket.items = basket.items.filter(
        (item) => item._id.toString() !== basketItemId,
      );

      await basket.save();

      return { data: basket };
    } catch (error) {
      throw error;
    }
  }

  async updateBasketItem(
    userID: string,
    basketItemId: string,
    data: BasketItemDto,
  ): Promise<AppResponse<BasketDocument>> {
    try {
      const basket = await this.basketModel.findOne({ userID }).exec();

      basket.items = basket.items.map((item) => {
        if (item._id.toString() !== basketItemId) {
          item.amount = data.amount;
        }

        return item;
      });

      await basket.save();

      return { data: basket };
    } catch (error) {
      throw error;
    }
  }
}
