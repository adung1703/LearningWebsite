import React, { useState } from 'react'
import './ProfilePage.css'
import Navbar from '../../components/Navbar/Navbar'

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [avatar, setAvatar] = useState(null);

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
            <div className="profile-avatar-section">
                <img
                    src={avatar || 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg'}
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
                <input type="text" value="john_doe" readOnly />
            </div>
            <div className="profile-field">
                <label>Fullname</label>
                <input type="text" placeholder="Enter your fullname" />
            </div>
            <div className="profile-field">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" />
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
    )
}

export default ProfilePage;
