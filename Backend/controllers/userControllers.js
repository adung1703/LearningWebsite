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

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; 

        const user = await User.findOne({ username });

        // console.log(user);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Tài khoản không tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (hashedPassword !== user.password) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác' });
        }

        // Tạo token JWT
        const token = jwt.sign({ 
                    id: user._id, 
                    username: user.username, 
                    fullname: user.fullname, 
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    password: user.password,
                    role: user.role,
                    avatar: user.avatar,
                    create_at: user.create_at
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Gửi token trong phản hồi
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi đăng nhập' });
    }
};

exports.getUserInfor = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi lấy thông tin người dùng' });
    }
};
