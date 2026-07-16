const express = require("express")
const router = express.Router()
const userModel = require("../models/auth.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const JWT_SECRET = process.env.JWT_SECRET
const { asyncHandler } = require("../middleware/error.middleware")

asyncHandler(async function verifyGoogleToken(accessToken) {
    client.setCredentials({ access_token: accessToken });

    const userInfo = await client.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    const payload = userInfo.data;

    return {
        success: true,
        payload: {
            email: payload.email,
            name: payload.name,
            sub: payload.sub
        }
    };

})

router.post("/register", asyncHandler(async (req, res) => {
    const username = req.body?.username?.trim()
    const email = req.body?.email?.trim()
    const password = req.body?.password
    const googleUser = req.body?.googleUser


    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) {
        return res.status(409).json({
            status: "failed",
            data: {
                message: "Email already exists"
            }
        });
    }

    let hashedPassword = null;
    if (!googleUser) {
        hashedPassword = await bcrypt.hash(password, 10);
    }
    const newUser = {
        username: username,
        email: email,
        password: hashedPassword,
        googleUser: googleUser
    }

    const user = await userModel.createUser(newUser)
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
    return res.status(201).json({
        status: "success",
        data: {
            message: "Account created successfuly",
            user: {
                name: user.username,
                email: user.email,
                role: user.role
            },
            token: token
        }
    })
}))

router.post("/login", asyncHandler(async (req, res) => {
    const email = req.body?.email?.trim()
    const password = req.body?.password?.trim()

    const existingUser = await userModel.findUserByEmail(email)
    if (!existingUser) {
        return res.status(400).json({ status: "failed", data: { message: "user not find" } })
    }

    const comparePassword = await bcrypt.compare(password, existingUser.password)
    if (!comparePassword) {
        return res.status(400).json({ status: "failed", data: { message: "wrong password or email" } })
    }


    const token = jwt.sign(
        {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
    return res.status(200).json({
        status: "success", data: {
            message: "login successfuly",
            user: {
                username: existingUser.username,
                email: existingUser.email
            },
            token: token
        }
    })

}
))

router.get("/me", asyncHandler(async (req, res) => {
    const email = req.userEmail

    const existingUser = await userModel.findUserByEmail(email)

    if (!existingUser) {
        return res.status(404).json({ status: "failed", data: { message: "user not find" } })
    }
    return res.status(200).json({
        status: "success",
        data: {
            user: {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role
            }
        }
    })
}
))

// TODO:
// - Store Google sub in database.
// - Verify email_verified from Google.
router.post("/google", asyncHandler(async (req, res) => {
    const googleIdToken = req.body.googleIdToken;

    if (!googleIdToken) {
        return res.status(400).json({
            status: "falied",
            data: {
                message: "google token requried"
            }
        });
    }
    const result = await verifyGoogleToken(googleIdToken);
    if (!result.success) {
        return res.status(401).json({
            status: "falied",
            data: {
                message: "Invalid Google Token: " + result.error
            }
        });
    }

    const payload = result.payload;
    const email = payload.email.toLowerCase();

    let user = await userModel.findUserByEmail(email);

    if (user) {
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            status: "success",
            data: {
                message: "Login successful",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token: token
            }
        });
    }

    const newUser = {
        username: payload.name,
        email: payload.email,
        password: null,
        googleUser: true,
        googleSub: payload.sub
    };

    user = await userModel.createUser(newUser);

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return res.status(201).json({
        status: "success",
        data: {
            message: "Account created successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token: token
        }
    });

}
));

module.exports = router