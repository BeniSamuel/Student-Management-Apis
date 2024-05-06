const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const config = require("./config");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors=require("cors");
const auth= require("./routes/auth");
const mongoose=require("mongoose");


mongoose.connect(config.db.url,{useNewUrlParser: true,useUnifiedTopology: true})
.then(()=>console.log("connection made succesfully"))
.catch((error)=>console.log(error))

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi:"3.0.0",
        info: {
            title: "Course API",
            description: "API documentation for managing courses",
            version: "1.0.0"
        },
        basePath: "/"
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/courses", routes);
app.use("/register",auth);

const port = config.port.number;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
