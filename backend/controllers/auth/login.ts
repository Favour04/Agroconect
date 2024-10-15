import { Response, Request } from "express"
import { Auth } from "../../models/engine/auth"

export class Login {
    private auth: Auth
    constructor() {
        this.auth = new Auth()
    }
    
    async loginUser(req: Request, res: Response): Promise<void> {
        if (!req.body) {
            console.log(req.body)
            return
        }
        
        const email = req.body.email;
        const password = req.body.password;

        try {
            const isValid = await this.auth.isvalid_login(email, password)
            if(!isValid) {
                res.status(401).json({
                    status: 401,
                    message: "invalid credentials"
                });
            }

            res.status(200).json({
                status: 200,
                message: "login successful"
            })
        } catch(error) {
            if (error instanceof Error) {
                if (error.message.includes("does not exist")) {
                    res.status(400).json({
                            status: 404,
                            message: error.message
                        }
                    )
                } else {
                    res.status(500).json({
                        status: 500,
                        message: "An error occur during login"
                    }
                    )
                }
            } else {
                res.status(500).json({
                    status: 500,
                    message: "An unknown error occured"
                })
            }
        }
    }
}