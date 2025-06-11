import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { ArrowLeft, Lock, PlayCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";



const CourseDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;
  const { course } = useSelector(store => store.course);
  const { user } = useSelector(store => store.auth);
  const selectedCourse = course.find(course => course._id === courseId);
  const [courseLecture, setCourseLecture] = useState(null);
  const isEnrolled = user?.enrolledCourses?.includes(courseId);
  const isInstructor = user?._id === selectedCourse?.creator?._id;


  useEffect(() => {
    const getCourseLecture = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/${courseId}/lecture`, 
                {withCredentials:true}
            )
            if(res.data.success) {
                setCourseLecture(res.data.lectures)
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch lectures");
        }
    }
    getCourseLecture();
  },[]);



  const handleBuyCourse = async (course) => {

    //check if user is logged in
    if(!user) {
       toast.error("Please login to enroll in the course");
       navigate("/login");  // 👈 Redirect to login page
       return;
     }
     
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate`,
      {courseId: course._id},
      {withCredentials:true}
    );
    const { order } = res.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name:"CourseHub",
      description: "Course Purchase",
      order_id: order.id,
      handler: async (response) => {
        const verify = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId: course._id,
            courseTitle: course.courseTitle,
            author: course.creator, // <-- Make sure this exists
            amount: course.coursePrice, // <-- Ensure price is present
          }, {withCredentials: true}
        );
        

        if(verify.data.success) {
          alert("Payment successful & course added!")
          toast.success("Payment successful & course added!")

        //update redux
        const updatedUser = {
          ...user,
          enrolledCourses: [...(user.enrolledCourses || []), course._id],
        };
        dispatch(setUser(updatedUser));

        // ✅ Navigate to course player
          navigate(`/courses/${courseId}/course-player`);
      }
    },
      theme: { color: "#3399cc"}
    }; 

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment Failed", error);
    toast.error("Payment Failed")
  }
};
  

  return (
    <div className="bg-gray-100 md:p-10 ">
      <Card className="max-w-7xl rounded-md mx-auto bg-white shadow-md pt-5 mt-14">
        {/* Header section  */}
        <div className="px-4 py-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={16} />
              </Button>
              <h1 className="md:text-2xl font-bold text-gray-800">
                {selectedCourse.courseTitle}
              </h1>
            </div>
            <div className="flex space-x-4">
              {/* <Button className="bg-blue-500 hover:bg-blue-600"
              onClick={() => handleBuyCourse(selectedCourse)}
              >
                Enroll Now
              </Button> */}
            </div>
          </div>
        </div>

        {/* Course overview section */}
        <div className="p-6 ">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <img
              src={selectedCourse.courseThumbnail}
              alt="thumbnail"
              className="w-full lg:w-1/3 rounded-md mb-4 lg:mb-0"
            />
            <div>
              <p className="text-gray-800 mb-4 font-semibold capitalize">
                {selectedCourse.subTitle}
              </p>
              <p
                className="mb-4 text-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedCourse.description }}
              />
              <p className="text-gray-800 font-semibold">
                ⭐⭐⭐⭐⭐ (4.8) | 1,200 reviews
              </p>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  ₹{selectedCourse.coursePrice}
                </p>
                <p className="text-gray-500 line-through">₹599</p>
              </div>
              <ul className="mt-4 space-y-2">
                <li className="text-gray-600">✔ 30+ hours of video content</li>
                <li className="text-gray-600">
                  ✔ Lifetime access to course materials
                </li>
                <li className="text-gray-600">✔ Certificate of completion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Course Details Section */}
        <div className="  p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            What You'll Learn
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Build dynamic web applications with React and Node.js</li>
            <li>Deploy websites with modern tools like Vercel and Netlify</li>
            <li>Understand REST APIs and database integration</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Requirements
          </h2>
          <p className="text-gray-700">
            Basic programming knowledge is helpful but not required.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mt-6 mb-4">
            Who This Course is For
          </h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade
            skills.
          </p>
        </div>
        {/* Course lectures */}
        {
            courseLecture?.length == 0 ? null : <div className="flex flex-col md:flex-row justify-between gap-10 p-6">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800">Course Curriculum</h2>
                    <p className="text-gray-700 italic my-2">{courseLecture?.length}</p>
                    <div className="space-y-2">
                        {
                            courseLecture?.map((lecture, index) => {
                                return <div key={index} className="flex items-center gap-3 bg-gray-200
                                p-4 rounded-md cursor-pointer">
                                    <span>{lecture.isPreviewFree ? <PlayCircle size={20} /> : <Lock size={20}/>}</span>
                                    <p>{lecture.lectureTitle}</p>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                <Card>
                    <CardContent className="p-4 flex flex-col">
                        <div className="w-full aspect-video mb-4">
                            <ReactPlayer 
                             width="100%"
                             height="100%"
                             url={courseLecture ? courseLecture[0]?.videoUrl : null}
                             controls={true}
                            />
                        </div>
                        <h1>{courseLecture ? courseLecture[0]?.lectureTitle : "Lecture Title"}</h1>
                        <Separator className="my-2" />
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas, a?</p>
                    </CardContent>
                    <CardFooter className="flex p-4">
                        <Button onClick={() => isEnrolled || isInstructor ? (navigate(`/courses/${courseId}/course-player`)) : (handleBuyCourse(selectedCourse))}>
                          { 
                            isEnrolled || isInstructor ? "Continue Course" : "Buy Course"
                          }
                          </Button>
                    </CardFooter>
                </Card>
                </div>
            </div>
        }
        {/* instructor section */}
        <div className="p-6 ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Instructor</h2>
            <div className="flex items-center space-x-4">
                <img src={selectedCourse.creator.photoUrl} alt="instaructor"  
                className="w-16 h-16 rounded-full"/>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedCourse.creator.name}</h3>
                    <p className="text-gray-600">Senior full stack devloper</p>
                </div>
            </div>
            <p className="text-gray-700 mt-4">
                {selectedCourse.creator.description}
            </p>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetails;
