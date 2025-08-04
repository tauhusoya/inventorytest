import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function ResetPassword({ status, email }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, [reset]);

    const submit = (e) => {
        e.preventDefault();

        put(route('password.reset.update'), {
            onSuccess: () => {
                toast.success('Password updated successfully!');
            },
            onError: (errors) => {
                if (errors.email) {
                    toast.error(errors.email);
                } else if (errors.password) {
                    toast.error(errors.password);
                } else if (errors.password_confirmation) {
                    toast.error(errors.password_confirmation);
                } else {
                    toast.error('Failed to update password. Please check your input and try again.');
                }
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Enter your new password below to complete the password reset process.
            </div>



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
                        disabled
                    />

                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="New Password" />
                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Back to login
                    </Link>

                    <PrimaryButton className="ml-4" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
