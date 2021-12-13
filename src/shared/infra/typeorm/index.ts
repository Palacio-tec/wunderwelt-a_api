import { Connection, createConnections, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection[]> => {
  const defaultPostgreOptions = await getConnectionOptions("default");
  const defaultMongoOptions = await getConnectionOptions("mongo");

  return createConnections([
    Object.assign(defaultPostgreOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "project_test"
          : defaultPostgreOptions.database,
    }),
    Object.assign(defaultMongoOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "mongo_test"
          : defaultMongoOptions.database,
    }),
  ]);
};
