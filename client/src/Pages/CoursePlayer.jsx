import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, Loader2, PlayCircle } from "lucide-react";

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
       setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/course/${courseId}/lecture`, {
          withCredentials: true,
        });
        if (res?.data?.success) {
          setLectures(res.data.lectures);
          setCurrentLecture(res.data.lectures[0]);
        }
      } catch (error) {
        console.error("Error loading lectures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [courseId]);

  const markLectureCompleted = async (lectureId) => {
    try {
      // API to mark lecture completed (optional)
      setCompletedLectures((prev) => [...prev, lectureId]);
    } catch (error) {
      console.error("Error marking lecture completed:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 border-r p-4 space-y-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Course Lectures</h2>
        
        {
          loading ? (
             <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
          ) : lectures.length > 0 ? (
            lectures.map((lecture, index) => (
          <div
            key={lecture._id}
            className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-100 transition ${
              currentLecture?._id === lecture._id ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              setCurrentLecture(lecture);
              setPlayerReady(false);
            }}
          >
            <div className="flex items-center gap-2">
              {completedLectures.includes(lecture._id) ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <PlayCircle size={18} />
              )}
              <span className="text-sm text-gray-700">{lecture.lectureTitle}</span>
            </div>
          </div>
        ))
          ) : (
            <p className="text-sm text-gray-500">No lectures available</p>
          )}
      </aside>

   {/* Main video player */}
      <main className="flex-1 p-6">
        <Card className="w-full">
          <CardContent className="p-4">
            {loading ? (
              <div className="aspect-video w-full flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : currentLecture ? (
              <div className="space-y-4">
                <div className="aspect-video w-full relative bg-gray-100">
                  {!playerReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin text-gray-400" size={32} />
                    </div>
                  )}
                  <ReactPlayer
                    url={currentLecture.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    onReady={() => setPlayerReady(true)}
                    onEnded={() => markLectureCompleted(currentLecture._id)}
                    style={{ display: playerReady ? "block" : "none" }}
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentLecture.lectureTitle}
                </h2>
                <Separator className="my-2" />
                <p className="text-gray-700 text-sm">
                  {currentLecture.description || "No description available."}
                </p>
              </div>
            ) : (
              <div className="aspect-video w-full flex items-center justify-center text-gray-500">
                Select a lecture to begin
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CoursePlayer;
