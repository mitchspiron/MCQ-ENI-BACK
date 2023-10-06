import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Choices,
  GetQuestionsToAnswer,
  GetQuestionsToChoice,
  Questions,
} from './types';
import { QuestionsToAnswerDto, QuestionsToChoiceDto } from './dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async getQuestionsToAnswerByTestsSlug(
    slug: string,
  ): Promise<GetQuestionsToAnswer[]> {
    const TestsBySlug = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
    });

    if (!TestsBySlug) throw new ForbiddenException("Ce test n'existe pas!");

    const tests = await this.prisma.question_to_answer.findMany({
      where: {
        tests: {
          slug,
        },
      },
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
        createdAt: true,
      },
    });

    if (tests.length == 0) {
      throw new ForbiddenException("Il n'y a aucune question pour ce test");
    }

    return tests;
  }

  async getQuestionsToChoiceByTestsSlug(
    slug: string,
  ): Promise<GetQuestionsToChoice[]> {
    const TestsBySlug = await this.prisma.tests.findUnique({
      where: {
        slug,
      },
    });

    if (!TestsBySlug) throw new ForbiddenException("Ce test n'existe pas!");

    const tests = await this.prisma.question_to_choice.findMany({
      where: {
        tests: {
          slug,
        },
      },
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
        choices: {
          select: {
            id: true,
            content: true,
            iscorrect: true,
          },
        },
        createdAt: true,
      },
    });

    if (tests.length == 0) {
      throw new ForbiddenException("Il n'y a aucune question pour ce test");
    }

    return tests;
  }

  async createQuestionToAnswer(
    dto: QuestionsToAnswerDto,
  ): Promise<GetQuestionsToAnswer> {
    const testsExists = await this.prisma.tests.findUnique({
      where: {
        id: Number(dto.test),
      },
    });

    if (!testsExists) throw new ForbiddenException("Ce test n'existe pas!");

    return await this.prisma.question_to_answer.create({
      data: {
        content: dto.content,
        test: Number(dto.test),
      },
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
        createdAt: true,
      },
    });
  }

  async createQuestionToChoice(
    dto: QuestionsToChoiceDto,
  ): Promise<GetQuestionsToChoice> {
    const testsExists = await this.prisma.tests.findUnique({
      where: {
        id: Number(dto.test),
      },
    });

    if (!testsExists) throw new ForbiddenException("Ce test n'existe pas!");

    return await this.prisma.question_to_choice.create({
      data: {
        content: dto.content,
        test: Number(dto.test),
        choices: {
          create: dto.choices,
        },
      },
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
        choices: {
          select: {
            id: true,
            content: true,
            iscorrect: true,
          },
        },
        createdAt: true,
      },
    });
  }

  async updateQuestionToAnswerById(
    id: number,
    dto: QuestionsToAnswerDto,
  ): Promise<GetQuestionsToAnswer> {
    const questionExists = await this.prisma.question_to_answer.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!questionExists)
      throw new ForbiddenException("Cette question n'existe pas!");

    const testsExists = await this.prisma.tests.findUnique({
      where: {
        id: Number(dto.test),
      },
    });

    if (!testsExists) throw new ForbiddenException("Ce test n'existe pas!");

    return await this.prisma.question_to_answer.update({
      data: {
        content: dto.content,
        test: Number(dto.test),
      },
      where: {
        id: Number(id),
      },
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
        createdAt: true,
      },
    });
  }

  async updateQuestionToChoiceById(
    id: number,
    dto: QuestionsToChoiceDto,
  ): Promise<GetQuestionsToChoice> {
    const questionExists = await this.prisma.question_to_choice.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!questionExists)
      throw new ForbiddenException("Cette question n'existe pas!");

    const testsExists = await this.prisma.tests.findUnique({
      where: {
        id: Number(dto.test),
      },
    });

    if (!testsExists) throw new ForbiddenException("Ce test n'existe pas!");

    const idChoice = await this.prisma.choices.findMany({
      where: {
        question: Number(id),
      },
      select: {
        id: true,
      },
    });

    const arrayOfIds = idChoice.map((obj) => obj.id);

    return await this.prisma.question_to_choice.update({
      data: {
        content: dto.content,
        test: Number(dto.test),
        choices: {
          upsert: dto.choices.map((choice, i) => ({
            where: {
              id: Number(arrayOfIds[i]) || 0,
            },
            update: {
              content: choice.content,
              iscorrect: choice.iscorrect,
            },
            create: {
              content: choice.content,
              iscorrect: choice.iscorrect,
            },
          })),
        },
      },
      where: {
        id: Number(id),
      },
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
        choices: {
          select: {
            id: true,
            content: true,
            iscorrect: true,
          },
        },
        createdAt: true,
      },
    });
  }

  async deleteQuestionToAnswerById(id: number): Promise<Questions> {
    const QuestionById = await this.prisma.question_to_answer.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!QuestionById)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.question_to_answer.delete({
      where: {
        id,
      },
    });
  }

  async deleteQuestionToChoiceById(id: number): Promise<Questions> {
    const QuestionById = await this.prisma.question_to_choice.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!QuestionById)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.question_to_choice.delete({
      where: {
        id,
      },
    });
  }

  async deleteChoiceById(id: number): Promise<Choices> {
    const ChoiceById = await this.prisma.choices.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!ChoiceById)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.choices.delete({
      where: {
        id,
      },
    });
  }
}
