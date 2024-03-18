require("dotenv").config();
const mongoose = require("mongoose");

const UserService = require("../../../src/services/user-service");
const User = require("../../../src/schemas/User");

describe("[Integration] User Service tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_BASE_URL);
    await User.create({
      name: "Test User",
      email: "any@mail.com",
      password: "test123",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test("Should create a new user", async () => {
    const userData = {
      name: "New User",
      email: "newuser@mail.com",
      password: "password123",
    };

    const { id } = await UserService.createUser(userData);

    expect(id).toBeDefined();
  });

  test("Should return true if user exists and password matches", async () => {
    const userData = {
      email: "any@mail.com",
      password: "test123",
    };

    const result = await UserService.userExistsAndCheckPassword(userData);

    expect(result).toBe(true);
  });

  test("Should return false if user does not exist", async () => {
    const userData = {
      email: "nonexistentuser@mail.com",
      password: "password123",
    };

    const result = await UserService.userExistsAndCheckPassword(userData);

    await expect(result).toBe(false);
  });

  test("Should throw status code 400 if password does not match", async () => {
    const userData = {
      email: "any@mail.com",
      password: "incorrectpassword",
    };

    try {
      await UserService.userExistsAndCheckPassword(userData);
    } catch (error) {
      expect(error.status).toBe(400);
      expect(error.message).toBe("As senhas não batem");
    }
  });
});
