import { AuthService } from "../../services/auth.service";
import { UserRepository } from "../../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {

  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();

    jest.clearAllMocks();
  });

  describe("register()", () => {

    it("should register a new user", async () => {

      jest
        .spyOn(
          UserRepository.prototype,
          "findByEmail"
        )
        .mockResolvedValue(null);

      jest
        .spyOn(
          bcrypt,
          "hash"
        )
        .mockResolvedValue(
          "hashedPassword" as never
        );

      jest
        .spyOn(
          UserRepository.prototype,
          "createUser"
        )
        .mockResolvedValue({
          user_id: 1,
          email: "bimal@gmail.com",
          role_id: 2,
        } as any);

      const result =
        await authService.register(
          "bimal@gmail.com",
          "123456"
        );

      expect(result).toEqual({
        user_id: 1,
        email: "bimal@gmail.com",
        role_id: 2,
      });

    });

    it("should throw error if email already exists", async () => {

      jest
        .spyOn(
          UserRepository.prototype,
          "findByEmail"
        )
        .mockResolvedValue({
          email: "bimal@gmail.com",
        } as any);

      await expect(

        authService.register(
          "bimal@gmail.com",
          "123456"
        )

      ).rejects.toThrow(
        "Email already exists"
      );

    });

  });

  describe("login()", () => {

    it("should login successfully", async () => {

      jest
        .spyOn(
          UserRepository.prototype,
          "findByEmail"
        )
        .mockResolvedValue({
          user_id: 1,
          email: "bimal@gmail.com",
          role_id: 2,
          password_hash: "hashedPassword",
        } as any);

      jest
        .spyOn(
          bcrypt,
          "compare"
        )
        .mockResolvedValue(
          true as never
        );

      jest
        .spyOn(
          jwt,
          "sign"
        )
        .mockReturnValue(
          "mockToken" as never
        );

      const result =
        await authService.login(
          "bimal@gmail.com",
          "123456"
        );

      expect(result.token)
        .toBe("mockToken");

      expect(result.user.email)
        .toBe("bimal@gmail.com");

    });

    it("should throw error if email is invalid", async () => {

      jest
        .spyOn(
          UserRepository.prototype,
          "findByEmail"
        )
        .mockResolvedValue(null);

      await expect(

        authService.login(
          "wrong@gmail.com",
          "123456"
        )

      ).rejects.toThrow(
        "Invalid email"
      );

    });

    it("should throw error if password is invalid", async () => {

      jest
        .spyOn(
          UserRepository.prototype,
          "findByEmail"
        )
        .mockResolvedValue({
          user_id: 1,
          email: "bimal@gmail.com",
          role_id: 2,
          password_hash: "hashedPassword",
        } as any);

      jest
        .spyOn(
          bcrypt,
          "compare"
        )
        .mockResolvedValue(
          false as never
        );

      await expect(

        authService.login(
          "bimal@gmail.com",
          "wrongpassword"
        )

      ).rejects.toThrow(
        "Invalid password"
      );

    });

  });

});