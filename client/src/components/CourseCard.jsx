// import React from 'react'
// import { Card } from './ui/card'
// import { Button } from './ui/button'
// import { useNavigate } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import axios from 'axios'
// import { toast } from 'sonner'

// const CourseCard = ({course}) => {
//   const navigate = useNavigate();
//   const {user} = useSelector(store=>store.auth)

//   return (
//     <Card className="bg-white shadow-lg">
//         <img src={course.courseThumbnail} alt="" className='w-full h-48 object-cover'/>
//         <div className='p-6'>
//             <h2 className='text-xl font-semibold text-gray-800 mb-3'>{course.courseTitle}</h2>
//             <p className='text-gray-600 mb-4'>{course.subTitle}</p>
//             {/* onClick={() => handleBuyCourse(course)} */}
//             <Button onClick={() => navigate(`/courses/${course._id}`)}>
//               View Course
//             </Button>
//         </div>
//     </Card>
//   )
// }

// export default CourseCard;

import React from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { Star, Clock, Users, ArrowRight, Bookmark } from 'lucide-react'


const CourseCard = ({ course, loading }) => {
  const navigate = useNavigate();

   if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5">
        <div className="h-56 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4" />
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
        <div className="flex justify-between">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={course?.courseThumbnail} 
          alt={course?.courseTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
        
        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-yellow-400/95 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 fill-yellow-900" />
            {course.rating || '4.8'}
          </div>
          {course.isPopular && (
            <div className="bg-pink-500/95 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              Popular
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Category and Bookmark */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            {course.category || 'Development'}
          </span>
          <button className="text-gray-400 hover:text-yellow-400 transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
          {course?.courseTitle}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {course?.subTitle}
        </p>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-5">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{course.duration || '12h 15m'}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{course?.enrolledStudents?.length || 0}+ students</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            {course.discountedPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {course.discountedPrice}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₹{course.coursePrice}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{course?.coursePrice || ''}
              </span>
            )}
          </div>
          <Button 
            onClick={() => navigate(`/courses/${course._id}`)}
            className="rounded-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Explore
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
