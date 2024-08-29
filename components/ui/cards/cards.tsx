import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../card';
import { Button } from '../button';
import { Skeleton } from '../skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
  id: string; // Ensure you have this property
  name: string;
  registration_number: string;
  section: string;
  department: string;
  year: string;
  semester: string;
  phone_number: string;
  srm_email: string;
  personal_email: string;
  resume_link: string;
  gender: string;
  domain: string;
  branch: string;
}

interface UserCardProps {
  searchQuery: string;
}

const UserCard: React.FC<UserCardProps> = ({ searchQuery }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Sort users by ID in descending order
        const sortedUsers = data.sort((a: User, b: User) => parseInt(b.id) - parseInt(a.id));
        setUsers(sortedUsers);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the user');
        }

        setUsers(users.filter(user => user.id !== id));
        toast.success("User deleted successfully!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const downloadCSV = () => {
    const csvData = users.map(user => ({
      Name: user.name.toUpperCase(),
      'Registration Number': user.registration_number,
      Section: user.section,
      Department: user.department,
      Year: user.year,
      Semester: user.semester,
      'Phone Number': user.phone_number,
      'SRM Email': user.srm_email,
      'Personal Email': user.personal_email,
      'Resume Link': user.resume_link,
      Gender: user.gender,
      Domain: user.domain,
      Branch: user.branch,
    }));

    const csvHeaders = Object.keys(csvData[0]).join(',') + '\n';
    const csvRows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csvString = csvHeaders + csvRows;

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SRMSIGKDD_Recruitments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="mt-2 h-6 w-3/4 rounded" />
              <Skeleton className="mt-1 h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-lg flex items-center justify-center min-h-screen">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-3xl font-bold leading-none text-red-600">ERROR</p>
            <p className="text-lg text-gray-400">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-lg flex items-center justify-center min-h-screen">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-3xl font-bold leading-none text-white">NO ENTRIES</p>
            <p className="text-lg text-gray-400">There are currently no entries available.</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.registration_number.toString().includes(searchQuery) ||
      user.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.srm_email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-2xl shadow-lg">
      <ToastContainer />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentUsers.map((user) => (
          <Card
            key={user.id}
            className="bg-gray-900 rounded-xl border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out"
          >
            <CardHeader className="p-6">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-semibold leading-none text-white uppercase">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.registration_number}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-gray-400">
              <p className="mb-2"><strong className="text-gray-300">Section:</strong> {user.section}</p>
              <p className="mb-2"><strong className="text-gray-300">Department:</strong> {user.department}</p>
              <p className="mb-2"><strong className="text-gray-300">Year:</strong> {user.year}</p>
              <p className="mb-2"><strong className="text-gray-300">Semester:</strong> {user.semester}</p>
              <p className="mb-2"><strong className="text-gray-300">Phone Number:</strong> {user.phone_number}</p>
              <p className="mb-2"><strong className="text-gray-300">SRM Email:</strong> {user.srm_email}</p>
              <p className="mb-2"><strong className="text-gray-300">Personal Email:</strong> {user.personal_email}</p>
              <p className="mb-2"><strong className="text-gray-300 mr-1">Resume Link:</strong>
                <a href={user.resume_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Resume</a>
              </p>
              <p className="mb-2"><strong className="text-gray-300">Gender:</strong> {user.gender}</p>
              <p className="mb-2"><strong className="text-gray-300">Domain:</strong> {user.domain}</p>
              <p className="mb-2"><strong className="text-gray-300">Branch:</strong> {user.branch}</p>
              <div className="mt-4 flex justify-end">
{/*                 <Button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 hover:bg-red-500 text-white"
                >
                  Delete User
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
        <Button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-500 text-white w-full md:w-auto mb-4 md:mb-0"
        >
          Download CSV
        </Button>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`bg-gray-600 hover:bg-gray-500 text-white ${
              currentPage === 1 && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Prev
          </Button>
          <span className="text-white">Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`bg-gray-600 hover:bg-gray-500 text-white ${
              currentPage === totalPages && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
