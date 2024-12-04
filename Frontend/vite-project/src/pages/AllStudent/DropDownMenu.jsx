import React, { useState, useEffect, useRef } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"; // Import biểu tượng
import CoursesOfStudent from "./CoursesOfStudent";
import axios from "axios";

const DropdownMenu = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Tham chiếu đến menu dropdown

    const toggleMenu = () => setIsOpen(!isOpen);
    const token = localStorage.getItem('token');
    const grantInstructorRole = async () => {
        try {
            const response = await axios.put("https://learning-website-final.onrender.com/admin/grant-instructor-role", 
                {userId: userId},
                {
                    headers: {
                        'Auth-Token': token
                    }
                });

            if (response.status === 200) {
                alert("Cấp quyền instructor thành công!");
            } else {
                alert(`Lỗi: ${response.data.message}`);
            }
        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
            alert("Đã xảy ra lỗi khi cấp quyền instructor.");
        }
    };

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <td className="p-4 relative">
            {/* Nút ba chấm */}
            <button onClick={(e) => { e.preventDefault(); toggleMenu(); }} className="text-blue-gray font-medium">
                <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {isOpen && (
                <ul
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-48 z-10"
                >
                    <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                        <CoursesOfStudent userId={userId}/>
                    </li>

                    <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={grantInstructorRole}
                    >
                        Cấp quyền instructor
                    </li>
                </ul>
            )}
        </td>
    );
};

export default DropdownMenu;
