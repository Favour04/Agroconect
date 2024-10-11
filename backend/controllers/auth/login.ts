import { Response, Request } from "express"
import { Auth } from "../../models/engine/auth"

export class Login {
    private auth: Auth
    constructor() {
        this.auth = new Auth()
    }
    
    async loginUser(res: Response, req: Request): Promise<void> {
        const {email, password} = req.body
        const isValid = await this.auth.isvalid_login(email, password)
        if(!isValid) {
            res.status(401).json({
                status: 401,
                message: "invalid credentials"
            });
        } else {
            res.status(200).json({
                status: 200,
                message: "login successful"
            });
        }
    }
}