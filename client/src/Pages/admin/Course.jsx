import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "@/redux/courseSlice";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";


const Course = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);

  useEffect(() => {
    const getCreatedCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setCourse(res.data.courses));
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCreatedCourse();
  }, []);

  return (
    <div className="md:p-10 p-4 w-full h-screen">
      <Button className="bg-blue-500" onClick={() => navigate("create")}>
        Create Course
      </Button>
      <Table>
        <TableCaption>A list of your recent Courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Course</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {course?.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="md:w-[300px] flex items-center gap-2">
                <img src={course?.courseThumbnail} alt="thumbnail" className="w-20 hidden md:block rounded-sm"/>
                {course.courseTitle}
              </TableCell>
              <TableCell className="font-medium text-right">
                {course.coursePrice || "NA"}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={course.isPublished ? "bg-green-400" : "bg-red-400"}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/admin/course/${course._id}`)}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Course;
