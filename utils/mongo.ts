import * as Mongoose from "mongoose";

let dbConnection: Mongoose.Connection;

// connect to the db
export const connectDB = (uri: string) => {
  // if already got a connection then return
  if (dbConnection) return;

  // connect to the db
  Mongoose.connect(uri, {});
  dbConnection = Mongoose.connection;

  // notify on open and error
  dbConnection.once("open", async () => console.log("Database connected!"));
  dbConnection.on("error", () => console.log("Database failed to connect!"));
};

// disconnect the db
export const disconnectDB = () => {
  // if there is no connection then return
  if (!dbConnection) return;

  Mongoose.disconnect();
};
