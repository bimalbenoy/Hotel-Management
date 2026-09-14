import { UserRepository } from "../repositories/user.repository";
import { logger } from "../logger/logger.service";

export class UserService {

  private userRepository = new UserRepository();

  async getAllUsers() {

    logger.info("UserService.getAllUsers called");

    const users =
      await this.userRepository.getAllUsers();

    logger.info("UserService.getAllUsers succeeded");

    return users;

  }

  async getUserById(userId: number) {

    logger.info(`UserService.getUserById called for userId=${userId}`);

    const user =
      await this.userRepository.findById(userId);

    if (!user) {

      logger.error(`User not found. userId=${userId}`);

      throw new Error("User not found");

    }

    logger.info(`UserService.getUserById succeeded for userId=${userId}`);

    return user;

  }

  async disableUser(
    loggedInUserId: number,
    userId: number
  ) {

    logger.info(
      `UserService.disableUser called. Admin=${loggedInUserId}, Target=${userId}`
    );

    const user =
      await this.userRepository.findById(userId);

    if (!user) {

      logger.error(`User not found. userId=${userId}`);

      throw new Error("User not found");

    }

    if (user.isDeleted) {

      logger.error(`User already disabled. userId=${userId}`);

      throw new Error("User already disabled");

    }

    if (loggedInUserId === userId) {

      logger.error(
        `Admin attempted to disable own account. userId=${loggedInUserId}`
      );

      throw new Error("Admin cannot disable their own account");

    }

    const disabledUser =
      await this.userRepository.disableUser(userId);

    logger.info(`User disabled successfully. userId=${userId}`);

    return disabledUser;

  }

}