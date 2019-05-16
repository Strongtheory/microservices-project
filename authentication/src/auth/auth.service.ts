import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { Auth } from './auth.entity';
import { CreateAuthDto, UpdateAuthDto, VerifyAuthDto } from './dto/index';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(Auth)
    private readonly _authRepository: Repository<Auth>,
  ) {}

  // GET /auth/all
  public async findAllAuthRecords(): Promise<Auth[]> {
    return this._authRepository.find().catch(() => {
      throw new RpcException(
        new NotFoundException('Could not retrieve all auth records'),
      );
    });
  }

  // GET /auth/:id
  public async findAuthRecordById(id: number): Promise<Auth> {
    return this._authRepository.findOneOrFail({ id }).catch(() => {
      throw new RpcException(
        new NotFoundException('Could not find auth record with id'),
      );
    });
  }

  // GET /auth/:email
  public async findAuthRecordByEmail(email: string): Promise<Auth> {
    return this._authRepository.findOneOrFail({ email }).catch(() => {
      throw new RpcException(
        new NotFoundException('Could not find auth record with email'),
      );
    });
  }

  // POST /auth/signup
  public async createAuthRecord(dto: CreateAuthDto): Promise<Auth> {
    const record = await this._authRepository.findOne({ email: dto.email });
    if (record) {
      throw new RpcException(
        new ConflictException('Auth record with email already exists'),
      );
    }
    return this.toAuthRecord(
      await this._authRepository
        .save(Object.assign(new Auth(), dto))
        .catch(() => {
          throw new RpcException(
            new UnprocessableEntityException(
              'Auth record could not be created',
            ),
          );
        }),
    );
  }

  // POST /auth/signin
  public async verifyToken(dto: VerifyAuthDto): Promise<Auth> {
    const record = await this._authRepository.findOne({ email: dto.email });
    if (!record) {
      throw new RpcException(
        new NotFoundException('Auth record with email does not exist'),
      );
    }
    const passwordHash = crypto
      .createHmac('sha256', record.passwordSalt)
      .update(dto.password)
      .digest('hex');
    if (record.password === passwordHash) {
      return this.toAuthRecord(record);
    } else {
      throw new RpcException(
        new UnauthorizedException('Password or email is incorrect'),
      );
    }
  }

  // PATCH /auth/update
  public async patchAuthRecord(dto: UpdateAuthDto): Promise<Auth> {
    const record = await this._authRepository.findOne({ id: dto.id });
    if (!record) {
      throw new RpcException(
        new NotFoundException('Auth record with id does not exist'),
      );
    }
    await this._authRepository
      .update({ id: dto.id }, { [dto.property]: dto.value })
      .catch(() => {
        throw new RpcException(
          new UnprocessableEntityException('Could not update auth record'),
        );
      });
    return this.findAuthRecordById(dto.id);
  }

  // DELETE /auth/delete/:id
  public async deleteAuthRecordById(id: number) {
    await this._authRepository
      .findOneOrFail({ id })
      .catch(() => {
        throw new RpcException(
          new NotFoundException(
            'Auth record to delete with provided ID does not exist',
          ),
        );
      })
      .then(x =>
        this._authRepository.remove(x).catch(() => {
          throw new RpcException(
            new UnprocessableEntityException(
              'Could not delete auth record (ID)',
            ),
          );
        }),
      );
  }

  private toAuthRecord(record: Auth): any {
    const { password, passwordSalt, ...auth } = record;
    return auth;
  }
}
