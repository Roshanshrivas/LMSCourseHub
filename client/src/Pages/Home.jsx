import CourseCard from "@/components/CourseCard";
import Hero from "@/components/Hero";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { course } = useSelector((store) => store.course);
  const [loading, setLoading] = useState(true);


   useEffect(() => {
    if (course && course.length > 0) {
      setLoading(false);
    }
  }, [course]);

  return (
    <div>
      <Hero />
      <div className="py-10">
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
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
            {course?.slice(0, 6).map((course, index) => {
              return <CourseCard course={course} loading={loading} key={index} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
