import { app } from "./app";
import ManagerCron from "./manager-cron";

app.listen(3333, () => {
  console.log("Server is running! port: 3333");
  ManagerCron.run();
});
