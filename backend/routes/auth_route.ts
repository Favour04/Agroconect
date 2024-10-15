import { Router, Request, Response, response } from "express";
import { Login } from "../controllers/auth/login"
import { SignUp } from "../controllers/auth/signup"

const auth: Router = Router()
const login: Login = new Login()
const register: SignUp = new SignUp()

// login route
auth.post("/login", async (req: Request, res: Response) => await login.loginUser(req, res))

// signup route
auth.post("/register", async (req: Request, res: Response) => await register.regiserUser(req, res))

export default auth