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
import { BasketDocument, FoodDocument } from './schemas';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/foods')
  @UsePipes(ValidationPipe)
  create(@Body() data: FoodDto): Promise<AppResponse<FoodDocument>> {
    return this.appService.create(data);
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
}
