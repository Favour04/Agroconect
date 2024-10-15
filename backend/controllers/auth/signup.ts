import { Response, Request, response } from "express"
import { Auth } from "../../models/engine/auth"

export class SignUp {
    private auth: Auth
    constructor() {
        this.auth = new Auth()
    }

    async regiserUser(req: Request, res: Response): Promise<void> {
        const {email, password, role} = req.body
        
        try {
            const user = await this.auth.register_user(email, password, role)
            if (user) {
                res.status(201).json({
                    "status-code": 201,
                    "message": `user ${user.email} created`
                })
            }
        } catch(error) {
            if (error instanceof Error) {
                if (error.message.includes("already exist")) {
                    res.status(400).json({
                        status: 400,
                        message: error.message
                    }
                    )
                } else {
                    res.status(500).json({
                        status: 500,
                        message: "An error occur during signup"
                    }
                    )
                    console.log(error.message)
                }
            } else {
                res.status(500).json({
                    status: 500,
                    message: "An unknown error occured"
                })
                console.log("unknown error occured")
            }
        }
    }

    regiserUser0auth(res: Response, req: Request): void {}

}