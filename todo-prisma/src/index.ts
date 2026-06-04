import express, { type Express, type Response, type Request } from "express";
import { signupUser, signInUser } from "./controllers/user-controller.ts";
import {
  addTodo,
  deleteTodo,
  updateTodo,
} from "./controllers/todo-controller.ts";

import { authMiddleware } from "./middleware.js/auth-middleware.ts";

const app: Express = express();
const port = 8000;

app.use(express.json());
app.post("/sign-up", signupUser);
app.post("/sign-in", signInUser);
app.post("/todo", authMiddleware, addTodo);
app.delete("/todo/:id", authMiddleware, deleteTodo);
app.patch("/todo/:id", authMiddleware, updateTodo);

app.get("/", (req: Request, res: Response) => {
  console.log(req.method);
  res.json("Hello World from Bun and TypeScript!");
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port http://localhost:${port}`);
});
