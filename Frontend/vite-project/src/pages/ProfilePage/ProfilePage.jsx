import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import Navbar from '../../components/Navbar/Navbar';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [avatar, setAvatar] = useState(null);
    const [userData, setUserData] = useState({
        username: '',
        fullname: '',
        email: '',
        phoneNumber: '',
        role: '',
    });
    const [error, setError] = useState('');

    // Function to fetch user info from the API
    const fetchUserInfo = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/user-info', {
                method: 'GET',
                headers: {
                    'Auth-Token': localStorage.getItem('token'), // Change to 'Auth-Token'
                },
            });
            

            const data = await response.json();
            if (response.ok) {
                setUserData({
                    username: data.user.username,
                    fullname: data.user.fullname,
                    email: data.user.email,
                    phoneNumber: data.user.phoneNumber,
                    role: data.user.role,
                });
                setAvatar(data.user.avatar || 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg');
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            setError('An error occurred while fetching user information.');
        }
    };

    // Fetch user info on component mount
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const renderProfileTab = () => (
        <div className="profile-container">
            <h2>Profile</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="profile-avatar-section">
                <img
                    src={avatar}
                    alt="avatar"
                    className="avatar"
                />
                <input 
                    type="file" 
                    id="avatar-upload" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={handleAvatarChange}
                />
                <button 
                    className="change-avatar-btn" 
                    onClick={() => document.getElementById('avatar-upload').click()}
                >
                    Change Avatar
                </button>
            </div>
            <div className="profile-field">
                <label>Username</label>
                <input type="text" value={userData.username} readOnly />
            </div>
            <div className="profile-field">
                <label>Fullname</label>
                <input 
                    type="text" 
                    value={userData.fullname} 
                    onChange={(e) => setUserData({ ...userData, fullname: e.target.value })}
                />
            </div>
            <div className="profile-field">
                <label>Email</label>
                <input 
                    type="email" 
                    value={userData.email} 
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
            </div>
            <div className="profile-field">
                <label>Phone Number</label>
                <input 
                    type="tel" 
                    value={userData.phoneNumber} 
                    onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                />
            </div>
            <button className="save-btn">Save</button>
        </div>
    );

    const renderPasswordTab = () => (
        <div className="password-container">
            <h2>Change Password</h2>
            <div className="profile-field">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
            </div>
            <div className="profile-field">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
            </div>
            <div className="profile-field">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" />
            </div>
            <button className="save-btn">Save</button>
        </div>
    );

    return (
        <div className='ProfilePage'>
            <Navbar />
            <div className="profile-layout">
                <div className="sidebar">
                    <button 
                        className={activeTab === 'profile' ? 'active' : ''} 
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button 
                        className={activeTab === 'password' ? 'active' : ''} 
                        onClick={() => setActiveTab('password')}
                    >
                        Password
                    </button>
                </div>
                <div className="content">
                    {activeTab === 'profile' ? renderProfileTab() : renderPasswordTab()}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
