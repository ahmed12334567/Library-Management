const userModel = require("../models/auth.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET
const { asyncHandler } = require("../middleware/error.middleware")
const { formateUsersRows } = require("../Utility/fromatBorrowRow")
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(idToken) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload.email_verified) {
            return {
                status: "fail",
                data: {
                    error: "Google email not verified"
                }
            }
        }

        return {
            status: "success",
            payload: {
                email: payload.email,
                name: payload.name,
                sub: payload.sub
            }
        };
    } catch (err) {
        return { status: "fail", error: err.message };
    }
}

const register = ("/register", asyncHandler(async (req, res) => {
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

const login = ("/login", asyncHandler(async (req, res) => {
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

const me = ("/me", asyncHandler(async (req, res) => {
    const { email } = req.user

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
const google = ("/google", asyncHandler(async (req, res) => {
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

const allUsers = ("/users", asyncHandler(async (req, res) => {
    const users = await userModel.getUsers()
    const fromatUsers = users.map(formateUsersRows)

    return res.status(200).json({
        status: "success",
        data: {
            number_of_users: fromatUsers.length,
            users: fromatUsers
        }
    })
}))

const user = ("/users/:id", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id)
    if (!Number.isFinite(userId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid user ID"
            }
        })
    }
    const user = await userModel.getUser(userId)
    if (user.length === 0) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "user not found check user ID"
            }
        })
    }
    const formatUser = user.map(formateUsersRows)

    return res.status(200).json({
        status: "fail",
        data: {
            user: formatUser
        }
    })
}))

const changeRole = ("/users/:id/role", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id)
    const role = req.body?.role?.trim()
    if (!Number.isFinite(userId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid user ID"
            }
        })
    }
    if (!role) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid role"
            }
        })
    }
    const newRole = {
        role: role,
        id: userId
    }
    const changeRole = await userModel.updateUser(newRole)
    if (!changeRole) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "user not found check user ID"
            }
        })
    }
    return res.status(201).json({
        status: "success",
        data: {
            message: "user updated successfuly"
        }
    })
}))

const deleteUser = ("/users/:id", asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id)
    if (!Number.isFinite(userId)) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "Invalid user ID"
            }
        })
    }

    const deleteUser = await userModel.deleteUser(userId)
    if (!deleteUser) {
        return res.status(400).json({
            status: "fail",
            data: {
                message: "user not found check user ID"
            }
        })
    }
    return res.status(200).json({
        status: "success",
        data: null
    })
}))

module.exports = { register, login, google, me, allUsers, user, changeRole, deleteUser }