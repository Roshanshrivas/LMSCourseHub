import CourseCard from "@/components/CourseCard";
import { setCourse } from "@/redux/courseSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// export const coursesJson = [
//   {
//     "id": 1,
//     "title": "Full Stack Web Development",
//     "description": "Master front-end and back-end web development with hands-on projects using HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB.",
//     "image": "https://example.com/images/fullstack.jpg"
//   },
//   {
//     "id": 2,
//     "title": "Data Structures and Algorithms",
//     "description": "Learn fundamental data structures and algorithms with real-world coding problems to strengthen your problem-solving skills.",
//     "image": "https://example.com/images/dsa.jpg"
//   },
//   {
//     "id": 3,
//     "title": "Python for Beginners",
//     "description": "Start your programming journey with Python. Learn syntax, variables, data types, control flow, and more.",
//     "image": "https://example.com/images/python.jpg"
//   },
//   {
//     "id": 4,
//     "title": "React.js Essentials",
//     "description": "Learn to build modern, responsive front-end web apps using React.js, including hooks, components, and state management.",
//     "image": "https://example.com/images/react.jpg"
//   },
//   {
//     "id": 5,
//     "title": "UI/UX Design Fundamentals",
//     "description": "Understand design principles, user flows, wireframing, and prototyping to build user-friendly web and mobile apps.",
//     "image": "https://example.com/images/uiux.jpg"
//   },
//   {
//     "id": 6,
//     "title": "Machine Learning Basics",
//     "description": "Get started with machine learning concepts like supervised learning, unsupervised learning, and basic model evaluation.",
//     "image": "https://example.com/images/ml.jpg"
//   }
// ]

const Courses = () => {
  const dispatch = useDispatch();
  const { course } = useSelector((store) => store.course);

  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const getAllPublishedCourse = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/course/published-courses`,
          { withCredentials: true }
        );
        if (res?.data?.success) {
          dispatch(setCourse(res?.data?.courses));
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPublishedCourse();
  }, []);

  return (
    <div className="bg-gray-100 pt-14">
      <div className="min-h-screen max-w-7xl mx-auto py-10">
        <div className="px-4">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Our Courses
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Explore our curated courses to boost your skills and career. Whether
            you're a beginner or an expert, we have something for everyone.
          </p>

          {loading ? (
            <div className="text-center text-lg text-gray-600 py-20">
              Loading courses...
            </div>
          ) : course?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {course?.map((course, index) => {
                return <CourseCard course={course} key={index} />;
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              No courses available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
