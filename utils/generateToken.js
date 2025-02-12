import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    const generatedToken = jwt.sign({ id: userId }, "idrissa-login-key", {
        expiresIn: '1h'
    })
    return generatedToken;
}