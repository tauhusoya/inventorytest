import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export default function Edit({ item }) {
    const { data, setData, put, processing, errors } = useForm({
        item_id: item.item_id,
        name: item.name,
        description: item.description,
        brand: item.brand,
        model: item.model,
        cost: item.cost,
        retail: item.retail,
    });

    const [models, setModels] = useState([]);

    const brandModels = {
        'PiRGE': ['Model A', 'Model B', 'Model C'],
        'Jaya Mata': ['Model X', 'Model Y', 'Model Z'],
        'Atasan Bicak': ['Model 1', 'Model 2', 'Model 3'],
    };

    useEffect(() => {
        if (data.brand) {
            setModels(brandModels[data.brand] || []);
        } else {
            setModels([]);
        }
    }, [data.brand]);

    const submit = (e) => {
        e.preventDefault();

        put(route('items.update', item.id), {
            onError: () => {
                toast.error('Failed to update item. Please check the form and try again.');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Item</h2>}
        >
            <Head title="Edit Item" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium">Edit Item: {item.name}</h3>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="item_id" value="Item ID" />
                                        <TextInput
                                            id="item_id"
                                            type="text"
                                            name="item_id"
                                            value={data.item_id}
                                            className="mt-1 block w-full"
                                            isFocused
                                            onChange={(e) => setData('item_id', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.item_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        rows="3"
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="brand" value="Brand" />
                                        <select
                                            id="brand"
                                            name="brand"
                                            value={data.brand}
                                            onChange={(e) => {
                                                setData('brand', e.target.value);
                                                setModels(brandModels[e.target.value] || []);
                                            }}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select Brand</option>
                                            <option value="PiRGE">PiRGE</option>
                                            <option value="Jaya Mata">Jaya Mata</option>
                                            <option value="Atasan Bicak">Atasan Bicak</option>
                                        </select>
                                        <InputError message={errors.brand} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="model" value="Model" />
                                        <select
                                            id="model"
                                            name="model"
                                            value={data.model}
                                            onChange={(e) => setData('model', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select Model</option>
                                            {models.map((model) => (
                                                <option key={model} value={model}>
                                                    {model}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.model} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="cost" value="Cost" />
                                        <TextInput
                                            id="cost"
                                            type="number"
                                            name="cost"
                                            value={data.cost}
                                            className="mt-1 block w-full"
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => setData('cost', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.cost} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="retail" value="Retail" />
                                        <TextInput
                                            id="retail"
                                            type="number"
                                            name="retail"
                                            value={data.retail}
                                            className="mt-1 block w-full"
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => setData('retail', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.retail} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('items.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Update Item
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