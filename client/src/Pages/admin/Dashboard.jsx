// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpenCheck, IndianRupee } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";


const AdminDashboard = () => {
  
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalEnrollments: 0,
    totalStudents: 0,
    totalUsers: 0,
    totalEarning: 0,
    earningChartData: [],
    topCourses: [],
  });

  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/stats`, {withCredentials: true}
        );
        setStats(res.data);
        setTopCourses(res.data.topCourses);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };

    fetchStats();
  }, []);


  // Stats Cards
  const statCards = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: (
        <BookOpenCheck
          size={20}
          className="text-indigo-600 flex justify-center"
        />
      ),
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: <Users size={20} className="text-green-600" />,
    },
    {
      label: "Enrollments",
      value: stats.totalEnrollments,
      icon: <GraduationCap size={20} className="text-yellow-600" />,
    },
    {
      label: "Total Revenue",
      value: stats.totalEarning,
      icon: <IndianRupee size={20} className="text-rose-600" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="text-center shadow-md">
            <CardContent className="py-6">
              <div className="flex gap-2 justify-center items-center">
                <p className="">{stat.icon}</p>
                <p className="text-gray-500 text-lg">{stat.label}</p>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">{stat.value}</h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart and Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.earningChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Thumbnail</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Enrolled</th>
                  <th className="px-4 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCourses?.map((course, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {course.courseTitle}
                    </td>
                    <td className="px-4 py-2">{course.enrolledStudents}</td>
                    <td className="px-4 py-2">₹{course.totalEarning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
