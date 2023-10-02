import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRoleDto } from './dto';
import { UserRole } from './types';

@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  async getUserRoleById(id: number): Promise<UserRole> {
    const UserRoleById = await this.prisma.user_role.findUnique({
      where: {
        id,
      },
    });

    if (!UserRoleById)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return UserRoleById;
  }

  async getUserRole(): Promise<UserRole[]> {
    const userRole = await this.prisma.user_role.findMany();

    if (userRole.length == 0)
      throw new ForbiddenException("Il n'y a aucun role d'utilisateur trouvé!");
    return userRole;
  }

  async createUserRole(dto: UserRoleDto): Promise<UserRole> {
    return await this.prisma.user_role.create({
      data: {
        role: dto.role,
      },
    });
  }

  async updateUserRoleById(id: number, dto: UserRoleDto): Promise<UserRole> {
    const UserRoleById = await this.prisma.user_role.findUnique({
      where: {
        id,
      },
    });

    if (!UserRoleById)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.user_role.update({
      data: {
        role: dto.role,
      },
      where: {
        id,
      },
    });
  }

  async deleteUserRoleById(id: number): Promise<UserRole> {
    const UserRoleById = await this.prisma.user_role.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!UserRoleById)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.user_role.delete({
      where: {
        id,
      },
    });
  }
}
