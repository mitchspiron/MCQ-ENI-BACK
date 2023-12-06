import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDto, UsersInfoDto, UsersPasswordDto } from './dto';
import {
  Users,
  UsersCreate,
  UsersPassword,
  UserTokenWithoutPassword,
} from './types';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from '../auth-user/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async getUserBySlug(slug: string): Promise<Users> {
    const UsersById = await this.prisma.users.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        registrationnumber: true,
        slug: true,
        phone: true,
        email: true,
        password: true,
        levels: {
          select: {
            id: true,
            designation: true,
          },
        },
        isadmin: true,
        user_role: {
          select: {
            id: true,
            role: true,
          },
        },
        createdAt: true,
      },
    });

    if (!UsersById) throw new ForbiddenException("L'utilisateur n'existe pas!");
    return UsersById;
  }

  async getUsers(): Promise<Users[]> {
    const users = await this.prisma.users.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        registrationnumber: true,
        slug: true,
        phone: true,
        email: true,
        password: true,
        levels: {
          select: {
            id: true,
            designation: true,
          },
        },
        isadmin: true,
        user_role: {
          select: {
            id: true,
            role: true,
          },
        },
        createdAt: true,
      },
    });

    if (users.length == 0) {
      throw new ForbiddenException("Il n'y a aucun utilisateur!");
    }
    return users;
  }

  async createUsers(dto: UsersDto): Promise<UsersCreate> {
    const userRegistrationNumber = await this.prisma.users.findUnique({
      where: {
        registrationnumber: dto.registrationnumber,
      },
    });

    const slug = dto.registrationnumber
      .toLocaleLowerCase()
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
      .trim()
      .split(' ')
      .join('-');

    const slugExists = await this.prisma.users.findUnique({
      where: {
        slug,
      },
    });

    if (userRegistrationNumber || slugExists)
      throw new ForbiddenException(
        'Ce numéro matricule appartient déjà à un utilisateur',
      );

    const userPhone = await this.prisma.users.findUnique({
      where: {
        phone: dto.phone,
      },
    });

    if (userPhone)
      throw new ForbiddenException(
        'Ce numéro de téléphone appartient déjà à un utilisateur',
      );

    const userEmail = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userEmail)
      throw new ForbiddenException(
        'Cet email appartient déjà à un utilisateur',
      );

    const userLevel = await this.prisma.levels.findUnique({
      where: {
        id: Number(dto.level),
      },
    });

    if (!userLevel)
      throw new ForbiddenException("Ce niveau d'utilisateur n'existe pas!");

    const userRole = await this.prisma.user_role.findUnique({
      where: {
        id: Number(dto.role),
      },
    });

    if (!userRole)
      throw new ForbiddenException("Ce rôle d'utilisateur n'existe pas!");

    const hash = await this.hashData(dto.password);

    return await this.prisma.users.create({
      data: {
        firstname: dto.firstname,
        lastname: dto.lastname,
        registrationnumber: dto.registrationnumber,
        slug,
        phone: dto.phone,
        email: dto.email,
        password: hash,
        level: Number(dto.level),
        isadmin: false,
        role: Number(dto.role),
      },
    });
  }

  async updateUsersInfoBySlug(
    slug: string,
    dto: UsersInfoDto,
  ): Promise<UserTokenWithoutPassword> {
    const UsersById = await this.prisma.users.findUnique({
      where: {
        slug,
      },
    });

    if (!UsersById) throw new ForbiddenException("L'identifiant n'éxiste pas!");
    else {
      const updatedSlug = dto.registrationnumber
        .toLocaleLowerCase()
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        .trim()
        .split(' ')
        .join('-');

      const registrationnumberExist = await this.prisma.users.findUnique({
        where: {
          slug: updatedSlug,
        },
      });

      if (registrationnumberExist && slug !== updatedSlug) {
        throw new ForbiddenException('Ce numéro matricule existe déja!');
      }

      const userPhone = await this.prisma.users.findUnique({
        where: {
          phone: dto.phone,
        },
      });

      if (userPhone && userPhone.slug !== slug)
        throw new ForbiddenException(
          'Ce numéro de téléphone appartient déjà à un utilisateur',
        );

      const userEmail = await this.prisma.users.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (userEmail && userEmail.slug !== slug)
        throw new ForbiddenException(
          'Cet email appartient déjà à un utilisateur',
        );

      const userLevel = await this.prisma.levels.findUnique({
        where: {
          id: Number(dto.level),
        },
      });

      if (!userLevel)
        throw new ForbiddenException("Ce niveau d'utilisateur n'existe pas!");

      const userRole = await this.prisma.user_role.findUnique({
        where: {
          id: Number(dto.role),
        },
      });

      if (!userRole)
        throw new ForbiddenException("Ce rôle d'utilisateur n'existe pas!");

      const user = await this.prisma.users.update({
        data: {
          firstname: dto.firstname,
          lastname: dto.lastname,
          registrationnumber: dto.registrationnumber,
          slug: updatedSlug,
          phone: dto.phone,
          email: dto.email,
          level: Number(dto.level),
          isadmin: false,
          role: Number(dto.role),
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          registrationnumber: true,
          slug: true,
          phone: true,
          email: true,
          password: true,
          level: true,
          isadmin: true,
          role: true,
        },
        where: {
          slug,
        },
      });

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

      return [user, token];
    }
  }

  async updateUsersPasswordBySlug(
    slug: string,
    dto: UsersPasswordDto,
  ): Promise<UsersPassword> {
    const user = await this.prisma.users.findUnique({
      where: {
        slug,
      },
    });

    if (!user) throw new ForbiddenException("L'identifiant n'éxiste pas!");
    else {
      const isMatch = bcrypt.compareSync(dto.lastpassword, user.password);
      if (!isMatch) {
        throw new ForbiddenException('Mot de passe actuel incorrect!');
      } else {
        const hash = await this.hashData(dto.newpassword);
        return await this.prisma.users.update({
          data: {
            password: hash,
          },
          select: {
            id: true,
            password: true,
          },
          where: {
            slug,
          },
        });
      }
    }
  }

  async deleteUsersById(id: number): Promise<Users> {
    const UsersById = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!UsersById) throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.users.delete({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        registrationnumber: true,
        slug: true,
        phone: true,
        email: true,
        password: true,
        levels: {
          select: {
            id: true,
            designation: true,
          },
        },
        isadmin: true,
        user_role: {
          select: {
            id: true,
            role: true,
          },
        },
        createdAt: true,
      },
    });
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

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
