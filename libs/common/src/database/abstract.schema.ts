import { SchemaTypes, Types } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export abstract class AbstractSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ type: SchemaTypes.Date })
  updatedAt: Date;
}
