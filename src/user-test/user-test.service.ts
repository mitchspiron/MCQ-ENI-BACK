import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserTest, UserTest } from './types';
import { UserTestDto } from './dto';

@Injectable()
export class UserTestService {
  constructor(private prisma: PrismaService) {}

  async getUserTestByTestsSlug(slug: string): Promise<GetUserTest[]> {
    const testsExists = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
    });

    if (!testsExists) {
      throw new ForbiddenException("Ce test n'existe pas!");
    }
    const UserTestByTestsSlugs = await this.prisma.user_test.findMany({
      where: {
        tests: {
          slug,
        },
      },
      orderBy: {
        users: {
          registrationnumber: 'asc',
        },
      },
      select: {
        id: true,
        isfinished: true,
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            registrationnumber: true,
            levels: {
              select: {
                id: true,
                designation: true,
                slug: true,
              },
            },
          },
        },
        tests: {
          select: {
            id: true,
            designation: true,
            slug: true,
            subject: true,
          },
        },
        createdAt: true,
      },
    });

    if (UserTestByTestsSlugs.length == 0)
      throw new ForbiddenException("Aucun étudiant n'a fait ce test!");
    return UserTestByTestsSlugs;
  }

  async createUserTest(dto: UserTestDto): Promise<UserTest> {
    const userExists = await this.prisma.users.findUnique({
      where: {
        id: Number(dto.user),
      },
      select: {
        user_role: {
          select: {
            role: true,
          },
        },
        level: true,
      },
    });

    if (!userExists) {
      throw new ForbiddenException("Cet utilisateur n'existe pas!");
    }

    if (userExists.user_role.role !== 'student') {
      throw new ForbiddenException(
        "Cet utilisateur n'est pas habilité à faire ce test!",
      );
    }

    const testsExists = await this.prisma.tests.findUnique({
      where: {
        id: Number(dto.test),
      },
      select: {
        level: true,
      },
    });

    if (!testsExists) {
      throw new ForbiddenException("Ce test n'existe pas!");
    }

    if (userExists.level !== testsExists.level) {
      throw new ForbiddenException(
        "Le niveau de cet utilisateur n'est pas autorisé à faire ce test!",
      );
    }

    const userTestExists = await this.prisma.user_test.findMany({
      where: {
        AND: [{ user: Number(dto.user) }, { test: Number(dto.test) }],
      },
    });

    if (userTestExists.length !== 0) {
      throw new ForbiddenException(
        "Vous n'avez plus le droit de refaire ce test!",
      );
    }

    return await this.prisma.user_test.create({
      data: {
        user: Number(dto.user),
        test: Number(dto.test),
        isfinished: false,
      },
    });
  }

  async updateUserTestState(slug: string, user: number): Promise<UserTest> {
    const TestById = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
    });

    if (!TestById) throw new ForbiddenException("L'identifiant n'éxiste pas!");

    const userExists = await this.prisma.users.findUnique({
      where: {
        id: Number(user),
      },
    });

    if (!userExists)
      throw new ForbiddenException("L'utilisateur n'éxiste pas!");

    const userTestExists = await this.prisma.user_test.findMany({
      where: {
        user: Number(user),
        tests: {
          slug,
        },
      },
    });

    if (userTestExists.length == 0)
      throw new ForbiddenException("Cet utilisateur n'a pas fait ce test!");

    return await this.prisma.user_test.update({
      data: {
        isfinished: true,
      },
      where: {
        id: Number(userTestExists[0].id),
      },
    });
  }
}
