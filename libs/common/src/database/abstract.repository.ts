import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractSchema } from './abstract.schema';
import { Logger } from '@nestjs/common';

export abstract class AbstractRepository<T extends AbstractSchema> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) {}

  async create(document: Omit<T, '_id'>): Promise<T> {
    const newDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return newDocument.save();
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T | null> {
    const document = await this.model.findOne(filterQuery).lean<T>();
    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      return null;
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
  ): Promise<T | null> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, updateQuery, {
        new: true,
      })
      .lean<T>(true);
    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      return null;
    }
    return document;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    const document = await this.model.find(filterQuery).lean<T[]>();
    if (!document.length) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      return [];
    }
    return document;
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T | null> {
    const document = await this.model.findOneAndDelete(filterQuery).lean<T>();
    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      return null;
    }
    return document;
  }
}
