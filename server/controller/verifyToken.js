const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
    const token = req.headers.token;
    // const refreshToken = req.cookies.refreshToken;
    if (token) {
        const accessToken = token.split(" ")[1];
        console.log(accessToken);
        jwt.verify(accessToken, process.env.secretkey, (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You're not authenticated");
    }
};
const verifyTokenAndUserAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json("You're not allowed to do that!");
        }
    });
};




module.exports = {
    verifyToken,
    verifyTokenAndUserAuthorization
};