import { Connection, createConnections, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection[]> => {
  const defaultPostgreOptions = await getConnectionOptions("default");

  return createConnections([
    Object.assign(defaultPostgreOptions, {
      database:
        process.env.NODE_ENV === "test"
          ? "project_test"
          : defaultPostgreOptions.database,
    }),
  ]);
};
