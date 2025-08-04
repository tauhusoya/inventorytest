import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ transactions, items, filters }) {
    const [activeTab, setActiveTab] = useState('history');
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedType, setSelectedType] = useState(filters?.type || '');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const { flash } = usePage().props;

    // Stock In states
    const [searchTermIn, setSearchTermIn] = useState('');
    const [selectedItemIn, setSelectedItemIn] = useState(null);
    const [searchResultsIn, setSearchResultsIn] = useState([]);
    const [showSearchResultsIn, setShowSearchResultsIn] = useState(false);

    // Stock Out states
    const [searchTermOut, setSearchTermOut] = useState('');
    const [selectedItemOut, setSelectedItemOut] = useState(null);
    const [searchResultsOut, setSearchResultsOut] = useState([]);
    const [showSearchResultsOut, setShowSearchResultsOut] = useState(false);

    const [calculatorData, setCalculatorData] = useState(null);
    const [calculatorItems, setCalculatorItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [calculatorSearchTerm, setCalculatorSearchTerm] = useState('');
    const [calculatorBrandFilter, setCalculatorBrandFilter] = useState('');
    const [calculatorModelFilter, setCalculatorModelFilter] = useState('');
    const [calculatorPagination, setCalculatorPagination] = useState(null);

    // Stock Aging states
    const [agingData, setAgingData] = useState(null);
    const [agingSearchTerm, setAgingSearchTerm] = useState('');
    const [agingAgeFilter, setAgingAgeFilter] = useState('');
    const [agingPagination, setAgingPagination] = useState(null);

    // Low Stock states
    const [lowStockData, setLowStockData] = useState(null);
    const [lowStockSearchTerm, setLowStockSearchTerm] = useState('');
    const [lowStockPagination, setLowStockPagination] = useState(null);

    // Out of Stock states
    const [outOfStockData, setOutOfStockData] = useState(null);
    const [outOfStockSearchTerm, setOutOfStockSearchTerm] = useState('');
    const [outOfStockPagination, setOutOfStockPagination] = useState(null);

    // Track if "Other" reason is selected
    const [showCustomReasonIn, setShowCustomReasonIn] = useState(false);
    const [showCustomReasonOut, setShowCustomReasonOut] = useState(false);

    const stockInForm = useForm({
        item_id: '',
        quantity: '',
        reason: '',
        custom_reason: '',
    });

    const stockOutForm = useForm({
        item_id: '',
        quantity: '',
        reason: '',
        custom_reason: '',
    });

    // Handle flash messages
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Load calculator data
    useEffect(() => {
        loadCalculatorData();
    }, []);

    // Load calculator items when tab is active
    useEffect(() => {
        if (activeTab === 'calculator') {
            loadCalculatorItems();
        }
    }, [activeTab]);

    // Load aging data when tab is active
    useEffect(() => {
        if (activeTab === 'aging') {
            loadAgingData();
        }
    }, [activeTab]);

    // Load low stock data when tab is active
    useEffect(() => {
        if (activeTab === 'low-stock') {
            loadLowStockData();
        }
    }, [activeTab]);

    // Update calculator data when selected items change
    useEffect(() => {
        if (activeTab === 'calculator') {
            updateCalculatorData();
        }
    }, [selectedItems]);

    // Auto-search when search term or filters change
    useEffect(() => {
        if (activeTab === 'calculator') {
            loadCalculatorItems();
        }
    }, [calculatorSearchTerm, calculatorBrandFilter, calculatorModelFilter]);

    // Auto-load aging data when search terms change
    useEffect(() => {
        if (activeTab === 'aging') {
            loadAgingData();
        }
    }, [agingSearchTerm, agingAgeFilter]);

    // Auto-load low stock data when search terms change
    useEffect(() => {
        if (activeTab === 'low-stock') {
            loadLowStockData();
        }
    }, [lowStockSearchTerm]);

    // Load out of stock data when tab is active
    useEffect(() => {
        if (activeTab === 'out-of-stock') {
            loadOutOfStockData();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'out-of-stock') {
            loadOutOfStockData();
        }
    }, [outOfStockSearchTerm]);

    // Auto-search for Stock History tab with debouncing
    useEffect(() => {
        if (activeTab === 'history') {
            const timeoutId = setTimeout(() => {
                handleSearch();
            }, 500); // 500ms delay

            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm]);

    const loadCalculatorData = async () => {
        try {
            const response = await fetch(route('stock.calculate'));
            const data = await response.json();
            setCalculatorData(data);
        } catch (error) {
            console.error('Error loading calculator data:', error);
        }
    };

    const loadAgingData = async () => {
        try {
            const params = new URLSearchParams();
            if (agingSearchTerm) params.append('search', agingSearchTerm);
            if (agingAgeFilter) params.append('age_filter', agingAgeFilter);

            const response = await fetch(`${route('stock.aging')}?${params}`);
            const data = await response.json();
            setAgingData(data);
            setAgingPagination(data.batches);
        } catch (error) {
            console.error('Error loading aging data:', error);
        }
    };

    const loadLowStockData = async () => {
        try {
            const params = new URLSearchParams();
            if (lowStockSearchTerm) params.append('search', lowStockSearchTerm);

            const response = await fetch(`${route('stock.low-stock')}?${params}`);
            const data = await response.json();
            setLowStockData(data);
            setLowStockPagination(data);
        } catch (error) {
            console.error('Error loading low stock data:', error);
        }
    };

    const loadOutOfStockData = async () => {
        try {
            const params = new URLSearchParams();
            if (outOfStockSearchTerm) params.append('search', outOfStockSearchTerm);

            const response = await fetch(`${route('stock.out-of-stock')}?${params}`);
            const data = await response.json();
            setOutOfStockData(data);
            setOutOfStockPagination(data);
        } catch (error) {
            console.error('Error loading out of stock data:', error);
        }
    };



    const loadCalculatorItems = async () => {
        try {
            const params = new URLSearchParams();
            if (calculatorSearchTerm) params.append('search', calculatorSearchTerm);
            if (calculatorBrandFilter) params.append('brand', calculatorBrandFilter);
            if (calculatorModelFilter) params.append('model', calculatorModelFilter);

            const response = await fetch(route('stock.calculator-items') + '?' + params.toString());
            const data = await response.json();
            setCalculatorItems(data.data || []);
            setCalculatorPagination(data);
        } catch (error) {
            console.error('Error loading calculator items:', error);
        }
    };

    const handleItemSelection = (item, isSelected) => {
        if (isSelected) {
            setSelectedItems(prev => [...prev, item]);
        } else {
            setSelectedItems(prev => prev.filter(selectedItem => selectedItem.id !== item.id));
        }
    };

    const updateCalculatorData = async () => {
        try {
            const itemIds = selectedItems.map(item => item.id);
            const params = new URLSearchParams();
            itemIds.forEach(id => params.append('item_ids[]', id));

            const response = await fetch(route('stock.calculate') + '?' + params.toString());
            const data = await response.json();
            setCalculatorData(data);
        } catch (error) {
            console.error('Error updating calculator data:', error);
            // Set default values when no items are selected
            setCalculatorData({
                items: [],
                totalCost: '0.00',
                totalRetail: '0.00',
                totalProfitMargin: '0.00',
                profitMarginPercentage: '0.00',
                itemCount: 0,
                totalQuantity: 0,
            });
        }
    };

    // Handle search and filter changes
    const handleSearch = () => {
        router.get(route('stock.index'), {
            search: searchTerm,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        router.get(route('stock.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleItemSearch = async (search, formType) => {
        if (search.length < 2) {
            if (formType === 'in') {
                setSearchResultsIn([]);
                setShowSearchResultsIn(false);
            } else {
                setSearchResultsOut([]);
                setShowSearchResultsOut(false);
            }
            return;
        }

        try {
            const response = await fetch(route('stock.items', { search }));
            const data = await response.json();

            if (formType === 'in') {
                setSearchResultsIn(data);
                setShowSearchResultsIn(true);
            } else {
                setSearchResultsOut(data);
                setShowSearchResultsOut(true);
            }
        } catch (error) {
            console.error('Error searching items:', error);
        }
    };

    const selectItem = (item, formType) => {
        console.log('selectItem called:', item, formType);

        if (formType === 'in') {
            setSelectedItemIn(item);
            setSearchTermIn(`${item.name} (${item.item_id})`);
            setShowSearchResultsIn(false);
            setSearchResultsIn([]);
            // Set the form data immediately
            stockInForm.setData('item_id', item.id);
            console.log('Stock In - selectedItemIn set to:', item);
            console.log('Stock In - searchTermIn set to:', `${item.name} (${item.item_id})`);
            console.log('Stock In - form data set to:', stockInForm.data);
        } else {
            setSelectedItemOut(item);
            setSearchTermOut(`${item.name} (${item.item_id})`);
            setShowSearchResultsOut(false);
            setSearchResultsOut([]);
            // Set the form data immediately
            stockOutForm.setData('item_id', item.id);
            console.log('Stock Out - selectedItemOut set to:', item);
            console.log('Stock Out - searchTermOut set to:', `${item.name} (${item.item_id})`);
            console.log('Stock Out - form data set to:', stockOutForm.data);
        }
    };

    const clearSelection = (formType) => {
        if (formType === 'in') {
            setSelectedItemIn(null);
            setSearchTermIn('');
            setSearchResultsIn([]);
            setShowSearchResultsIn(false);
        } else {
            setSelectedItemOut(null);
            setSearchTermOut('');
            setSearchResultsOut([]);
            setShowSearchResultsOut(false);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Don't close if clicking on dropdown buttons
            if (event.target.closest('button[type="button"]')) {
                return;
            }

            if (showSearchResultsIn && !event.target.closest('.search-container')) {
                setShowSearchResultsIn(false);
            }
            if (showSearchResultsOut && !event.target.closest('.search-container')) {
                setShowSearchResultsOut(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearchResultsIn, showSearchResultsOut]);

    const handleStockIn = (e) => {
        e.preventDefault();

        console.log('handleStockIn called');
        console.log('selectedItemIn:', selectedItemIn);
        console.log('stockInForm.data:', stockInForm.data);

        if (!selectedItemIn) {
            toast.error('Please select an item');
            return;
        }

        stockInForm.post(route('stock.in'), {
            onSuccess: () => {
                stockInForm.reset();
                setSelectedItemIn(null);
                setSearchTermIn('');
                loadCalculatorData();
            },
            onError: (errors) => {
                console.log('Stock in errors:', errors);
                toast.error('Failed to record stock in');
            },
        });
    };

    const handleStockOut = (e) => {
        e.preventDefault();

        console.log('handleStockOut called');
        console.log('selectedItemOut:', selectedItemOut);
        console.log('stockOutForm.data:', stockOutForm.data);

        if (!selectedItemOut) {
            toast.error('Please select an item');
            return;
        }

        // Check if quantity is valid
        const requestedQuantity = parseInt(stockOutForm.data.quantity);
        const availableQuantity = selectedItemOut.quantity;

        if (requestedQuantity > availableQuantity) {
            toast.error(`Insufficient stock. Available: ${availableQuantity} units`);
            return;
        }

        stockOutForm.post(route('stock.out'), {
            onSuccess: () => {
                stockOutForm.reset();
                setSelectedItemOut(null);
                setSearchTermOut('');
                loadCalculatorData();
            },
            onError: (errors) => {
                console.log('Stock out errors:', errors);
                if (errors.quantity && errors.quantity.includes('Insufficient stock')) {
                    toast.error(errors.quantity);
                } else {
                    toast.error('Failed to record stock out');
                }
            },
        });
    };

    const getTypeColor = (type) => {
        return type === 'in'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    };

    const tabs = [
        { id: 'history', name: 'Stock History' },
        { id: 'low-stock', name: 'Low Stock' },
        { id: 'out-of-stock', name: 'Out of Stock' },
        { id: 'in', name: 'Stock In' },
        { id: 'out', name: 'Stock Out' },
        { id: 'calculator', name: 'Stock Calculator' },
        { id: 'aging', name: 'Stock Aging' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Stock Management</h2>}
        >
            <Head title="Stock Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Stock History Tab */}
                            {activeTab === 'history' && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Stock Transaction History</h3>
                                    <div className="mb-4">
                                        <div className="relative">
                                            <TextInput
                                                id="search"
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search by item name, ID, user name, reason, type, quantity, or date..."
                                                className="mt-1 block w-full pl-10"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Product ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Item
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Quantity
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Reason
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        User
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {transactions.data.map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {new Date(transaction.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {transaction.item.item_id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {transaction.item.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                                                                {transaction.type.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {transaction.quantity}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {transaction.reason || '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {transaction.user.first_name} {transaction.user.last_name}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {transactions.links && (
                                        <div className="mt-4">
                                            <nav className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    {transactions.prev_page_url && (
                                                        <a href={transactions.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Previous
                                                        </a>
                                                    )}
                                                    {transactions.next_page_url && (
                                                        <a href={transactions.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Next
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            Showing <span className="font-medium">{transactions.from}</span> to <span className="font-medium">{transactions.to}</span> of{' '}
                                                            <span className="font-medium">{transactions.total}</span> results
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                            {transactions.links.map((link, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={link.url}
                                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${link.active
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                        } border ${index === 0 ? 'rounded-l-md' : ''
                                                                        } ${index === transactions.links.length - 1 ? 'rounded-r-md' : ''
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
                            )}

                            {/* Low Stock Tab */}
                            {activeTab === 'low-stock' && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Low Stock Items</h3>
                                    <div className="mb-4">
                                        <div className="relative">
                                            <TextInput
                                                id="low-stock-search"
                                                type="text"
                                                value={lowStockSearchTerm}
                                                onChange={(e) => setLowStockSearchTerm(e.target.value)}
                                                placeholder="Search by item name or ID..."
                                                className="mt-1 block w-full pl-10"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Item ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Brand
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Model
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Quantity
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {lowStockData && lowStockData.data && lowStockData.data.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.item_id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.brand}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.model}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.quantity === 0
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                : item.quantity <= 10
                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                }`}>
                                                                {item.quantity}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {lowStockPagination && lowStockPagination.links && (
                                        <div className="mt-4">
                                            <nav className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    {lowStockPagination.prev_page_url && (
                                                        <a href={lowStockPagination.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Previous
                                                        </a>
                                                    )}
                                                    {lowStockPagination.next_page_url && (
                                                        <a href={lowStockPagination.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Next
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            Showing <span className="font-medium">{lowStockPagination.from}</span> to <span className="font-medium">{lowStockPagination.to}</span> of{' '}
                                                            <span className="font-medium">{lowStockPagination.total}</span> results
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                            {lowStockPagination.links.map((link, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={link.url}
                                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${link.active
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                        } border ${index === 0 ? 'rounded-l-md' : ''
                                                                        } ${index === lowStockPagination.links.length - 1 ? 'rounded-r-md' : ''
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
                            )}

                            {/* Out of Stock Tab */}
                            {activeTab === 'out-of-stock' && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Out of Stock Items</h3>
                                    <div className="mb-4">
                                        <div className="relative">
                                            <TextInput
                                                id="out-of-stock-search"
                                                type="text"
                                                value={outOfStockSearchTerm}
                                                onChange={(e) => setOutOfStockSearchTerm(e.target.value)}
                                                placeholder="Search by item name or ID..."
                                                className="mt-1 block w-full pl-10"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Item ID
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Brand
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Model
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        Quantity
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {outOfStockData && outOfStockData.data && outOfStockData.data.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.item_id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.brand}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {item.model}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.quantity === 0
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                : item.quantity <= 10
                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                }`}>
                                                                {item.quantity}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {outOfStockPagination && outOfStockPagination.links && (
                                        <div className="mt-4">
                                            <nav className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    {outOfStockPagination.prev_page_url && (
                                                        <a href={outOfStockPagination.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Previous
                                                        </a>
                                                    )}
                                                    {outOfStockPagination.next_page_url && (
                                                        <a href={outOfStockPagination.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Next
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            Showing <span className="font-medium">{outOfStockPagination.from}</span> to <span className="font-medium">{outOfStockPagination.to}</span> of{' '}
                                                            <span className="font-medium">{outOfStockPagination.total}</span> results
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                            {outOfStockPagination.links.map((link, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={link.url}
                                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${link.active
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                        } border ${index === 0 ? 'rounded-l-md' : ''
                                                                        } ${index === outOfStockPagination.links.length - 1 ? 'rounded-r-md' : ''
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
                            )}

                            {/* Stock In Tab */}
                            {activeTab === 'in' && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Stock In</h3>
                                    <form onSubmit={handleStockIn} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="item_search" value="Item" />
                                                <div className="relative search-container">
                                                    <TextInput
                                                        id="item_search"
                                                        type="text"
                                                        value={searchTermIn}
                                                        onChange={(e) => {
                                                            setSearchTermIn(e.target.value);
                                                            handleItemSearch(e.target.value, 'in');
                                                        }}
                                                        onFocus={() => setShowSearchResultsIn(true)}
                                                        placeholder="Search by item name or ID..."
                                                        className="mt-1 block w-full"
                                                    />
                                                    {selectedItemIn && (
                                                        <button
                                                            type="button"
                                                            onClick={() => clearSelection('in')}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                {selectedItemIn && (
                                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                                                                    Selected Item
                                                                </h4>
                                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                                    {selectedItemIn.name} ({selectedItemIn.item_id})
                                                                </p>
                                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                    Current Stock: {selectedItemIn.quantity} units
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedItemIn.quantity === 0
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                    : selectedItemIn.quantity <= 10
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    }`}>
                                                                    {selectedItemIn.quantity === 0 ? 'Out of Stock' : selectedItemIn.quantity <= 10 ? 'Low Stock' : 'Ready Stock'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="quantity" value="Quantity" />
                                                <TextInput
                                                    id="quantity"
                                                    type="number"
                                                    min="1"
                                                    value={stockInForm.data.quantity}
                                                    onChange={(e) => stockInForm.setData('quantity', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                                <InputError message={stockInForm.errors.quantity} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="reason" value="Reason" />
                                                <select
                                                    id="reason"
                                                    value={stockInForm.data.reason}
                                                    onChange={(e) => {
                                                        stockInForm.setData('reason', e.target.value);
                                                        setShowCustomReasonIn(e.target.value === 'Other');
                                                        if (e.target.value !== 'Other') {
                                                            stockInForm.setData('custom_reason', '');
                                                        }
                                                    }}
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                    required
                                                >
                                                    <option value="">Select a reason</option>
                                                    <option value="Purchase">Purchase</option>
                                                    <option value="Return from Customer">Return from Customer</option>
                                                    <option value="Internal Transfer">Internal Transfer</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <InputError message={stockInForm.errors.reason} className="mt-2" />
                                            </div>
                                            {showCustomReasonIn && (
                                                <div>
                                                    <InputLabel htmlFor="custom_reason_in" value="Reason" />
                                                    <TextInput
                                                        id="custom_reason_in"
                                                        type="text"
                                                        value={stockInForm.data.custom_reason}
                                                        onChange={(e) => stockInForm.setData('custom_reason', e.target.value)}
                                                        className="mt-1 block w-full"
                                                        placeholder="Please specify the reason..."
                                                        required
                                                    />
                                                    <InputError message={stockInForm.errors.custom_reason} className="mt-2" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end space-x-4">
                                            <PrimaryButton disabled={stockInForm.processing}>
                                                {stockInForm.processing ? 'Recording...' : 'Record Stock In'}
                                            </PrimaryButton>
                                        </div>
                                    </form>

                                    {/* Dropdown positioned outside form */}
                                    {showSearchResultsIn && searchResultsIn.length > 0 && (
                                        <div className="fixed z-50 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl max-h-60 overflow-y-auto" style={{
                                            top: document.getElementById('item_search')?.getBoundingClientRect().bottom + 5 || 0,
                                            left: document.getElementById('item_search')?.getBoundingClientRect().left || 0,
                                            width: document.getElementById('item_search')?.offsetWidth || 'auto'
                                        }}>
                                            {searchResultsIn.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        selectItem(item, 'in');
                                                    }}
                                                    className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                ID: {item.item_id} • Current Stock: {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="ml-2">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.quantity === 0
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                : item.quantity <= 10
                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                }`}>
                                                                {item.quantity === 0 ? 'Out of Stock' : item.quantity <= 10 ? 'Low Stock' : 'Ready Stock'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stock Out Tab */}
                            {activeTab === 'out' && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Stock Out</h3>
                                    <form onSubmit={handleStockOut} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="item_search_out" value="Item" />
                                                <div className="relative search-container">
                                                    <TextInput
                                                        id="item_search_out"
                                                        type="text"
                                                        value={searchTermOut}
                                                        onChange={(e) => {
                                                            setSearchTermOut(e.target.value);
                                                            handleItemSearch(e.target.value, 'out');
                                                        }}
                                                        onFocus={() => setShowSearchResultsOut(true)}
                                                        placeholder="Search by item name or ID..."
                                                        className="mt-1 block w-full"
                                                    />
                                                    {selectedItemOut && (
                                                        <button
                                                            type="button"
                                                            onClick={() => clearSelection('out')}
                                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                {selectedItemOut && (
                                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                                                                    Selected Item
                                                                </h4>
                                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                                    {selectedItemOut.name} ({selectedItemOut.item_id})
                                                                </p>
                                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                                    Current Stock: {selectedItemOut.quantity} units
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedItemOut.quantity === 0
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                    : selectedItemOut.quantity <= 10
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    }`}>
                                                                    {selectedItemOut.quantity === 0 ? 'Out of Stock' : selectedItemOut.quantity <= 10 ? 'Low Stock' : 'Ready Stock'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="quantity_out" value="Quantity" />
                                                <TextInput
                                                    id="quantity_out"
                                                    type="number"
                                                    min="1"
                                                    value={stockOutForm.data.quantity}
                                                    onChange={(e) => stockOutForm.setData('quantity', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                                <InputError message={stockOutForm.errors.quantity} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <InputLabel htmlFor="reason" value="Reason" />
                                                <select
                                                    id="reason"
                                                    value={stockOutForm.data.reason}
                                                    onChange={(e) => {
                                                        stockOutForm.setData('reason', e.target.value);
                                                        setShowCustomReasonOut(e.target.value === 'Other');
                                                        if (e.target.value !== 'Other') {
                                                            stockOutForm.setData('custom_reason', '');
                                                        }
                                                    }}
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                    required
                                                >
                                                    <option value="">Select a reason</option>
                                                    <option value="Sale">Sale</option>
                                                    <option value="Damaged">Damaged</option>
                                                    <option value="Lost">Lost</option>
                                                    <option value="Return to Supplier">Return to Supplier</option>
                                                    <option value="Internal Use">Internal Use</option>
                                                    <option value="Customer Return">Customer Return</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <InputError message={stockOutForm.errors.reason} className="mt-2" />
                                            </div>
                                            {showCustomReasonOut && (
                                                <div>
                                                    <InputLabel htmlFor="custom_reason_out" value="Reason" />
                                                    <TextInput
                                                        id="custom_reason_out"
                                                        type="text"
                                                        value={stockOutForm.data.custom_reason}
                                                        onChange={(e) => stockOutForm.setData('custom_reason', e.target.value)}
                                                        className="mt-1 block w-full"
                                                        placeholder="Please specify the reason..."
                                                        required
                                                    />
                                                    <InputError message={stockOutForm.errors.custom_reason} className="mt-2" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end space-x-4">
                                            <PrimaryButton disabled={stockOutForm.processing}>
                                                {stockOutForm.processing ? 'Recording...' : 'Record Stock Out'}
                                            </PrimaryButton>
                                        </div>
                                    </form>

                                    {/* Dropdown positioned outside form */}
                                    {showSearchResultsOut && searchResultsOut.length > 0 && (
                                        <div className="fixed z-50 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl max-h-60 overflow-y-auto" style={{
                                            top: document.getElementById('item_search_out')?.getBoundingClientRect().bottom + 5 || 0,
                                            left: document.getElementById('item_search_out')?.getBoundingClientRect().left || 0,
                                            width: document.getElementById('item_search_out')?.offsetWidth || 'auto'
                                        }}>
                                            {searchResultsOut.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        selectItem(item, 'out');
                                                    }}
                                                    className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                ID: {item.item_id} • Current Stock: {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="ml-2">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.quantity === 0
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                : item.quantity <= 10
                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                }`}>
                                                                {item.quantity === 0 ? 'Out of Stock' : item.quantity <= 10 ? 'Low Stock' : 'Ready Stock'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Stock Calculator Tab */}
                            {activeTab === 'calculator' && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Stock Calculator</h3>

                                    {/* Calculator Summary Cards */}
                                    {calculatorData && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Total Cost</h4>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">RM {calculatorData.totalCost}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Total Retail Value</h4>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">RM {calculatorData.totalRetail}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Total Profit Margin</h4>
                                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">RM {calculatorData.totalProfitMargin}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Profit Margin Percentage</h4>
                                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{calculatorData.profitMarginPercentage}%</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Selected Items</h4>
                                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{calculatorData.itemCount}</p>
                                            </div>
                                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Total Quantity</h4>
                                                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{calculatorData.totalQuantity}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Search and Filter Section */}
                                    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Items for Calculation</h4>
                                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <TextInput
                                                        id="calculator_search"
                                                        type="text"
                                                        value={calculatorSearchTerm}
                                                        onChange={(e) => setCalculatorSearchTerm(e.target.value)}
                                                        placeholder="Search by item name or ID..."
                                                        className="mt-1 block w-full pl-10"
                                                    />
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <select
                                                    value={calculatorBrandFilter}
                                                    onChange={(e) => setCalculatorBrandFilter(e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                >
                                                    <option value="">All Brands</option>
                                                    <option value="PiRGE">PiRGE</option>
                                                    <option value="Jaya Mata">Jaya Mata</option>
                                                    <option value="Atasan Bicak">Atasan Bicak</option>
                                                </select>
                                                <select
                                                    value={calculatorModelFilter}
                                                    onChange={(e) => setCalculatorModelFilter(e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                >
                                                    <option value="">All Models</option>
                                                    {calculatorBrandFilter === 'PiRGE' && (
                                                        <>
                                                            <option value="Model A">Model A</option>
                                                            <option value="Model B">Model B</option>
                                                            <option value="Model C">Model C</option>
                                                        </>
                                                    )}
                                                    {calculatorBrandFilter === 'Jaya Mata' && (
                                                        <>
                                                            <option value="Model X">Model X</option>
                                                            <option value="Model Y">Model Y</option>
                                                            <option value="Model Z">Model Z</option>
                                                        </>
                                                    )}
                                                    {calculatorBrandFilter === 'Atasan Bicak' && (
                                                        <>
                                                            <option value="Model 1">Model 1</option>
                                                            <option value="Model 2">Model 2</option>
                                                            <option value="Model 3">Model 3</option>
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Items Table */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedItems(calculatorItems);
                                                                    } else {
                                                                        setSelectedItems([]);
                                                                    }
                                                                }}
                                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                            />
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Item ID
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Name
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Brand
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Model
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {calculatorItems.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                                                                    onChange={(e) => handleItemSelection(item, e.target.checked)}
                                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {item.item_id}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {item.name}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {item.brand}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {item.model}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        {calculatorPagination && calculatorPagination.links && (
                                            <div className="mt-4">
                                                <nav className="flex items-center justify-between">
                                                    <div className="flex-1 flex justify-between sm:hidden">
                                                        {calculatorPagination.prev_page_url && (
                                                            <a href={calculatorPagination.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                                Previous
                                                            </a>
                                                        )}
                                                        {calculatorPagination.next_page_url && (
                                                            <a href={calculatorPagination.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                                Next
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                Showing <span className="font-medium">{calculatorPagination.from}</span> to <span className="font-medium">{calculatorPagination.to}</span> of{' '}
                                                                <span className="font-medium">{calculatorPagination.total}</span> results
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                                {calculatorPagination.links.map((link, index) => (
                                                                    <a
                                                                        key={index}
                                                                        href={link.url}
                                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${link.active
                                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                                                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                            } border ${index === 0 ? 'rounded-l-md' : ''
                                                                            } ${index === calculatorPagination.links.length - 1 ? 'rounded-r-md' : ''
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
                                </div>
                            )}

                            {/* Stock Aging Tab */}
                            {activeTab === 'aging' && (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Stock Aging Analysis</h3>

                                    {/* Aging Statistics */}
                                    {agingData && agingData.aging_stats && (
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {agingData.aging_stats.total_batches}
                                                </div>
                                                <div className="text-sm text-blue-600 dark:text-blue-400">Total Batches</div>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {agingData.aging_stats.active_batches}
                                                </div>
                                                <div className="text-sm text-green-600 dark:text-green-400">Active Batches</div>
                                            </div>
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                                    {agingData.aging_stats.old_stock_batches}
                                                </div>
                                                <div className="text-sm text-yellow-600 dark:text-yellow-400">Old Stock (&gt;30 days)</div>
                                            </div>
                                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                    {agingData.aging_stats.depleted_batches}
                                                </div>
                                                <div className="text-sm text-red-600 dark:text-red-400">Depleted Batches</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Search and Filters */}
                                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <TextInput
                                                    id="aging-search"
                                                    type="text"
                                                    value={agingSearchTerm}
                                                    onChange={(e) => setAgingSearchTerm(e.target.value)}
                                                    placeholder="Search by item name or ID..."
                                                    className="mt-1 block w-full pl-10"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                value={agingAgeFilter}
                                                onChange={(e) => setAgingAgeFilter(e.target.value)}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            >
                                                <option value="">All Ages</option>
                                                <option value="7">7+ days old</option>
                                                <option value="30">30+ days old</option>
                                                <option value="60">60+ days old</option>
                                                <option value="90">90+ days old</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Batches Table */}
                                    {agingData && agingData.batches && (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Batch Number
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Item
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Initial Qty
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Remaining Qty
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Age (Days)
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                            Created
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {agingData.batches.data.map((batch) => (
                                                        <tr key={batch.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {batch.batch_number}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                                    {batch.item?.item_id}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {batch.item?.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {batch.initial_quantity}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {batch.remaining_quantity}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                                {batch.age}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${batch.is_depleted
                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                    : batch.age > 30
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                    }`}>
                                                                    {batch.is_depleted ? 'Depleted' : batch.age > 30 ? 'Old Stock' : 'Active'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                {new Date(batch.created_at).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {agingPagination && agingPagination.links && (
                                        <div className="mt-4">
                                            <nav className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    {agingPagination.prev_page_url && (
                                                        <a href={agingPagination.prev_page_url} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Previous
                                                        </a>
                                                    )}
                                                    {agingPagination.next_page_url && (
                                                        <a href={agingPagination.next_page_url} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                                            Next
                                                        </a>
                                                    )}
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            Showing <span className="font-medium">{agingPagination.from}</span> to <span className="font-medium">{agingPagination.to}</span> of{' '}
                                                            <span className="font-medium">{agingPagination.total}</span> results
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                            {agingPagination.links.map((link, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={link.url}
                                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${link.active
                                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                        } border ${index === 0 ? 'rounded-l-md' : ''
                                                                        } ${index === agingPagination.links.length - 1 ? 'rounded-r-md' : ''
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 