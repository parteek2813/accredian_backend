const bcrypt = require('bcrypt');
const db = require('../services/database')
const createError = require('../utils/error');

const checkDuplicate = async (field, value) => {
    const rows = await db.query(`SELECT * FROM user_data WHERE ${field}=?`, [value]);

    return rows.length > 0;
}

const userSignup = async (req, res, next) => {
    const { username, email, password, confirm_password } = req.body;

    try {
        //check if username or email already exist

        const isUsernameExist = await checkDuplicate('username', username);
        const isEmailExist = await checkDuplicate('email', email);

        if (isUsernameExist === true)
            return res.status(400).json({ message: 'Username already exist' });

        if (isEmailExist === true)
            return res.status(400).json({ message: 'Duplicate Email' });


        //creating user
        const salt = await bcrypt.genSalt();
        const hashedPasssword = await bcrypt.hash(password, salt);
        const hashConfirm = await bcrypt.hash(confirm_password, salt);

        const sql = "INSERT INTO user_data (username,email,password,confirm_password) VALUES (?,?,?,?)";

        const result = await db.query(sql, [username, email, hashedPasssword, hashConfirm]);

        if (result.affectedRows) {
            return res.status(200).json({ message: 'sign up successful' })
        }
        else {
            return next(createError(500, 'something went wrong try again after some time'))
        }

    } catch (error) {
        next(error);
    }

}

const userlogin = async (req, res, next) => {
    const username_or_email = req.body.username_or_email;
    const password = req.body.password;

    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regular expression for username validation (assuming alphanumeric and underscore are allowed)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    let field;
    if (emailRegex.test(username_or_email)) {
        field = 'email';
    }
    else {
        field = 'username';
    }
    try {
        const userFound = await db.query(`SELECT * FROM user_data WHERE ${field}=?`, [username_or_email]);

        if (userFound.length > 0) {
            const passMatch = await bcrypt.compare(password, userFound[0].password);
            if (passMatch) {
                return res.status(200).json({ msg: userFound });
            }
            else {
                return next(createError(400, 'Invalid credentials'));
            }
        }
        else {
            return next(createError(500, 'User does not exist'))
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { userSignup, userlogin };