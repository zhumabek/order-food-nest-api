import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class FoodDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  price: number;
}

export class BasketItemDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class FoodEntity {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export interface AppResponse<T = any> {
  message?: string;
  status?: number;
  data?: T;
  total?: number;
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type LoginJwtPayload = {
  id: string;
  sub: string;
};
