import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URI || "");
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.log(`Error al conectar a la base de datos: ${error}`);
        process.exit(1);
    }
};

export default connectDB;