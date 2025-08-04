import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function Import() {
    const { data, setData, post, processing, errors } = useForm({
        csv_file: null,
    });

    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('csv_file', e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData('csv_file', e.target.files[0]);
        }
    };

    const downloadTemplate = () => {
        const csvContent = 'item_id,name,description,brand,model,cost,retail,quantity\nITEM001,Test Knife 1,Sharp kitchen knife,PiRGE,Model A,100.00,150.00,10\nITEM002,Test Knife 2,Professional chef knife,Jaya Mata,Model X,120.00,180.00,5\nITEM003,Chef Knife,High quality chef knife,New Brand,Premium Model,200.00,300.00,15';
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'items_template.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const submit = (e) => {
        e.preventDefault();

        if (!data.csv_file) {
            toast.error('Please select a CSV file to import.');
            return;
        }

        post(route('items.processImport'), {
            onSuccess: () => {
                // Redirect will happen automatically, flash message will be shown on Items page
            },
            onError: () => {
                toast.error('Failed to import items. Please check the file format and try again.');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Bulk Import Items</h2>}
        >
            <Head title="Bulk Import Items" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium">Import Items from CSV</h3>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Upload a CSV file to import multiple items at once.
                                </p>
                            </div>

                            {/* Download Template Button */}
                            <div className="mb-6">
                                <button
                                    onClick={downloadTemplate}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Template
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* File Upload Area */}
                                <div>
                                    <InputLabel htmlFor="csv_file" value="CSV File" />
                                    <div
                                        className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center ${dragActive
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : data.csv_file
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <div className="space-y-2">
                                            {data.csv_file ? (
                                                <>
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-green-500"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <div className="text-green-600 dark:text-green-400">
                                                        <p className="font-medium">File uploaded successfully!</p>
                                                        <p className="text-sm">{data.csv_file.name}</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="text-gray-600 dark:text-gray-400">
                                                        <label htmlFor="csv_file" className="cursor-pointer">
                                                            <span className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                                                Click to upload
                                                            </span>{' '}
                                                            or drag and drop
                                                        </label>
                                                        <p className="text-xs">CSV files only, up to 2MB</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            id="csv_file"
                                            type="file"
                                            accept=".csv,.txt"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <InputError message={errors.csv_file} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('items.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        {processing ? 'Importing...' : 'Import Items'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 