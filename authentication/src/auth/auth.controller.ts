import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ExceptionFilter } from 'src/common/filters/exception.filter';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { CreateAuthDto, UpdateAuthDto, VerifyAuthDto } from './dto/index';

@Controller()
@UseFilters(ExceptionFilter)
export class AuthController {
  public constructor(private readonly _authService: AuthService) {}

  // GET /auth/all
  @MessagePattern({ cmd: 'getAllAuthRecords' })
  public async getAllAuthRecords(): Promise<Auth[]> {
    return this._authService.findAllAuthRecords();
  }

  // GET /auth/:id
  @MessagePattern({ cmd: 'getAuthRecordById' })
  public async getAuthRecordById(id: number): Promise<Auth> {
    return this._authService.findAuthRecordById(id);
  }

  // GET /auth/:email
  @MessagePattern({ cmd: 'getAuthRecordByEmail' })
  public async getAuthRecordByEmail(email: string): Promise<Auth> {
    return this._authService.findAuthRecordByEmail(email);
  }

  // POST /auth/signup
  @MessagePattern({ cmd: 'signup' })
  public async signup(dto: CreateAuthDto): Promise<Auth> {
    return this._authService.createAuthRecord(dto);
  }

  // POST /auth/signin
  @MessagePattern({ cmd: 'signin' })
  public async signin(dto: VerifyAuthDto): Promise<Auth> {
    return this._authService.verifyToken(dto);
  }

  // PATCH /auth/update
  @MessagePattern({ cmd: 'updateAuthRecord' })
  public async updateAuthRecord(dto: UpdateAuthDto): Promise<Auth> {
    return this._authService.patchAuthRecord(dto);
  }

  // DELETE /auth/delete/:id
  @MessagePattern({ cmd: 'deleteAuthRecord' })
  public async deleteAuthRecord(id: number) {
    await this._authService.deleteAuthRecordById(id);
  }
}
