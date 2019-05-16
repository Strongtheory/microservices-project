import { IsNotEmpty } from 'class-validator';

export class VerifyAuthDto {
  @IsNotEmpty()
  public readonly email: string;

  @IsNotEmpty()
  public readonly password: string;
}
