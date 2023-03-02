import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppResponse, BasketItemDto, FoodDto } from './app.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Basket,
  BasketDocument,
  BasketItem,
  BasketItemDocument,
  Food,
  FoodDocument,
  User,
  UserDocument,
} from './schemas';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Food.name) private foodModel: Model<FoodDocument>,
    @InjectModel(Basket.name) private basketModel: Model<BasketDocument>,
    @InjectModel(BasketItem.name)
    private basketItemModel: Model<BasketItemDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createFood(data: FoodDto): Promise<AppResponse<FoodDocument>> {
    try {
      const food = new this.foodModel(data);
      await food.save();

      return { data: food, message: 'Food successfully created.' };
    } catch (error) {
      throw error;
    }
  }

  async updateFood(
    id: string,
    data: FoodDto,
  ): Promise<AppResponse<FoodDocument>> {
    try {
      await this.foodModel.findByIdAndUpdate(id, data);

      return {
        data: await this.foodModel.findById(id),
        message: 'Food successfully updated.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getFoodById(id: string): Promise<AppResponse<FoodDocument>> {
    try {
      const food = await this.foodModel.findById(id);
      if (!food) {
        throw new HttpException('Food not found.', HttpStatus.NOT_FOUND);
      }

      return { data: food };
    } catch (error) {
      throw error;
    }
  }

  async deleteFoodById(id: string): Promise<AppResponse> {
    try {
      const food = await this.foodModel.findByIdAndDelete(id);
      if (!food) {
        throw new HttpException('Food not found.', HttpStatus.NOT_FOUND);
      }

      return { message: 'Food successfully deleted' };
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
        if (item._id.toString() === basketItemId) {
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

  async dropDB(): Promise<AppResponse> {
    try {
      // Get all collections

      // Create an array of collection names and drop each collection
      await Promise.all([
        this.basketItemModel.deleteMany(),
        this.basketModel.deleteMany(),
        this.foodModel.deleteMany(),
        this.userModel.deleteMany(),
      ]);

      return { message: 'SUCCESS' };
    } catch (error) {
      throw error;
    }
  }
}
