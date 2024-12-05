import { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import axios from 'axios';

const CoursesOfStudent = ({ userId }) => {

    const [openModal, setOpenModal] = useState(false);
    const [courses, setCourses] = useState([]);

    const handleViewCourses = () => {
        setOpenModal(true);
    }
    const handleOpenModal = () => setOpenModal(!openModal);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`https://learning-website-final.onrender.com/admin/get-course-joined/${userId}`, 
                    {
                        headers: {
                            'Auth-Token': localStorage.getItem('token')
                        }
                    });
                if (response.data.success) {
                    setCourses(response.data.courses.coursesJoined);
                } else {
                    console.error("Lỗi khi gọi API:", response.statusText);
                }
            } catch (error) {
                console.error("Catch:", error);
            }
        }
        fetchCourses();
    }, [userId]);

    return (
        <>
            <div onClick={(e) => {e.preventDefault(); handleViewCourses();}}>
                Xem các khóa học đã tham gia
            </div>
            <Dialog open={openModal}
                handler={handleOpenModal}
                className="w-2/3 h-11/12 max-h-screen fixed bg-cyan-50 mx-auto inset-0 items-center justify-center"
            >
                <DialogHeader className="mt-5 mx-5">Danh sách khóa học đã tham gia: </DialogHeader>
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
                        onClick={handleOpenModal}
                        className="mr-1 mb-2 bg-red-800"
                    >
                        <span>Cancel</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default CoursesOfStudent;