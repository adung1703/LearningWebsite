const Users = require('../models/users');
const bcrypt = require('bcrypt');

exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await Users.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { phoneNumber: identifier }
            ]
        });
        if (!user) {
            return res.status(400).json({ message: 'Thông tin đăng nhập không đúng!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Thông tin đăng nhập không đúng!' });
        }
        res.status(200).json({ message: 'Đăng nhập thành công!', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};