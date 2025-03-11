import Link from "next/link";

const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
                {/* Course name section */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{course.course_name.vi}</h3>
                    <p className="text-gray-600 text-sm leading-tight mt-1">{course.course_name.en}</p>
                </div>

                {/* Course details section */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap">
                        {course.course_code}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap">
                        {course.course_credit} Credits
                    </span>
                    {course.final_weight && (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap">
                            Final: {course.final_weight}%
                        </span>
                    )}
                </div>

                {/* action section */}
                <Link href={`/courses/${course._id}`} className="text-red-600 hover:text-red-800 text-sm font-medium">
                    View Details
                    <i className="fas fa-arrow-right ml-2"></i>
                </Link>
            </div>
        </div>
    );
};

export default CourseCard;
