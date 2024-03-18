const jwt = require("jsonwebtoken");
const SessionService = require("../../../src/services/session-service");

jest.mock("jsonwebtoken");

describe("Session Service Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should generate token with valid email", () => {
    const email = "valid@mail.com";
    const expectedToken = "validToken";

    jwt.sign.mockReturnValue(expectedToken);

    const token = SessionService.generateToken({ email });

    expect(token).toEqual(expectedToken);
    expect(jwt.sign).toHaveBeenCalledWith({ email }, process.env.SECRET_KEY, {
      expiresIn: "30s",
    });
  });

  test("Should throw an error if email is not provided", () => {
    const expectedError = new Error("Email is required");

    expect(() => {
      SessionService.generateToken({});
    }).toThrow(expectedError);

    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
