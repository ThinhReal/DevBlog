import mongoose, { Schema, Document } from 'mongoose';

export interface IAlgorithm extends Document {
  title: string;
  category: string; // Greedy, Backtracking, Two Pointer...
  difficulty: 'Easy' | 'Medium' | 'Hard';
  signs: string[]; // Dấu hiệu nhận biết
  coreConcept: string; // Tư duy cốt lõi
  templateCode: string; // Mã nguồn mẫu
  complexity: {
    time: string;
    space: string;
  };
}

const AlgorithmSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  signs: [{ type: String }],
  coreConcept: { type: String, required: true },
  templateCode: { type: String, required: true },
  complexity: {
    time: { type: String },
    space: { type: String }
  }
}, { timestamps: true });

export default mongoose.model<IAlgorithm>('Algorithm', AlgorithmSchema);