const path = require("path");
const fs = require("fs");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require('cors');

const { fileStorage, getFileStream } = require("./util/s3");

const app = express();

const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const adminRoutes = require("./routes/admin");

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// CORS
app.use(cors());

// IMAGE SETUP
const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
  }
  else {
      cb(null, false);
  }
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StudentHub API",
      version: "2.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "StudentHub",
        url: "https://studenthub.com",
        email: "studenthub@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(morgan('tiny'));

// FOR SAVING THE LOGS IN A FILE

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))


// FOR UPLOADING THE IMAGE
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// FOR DOWNLOADING THE IMAGE
app.get('/image/:key', (req,res,next)=>{
  const key=req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});


app.get("/", (req, res, next) => {
  return res.status(200).json({
    body: "Backend working",
  });
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);
app.use("/admin", adminRoutes);

// ERROR HANDLING
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    console.log("DB Connected");
    const server = app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
