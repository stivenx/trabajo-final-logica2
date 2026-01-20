import mongoose, { Schema, Document } from "mongoose";

export interface IDocument extends Document {
 user: mongoose.Types.ObjectId;     // Referencia a la persona
  name: string;                      // Nombre del documento
  type: string;                      // Tipo (PDF, imagen, etc.)
  fileUrl: string;                   // URL o ruta del archivo
  description?: string;              // Descripción opcional
  uploadDate: Date;   
  
}

const DocumentSchema = new Schema<IDocument>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User",                    
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IDocument>("Document", DocumentSchema);