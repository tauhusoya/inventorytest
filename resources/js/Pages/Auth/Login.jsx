import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';

import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';

export default function Login({ status, canResetPassword }) {
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const { data: resetData, setData: setResetData, post: postReset, processing: resetProcessing, errors: resetErrors, reset: resetResetForm } = useForm({
        reset_email: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                toast.success('Login successful!');
            },
            onError: (errors) => {
                if (errors.email) {
                    toast.error(errors.email);
                } else if (errors.password) {
                    toast.error(errors.password);
                } else {
                    toast.error('Login failed. Please check your credentials.');
                }
            },
        });
    };

    const submitPasswordReset = (e) => {
        e.preventDefault();

        postReset(route('reactivate.email'), {
            onSuccess: (page) => {
                // Check if we got redirected (approved request)
                if (page && page.props && page.props.email) {
                    // User has approved request, show approval message
                    toast.success('Your request has been approved. You can now change your password.');
                    return;
                }

                // New request created
                toast.success('Password reset request submitted successfully! An admin will review your request.');
                setShowPasswordReset(false);
                resetResetForm();
            },
            onError: (errors) => {
                toast.error('Failed to submit password reset request. Please try again.');
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />



            {!showPasswordReset ? (
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />


                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        {canResetPassword && (
                            <button
                                type="button"
                                onClick={() => setShowPasswordReset(true)}
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Forgot password?
                            </button>
                        )}

                        <PrimaryButton className="ms-4" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            ) : (
                <div>
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={() => setShowPasswordReset(false)}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                            Back to login
                        </button>
                    </div>

                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Enter your email address below and we will send a password reset request to the administrator for review.
                    </div>

                    <form onSubmit={submitPasswordReset}>
                        <div>
                            <InputLabel htmlFor="reset_email" value="Email" />

                            <TextInput
                                id="reset_email"
                                type="email"
                                name="reset_email"
                                value={resetData.reset_email}
                                className="mt-1 block w-full"
                                autoComplete="email"
                                isFocused={true}
                                onChange={(e) => setResetData('reset_email', e.target.value)}
                            />


                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <PrimaryButton disabled={resetProcessing}>
                                Send Password Reset Request
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            )}
        </GuestLayout>
    );
}
