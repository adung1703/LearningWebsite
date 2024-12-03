import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCoursePage.css';
import Navbar from '../../components/Navbar/Navbar';
import axios from "axios";

const AddCoursePage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [instructorId, setInstructorId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/user/user-info', {
                    method: 'GET',
                    headers: {
                        'Auth-Token': token,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setInstructorId(data.user._id); // Set the instructor ID
                } else {
                    console.error('Error fetching user info:', data.message);
                    alert('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
                    navigate('/sign-in');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                alert('Đã xảy ra lỗi khi lấy thông tin người dùng.');
                navigate('/sign-in');
            }
        };

        fetchUserInfo();
    }, [navigate]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result); // Store the file content
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null); // Reset the selected image
    };

    const handleSubmit = async () => {
        if (!title || !description || price === '') {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const parsedPrice = parseInt(price, 10);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            alert('Giá phải là một số nguyên dương!');
            return;
        }

        if (!instructorId) {
            alert('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', parsedPrice);
        formData.append('instructor', instructorId);
        if (selectedImage) {
            const fileBlob = new Blob([selectedImage], { type: 'text/html' });
            formData.append('image', new File([fileBlob], 'course-image.html'));
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:3000/course/add-course", formData, {
                headers: {
                    "Auth-Token": token,
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = await response.data;
            if (data.success) {
                alert('Thêm khóa học thành công!');
                navigate('/dashboard');
            } else {
                alert(`Thêm khóa học thất bại: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Đã xảy ra lỗi khi thêm khóa học!');
        }
    };

    return (
        <div className="AddCoursePage">
            <Navbar />
            <h1>Thêm Khóa Học Mới</h1>
            <div className="form-container">
                <label>
                    Tiêu đề:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nhập tiêu đề khóa học"
                    />
                </label>
                <label>
                    Mô tả:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Nhập mô tả khóa học"
                    />
                </label>
                <label>
                    Giá (VNĐ):
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Nhập giá khóa học"
                    />
                </label>
                <label className="file-input">
                    Chọn ảnh cho khóa học (không bắt buộc):
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>
                {selectedImage && (
                    <div className="image-preview">
                        <p>Đã chọn ảnh: {selectedImage.name}</p>
                        <button onClick={handleRemoveImage} className="remove-image-button">
                            X
                        </button>
                    </div>
                )}
                <button onClick={handleSubmit} className="submit-button">
                    Xác nhận thêm
                </button>
            </div>
        </div>
    );
};

export default AddCoursePage;
