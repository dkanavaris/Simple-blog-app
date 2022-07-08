const request = require("supertest");
const app = require("./app.js");

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        
      });
  });
});

// SIGN UP tests
describe("Sign up with a username that is already in use", () => {
  test("Post should return an invalid username error", () => {
    const user_info = {
      username : "jim",
      password : "test",
      confirm_password : "test",
      email : "test@gmail.com"
    };

    return request(app)
      .post("/signup")
      .send(user_info)
      .then(response => {
        expect(response.statusCode).toBe(406);
      });
  });
});

describe("Sign up with confirm_password not matching password", () => {
  test("Post should return passwords do not match error", () => {
    const user_info = {
      username : "test",
      password : "test",
      confirm_password : "wrong_password",
      email : "test@gmail.com"
    };

    return request(app)
      .post("/signup")
      .send(user_info)
      .then(response => {
        expect(response.statusCode).toBe(406);
      });
  });
});


describe("Sign up with an email that is already in use", () => {
  test("Post should return an invalid email error", () => {
    const user_info = {
      username : "test",
      password : "test",
      confirm_password : "test",
      email : "dkana@gmail.com"
    };

    return request(app)
      .post("/signup")
      .send(user_info)
      .then(response => {
        expect(response.statusCode).toBe(406);
      });
  });
});

describe("Sign up a new user without wrong input", () => {
  test("Post should return a success and redirect to login", () => {
    const user_info = {
      username : "test",
      password : "test",
      confirm_password : "test",
      email : "dkana@gmail.com"
    };

    return request(app)
      .post("/signup")
      .send(user_info)
      .then(response => {
        expect(response.statusCode).toBe(406);
      });
  });
});


// LOG IN tests
describe("Login with wrong username should result in error", () => {
  test("Post should return wrong username error", () => {
    const user_info = {
      username : "wrong_username",
      password : "wrong_password"
    };

    return request(app)
      .post("/")
      .send(user_info)
      .then(response => {
        expect(response.statusCode).toBe(406);
      });
  });
});

describe("Login with wrong password should result in error", () => {
  test("Post should return wrong password error", () => {
    const user_info = {
      username : "jim",
      password : "wrong_password"
    };

    return request(app)
      .post("/")
      .send(user_info)
      .then(response => {
        expect(response.statusCode).toBe(406);
      });
  });
});

describe("Login with valid credentials", () => {
  test("Post should return 302 status and redirect", () => {
    const user_info = {
      username : "jim",
      password : "test"
    };

    return request(app)
      .post("/")
      .send(user_info)
      .then(response => {
        expect(response.statusCode).toBe(302);
      });
  });
});