import { app } from "./app";
import ManagerCron from "./manager-cron";

const { ENVIRONMENT, PORT } = process.env

app.listen(Number(PORT) || 3333, () => {
  console.log("Server is running!");
  console.log(`[Environment] ${ENVIRONMENT}`)
  console.log(`[Port] ${PORT || 3333}`)
  ManagerCron.run();
});
