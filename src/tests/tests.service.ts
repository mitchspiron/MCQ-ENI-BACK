import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestsDto } from './dto';
import { GetTests, Tests } from './types';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async getTestsBySlug(slug: string): Promise<GetTests> {
    const TestsBySlug = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        designation: true,
        slug: true,
        subject: true,
        yeartest: true,
        duration: true,
        datetest: true,
        levels: {
          select: {
            id: true,
            designation: true,
          },
        },
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            user_role: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    if (!TestsBySlug)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return TestsBySlug;
  }

  async getTests(): Promise<GetTests[]> {
    const tests = await this.prisma.tests.findMany({
      select: {
        id: true,
        designation: true,
        slug: true,
        subject: true,
        yeartest: true,
        duration: true,
        datetest: true,
        levels: {
          select: {
            id: true,
            designation: true,
          },
        },
        users: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            user_role: {
              select: {
                id: true,
                role: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    if (tests.length == 0)
      throw new ForbiddenException("Il n'y a aucun test trouvé!");
    return tests;
  }

  async createTests(dto: TestsDto) {
    const slug = dto.designation
      .toLocaleLowerCase()
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
      .trim()
      .split(' ')
      .join('-');

    const slugExists = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
    });

    if (slugExists) {
      throw new ForbiddenException('Ce test existe déjà!');
    }

    const levelExists = await this.prisma.levels.findUnique({
      where: {
        id: Number(dto.level),
      },
    });

    if (!levelExists) {
      throw new ForbiddenException("Ce niveau n'existe pas!");
    }

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
      },
    });

    if (!userExists) {
      throw new ForbiddenException("Cet utilisateur n'existe pas!");
    }

    if (userExists.user_role.role !== 'professor') {
      throw new ForbiddenException(
        "Cet utilisateur n'est pas habilité à créer un test!",
      );
    }

    return await this.prisma.tests.create({
      data: {
        designation: dto.designation,
        slug,
        subject: dto.subject,
        yeartest: dto.yeartest,
        duration: Number(dto.duration),
        datetest: new Date(dto.datetest),
        level: Number(dto.level),
        user: Number(dto.user),
      },
    });
  }

  async updateTestsBySlug(slug: string, dto: TestsDto): Promise<GetTests> {
    const TestById = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
    });

    if (!TestById) throw new ForbiddenException("L'identifiant n'éxiste pas!");
    else {
      const updatedSlug = dto.designation
        .toLocaleLowerCase()
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        .trim()
        .split(' ')
        .join('-');

      const slugExist = await this.prisma.tests.findUnique({
        where: {
          slug: updatedSlug,
        },
      });

      if (slugExist && slug !== updatedSlug) {
        throw new ForbiddenException('Ce test existe déja!');
      }

      const levelExists = await this.prisma.levels.findUnique({
        where: {
          id: Number(dto.level),
        },
      });

      if (!levelExists) {
        throw new ForbiddenException("Ce niveau n'existe pas!");
      }

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
        },
      });

      if (!userExists) {
        throw new ForbiddenException("Cet utilisateur n'existe pas!");
      }

      if (userExists.user_role.role !== 'professor') {
        throw new ForbiddenException(
          "Cet utilisateur n'est pas habilité à créer un test!",
        );
      }

      return await this.prisma.tests.update({
        data: {
          designation: dto.designation,
          slug: updatedSlug,
          subject: dto.subject,
          yeartest: dto.yeartest,
          duration: Number(dto.duration),
          datetest: new Date(dto.datetest),
          level: Number(dto.level),
          user: Number(dto.user),
        },
        where: {
          slug,
        },
        select: {
          id: true,
          designation: true,
          slug: true,
          subject: true,
          yeartest: true,
          duration: true,
          datetest: true,
          levels: {
            select: {
              id: true,
              designation: true,
            },
          },
          users: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              user_role: {
                select: {
                  id: true,
                  role: true,
                },
              },
            },
          },
          createdAt: true,
        },
      });
    }
  }

  async deleteTestsById(id: number): Promise<Tests> {
    const TestById = await this.prisma.tests.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!TestById) throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.tests.delete({
      where: {
        id,
      },
    });
  }
}
