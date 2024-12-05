import { Avatar, Card, Typography } from "@material-tailwind/react";
import DropdownMenu from "./DropDownMenu";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TABLE_HEAD = ["Tên", "Username", "Email", "Số điện thoại", ""];

function TableWithStripedRows() {
    const [students, setStudents] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://learning-website-final.onrender.com/admin/users", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Auth-Token': localStorage.getItem('token')
                    }
                });

                if (response.status === 200) {
                    setStudents(response.data.users);
                } else {
                    console.error("Lỗi khi gọi API:", response.statusText);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };
        fetchData();
    }, []);
    return (
        <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-auto text-left max-h-5/6">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => {
                        const { fullname, avatar, username, email, phoneNumber, _id } = student;
                        return (
                            <tr key={_id} className="even:bg-blue-gray-50/50">
                                <td className="p-4 flex items-center gap-3">
                                    <Avatar
                                        src={avatar}
                                        alt={username}
                                        size="md"
                                        className="border border-blue-gray-50 bg-blue-gray-50/50 object-cover"
                                    />
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {fullname}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {username}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {email}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {phoneNumber}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium">
                                        <DropdownMenu userId={_id} />
                                    </Typography>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Card>
    );
}

export default TableWithStripedRows;