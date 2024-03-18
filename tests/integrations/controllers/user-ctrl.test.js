require("dotenv").config();
const mongoose = require("mongoose");

const UserController = require("../../../src/controllers/user-ctrl");
const { req, res } = require("../../mocks/http-mocks");
const User = require("../../../src/schemas/User");

describe("[Integration] User Controller tests", () => {
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

  test("Should create a new user at database", async () => {
    const resSpy = jest.spyOn(res, "status");

    await UserController.create(req.success, res);

    expect(resSpy).toHaveBeenCalledWith(201);
  });

  test("Should throw status code 400 if an email is invalid", async () => {
    const resSpy = jest.spyOn(res, "status");

    await UserController.create(req["invalid-email"], res);

    expect(resSpy).toHaveBeenCalledWith(400);
  });

  test("Should throw status code 400 if an password is invalid", async () => {
    const resSpy = jest.spyOn(res, "status");

    await UserController.create(req["invalid-password"], res);

    expect(resSpy).toHaveBeenCalledWith(400);
  });
});
