const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const axios = require("axios");
const session = require("express-session");
const { useParams } = require("react-router-dom");
const saltRounds = 10;

//CONNECTION
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "fledge",
  port: 3310,
});

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "secret123",
    cookie: { httpOnly: true },
    resave: true,
    saveUninitialized: false,
    cookie: {
      expires: 1000 * 60 * 60 * 24,
    },
  })
);

//GET ALL BIRDS
app.get("/api/getAll", (req, res) => {
  const sqlSelect = "SELECT * FROM fledge.unique";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET SPECIFIC BIRD
app.get(`/api/getBird/:id`, (req, res) => {
  const [result1, setResult] = [];
  const { id } = req.params;
  const sqlSelect = `SELECT * FROM fledge.unique WHERE id = ${id}`;
  db.query(sqlSelect, (err, result) => {
    res.send(result[0]);
  });
});

//GET ALL CATEGORIES
app.get("/api/getCategories", (req, res) => {
  const sqlSelect = "SELECT * FROM fledge.categories";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET THIS CATEGORY
app.get(`/api/getCatHeaders/:id`, (req, res) => {
  const [result1, setResult] = [];
  const { id } = req.params;
  const sqlSelect = `SELECT * FROM fledge.categories WHERE id = ${id}`;
  db.query(sqlSelect, (err, result) => {
    res.send(result[0]);
  });
});

//GET BIRDS IN A SPECIFIC CATEGORY
app.get("/api/getCategory/:id", (req, res) => {
  const { id } = req.params;
  const sqlSelect = `SELECT * FROM fledge.unique WHERE categoryID = ${id}`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET ALL FORUM POSTS
app.get("/api/getForumPosts", (req, res) => {
  const sqlSelect =
    "SELECT * FROM fledge.forum_posts INNER JOIN fledge.users ON fledge.forum_posts.username = fledge.users.username";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET REPLIES TO A SPECIFIC FORUM POST
app.get("/api/getForumReplies/:postId", (req, res) => {
  const { postId } = req.params;
  const sqlSelect = `SELECT fledge.forum_replies.id, post_id, fledge.forum_replies.username, fledge.forum_replies.message, photo FROM fledge.forum_replies LEFT JOIN fledge.forum_posts ON fledge.forum_replies.post_id = fledge.forum_posts.id LEFT JOIN fledge.users ON fledge.forum_replies.username = fledge.users.username WHERE post_id = ${postId} ORDER BY id`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET USER
app.get(`/api/getUser/:user`, (req, res) => {
  const [result1, setResult] = [];
  const { user } = req.params;
  const sqlSelect = `SELECT * FROM fledge.users WHERE username = ?`;
  db.query(sqlSelect, [user], (err, result) => {
    res.send(result[0]);
  });
});

//GET USER [PROP] (USED TO COMPARE IF SAME USER - I.E. LOOKING AT A DIFFERENT PROFILE)
app.get(`/api/getPropUser/:propUser`, (req, res) => {
  const [result1, setResult] = [];
  const { propUser } = req.params;
  const sqlSelect = `SELECT * FROM fledge.users WHERE username = ?`;
  db.query(sqlSelect, [propUser], (err, result) => {
    res.send(result[0]);
  });
});

//GET RECEIVED MESSAGES  A TO PARTICULAR USER
app.get("/api/getMessages/:user", (req, res) => {
  const [result1, setResult] = [];
  const { user } = req.params;
  const sqlSelect = `SELECT to_id, from_user.id AS from_user_id, 
  from_user.username AS from_user_username,
  from_user.photo AS from_user_photo,
  message
  FROM fledge.dms 
  LEFT JOIN fledge.users ON fledge.dms.to_id = users.id
  LEFT JOIN fledge.users AS from_user ON fledge.dms.from_id = from_user.id
  WHERE fledge.users.username = '${user}'; `;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET MESSAGES SENT TO PARTICULAR USER
app.get("/api/getSentMessages/:user", (req, res) => {
  const [result1, setResult] = [];
  const { user } = req.params;
  const sqlSelect = `SELECT to_user.id AS to_user_id, 
  to_user.username AS to_user_username,
  to_user.photo AS to_user_photo,
  message
  FROM fledge.dms 
  LEFT JOIN fledge.users ON fledge.dms.from_id = users.id
  LEFT JOIN fledge.users AS to_user ON fledge.dms.to_id = to_user.id
  WHERE fledge.users.username = '${user}'; `;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET SIGHTINGS FOR A PARTICULAR BIRD
app.get("/api/getSightings/:id", (req, res) => {
  const [result1, setResult] = [];
  const { id } = req.params;
  const sqlSelect = `SELECT bird_id, date, latitude, longitude, user, photo FROM fledge.sightings
        WHERE bird_id = ${id}`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
    // console.log(result);
  });
});

//GET SIGHTING BY SIGHTING ID
app.get("/api/getThisSightings/:id", (req, res) => {
  const [result1, setResult] = [];
  const { id } = req.params;
  const sqlSelect = `SELECT bird_id, date, latitude, longitude, user, photo FROM fledge.sightings
        WHERE id = ${id}`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
    // console.log(result);
  });
});

//GET SIGHTINGS FOR A PARTICULAR BIRD THAT INCLUDE A PHOTO
app.get("/api/getSightingsNotNull/:id", (req, res) => {
  const [result1, setResult] = [];
  const { id } = req.params;
  const sqlSelect = `SELECT bird_id, date, latitude, longitude, user, fledge.sightings.photo, fledge.users.photo AS user_photo FROM fledge.sightings
  INNER JOIN fledge.users ON fledge.sightings.user = fledge.users.username
    WHERE bird_id = ${id} AND fledge.sightings.photo IS NOT NULL`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
    // console.log(result);
  });
});

//GET SIGHTINGS FOR A PARTICULAR USER
app.get("/api/getUserSightings/:user", (req, res) => {
  const [result1, setResult] = [];
  const { user } = req.params;
  const sqlSelect = `SELECT bird_id, name, date, latitude, longitude, user, photo FROM fledge.sightings
  INNER JOIN  fledge.unique ON fledge.unique.id = fledge.sightings.bird_id
  WHERE user = '${user}'`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET ALL USER SIGHTINGS
app.get("/api/getAllUserSightings", (req, res) => {
  const [result1, setResult] = [];
  const sqlSelect = `SELECT fledge.sightings.id, bird_id, date, user, fledge.sightings.photo, fledge.users.photo AS user_photo, name, fledge.sightings.latitude, fledge.sightings.longitude 
  FROM fledge.sightings 
  JOIN fledge.unique ON fledge.unique.id = fledge.sightings.bird_id 
  INNER JOIN fledge.users ON fledge.sightings.user = fledge.users.username
  WHERE fledge.sightings.user IS NOT NULL 
  ORDER BY fledge.sightings.date DESC`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//GET COMMENTS FOR A PARTICULAR SIGHTING
app.get("/api/getSightingComments/:id", (req, res) => {
  const { id } = req.params;
  const sqlSelect = `SELECT fledge.sighting_comments.id, fledge.sighting_comments.user, fledge.sighting_comments.comment, fledge.users.photo AS photo
  FROM fledge.sighting_comments
  LEFT JOIN fledge.sightings ON fledge.sighting_comments.sighting_id = fledge.sightings.id 
  LEFT JOIN fledge.users ON fledge.sighting_comments.user = fledge.users.username 
  WHERE sighting_id = ${id}
  ORDER BY id`;
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

//REGISTER NEW USER
app.post("/api/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const emailAdd = req.body.emailAdd;

  const sqlInsert =
    "INSERT INTO fledge.users (username, password, emailAdd, photo, description) VALUES (? , ?, ?, 'https://media.istockphoto.com/vectors/male-profile-flat-blue-simple-icon-with-long-shadow-vector-id522855255?k=20&m=522855255&s=612x612&w=0&h=fLLvwEbgOmSzk1_jQ0MgDATEVcVOh_kqEe0rqi7aM5A=', 'Say a little about yourself...')";

  bcrypt.hash(password, saltRounds, (err, hash) => {
    db.query(sqlInsert, [username, hash, emailAdd], (err, result) => {
      console.log("this should be null", err);
    });
  });
});

//ADD DIRECT MESSAGE
app.post("/api/addmessage", (req, res) => {
  const propId = req.body.propId;
  const userId = req.body.userId;
  const text = req.body.text;

  const sqlInsert =
    "INSERT INTO fledge.dms (id, from_id, to_id, message) VALUES (null, ?, ?, ?)";

  db.query(sqlInsert, [propId, userId, text], (err, result) => {
    console.log(err);
  });
});

//ADD PHOTO - REDUNDANT FOR NOW
app.post("/api/submitPhoto/:id", (req, res) => {
  const user = req.body.user;
  const url = req.body.url;
  const { id } = req.params;

  const sqlInsert =
    "INSERT INTO fledge.user_photos (username, photo, bird_id) VALUES (? , ?, ?)";

  db.query(sqlInsert, [user, selectedFile, id], (err, result) => {
    console.log(err);
  });
});

//CHANGE PROFILE PICTURE
app.post("/api/submitUserPhoto", (req, res) => {
  const user = req.body.user;
  const url = req.body.url;

  const sqlInsert = "UPDATE fledge.users SET photo = (?) WHERE username = (?)";

  db.query(sqlInsert, [url, user], (err, result) => {
    console.log(err);
  });
});

//CHANGE PROFILE ABOUT ME DESCRIPTION
app.post("/api/addDescription", (req, res) => {
  const user = req.body.user;
  const text = req.body.text;

  const sqlInsert =
    "UPDATE fledge.users SET description = (?) WHERE username = (?)";

  db.query(sqlInsert, [text, user], (err, result) => {
    console.log(err);
  });
});

//ADD NEW FORUM POST
app.post("/api/addForumPost", (req, res) => {
  const user = req.body.user;
  const title = req.body.title;
  const text = req.body.text;

  const sqlInsert =
    "INSERT INTO fledge.forum_posts (id, username, title, message) VALUES (null, ? , ?, ?)";

  db.query(sqlInsert, [user, title, text], (err, result) => {
    console.log(err);
  });
});

//ADD REPLY TO A FORUM POST
app.post("/api/addForumReply", (req, res) => {
  const postId = req.body.postId;
  const user = req.body.user;
  const replyText = req.body.replyText;
  const sqlInsert =
    "INSERT INTO fledge.forum_replies (id, post_id, username, message) VALUES (null, ? , ?, ?)";
  db.query(sqlInsert, [postId, user, replyText], (err, result) => {
    console.log(err);
  });
});

//ADD COMMENT TO A SIGHTING
app.post("/api/addSightingComment", (req, res) => {
  const sightingId = req.body.sightingId;
  const user = req.body.user;
  const commentText = req.body.commentText;
  const sqlInsert =
    "INSERT INTO fledge.sighting_comments (id, sighting_id, user, comment) VALUES (null, ?, ?, ?)";
  db.query(sqlInsert, [sightingId, user, commentText], (err, result) => {
    console.log(err);
  });
});

//ADD SIGHTING WITH PHOTO
app.post("/api/addSighting", (req, res) => {
  const user = req.body.user;
  const url = req.body.url;
  const lat = req.body.lat;
  const long = req.body.long;
  const date = req.body.date;
  const id = req.body.id;

  const sqlInsert =
    "INSERT INTO fledge.sightings (bird_id, date, latitude, longitude, user, photo) VALUES (? , ?, ?, ?, ?, ?)";

  db.query(sqlInsert, [id, date, lat, long, user, url], (err, result) => {
    console.log(err);
  });
});

//ADD SIGHTING WITHOUT PHOTO
app.post("/api/addSightingOnly", (req, res) => {
  const user = req.body.user;
  const lat = req.body.lat;
  const long = req.body.long;
  const date = req.body.date;
  const id = req.body.id;

  const sqlInsert =
    "INSERT INTO fledge.sightings (bird_id, date, latitude, longitude, user, photo) VALUES (? , ?, ?, ?, ?, null)";

  db.query(sqlInsert, [id, date, lat, long, user], (err, result) => {
    console.log(err);
  });
});

// //LOG IN (GET)
app.get("/api/login", (req, res) => {
  // console.log(req.session);
  if (req.session.user) {
    res.send({
      loggedIn: true,
      user: req.session.user,
    });
  } else {
    res.send({
      loggedIn: false,
    });
  }
});

//LOG IN (POST)
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("user", username, password);
  const sqlValidate = "SELECT * FROM fledge.users WHERE username = ?";
  db.query(sqlValidate, username, (err, data) => {
    if (err) {
      console.log("this happens:", err);
      res.status(404).json({ message: err.message });
    }

    if (data.length > 0) {
      //res.send(data);
      bcrypt.compare(password, data[0].password, (error, thisResponse) => {
        if (thisResponse) {
          req.session.user = data;
          console.log("Session: ", req.session.user);
          res.send(data);
        } else {
          res.send({ message: "Wrong username/password combination" });
        }
      });
    } else {
      res.send({ message: "Wrong username/password combination" });
    }
  });
});

// const deleteCookie = (name) => {
//   document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
// };

//LOG OUT
app.post("/api/logout", (req, res) => {
  req.session.destroy();
});

//LISTENER
app.listen(3001, () => {
  console.log("Fledge API running on port 3001");
});
