import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserAnswer, UserAnswer } from './types';
import { SwitchIsCorrectDto, UserAnswerDto } from './dto';

@Injectable()
export class UserAnswerService {
  constructor(private prisma: PrismaService) {}

  async getUserAnswerByTestSlug(
    user: number,
    slug: string,
  ): Promise<GetUserAnswer[]> {
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

    const UserAnswerByTestsSlugs = await this.prisma.user_answer.findMany({
      where: {
        AND: [
          {
            question_to_answer: {
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
          {
            iscorrected: false,
          },
        ],
      },
      orderBy: {
        users: {
          registrationnumber: 'asc',
        },
      },
      select: {
        id: true,
        content: true,
        iscorrect: true,
        iscorrected: true,
        question_to_answer: {
          select: {
            id: true,
            content: true,
            tests: {
              select: {
                id: true,
                designation: true,
                slug: true,
                subject: true,
              },
            },
          },
        },
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
        createdAt: true,
      },
    });

    if (UserAnswerByTestsSlugs.length == 0)
      throw new ForbiddenException("Il n'y a rien à corriger!");
    return UserAnswerByTestsSlugs;
  }

  async createUserAnswer(dto: UserAnswerDto): Promise<UserAnswer> {
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

    const questionExists = await this.prisma.question_to_answer.findUnique({
      where: {
        id: Number(dto.question),
      },
      select: {
        tests: {
          select: {
            id: true,
            level: true,
          },
        },
      },
    });

    if (!questionExists) {
      throw new ForbiddenException("Cette question n'existe pas!");
    }

    if (userExists.level !== questionExists.tests.level) {
      throw new ForbiddenException(
        "Votre niveau n'est pas autorisé à passer ce test!",
      );
    }

    const userAnswerExists = await this.prisma.user_answer.findMany({
      where: {
        AND: [{ user: Number(dto.user) }, { question: Number(dto.question) }],
      },
    });

    if (userAnswerExists.length !== 0) {
      throw new ForbiddenException('Vous avez déjà répondu à cette question!');
    }

    return await this.prisma.user_answer.create({
      data: {
        content: dto.content,
        user: Number(dto.user),
        question: Number(dto.question),
        iscorrect: false,
        iscorrected: false,
      },
    });
  }

  async switchIsCorrectById(
    id: number,
    user: number,
    dto: SwitchIsCorrectDto,
  ): Promise<UserAnswer> {
    const userAnswerExists = await this.prisma.user_answer.findUnique({
      where: {
        id,
      },
      select: {
        question_to_answer: {
          select: {
            tests: {
              select: {
                users: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!userAnswerExists) {
      throw new ForbiddenException("Cet identifiant n'existe pas!");
    }

    const userExists = await this.prisma.users.findUnique({
      where: {
        id: Number(user),
      },
    });

    if (!userExists) {
      throw new ForbiddenException("Cet utilisateur n'existe pas!");
    }

    if (userAnswerExists.question_to_answer.tests.users.id !== user) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à corriger ce test!",
      );
    }

    return await this.prisma.user_answer.update({
      data: {
        iscorrect: dto.iscorrect,
      },
      where: {
        id,
      },
      select: {
        id: true,
        content: true,
        iscorrect: true,
        iscorrected: true,
        question: true,
        user: true,
        createdAt: true,
      },
    });
  }

  async updateUserAnswerToCorrected(
    id: number,
    user: number,
  ): Promise<UserAnswer> {
    const userAnswerExists = await this.prisma.user_answer.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        question_to_answer: {
          select: {
            tests: {
              select: {
                users: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!userAnswerExists) {
      throw new ForbiddenException("Cet identifiant n'existe pas!");
    }

    const userExists = await this.prisma.users.findUnique({
      where: {
        id: Number(user),
      },
    });

    if (!userExists) {
      throw new ForbiddenException("Cet utilisateur n'existe pas!");
    }

    if (userAnswerExists.question_to_answer.tests.users.id !== user) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à corriger ce test!",
      );
    }

    return await this.prisma.user_answer.update({
      data: {
        iscorrected: true,
      },
      where: {
        id: Number(id),
      },
    });
  }
}
