const SessionController = require("../../../src/controllers/session-ctrl");
const SessionService = require("../../../src/services/session-service");
const UserService = require("../../../src/services/user-service");
const Email = require("../../../src/utils/email-validator");

jest.mock("../../../src/services/session-service");
jest.mock("../../../src/services/user-service");
jest.mock("../../../src/utils/email-validator");

describe("Session Controller Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should return 200 and a token when valid email and password are provided", async () => {
    const req = {
      body: { email: "valid@mail.com", password: "validPassword" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Email.isValid.mockReturnValue(true);
    UserService.userExistsAndCheckPassword.mockResolvedValue(true);
    SessionService.generateToken.mockResolvedValue("validToken");

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "validToken" });
  });

  test("Should return 400 and a message when invalid email is provided", async () => {
    const req = { body: { email: "invalidEmail", password: "validPassword" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Email.isValid.mockReturnValue(false);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("Email inválido");
  });

  test("Should return 400 and a message when invalid password is provided", async () => {
    const req = { body: { email: "valid@mail.com", password: "" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Email.isValid.mockReturnValue(true);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("Senha inválida");
  });

  test("Should return 404 and a message when user does not exist", async () => {
    const req = {
      body: { email: "valid@mail.com", password: "validPassword" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    Email.isValid.mockReturnValue(true);
    UserService.userExistsAndCheckPassword.mockResolvedValue(false);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith("Usuário não encontrado");
  });

  test("Should return 500 and a default message when an unexpected error occurs", async () => {
    const req = {
      body: { email: "valid@mail.com", password: "validPassword" },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const error = new Error("Server Error");

    Email.isValid.mockReturnValue(true);
    UserService.userExistsAndCheckPassword.mockRejectedValue(error);

    await SessionController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith("Server Error");
  });
});
