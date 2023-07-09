import { container } from "tsyringe";

import "@shared/container/providers";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";

import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";

import { IEventsRepository } from "@modules/events/repositories/IEventsRepository";
import { EventsRepository } from "@modules/events/infra/typeorm/repositories/EventsRepository";

import { ISchedulesRepository } from "@modules/schedules/repositories/ISchedulesRepository";
import { SchedulesRepository } from "@modules/schedules/infra/typeorm/repositories/SchedulesRepository";

import { IHoursRepository } from "@modules/accounts/repositories/IHoursRepository";
import { HoursRepository } from "@modules/accounts/infra/typeorm/repositories/HoursRepository";

import { IParametersRepository } from "@modules/parameters/repositories/IParametersRepository";
import { ParametersRepository } from "@modules/parameters/infra/typeorm/repositories/ParametersRepository";

import { IQueuesRepository } from "@modules/queues/repositories/IQueuesRepository";
import { QueuesRepository } from "@modules/queues/infra/typeorm/repositories/QueuesRepository";

import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { StatementsRepository } from "@modules/statements/infra/typeorm/repositories/StatementsRepository";

import { ICouponsRepository } from "@modules/coupons/repositories/ICouponsRepository";
import { CouponsRepository } from "@modules/coupons/infra/typeorm/repositories/CouponsRepository";

import { ILevelsRepository } from "@modules/levels/repositories/ILevelsRepository";
import { LevelsRepository } from "@modules/levels/infra/typeorm/repositories/LevelsRepository";

import { IEventsLevelsRepository } from "@modules/events/repositories/IEventsLevelsRepository";
import { EventsLevelsRepository } from "@modules/events/infra/typeorm/repositories/EventsLevelsRepository";

import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ProductsRepository } from "@modules/products/infra/typeorm/repositories/ProductsRepository";

import { NotificationsRepository } from "@modules/notifications/infra/typeorm/repositories/NotificationsRepository";
import { INotificationsRepository } from "@modules/notifications/repositories/INotificationsRepository";

import { IPurchaseOrdersRepository } from "@modules/purchases/repositories/IPurchaseOrdersRepository";
import { PurchaseOrdersRepository } from "@modules/purchases/infra/typeorm/repositories/PurchaseOrdersRepository";
import { ISchedulesCreditsRepository } from "@modules/schedules/repositories/ISchedulesCreditsRepository";
import { SchedulesCreditsRepository } from "@modules/schedules/infra/typeorm/repositories/SchedulesCreditsRepository";
import { IPromotionsRepository } from "@modules/promotions/repositories/IPromotionsRepository";
import { PromotionsRepository } from "@modules/promotions/infra/typeorm/repositories/PromotionsRepository";
import { IFQAsRepository } from "@modules/fqas/repositories/IFQAsRepository";
import { FQAsRepository } from "@modules/fqas/infra/typeorm/repositories/FQAsRepository";
import { IMailLogsRepository } from "@modules/mailLogs/repositories/IMailLogsRepository";
import { MailLogsRepository } from "@modules/mailLogs/infra/typeorm/repositories/MailLogsRepository";
import { ICompanyMembersRepository } from "@modules/companyMembers/repositories/ICompanyMembersRepository";
import { CompanyMembersRepository } from "@modules/companyMembers/infra/typeorm/repositories/CompanyMemberRepository";

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository
);

container.registerSingleton<IUsersTokensRepository>(
  "UsersTokensRepository",
  UsersTokensRepository
);

container.registerSingleton<IHoursRepository>(
  "HoursRepository",
  HoursRepository
);

container.registerSingleton<ICouponsRepository>(
  "CouponsRepository",
  CouponsRepository
);

container.registerSingleton<IEventsRepository>(
  "EventsRepository",
  EventsRepository
);

container.registerSingleton<IEventsLevelsRepository>(
  "EventsLevelsRepository",
  EventsLevelsRepository
);

container.registerSingleton<ILevelsRepository>(
  "LevelsRepository",
  LevelsRepository
);

container.registerSingleton<IParametersRepository>(
  "ParametersRepository",
  ParametersRepository
);

container.registerSingleton<IQueuesRepository>(
  "QueuesRepository",
  QueuesRepository
);

container.registerSingleton<ISchedulesRepository>(
  "SchedulesRepository",
  SchedulesRepository
);

container.registerSingleton<IStatementsRepository>(
  "StatementsRepository",
  StatementsRepository
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  ProductsRepository
);

container.registerSingleton<IPurchaseOrdersRepository>(
  "PurchaseOrdersRepository",
  PurchaseOrdersRepository
);

container.registerSingleton<ISchedulesCreditsRepository>(
  "SchedulesCreditsRepository",
  SchedulesCreditsRepository
);

container.registerSingleton<IPromotionsRepository>(
  "PromotionsRepository",
  PromotionsRepository
);

container.registerSingleton<IFQAsRepository>(
  "FQAsRepository",
  FQAsRepository
);

container.registerSingleton<IMailLogsRepository>(
  "MailLogsRepository",
  MailLogsRepository
)

container.registerSingleton<INotificationsRepository>(
  "NotificationsRepository",
  NotificationsRepository
)

container.registerSingleton<ICompanyMembersRepository>(
  "CompanyMembersRepository",
  CompanyMembersRepository
)
