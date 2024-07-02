const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require('uuid');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

// Setup MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Ali#pro123!",
});

// Function to get random user data using faker
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// // Uncomment to generate a batch of random users
// let data=[]
// for(let i=1;i<=100;i++){
//     data.push(getRandomUser())
// }

// Route to render the home page and display user count
app.get("/", (req, res) => {
  let query = "SELECT count(*) FROM user";
  connection.query(query, (err, result) => {
    try {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    } catch (err) {
      res.send("Some Error Occur");
    }
  });
});

// Route to list all users
app.get("/users", (req, res) => {
  let query = "SELECT * FROM user";
  connection.query(query, (err, result) => {
    try {
      if (err) throw err;
      let data = result;
      res.render("users.ejs", { data });
    } catch (err) {
      res.send("Some Error Occur");
    }
  });
});

// Route to render edit form for a specific user
app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let query = "SELECT * FROM user WHERE id=?";
  connection.query(query, [id],(err, result) => {
    try {
      if (err) throw err;
      let data = result[0];
      res.render("edit.ejs", { data });
    } catch (err) {
      res.send("Some Error Occur");
    }
  });
});

// Route to update user information
app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: formpassWord, username: formusername } = req.body;
  let q = "SELECT * FROM user WHERE id = ?";

  try {
    connection.query(q,[id], (err, result) => {
      if (err) throw err;
      let data = result[0];
      if (formpassWord != data.password) {
        res.send("Wrong Password");
      } else {
        let q2 = "UPDATE user SET name = ? WHERE id =?";
        connection.query(q2, [formusername,id],(err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  } catch (err) {
    res.send("Some Error Occur");
  }
});

// Route to render the form to add a new user
app.get("/users/new", (req, res) => {
  res.render("new.ejs");
});

// Route to handle form submission for adding a new user
app.post("/users", (req, res) => {
  let { name, email, password } = req.body;
  let q = "INSERT INTO user (id, name, email, password) VALUES ?";
  let values = [[uuidv4(), name, email, password]];

  connection.query(q, [values], (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    res.redirect('/users');
  });
});

// Route to render form to input email and password for deletion
app.get("/users/:id/delete", (req, res) => {
  let { id } = req.params;
  res.render("delete.ejs", { id });
});

// Route to handle user deletion based on email and password
app.delete("/users/:id", (req, res) => {
  let { id } = req.params;
  let { email, password } = req.body;
  let q = "DELETE FROM user WHERE id = ? AND email = ? AND password = ?";

  connection.query(q, [id, email, password], (err, result) => {
    if (err) {
      res.send(err);
      return;
    }
    if (result.affectedRows > 0) {
      res.redirect("/users");
    } else {
      res.send("No user found with the provided credentials");
    }
  });
});

// Start the server
app.listen("3001", () => {
  console.log("Server is listening on 3001");
});
