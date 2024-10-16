const Users = require('../models/users');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { fullname, username, email, phoneNumber, password, role, avatar, create_at } = req.body;
        hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({
            fullname,
            username,
            email,
            phoneNumber,
            password : hashedPassword,
            role,
            avatar, 
            create_at
        });
        await user.save();
        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};