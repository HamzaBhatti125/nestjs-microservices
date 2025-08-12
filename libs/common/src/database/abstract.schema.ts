import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  // This class can be extended by other schemas to inherit common properties or methods
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
