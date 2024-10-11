import { Router, Request, Response, response } from "express";
import { Login } from "../controllers/auth/login"
import { SignUp } from "../controllers/auth/signup"

const auth: Router = Router()
const login: Login = new Login()
const register: SignUp = new SignUp()

// login route
auth.post("/login", async (res: Response, req: Request) => await login.loginUser(res, req))

// signup route
auth.post("/register", async (res: Response, req: Request) => await register.regiserUser(res, req))

export default auth