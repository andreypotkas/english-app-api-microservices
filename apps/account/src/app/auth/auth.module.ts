import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Account, Profile } from '@english-app-api/entities';
import { AuthService } from './auth.service';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Profile]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
