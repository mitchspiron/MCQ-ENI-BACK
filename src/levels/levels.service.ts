import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Levels } from './types';
import { LevelsDto } from './dto';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  async getLevelsBySlug(slug: string): Promise<Levels> {
    const LevelsBySlug = await this.prisma.levels.findUnique({
      where: {
        slug,
      },
    });

    if (!LevelsBySlug)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return LevelsBySlug;
  }

  async getLevels(): Promise<Levels[]> {
    const levels = await this.prisma.levels.findMany();

    if (levels.length == 0)
      throw new ForbiddenException("Il n'y a aucun niveau d'étudiant trouvé!");
    return levels;
  }

  async createLevels(dto: LevelsDto): Promise<Levels> {
    const slug = dto.designation
      .toLocaleLowerCase()
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
      .trim()
      .split(' ')
      .join('-');

    const slugExists = await this.prisma.levels.findUnique({
      where: {
        slug,
      },
    });

    if (slugExists)
      throw new ForbiddenException("Ce niveau d'étudiant existe déjà!");

    return await this.prisma.levels.create({
      data: {
        designation: dto.designation,
        slug,
      },
    });
  }

  async updateLevelsBySlug(slug: string, dto: LevelsDto): Promise<Levels> {
    const LevelsBySlug = await this.prisma.levels.findUnique({
      where: {
        slug,
      },
    });

    if (!LevelsBySlug)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    const updatedSlug = dto.designation
      .toLocaleLowerCase()
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
      .trim()
      .split(' ')
      .join('-');

    const levelsExist = await this.prisma.levels.findUnique({
      where: {
        slug: updatedSlug,
      },
    });

    if (levelsExist && slug !== updatedSlug) {
      throw new ForbiddenException("Ce niveau d'étudiant existe déja!");
    }

    const levels = await this.prisma.levels.update({
      data: {
        designation: dto.designation,
        slug: updatedSlug,
      },
      select: {
        id: true,
        designation: true,
        slug: true,
      },
      where: {
        slug,
      },
    });

    return levels;
  }

  async deleteLevelsById(id: number): Promise<Levels> {
    const LevelsById = await this.prisma.levels.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!LevelsById)
      throw new ForbiddenException("L'identifiant n'existe pas!");

    return await this.prisma.levels.delete({
      where: {
        id,
      },
    });
  }
}
