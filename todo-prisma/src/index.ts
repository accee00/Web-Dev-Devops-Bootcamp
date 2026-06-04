import express, { type Express, type Response, type Request } from "express";

const app: Express = express();
const port = 8000;
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log(req.method);
  res.json("Hello World from Bun and TypeScript!");
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port http://localhost:${port}`);
});
