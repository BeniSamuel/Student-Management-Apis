const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const config = require("./config");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

const port = config.port.number;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
