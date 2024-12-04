import { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton
} from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/solid";
import axios from 'axios';

const ViewCourses = ({ instructor }) => {

    const [open, setOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem('token');

    const handleViewCourses = () => {
        setOpen(true);
    }
    const handleOpen = () => setOpen(!open);

    useEffect(() => {
        const fetchCourses = async () => {
            axios.get(`https://learning-website-final.onrender.com/admin/instructor-courses/${instructor._id}`, {
                headers: {
                    'Auth-Token': token,
                },
            })
            .then((response) => {
                if (response.data) {
                    setCourses(response.data.courses);
                } else {
                    console.error('Invalid response structure:', response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching instructors:', error);
            });
        }
        fetchCourses();
    }
    , [instructor]);

    return (
        <>
            <IconButton variant="text" color="blue" onClick={handleViewCourses}>
                <EyeIcon className="h-4 w-4" /> {/* Biểu tượng để xem */}
            </IconButton>
            <Dialog open={open}
                handler={handleOpen}
                className="w-2/3 h-11/12 max-h-screen fixed bg-cyan-50 mx-auto inset-0 items-center justify-center"
            >
                <DialogHeader className="mt-5 mx-5">Danh sách khóa học do {instructor.fullname} giảng dạy: </DialogHeader>
                <DialogBody>
                    <div className="overflow-x-auto overflow-y-auto max-h-[70vh] px-5">
                        <table className="table-fixed divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên khóa học
                                    </th>
                                    <th scope="col" className="w-2/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {courses.map((course) => (
                                    <tr key={course._id}>
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full" src={course.image} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="text-sm text-gray-900 line-clamp-3">{course.description}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogBody>
                <DialogFooter className="">
                    <Button
                        variant="text"
                        color="white"
                        onClick={handleOpen}
                        className="mr-1 mb-2 bg-red-800"
                    >
                        <span>Cancel</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default ViewCourses;