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
import { AppResponse, BasketItemDto, FoodDto } from './app.dto';
import { BasketDocument, FoodDocument, UserRoles } from './schemas';
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
    // await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.createFood(data);
  }

  @Put('/foods/:id')
  @UsePipes(ValidationPipe)
  async updateFood(
    @Req() req,
    @Body() data: FoodDto,
    @Param('id') foodId: string,
  ): Promise<AppResponse<FoodDocument>> {
    // await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.updateFood(foodId, data);
  }

  @Get('/foods/:id')
  @UsePipes(ValidationPipe)
  async getFoodByID(
    @Req() req,
    @Param('id') foodId: string,
  ): Promise<AppResponse<FoodDocument>> {
    // await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.getFoodById(foodId);
  }

  @Delete('/foods/:id')
  @UsePipes(ValidationPipe)
  async deleteFoodByID(
    @Req() req,
    @Param('id') foodId: string,
  ): Promise<AppResponse<FoodDocument>> {
    // await this.authService.authorize([UserRoles.ADMIN], req);

    return this.appService.deleteFoodById(foodId);
  }

  @Post('/foods/:foodId/addToBasket')
  @UsePipes(ValidationPipe)
  addToBasket(
    @Body() data: BasketItemDto,
    @Param('foodId') foodId: string,
    @Req() req,
  ): Promise<AppResponse<BasketDocument>> {
    if (!req.headers['userid']) {
      throw new ForbiddenException(
        'Апей кокуй UserID header ди кошуп жонотуш керек да. Унутуп калдынбы?',
      );
    }

    return this.appService.addToBasket(data, foodId, req.headers['userid']);
  }

  @Get('/basket')
  getById(@Req() req): Promise<AppResponse<BasketDocument>> {
    if (!req.headers['userid']) {
      throw new ForbiddenException(
        'Апей кокуй UserID header ди кошуп жонотуш керек да. Унутуп калдынбы?',
      );
    }
    return this.appService.getBasket(req.headers['userid']);
  }

  @Delete('/basketItem/:id/delete')
  deleteBasketItem(
    @Req() req,
    @Param('id') id: string,
  ): Promise<AppResponse<BasketDocument>> {
    if (!req.headers['userid']) {
      throw new ForbiddenException(
        'Апей кокуй UserID header ди кошуп жонотуш керек да. Унутуп калдынбы?',
      );
    }
    return this.appService.deleteBasketItem(req.headers['userid'], id);
  }

  @Put('/basketItem/:id/update')
  updateBasketItem(
    @Req() req,
    @Param('id') id: string,
    @Body() data: BasketItemDto,
  ): Promise<AppResponse<BasketDocument>> {
    if (!req.headers['userid']) {
      throw new ForbiddenException(
        'Апей кокуй UserID header ди кошуп жонотуш керек да. Унутуп калдынбы?',
      );
    }
    return this.appService.updateBasketItem(req.headers['userid'], id, data);
  }

  @Get('/foods')
  getAll(): Promise<AppResponse<FoodDocument[]>> {
    return this.appService.getAll();
  }

  @Delete('/drop_db')
  async dropDB(): Promise<AppResponse> {
    return this.appService.dropDB();
  }
}
