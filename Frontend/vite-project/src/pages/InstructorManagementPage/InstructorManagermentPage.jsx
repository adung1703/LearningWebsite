import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import ViewCourses from './ViewCourses';
import { TrashIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Avatar,
    IconButton,
    Tooltip,
    Input,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Username", "Họ và tên", "Email", "Số điện thoại", ""];

const TransactionsTable = ({ instructors }) => {
    const handleDelete = () => {
        alert('Delete user');
    }
    return (
        <Card className="h-full w-5/6 mx-auto">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Danh sách giảng viên tại EduCoder
                        </Typography>
                        {/* <Typography color="gray" className="mt-1 font-normal">
                            These are details about the last transactions
                        </Typography> */}
                    </div>
                    <div className="flex w-full shrink-0 gap-2 md:w-max">
                        <div className="relative w-full md:w-72">
                            <span className="absolute inset-y-0 left-3 flex items-center">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>

                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4" >
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
                        {instructors.map(( instructor, index ) => {
                                const isLast = index === instructors.length - 1;
                                const classes = isLast ? "p-4": "p-4 border-b border-blue-gray-50";
                                const { avatar, username, fullname, email, phoneNumber,_id } = instructor;
                                return (
                                    <tr key={_id}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={avatar}
                                                    alt={username}
                                                    size="md"
                                                    className="border border-blue-gray-50 bg-blue-gray-50/50 object-cover"
                                                />
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold"
                                                >
                                                    {username}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {fullname}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {email}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {phoneNumber}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Tooltip content="View Courses">
                                                <ViewCourses instructor={instructor} />
                                            </Tooltip>
                                            <Tooltip content="Delete User">
                                                <IconButton variant="text" color="red" onClick={handleDelete}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </CardBody>
            {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Button variant="outlined" size="sm">
                    Previous
                </Button>
                <div className="flex items-center gap-2">
                    <IconButton variant="outlined" size="sm">
                        1
                    </IconButton>
                    <IconButton variant="text" size="sm">
                        2
                    </IconButton>
                    <IconButton variant="text" size="sm">
                        3
                    </IconButton>
                    <IconButton variant="text" size="sm">
                        ...
                    </IconButton>
                    <IconButton variant="text" size="sm">
                        8
                    </IconButton>
                    <IconButton variant="text" size="sm">
                        9
                    </IconButton>
                    <IconButton variant="text" size="sm">
                        10
                    </IconButton>
                </div>
                <Button variant="outlined" size="sm">
                    Next
                </Button>
            </CardFooter> */}
        </Card>
    );
}

const InstructorPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/sign-in');
        }
        const fetchUser = async () => {
            axios.get('https://learning-website-final.onrender.com/user/user-info', {
                headers: {
                    'Auth-Token': token,
                },
            })
            .then((response) => {
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                    if (user.role !== 'admin') {
                        alert('You are not an admin');
                        navigate('/dashboard');
                    }
                } else {
                    console.error('Invalid response structure:', response.data);
                    navigate('/sign-in');
                }
            })
            .catch((error) => {
                console.error('Error fetching user info:', error);
                navigate('/sign-in');
            });
        }
        fetchUser();

        const fetchListInstructors = async () => {
            axios.get('https://learning-website-final.onrender.com/admin/instructors', {
                headers: {
                    'Auth-Token': token,
                },
            })
            .then((response) => {
                if (response.data && response.data.instructors) {
                    setInstructors(response.data.instructors);
                } else {
                    console.error('Invalid response structure:', response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching instructors:', error);
            });
        }
        fetchListInstructors();
}, [navigate]);


// if (loading) return <div>Loading...</div>;
// if (error) return <div>Error: {error}</div>;

return (
    <div className='InstructorsManagement'>
        <Navbar />
        <br />
        <div>
            <TransactionsTable instructors={instructors}/>
        </div>
    </div>
);
};

export default InstructorPage;
