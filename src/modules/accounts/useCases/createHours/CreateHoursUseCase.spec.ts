import { HoursRepositoryInMemory } from "@modules/accounts/repositories/in-memory/HoursRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateHoursUseCase } from "./CreateHoursUseCase";

let dateProvider: DayjsDateProvider;
let hoursRepositoryInMemory: HoursRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

let createUserUseCase: CreateUserUseCase;
let createHoursUseCase: CreateHoursUseCase;

describe("Create Hours", () => {
  beforeEach(() => {
    hoursRepositoryInMemory = new HoursRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();

    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      hoursRepositoryInMemory,
      dateProvider
    );
    createHoursUseCase = new CreateHoursUseCase(hoursRepositoryInMemory);
  });

  it("should be able to create a hour", async () => {
    const user = await createUserUseCase.execute({
      name: "Celia Simpson",
      email: "hukaf@ewason.ro",
      username: "celiasimpson",
      password: "teste_password",
    });

    const hour = await hoursRepositoryInMemory.findByUser(user.id);

    expect(hour).toHaveProperty("id");
  });

  it("should not be able to create a hour to the same user", async () => {
    const user = await createUserUseCase.execute({
      name: "Celia Simpson",
      email: "hukaf@ewason.ro",
      username: "celiasimpson",
      password: "teste_password",
    });

    await expect(
      createHoursUseCase.execute({
        amount: 10,
        user_id: user.id,
      })
    ).rejects.toEqual(new AppError("User already has hours registered"));
  });
});
