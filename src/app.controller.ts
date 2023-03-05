import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AppResponse, BasketItemDto, CreateOrderDto, FoodDto } from './app.dto';
import {
  BasketDocument,
  FoodDocument,
  OrderDocument,
  UserRoles,
} from './schemas';
import { AuthService } from './auth/auth.service';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Post('/foods')
  @UsePipes(ValidationPipe)
  async createFood(
    @Req() req,
    @Body() data: FoodDto,
  ): Promise<AppResponse<FoodDocument>> {
    await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.createFood(data);
  }

  @Put('/foods/:id')
  @UsePipes(ValidationPipe)
  async updateFood(
    @Req() req,
    @Body() data: FoodDto,
    @Param('id') foodId: string,
  ): Promise<AppResponse<FoodDocument>> {
    await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.updateFood(foodId, data);
  }

  @Get('/foods/:id')
  @UsePipes(ValidationPipe)
  async getFoodByID(
    @Req() req,
    @Param('id') foodId: string,
  ): Promise<AppResponse<FoodDocument>> {
    await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.getFoodById(foodId);
  }

  @Delete('/foods/:id')
  @UsePipes(ValidationPipe)
  async deleteFoodByID(
    @Req() req,
    @Param('id') foodId: string,
  ): Promise<AppResponse<FoodDocument>> {
    await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.deleteFoodById(foodId);
  }

  @Post('/foods/:foodId/addToBasket')
  @UsePipes(ValidationPipe)
  async addToBasket(
    @Body() data: BasketItemDto,
    @Param('foodId') foodId: string,
    @Req() req,
  ): Promise<AppResponse<BasketDocument>> {
    const user = await this.authService.authorize([UserRoles.USER], req);

    return this.appService.addToBasket(data, foodId, user._id);
  }

  @Get('/basket')
  async getById(@Req() req): Promise<AppResponse<BasketDocument>> {
    const user = await this.authService.authorize([UserRoles.USER], req);

    return this.appService.getBasket(user._id);
  }

  @Delete('/basketItem/:id/delete')
  async deleteBasketItem(
    @Req() req,
    @Param('id') id: string,
  ): Promise<AppResponse<BasketDocument>> {
    const user = await this.authService.authorize([UserRoles.USER], req);

    return this.appService.deleteBasketItem(user._id, id);
  }

  @Put('/basketItem/:id/update')
  async updateBasketItem(
    @Req() req,
    @Param('id') id: string,
    @Body() data: BasketItemDto,
  ): Promise<AppResponse<BasketDocument>> {
    const user = await this.authService.authorize([UserRoles.USER], req);

    return this.appService.updateBasketItem(user._id, id, data);
  }

  @Get('/foods')
  getAll(): Promise<AppResponse<FoodDocument[]>> {
    return this.appService.getAllFoods();
  }

  @Get('/orders/all')
  async getAllOrders(@Req() req): Promise<AppResponse<OrderDocument[]>> {
    await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.getAllOrders();
  }

  @Get('/orders')
  async getOrders(@Req() req): Promise<AppResponse<OrderDocument[]>> {
    const user = await this.authService.authorize([UserRoles.USER], req);

    return this.appService.getOrders(user._id);
  }

  @Post('/orders')
  async createOrder(
    @Req() req,
    @Body() data: CreateOrderDto,
  ): Promise<AppResponse> {
    const user = await this.authService.authorize([UserRoles.USER], req);

    return this.appService.createOrder(user, data);
  }

  @Delete('/drop_db')
  async dropDB(): Promise<AppResponse> {
    return this.appService.dropDB();
  }
}
