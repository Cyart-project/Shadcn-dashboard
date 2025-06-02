import { Document, Model, Schema, model } from 'mongoose';

export interface IEvent extends Document {
  agent_id: string;
  timestamp: Date;
  rule_id: number;
  rule_description: string;
  severity: number;
  src_ip?: string;
  dst_ip?: string;
  user?: string;
  event_data: object;
}

const EventSchema = new Schema<IEvent>({
  agent_id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  rule_id: { type: Number, required: true },
  rule_description: { type: String, required: true },
  severity: { type: Number, required: true },
  src_ip: { type: String },
  dst_ip: { type: String },
  user: { type: String },
  event_data: { type: Object, required: true }
});

export const Event: Model<IEvent> = model<IEvent>('Event', EventSchema);
