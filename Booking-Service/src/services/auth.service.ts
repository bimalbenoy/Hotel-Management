import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "../logger/logger.service";

export class AuthService {
private userRepository=new UserRepository();
async register(
  email: string,
  password: string
) {

  logger.info(`AuthService.register called for email=${email}`);

  const existingUser =
    await this.userRepository.findByEmail(email);

  // New user
  if (!existingUser) {

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user =
      await this.userRepository.createUser(
        2,
        email,
        passwordHash
      );

    logger.info(`New user registered: ${email}`);

    return {
      user_id: user.user_id,
      email: user.email,
      role_id: user.role_id
    };
  }

  // Email already active
  if (!existingUser.isDisabled) {

    logger.error(`Email already exists: ${email}`);

    throw new Error("Email already exists");
  }

  // Reactivate disabled account
  const passwordHash =
    await bcrypt.hash(password, 10);

  const user =
    await this.userRepository.reactivateUser(
      existingUser.user_id,
      passwordHash
    );

  logger.info(`User reactivated: ${email}`);

  return {
    user_id: user.user_id,
    email: user.email,
    role_id: user.role_id
  };

}

async login(
  email: string,
  password: string
) {
  logger.info(`AuthService.login called for email=${email}`);
  const user =
    await this.userRepository.findByEmail(email);

  if (!user) {
    logger.error(`AuthService.login failed: invalid email ${email}`);
    throw new Error("Invalid email");
  }
  if(user.isDeleted){
    logger.error(`AuthService.login failed: user is disabled for email=${email}`);
    throw new Error("User is disabled or soft deleted");
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!isPasswordValid) {
    logger.error(`AuthService.login failed: invalid password for email=${email}`);
    throw new Error("Invalid password");
  }
  const token=jwt.sign({
    userID:user.user_id,
    roleId:user.role_id,
    email:user.email

  },
  process.env.JWT_SECRET!,
  {
    expiresIn:"1d",
  }
);

  logger.info(`AuthService.login succeeded for email=${email}`);
  return {
  token,
  user: {
    userId: user.user_id,
    email: user.email,
    roleId: user.role_id,
  },
};
}
}