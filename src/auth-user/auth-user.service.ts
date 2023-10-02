import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserDtoSignin, ForgotPasswordDto, ResetPasswordDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Token, User, UserToken } from './types';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mailer/mailer.service';
import { Request, Response } from 'express';

@Injectable()
export class AuthUserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signin(dto: AuthUserDtoSignin): Promise<UserToken> {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Compte inexistant');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches)
      throw new ForbiddenException('Mot de passe incorrect');

    const token = await this.getToken(
      user.id,
      user.firstname,
      user.lastname,
      user.registrationnumber,
      user.phone,
      user.email,
      user.level,
      user.isadmin,
      user.role,
    );

    /* res.cookie('dadelions_token', token.access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    }); */

    return [user, token];
  }

  decodeToken(req: Request) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const secret = 'at-secret';
    const data = this.jwtService.verify(token, { secret });
    delete data.iat;
    delete data.exp;

    return data;
  }

  async isLoggedIn(req: Request, res: Response): Promise<any> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Session invalid');
    }

    try {
      const decoded = this.decodeToken(req);
      req.user = decoded;
      console.log(req.user);
    } catch (err) {
      throw new UnauthorizedException('Session invalid');
    }
    res.send(req.user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const token = await Promise.all([
      this.jwtService.signAsync(dto, {
        secret: 'super-secret',
        expiresIn: 60 * 15,
      }),
    ]);

    const userEmail = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!userEmail) throw new ForbiddenException("Ce compte n'éxiste pas");

    /* console.log(token[0]); */

    await this.mailService
      .sendMailForgotPassword(dto.email, token[0])
      .then(() => console.log('Vérifier votre boîte email!'))
      .catch((e) => {
        console.log('email-error', e);
        throw new ForbiddenException(
          "Un problème s'est produit, vérifier votre connexion internet!",
        );
      });
  }

  async resetPassword(dto: ResetPasswordDto, data): Promise<User> {
    try {
      const secret = 'super-secret';
      const newPassword = this.jwtService.verify(data, { secret: secret });
      delete newPassword.iat;
      delete newPassword.exp;
      const hash = await this.hashData(dto.password);
      const newUserPassword = await this.prisma.users.update({
        data: {
          password: hash,
        },
        where: {
          email: newPassword.email,
        },
      });
      return await newUserPassword;
    } catch (e) {
      throw new ForbiddenException(
        "Ce lien a éxpiré! Vous ne pouvez plus l'utiliser pour recupérer votre mot de passe",
      );
    }
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getToken(
    id: number,
    firstname: string,
    lastname: string,
    registrationnumber: string,
    phone: string,
    email: string,
    level: number,
    isadmin: boolean,
    role: number,
  ): Promise<Token> {
    const [at] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          firstname,
          lastname,
          registrationnumber,
          phone,
          email,
          level,
          isadmin,
          role,
        },
        {
          secret: 'at-secret',
          expiresIn: '1d',
        },
      ),
    ]);

    return {
      access_token: at,
    };
  }
}
