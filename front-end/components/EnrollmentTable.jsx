import Link from "next/link";

const EnrollmentTable = ({ enrollments, semester, onDelete }) => {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{semester}</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                            >
                                Course code
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                            >
                                Course name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                            >
                                Credits
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                            >
                                Midterm
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                            >
                                Final
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                            >
                                GPA Scale
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {enrollments.map((enrollment) => (
                            <tr key={enrollment._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {enrollment.course?.course_code}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {enrollment.course?.course_name?.vi}
                                    </div>
                                    <div className="text-sm text-gray-500">{enrollment.course?.course_name?.en}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {enrollment.course?.course_credit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {enrollment.midterm_grade || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {enrollment.final_grade ? (
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                enrollment.gpa_scale >= 3.5
                                                    ? "bg-green-200 text-green-900"
                                                    : enrollment.gpa_scale >= 3.0
                                                    ? "bg-blue-200 text-blue-900"
                                                    : enrollment.gpa_scale >= 2.5
                                                    ? "bg-yellow-200 text-yellow-900"
                                                    : enrollment.gpa_scale >= 2.0
                                                    ? "bg-orange-200 text-orange-900"
                                                    : "bg-red-200 text-red-900"
                                            }`}
                                        >
                                            {enrollment.final_grade}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    {enrollment.character_grade || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/enrollments/${enrollment._id}`}
                                        className="text-red-600 hover:text-red-900 mr-4"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => onDelete(enrollment._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnrollmentTable;
