const request = require("supertest");
const app = require("./app.js");
const User_Model = require("./models/user_model")
const bcrypt = require("bcrypt");

const mongoose = require('mongoose');
require('dotenv').config()

let connection;
let db;

beforeAll(async () => {
   
	const mongoDb = process.env.TEST_DB_URL;
	connection =  mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
	db = mongoose.connection;
	db.on("error", console.error.bind(console, "mongo connection error"));

	let hashed_password = bcrypt.hashSync("test", 12);
	// Add an existing user to the DB
	const User = await new User_Model({
		username: "jim",
		password: hashed_password,
		email : "dkana@gmail.com",
		last_post_id : 0
	}).save();
});

afterAll(async () => {

	await db.dropDatabase();
	await db.close();
});



describe("Test login and sign-up", () => {

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
			email : "test@gmail.com"
		};
	
		return request(app)
			.post("/signup")
			.send(user_info)
			.then(response => {
			expect(response.statusCode).toBe(302);
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
			username : "test",
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
});




describe("Test blogs posts path", () => {

	let { header } = "";


	beforeAll(async () => {
		const user_info = {
			username : "test",
			password : "test"
		};
			
		const logged = await request(app).post("/").send(user_info);

		// Get cookies from response
		({header} = logged);

	});

	describe("Test the blog-posts main page", () => {
		test("It should response the GET method", async () => {

			const response = await request(app)
			.get("/blog-posts")
			.set("Cookie", [...header["set-cookie"]]) // this line I add cookies...
			expect(response.statusCode).toBe(200);
		});
	});

	describe("Test creating a new post", () => {
		test("It should response with 302 status", async () => {

			const response = await request(app)
			.post("/blog-posts")
			.set("Cookie", [...header["set-cookie"]]) // this line I add cookies...
			.send({
				body : "New post",
				title : "New title"
			});
			expect(response.statusCode).toBe(302);
		});
	});


	describe("Test getting an existing post", () => {
		test("It should response with 200 status", async () => {

			const response = await request(app)
			.get("/blog-posts/0")
			.set("Cookie", [...header["set-cookie"]]) // this line I add cookies...
			expect(response.statusCode).toBe(200);
		});
	});

	describe("Test getting an user posts", () => {
		test("It should response with 200 status", async () => {

			const response = await request(app)
			.get("/blog-posts/user/test")
			.set("Cookie", [...header["set-cookie"]]) // this line I add cookies...
			expect(response.statusCode).toBe(200);
		});
	});


	describe("Test patching a user posts", () => {
		test("It should response with 200 status", async () => {

			const response = await request(app)
			.patch("/blog-posts/0")
			.set("Cookie", [...header["set-cookie"]]) // this line I add cookies...
			.send({
				id : 0,
				title : "Updated Title",
				contents : "Updated Content"
			})
			expect(response.statusCode).toBe(200);
		});
	});

	describe("Test deleting a user posts", () => {
		test("It should response with 200 status", async () => {

			const response = await request(app)
			.delete("/blog-posts/0")
			.set("Cookie", [...header["set-cookie"]]) // this line I add cookies...
			.send({
				id : 0,
			})
			expect(response.statusCode).toBe(200);
		});
	});

});


