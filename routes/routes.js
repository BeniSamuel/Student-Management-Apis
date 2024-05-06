const Joi = require("joi");
const express = require("express");
const router = express.Router();

const courses = [
    {
        id: 1,
        name: "english",
        about: "english course"
    },
    {
        id: 2,
        name: "math",
        about: "math course"
    },
    {
        id: 3,
        name: "physic",
        about: "physic course"
    }
];

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     description: Returns a list of courses
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   about:
 *                     type: string
 */
router.get("/courses", (req, res) => {
    res.json(courses);
});

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a single course
 *     description: Retrieve a course by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single course object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 about:
 *                   type: string
 *       404:
 *         description: Course not found
 */
router.get("/courses/:id", (req, res) => {
    const { id } = req.params;
    const course = courses.find(c => c.id === parseInt(id));
    if (!course) {
        res.status(404).send("Resource not found");
    } else {
        res.status(200).send(course);
    }
});

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     description: Create a new course with the provided name and about
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               about:
 *                 type: string
 *             required:
 *               - name
 *               - about
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request, missing or invalid parameters
 */
router.post("/courses", async (req, res) => {
    const result = await validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
        about: req.body.about
    };

    courses.push(course);
    res.status(201).send(course);
});

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     description: Update an existing course with the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               about:
 *                 type: string
 *             required:
 *               - name
 *               - about
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       404:
 *         description: Course not found
 */
router.put("/courses/:id", async (req, res) => {
    const { id } = req.params;
    const course = courses.find(c => c.id === parseInt(id));
    if (!course) {
        res.status(404).send("Resource not found");
        return;
    }

    const result = await validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;
    course.about = req.body.about;

    res.status(200).send(course);
});

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete a course with the provided ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete("/courses/:id", (req, res) => {
    const { id } = req.params;
    const course = courses.find(c => c.id === parseInt(id))
    if (!course) {
        res.status(404).send("Resource not found!");
        return;
    }
    const manyCourse = courses.filter(c => c !== course);
    res.status(200).send(manyCourse);
});

async function validate(course) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        about: Joi.string().required()
    });

    return await schema.validate(course);
}

module.exports = router;
