import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Index({ users, inactiveUsers, reactivationRequests, activeTab = 'manage' }) {
    const { delete: destroy } = useForm();
    const { auth } = usePage().props;

    const handleDeactivate = (userId) => {
        toast.error('Are you sure you want to deactivate this user?', {
            action: {
                label: 'Deactivate',
                onClick: () => {
                    destroy(route('users.destroy', userId), {
                        onSuccess: () => {
                            toast.success('User deactivated successfully!');
                        },
                        onError: () => {
                            toast.error('Failed to deactivate user. Please try again.');
                        },
                    });
                },
            },
            cancel: {
                label: 'Cancel',
            },
            duration: 5000,
        });
    };

    // Debug logging
    // Users Index Component Rendered

    const [currentTab, setCurrentTab] = useState(activeTab);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        router.get(route('users.index'), { tab }, { preserveState: true });
    };

    const handleReactivate = (userId) => {
        toast.error('Are you sure you want to reactivate this user?', {
            action: {
                label: 'Reactivate',
                onClick: () => {
                    router.post(route('users.reactivate', userId), {}, {
                        onSuccess: () => {
                            toast.success('User reactivated successfully!');
                        },
                        onError: () => {
                            toast.error('Failed to reactivate user. Please try again.');
                        },
                    });
                },
            },
            cancel: {
                label: 'Cancel',
            },
            duration: 5000,
        });
    };

    const handlePermanentlyDelete = (userId) => {
        toast.error('Are you sure you want to permanently delete this user? This action cannot be undone.', {
            action: {
                label: 'Delete Permanently',
                onClick: () => {
                    router.delete(route('users.permanently-delete', userId), {
                        onSuccess: () => {
                            toast.success('User permanently deleted!');
                        },
                        onError: () => {
                            toast.error('Failed to delete user. Please try again.');
                        },
                    });
                },
            },
            cancel: {
                label: 'Cancel',
            },
            duration: 5000,
        });
    };

    const handleApproveReactivation = (requestId) => {
        router.post(route('reactivation.approve', requestId), {}, {
            onSuccess: () => {
                toast.success('Reactivation request approved!');
            },
            onError: () => {
                toast.error('Failed to approve request. Please try again.');
            },
        });
    };

    const handleRejectReactivation = (requestId) => {
        router.post(route('reactivation.reject', requestId), {}, {
            onSuccess: () => {
                toast.success('Reactivation request rejected!');
            },
            onError: () => {
                toast.error('Failed to reject request. Please try again.');
            },
        });
    };

    const handleApprovePasswordReset = (requestId) => {
        router.post(route('password-reset-requests.approve', requestId), {}, {
            onSuccess: () => {
                toast.success('Password reset request approved!');
            },
            onError: () => {
                toast.error('Failed to approve request. Please try again.');
            },
        });
    };

    const handleDeletePasswordReset = (requestId) => {
        router.delete(route('password-reset-requests.delete', requestId), {
            onSuccess: () => {
                toast.success('Password reset request deleted!');
            },
            onError: () => {
                toast.error('Failed to delete request. Please try again.');
            },
        });
    };

    // Check if user is admin
    if (!auth?.user || auth.user.role !== 'Admin') {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">Only Admin users can access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manage Users</h2>}
        >
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        onClick={() => handleTabChange('manage')}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${currentTab === 'manage'
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        List of Users
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('reactivate')}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${currentTab === 'reactivate'
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Inactive Users
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('password-reset')}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${currentTab === 'password-reset'
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Password Reset Requests
                                    </button>
                                </nav>
                            </div>

                            {/* List of Users Tab */}
                            {currentTab === 'manage' && (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-medium">Active Users</h3>
                                        <Link
                                            href={route('users.create')}
                                            className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                        >
                                            Add New User
                                        </Link>
                                    </div>

                                    {users && users.data && users.data.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Email
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Role
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {users.data.map((user) => (
                                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {user.first_name} {user.last_name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {user.email}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin'
                                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                                    }`}>
                                                                    {user.role}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex space-x-2">
                                                                    <Link
                                                                        href={route('users.edit', user.id)}
                                                                        className="inline-flex items-center px-3 py-1 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    {auth.user.id !== user.id && (
                                                                        <button
                                                                            onClick={() => handleDeactivate(user.id)}
                                                                            className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                        >
                                                                            Deactivate
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Pagination */}
                                            {users.links && (
                                                <div className="mt-4">
                                                    <nav className="flex items-center justify-between">
                                                        <div className="flex-1 flex justify-between sm:hidden">
                                                            {users.prev_page_url && (
                                                                <a href={users.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                                    Previous
                                                                </a>
                                                            )}
                                                            {users.next_page_url && (
                                                                <a href={users.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                                    Next
                                                                </a>
                                                            )}
                                                        </div>
                                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                            <div>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                    Showing <span className="font-medium">{users.from}</span> to <span className="font-medium">{users.to}</span> of{' '}
                                                                    <span className="font-medium">{users.total}</span> results
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                                    {users.links.map((link, index) => (
                                                                        <a
                                                                            key={index}
                                                                            href={link.url}
                                                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${link.active
                                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                                                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                                } border ${index === 0 ? 'rounded-l-md' : ''
                                                                                } ${index === users.links.length - 1 ? 'rounded-r-md' : ''
                                                                                }`}
                                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                                        />
                                                                    ))}
                                                                </nav>
                                                            </div>
                                                        </div>
                                                    </nav>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400">No users found.</p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Inactive Users Tab */}
                            {currentTab === 'reactivate' && (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium mb-4">Inactive Users</h3>
                                        {inactiveUsers && inactiveUsers.data && inactiveUsers.data.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Name
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Email
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Role
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Deactivated
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {inactiveUsers.data.map((user) => (
                                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                    {user.first_name} {user.last_name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {user.email}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin'
                                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                                        }`}>
                                                                        {user.role}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {new Date(user.created_at).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <div className="flex space-x-2">
                                                                        <button
                                                                            onClick={() => handleReactivate(user.id)}
                                                                            className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                        >
                                                                            Reactivate
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handlePermanentlyDelete(user.id)}
                                                                            className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                        >
                                                                            Delete Permanently
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400 text-center py-4">No inactive users found.</p>
                                        )}
                                    </div>


                                </>
                            )}

                            {/* Password Reset Requests Tab */}
                            {currentTab === 'password-reset' && (
                                <>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium mb-4">Password Reset Requests</h3>
                                        {reactivationRequests && reactivationRequests.data && reactivationRequests.data.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                User
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Email
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Requested
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                        {reactivationRequests.data.map((request) => (
                                                            <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                    {request.user ? `${request.user.first_name} ${request.user.last_name}` : 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                    {request.email}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                                                        request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                                            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                                                        }`}>
                                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                    {new Date(request.created_at).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    <div className="flex space-x-2">
                                                                        {request.status === 'pending' && (
                                                                            <button
                                                                                onClick={() => handleApprovePasswordReset(request.id)}
                                                                                className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                            >
                                                                                Approve
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => handleDeletePasswordReset(request.id)}
                                                                            className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400 text-center py-4">No password reset requests found.</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 