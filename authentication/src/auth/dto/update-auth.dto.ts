import { IsNotEmpty } from 'class-validator';

export class UpdateAuthDto {
  @IsNotEmpty()
  public readonly id: number;

  @IsNotEmpty()
  public readonly property: string;

  @IsNotEmpty()
  public readonly value: string | any;
}
