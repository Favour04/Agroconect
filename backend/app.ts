import  express, { Application, Request, Response } from "express";
import auth from "./routes/auth_route";

const app: Application = express();
const PORT = 3000;

app.use(express.json());  

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/auth", auth);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);	
})