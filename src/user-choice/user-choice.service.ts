import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserChoice, UserChoice } from './types';
import { UserChoiceDto } from './dto';

@Injectable()
export class UserChoiceService {
  constructor(private prisma: PrismaService) {}

  async getUserChoiceByTestSlug(
    user: number,
    slug: string,
  ): Promise<GetUserChoice[]> {
    const userExists = await this.prisma.users.findUnique({
      where: {
        id: Number(user),
      },
      select: {
        id: true,
      },
    });

    if (!userExists) {
      throw new ForbiddenException("Cet utilisateur n'existe pas!");
    }

    const testsExists = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
      select: {
        user: true,
      },
    });

    if (!testsExists) {
      throw new ForbiddenException("Ce test n'existe pas!");
    }

    if (userExists.id !== testsExists.user) {
      throw new ForbiddenException("Vous n'avez aucun droit sur ce test!");
    }

    const UserChoiceByTestsSlugs = await this.prisma.user_choice.findMany({
      where: {
        choices: {
          question_to_choice: {
            tests: {
              AND: [
                {
                  slug,
                },
                {
                  user: Number(user),
                },
              ],
            },
          },
        },
      },
      orderBy: {
        users: {
          registrationnumber: 'asc',
        },
      },
      select: {
        id: true,
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
        choices: {
          select: {
            id: true,
            content: true,
            iscorrect: true,
            question_to_choice: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        },
        createdAt: true,
      },
    });

    if (UserChoiceByTestsSlugs.length == 0)
      throw new ForbiddenException("Il n'y a rien à corriger!");
    return UserChoiceByTestsSlugs;
  }

  async createUserChoice(dto: UserChoiceDto): Promise<UserChoice> {
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

    const choiceExists = await this.prisma.choices.findUnique({
      where: {
        id: Number(dto.choice),
      },
      select: {
        question_to_choice: {
          select: {
            tests: {
              select: {
                id: true,
                level: true,
              },
            },
          },
        },
      },
    });

    if (!choiceExists) {
      throw new ForbiddenException("Ce choix n'existe pas!");
    }

    if (userExists.level !== choiceExists.question_to_choice.tests.level) {
      throw new ForbiddenException(
        "Votre niveau n'est pas autorisé à passer ce test!",
      );
    }

    const userChoiceExists = await this.prisma.user_choice.findMany({
      where: {
        AND: [{ user: Number(dto.user) }, { choice: Number(dto.choice) }],
      },
    });

    if (userChoiceExists.length !== 0) {
      throw new ForbiddenException('Vous avez déjà fait ce choix!');
    }

    return await this.prisma.user_choice.create({
      data: {
        user: Number(dto.user),
        choice: Number(dto.choice),
      },
    });
  }
}
