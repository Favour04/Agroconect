import { Response, Request, response } from "express"
import { Auth } from "../../models/engine/auth"

export class SignUp {
    private auth: Auth
    constructor() {
        this.auth = new Auth()
    }

    async regiserUser(res: Response, req: Request): Promise<void> {
        const {email, password, role} = req.body
        const user = await this.auth.register_user(email, password, role)
        if (!user) {
            
        }
        res.status(201).json({
            "status-code": 201,
            "message": `user ${email} created`
        })
    }

    regiserUser0auth(res: Response, req: Request): void {}

}