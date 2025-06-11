import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { Payment } from "../models/payment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });
    return res.status(201).json({
      success: true,
      course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl description",
    });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "No published courses found",
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching published courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId }).populate("lectures");
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this creator",
        courses: [],
      });
    }

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Error fetching creator courses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch creator courses",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const file = req.file;

    let course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    let courseThumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      courseThumbnail = await cloudinary.uploader.upload(fileUri);
    }
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      course,
      message: "Course Updated successfully",
    });
  } catch (error) {
    console.error("Error in editCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Update course",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found in getCourseById",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Error in getCourseById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Course",
    });
  }
};

//lecture controllers

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      success: true,
      lecture,
      message: "Lecture created successfully",
    });
  } catch (error) {
    console.error("Error in createLecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Lecture",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error("Error in getCourseLecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get Course Lecture",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }
    //update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    // Update video info if provided
    if (videoInfo) {
      if (videoInfo.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
      if (videoInfo.publicId) lecture.publicId = videoInfo.publicId;
    }

    await lecture.save();

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture Updated successfully",
    });
  } catch (error) {
    console.error("Error in editLecture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Edit Lecture",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Remove the lecture reffrence from the associate course
    await Course.updateOne(
      { lectures: lectureId }, //find the course that content the lecture
      { $pull: { lectures: lectureId } } // remove the lectures id from the lectures array
    );

    return res.status(200).json({
      success: false,
      message: "Lecture Removed Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture",
    });
  }
};

export const togglePublishedCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; // true, false
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    course.isPublished = !course.isPublished;
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update Status",
    });
  }
};

//Get Dashboard data's

export const getDashboardStats = async (req, res) => {
  try {
    //get the logged in admin id
    const instructorId = req.id;

    // 1. get only courses created by this instructor
    const instructorCourses = await Course.find({
      creator: instructorId,
    }).select("enrolledStudents coursePrice courseTitle courseThumbnail createdAt");
    
    // if(instructorCourses) {
    //     return res.status(404).json({
    //         success:false,
    //         message: "No Courses Found for this Instructor"
    //     })
    // }

    const totalCourses = instructorCourses.length;

    // 2. total enrollments (sum of all enrolledStudents )
    const totalEnrollments = instructorCourses.reduce(
      (acc, course) => acc + course.enrolledStudents.length,
      0
    );

    //3. unique total students
    const studentSet = new Set();
    instructorCourses.forEach((course) => {
      course.enrolledStudents.forEach((studentId) =>
        studentSet.add(studentId.toString())
      );
    });

    const totalStudents = studentSet.size;

    //4. Payments for this instructor's coursesy
    const payments = await Payment.find({ author: instructorId }).select(
      "price author createdAt"
    );
    const totalEarning = payments.reduce(
      (acc, payment) => acc + payment.price,
      0
    );

    //5. Monthly earning chart data
    const monthlyEarning = Array(12).fill(0);
    payments.forEach((payment) => {
      const month = new Date(payment.createdAt).getMonth();
      monthlyEarning[month] += payment.price;
    });
    const earningChartData = monthlyEarning.map((value, index) => ({
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      revenue: value,
    }));

    //6. Top 3 best selling courses by enrollments
     const top3Courses = instructorCourses
        .map((course) => ({
            _id: course._id,
            courseTitle: course.courseTitle,
            enrolledStudents: course.enrolledStudents.length,
            courseThumbnail: course.courseThumbnail,
            totalEarning: course.enrolledStudents.length * course.coursePrice,
        }))
        .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
        .slice(0, 3);
        

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      totalCourses,
      totalEnrollments,
      totalStudents,
      totalEarning,
      earningChartData,
      topCourses: top3Courses
    });

    // -----------------------

    // old code

    // //Find total courses
    // const allCourses = await Course.find().select("enrolledStudents")
    // const totalCourses = allCourses.length;

    // //find total Enrollment's
    // const totalEnrollments = allCourses.reduce((acc, course) => {
    //     return acc + course.enrolledStudents.length;
    // }, 0);

    // //find total Student's
    // const users = await User.find();
    // const totalUsers = users.filter((user) => user.role === "student").length;

    // //find Total Earning
    // const payments = await Payment.find().select("price createdAt");
    // const totalEarning = payments.reduce((acc, payment) => acc + payment.price, 0);

    // //monthly earning
    // const monthlyEarning = Array(12).fill(0);

    // payments.forEach(payment => {
    //     const month = new Date(payment.createdAt).getMonth();
    //     monthlyEarning[month] += payment.price;
    // })

    // const earningChartData = monthlyEarning.map((value, index) => ({
    //     month: new Date(0, index).toLocaleString("default", {month: "short"}),
    //     revenue: value,
    // }));

    // // Top 3 courses based on enrollments
    // const allCoursesWithDetails = await Course.find({ isPublished: true })
    //   .select("courseTitle enrolledStudents creator courseThumbnail coursePrice")

    //   const topCourses = allCoursesWithDetails
    //   .map((course) => ({
    //     _id: course._id,
    //     courseTitle: course.courseTitle,
    //     enrolledStudents: course.enrolledStudents.length,
    //     creator: course.creator,
    //     courseThumbnail: course.courseThumbnail,
    //     totalEarning: course.enrolledStudents.length * course.coursePrice, // Assuming coursePrice is defined
    //   }))
    //   .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
    //   .slice(0, 3);

    // return res.status(200).json({
    //     success:true,
    //     message:"get data success",
    //     totalCourses,
    //     totalEnrollments,
    //     totalUsers,
    //     totalEarning,
    //     earningChartData,
    //     topCourses
    // })
  } catch (error) {
    console.error("Error in getTotalCourse");
    return res.status(500).json({
      success: false,
      message: "getDashboardStats Error!!",
    });
  }
};
