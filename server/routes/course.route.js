import express from 'express';
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getDashboardStats, getPublishedCourse, removeLecture, togglePublishedCourse } from '../controllers/course.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/published-courses").get(getPublishedCourse);
router.route("/admin/stats").get(isAuthenticated, getDashboardStats);

router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/:courseId").put(isAuthenticated, singleUpload, editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);

router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(getCourseLecture);
router.route("/:courseId/lecture/:lectureId").put(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);

router.route("/:courseId").patch(togglePublishedCourse);




export default router;