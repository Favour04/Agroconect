import  express, { Application, Request, Response } from "express";
import auth from "./routes/auth_route";
import cors from "cors"

const app: Application = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/auth", auth);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);	
})