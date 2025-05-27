import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import LoadingAnimation from '../steering';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://park-server.onrender.com/api/usersdet`);
            if (response.ok) {
                const fetchedUsers = await response.json();
                setUsers(fetchedUsers);
                setSearchResults(fetchedUsers);
                setLoading(false);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (searchTerm === "") {
            setSearchResults(users);
        } else {
            const results = users.filter(user =>
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.phoneNumber && user.phoneNumber.includes(searchTerm))
            );
            setSearchResults(results);
        }
    }, [searchTerm, users]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-white text-gray-900 p-6">
            <header className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white bg-opacity-90 rounded-xl shadow-md p-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-orange-600 mb-3 sm:mb-0">
                    User List
                </h1>
                <button
                    onClick={fetchUsers}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
                >
                    Refresh
                </button>
            </header>

            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    className="mb-4"
                >
                    {error}
                </Alert>
            )}

            {!loading ? (
                <div className="overflow-x-auto rounded-lg shadow-lg bg-white bg-opacity-90 p-4">
                    <div className="flex items-center justify-center mb-4">
                        <input
                            type="text"
                            placeholder="Search by email or phone number"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        />
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-orange-100 text-orange-700 uppercase text-sm font-semibold">
                                <th className="border border-orange-300 px-6 py-3 rounded-tl-lg">Email</th>
                                <th className="border border-orange-300 px-6 py-3 rounded-tr-lg">Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.length > 0 ? (
                                searchResults.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="even:bg-orange-50 hover:bg-orange-200 transition"
                                    >
                                        <td className="border border-orange-300 px-6 py-3">{user.email}</td>
                                        <td className="border border-orange-300 px-6 py-3">{user.phoneNumber}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center py-4 text-orange-600">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex justify-center mt-20">
                    <LoadingAnimation />
                </div>
            )}
        </div>
    );
};

export default UserList;
