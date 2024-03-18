const { faker } = require("@faker-js/faker");

exports.req = {
  "created-user": {
    body: {
      name: "Test User",
      email: "test@mail.com",
      password: "test123",
    },
  },
  success: {
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
  },
  "invalid-email": {
    body: {
      name: faker.person.fullName(),
      email: "invalidemail",
      password: faker.internet.password(),
    },
  },
  "invalid-password": {
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "",
    },
  },
};

exports.res = {
  status: (status) => {
    console.log("STATUS:", status);
    return {
      json: (data) => {
        console.log("DATA:", data);
      },
    };
  },
};
