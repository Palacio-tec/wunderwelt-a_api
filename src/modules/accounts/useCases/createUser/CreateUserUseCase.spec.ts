import { HoursRepositoryInMemory } from "@modules/accounts/repositories/in-memory/HoursRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let hoursRepositoryInMemory: HoursRepositoryInMemory;
let dateProvider: DayjsDateProvider;

let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    hoursRepositoryInMemory = new HoursRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      hoursRepositoryInMemory,
      dateProvider
    );
  });

  it("should be able to create an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Lottie Flores",
      email: "usaril@gaz.mg",
      username: "lottieflores",
      password: "teste",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able do crete an user with same username", async () => {
    await createUserUseCase.execute({
      name: "Lottie Flores",
      email: "usaril@gaz.mg",
      username: "sameUserName",
      password: "teste",
    });

    await expect(
      createUserUseCase.execute({
        name: "Alice Powers",
        email: "esu@fojugro.ec",
        username: "sameUserName",
        password: "teste",
      })
    ).rejects.toEqual(new AppError("User username already exists"));
  });
});
