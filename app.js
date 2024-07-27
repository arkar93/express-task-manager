const express = require("express");
const cors = require("cors");
const { body, validationResult } = require("express-validator");
const app = express();
const port = 9001;

app.use(cors());
app.use(express.json());

let tasks = [];

const validateTask = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
];

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", validateTask, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      path: err.path,
      msg: err.msg,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }

  const id = tasks.length ? tasks[tasks.length - 1]["id"] + 1 : 1;

  const task = {
    id,
    name: req.body.name,
    description: req.body.description,
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send({ error: "Task not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
