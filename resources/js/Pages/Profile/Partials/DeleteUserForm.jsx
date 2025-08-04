import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deactivateUser = (e) => {
        e.preventDefault();

        // Test if toast is available
        if (typeof toast === 'undefined') {
            // Toast function is not available!
            alert('Toast not available - this is a fallback');
            return;
        }

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => {
                // Account deactivated successfully, showing toast...
                closeModal();
                toast.success('Account deactivated successfully!');
            },
            onError: (errors) => {
                // Account deactivation failed
                passwordInput.current.focus();
                toast.error('Failed to deactivate account. Please check your password.');
            },
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Deactivate Account</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Once your account is deactivated, you will not be able to log in. You can contact an administrator to reactivate your account if needed.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Deactivate Account</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="p-6">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Are you sure you want to deactivate your account?
                            </h2>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Once your account is deactivated, you will not be able to log in. Please enter your password to confirm you would like to deactivate your account.
                            </p>
                        </div>

                        <form onSubmit={deactivateUser}>
                            <div>
                                <InputLabel htmlFor="password" value="Password" className="sr-only" />

                                <PasswordInput
                                    id="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full"
                                    isFocused
                                    placeholder="Password"
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                                <DangerButton disabled={processing}>
                                    Deactivate Account
                                </DangerButton>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
