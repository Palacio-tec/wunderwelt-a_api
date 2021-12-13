import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let refreshTokenUseCase: RefreshTokenUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Refresh User Token", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersTokensRepositoryInMemory,
      dateProvider
    );
  });

  it("should be able to create a new refresh token", async () => {
    const user: ICreateUserDTO = {
      email: "johndoe@test.com",
      username: "johndoe",
      password: "test_password",
      name: "John Doe",
    };

    await createUserUseCase.execute(user);

    const authenticate = await authenticateUserUseCase.execute({
      username: user.username,
      password: user.password,
    });

    const refresh_token = await refreshTokenUseCase.execute(
      authenticate.refresh_token
    );

    expect(refresh_token).toHaveProperty("refresh_token");
  });

  it("should not be able to create a new refresh token with nonexistent token", async () => {
    await expect(
      refreshTokenUseCase.execute(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjI3OTA1MzQ4LCJleHAiOjE2MzA0OTczNDgsInN1YiI6ImIyOTc2ZWEyLTI2M2QtNDA5Ny04NTYzLTllNDRmM2Y4NGE2MSJ9.o5dy3zefpnOyaBq_TpaEuMF5BoOH4njhe543jyyJvi0"
      )
    ).rejects.toEqual(new AppError("Refresh Token does not exists"));
  });
});
