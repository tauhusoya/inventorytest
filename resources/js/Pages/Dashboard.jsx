import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Package, DollarSign, AlertTriangle, TrendingUp, Users, Activity, BarChart3, Calendar, Plus, Minus, ShoppingCart, XCircle } from 'lucide-react';

export default function Dashboard({ auth, kpis, recentActivities, charts, alerts }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadingStates, setLoadingStates] = React.useState({
        kpis: true,
        charts: true,
        alerts: true,
        activities: true
    });

    // Simulate loading states
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setLoadingStates({
                kpis: false,
                charts: false,
                alerts: false,
                activities: false
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ms-MY', {
            style: 'currency',
            currency: 'MYR',
        }).format(amount);
    };

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) {
            return 'Just now';
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
    };

    // Prepare brand data for chart
    const prepareBrandChartData = () => {
        const brands = charts?.itemsByBrand || [];
        if (brands.length === 0) return [];

        // Sort by item count and take top 4
        const sortedBrands = brands.sort((a, b) => b.item_count - a.item_count);
        const topBrands = sortedBrands.slice(0, 4);
        const otherBrands = sortedBrands.slice(4);

        const chartData = topBrands.map((brand, index) => ({
            name: brand.brand,
            value: brand.item_count,
            color: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'][index] || '#6B7280'
        }));

        // Add "Others" category if there are more brands
        if (otherBrands.length > 0) {
            const othersTotal = otherBrands.reduce((sum, brand) => sum + brand.item_count, 0);
            chartData.push({
                name: 'Others',
                value: othersTotal,
                color: '#9CA3AF'
            });
        }

        return chartData;
    };

    const brandChartData = prepareBrandChartData();

    // Calculate total for percentages
    const totalItems = kpis?.totalItems || 1;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                .animate-slide-in {
                    animation: slideIn 0.5s ease-out forwards;
                }
                .animate-scale-in {
                    animation: scaleIn 0.4s ease-out forwards;
                }

            `}</style>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Mosaic Grid Layout */}
                            <div className="grid grid-cols-12 gap-4 auto-rows-min">
                                {/* KPI Cards - Large Tiles */}
                                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-blue-900/20 dark:to-indigo-900/20 h-full border border-blue-200 dark:border-blue-700">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <div className="relative">
                                            {loadingStates.kpis ? (
                                                <>
                                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                        <div>
                                                            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center space-x-3 h-full">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                                            <Package className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex flex-col justify-center h-full">
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {kpis?.totalItems || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-emerald-900/20 dark:to-green-900/20 h-full border border-emerald-200 dark:border-emerald-700">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <div className="relative">
                                            {loadingStates.kpis ? (
                                                <>
                                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                        <div>
                                                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center space-x-3 h-full">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                                            <DollarSign className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex flex-col justify-center h-full">
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
                                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {formatCurrency(kpis?.totalCost || 0)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-amber-900/20 dark:to-yellow-900/20 h-full border border-amber-200 dark:border-amber-700">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <div className="relative">
                                            {loadingStates.kpis ? (
                                                <>
                                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                        <div>
                                                            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center space-x-3 h-full">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg">
                                                            <AlertTriangle className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex flex-col justify-center h-full">
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {kpis?.lowStockItems || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-rose-900/20 dark:to-red-900/20 h-full border border-rose-200 dark:border-rose-700">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <div className="relative">
                                            {loadingStates.kpis ? (
                                                <>
                                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                    <div className="flex items-end justify-between">
                                                        <div className="space-y-2">
                                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center space-x-3 h-full">
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                                                            <XCircle className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex flex-col justify-center h-full">
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
                                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                {kpis?.outOfStockItems || 0}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Brand Distribution - Chart Tile */}
                                <div className="col-span-12 lg:col-span-8">
                                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-indigo-900/20 h-full border border-blue-200 dark:border-blue-700">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Brand Distribution</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Top brands by items</p>
                                        </div>

                                        {brandChartData.length > 0 ? (
                                            <div className="space-y-4">
                                                {/* Bar Chart Visualization */}
                                                <div className="h-64 flex items-end justify-center space-x-2">
                                                    {brandChartData.map((item, index) => {
                                                        const percentage = (item.value / totalItems) * 100;
                                                        const maxHeight = 200; // Maximum height in pixels
                                                        const barHeight = (item.value / Math.max(...brandChartData.map(d => d.value))) * maxHeight;

                                                        return (
                                                            <div key={item.name} className="flex flex-col items-center space-y-2">
                                                                <div
                                                                    className="w-8 rounded-t-lg transition-all duration-300 hover:scale-105"
                                                                    style={{
                                                                        height: `${barHeight}px`,
                                                                        backgroundColor: item.color
                                                                    }}
                                                                />
                                                                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                                    <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                                                    <div>{item.value}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Summary Stats */}
                                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                                    {brandChartData.slice(0, 4).map((item, index) => (
                                                        <div key={item.name} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-700 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 dark:text-gray-400">No brand data available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stock Health Overview - Chart Tile */}
                                <div className="col-span-12 lg:col-span-4">
                                    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg dark:from-green-900/20 dark:to-emerald-900/20 h-full border border-green-200 dark:border-green-700">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Stock Health Overview</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Current inventory status</p>
                                        </div>

                                        {/* Doughnut Chart */}
                                        <div className="relative h-48 flex items-center justify-center">
                                            {loadingStates.charts ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                </div>
                                            ) : (
                                                <div className="relative w-32 h-32">
                                                    {/* Calculate stock health data */}
                                                    {(() => {
                                                        // Use backend-provided KPIs (accurate and separate)
                                                        const readyStock = Math.max(0, kpis?.readyStockItems || 0);
                                                        const lowStock = Math.max(0, kpis?.lowStockItems || 0);
                                                        const outOfStock = Math.max(0, kpis?.outOfStockItems || 0);
                                                        const total = readyStock + lowStock + outOfStock;

                                                        if (total === 0) return null;

                                                        const readyAngle = (readyStock / total) * 360;
                                                        const lowAngle = (lowStock / total) * 360;
                                                        const outAngle = (outOfStock / total) * 360;

                                                        return (
                                                            <>
                                                                {/* Ready Stock */}
                                                                <div
                                                                    className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
                                                                    style={{
                                                                        background: `conic-gradient(#10B981 0deg ${readyAngle}deg, #F59E0B ${readyAngle}deg ${readyAngle + lowAngle}deg, #EF4444 ${readyAngle + lowAngle}deg ${readyAngle + lowAngle + outAngle}deg)`
                                                                    }}
                                                                />
                                                                <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                                    <div className="text-center">
                                                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                                            {total}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                                            Total
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Legend */}
                                        <div className="space-y-3 mt-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Ready Stock</span>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {Math.max(0, kpis?.readyStockItems || 0)}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Low Stock</span>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {Math.max(0, kpis?.lowStockItems || 0)}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Out of Stock</span>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {kpis?.outOfStockItems || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Low Stock Alerts - Medium Tile */}
                                <div className="col-span-12 md:col-span-6">
                                    <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-lg dark:from-yellow-900/20 dark:to-orange-900/20 h-full border border-yellow-200 dark:border-yellow-700">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Low Stock Alerts</h3>
                                                <p className="text-gray-600 dark:text-gray-400">Items needing attention</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg">
                                                <AlertTriangle className="h-6 w-6 text-white" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {loadingStates.alerts ? (
                                                <>
                                                    {[1, 2, 3].map((index) => (
                                                        <div key={index} className="group flex items-center justify-between rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-700">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                                <div className="space-y-2">
                                                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    {(alerts?.lowStock || []).slice(0, 3).map((item, index) => (
                                                        <div key={index} className="group flex items-center justify-between rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-700">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 shadow-md">
                                                                    <Package className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                                                        {item.item_id}
                                                                    </h5>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {item.brand} - {item.model}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                                                    {item.quantity} left
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(alerts?.lowStock || []).length === 0 && (
                                                        <div className="text-center py-8">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">No low stock alerts</p>
                                                        </div>
                                                    )}
                                                    {(alerts?.lowStock || []).length > 3 && (
                                                        <div className="text-center pt-2">
                                                            <Link
                                                                href={route('items.index', { filter: 'low_stock' })}
                                                                className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200"
                                                            >
                                                                See all {alerts.lowStock.length} low stock items
                                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Out of Stock Alerts - Medium Tile */}
                                <div className="col-span-12 md:col-span-6">
                                    <div className="rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 p-6 shadow-lg dark:from-red-900/20 dark:to-pink-900/20 h-full border border-red-200 dark:border-red-700">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Out of Stock Alerts</h3>
                                                <p className="text-gray-600 dark:text-gray-400">Critical items</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                                                <XCircle className="h-6 w-6 text-white" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {loadingStates.alerts ? (
                                                <>
                                                    {[1, 2, 3].map((index) => (
                                                        <div key={index} className="group flex items-center justify-between rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-700">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                                <div className="space-y-2">
                                                                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    {(alerts?.outOfStock || []).slice(0, 3).map((item, index) => (
                                                        <div key={index} className="group flex items-center justify-between rounded-xl bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-700">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-600 shadow-md">
                                                                    <Package className="h-5 w-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                                                        {item.item_id}
                                                                    </h5>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {item.brand} - {item.model}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                                                    Out of stock
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {(alerts?.outOfStock || []).length === 0 && (
                                                        <div className="text-center py-8">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">No out of stock alerts</p>
                                                        </div>
                                                    )}
                                                    {(alerts?.outOfStock || []).length > 3 && (
                                                        <div className="text-center pt-2">
                                                            <Link
                                                                href={route('items.index', { filter: 'out_of_stock' })}
                                                                className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                                            >
                                                                See all {alerts.outOfStock.length} out of stock items
                                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stock In/Out Trend and Recent Activities Row */}
                                <div className="col-span-12 lg:col-span-6">
                                    <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 p-6 shadow-lg dark:from-purple-900/20 dark:to-violet-900/20 h-full border border-purple-200 dark:border-purple-700">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Stock In/Out Trend</h3>
                                                <p className="text-gray-600 dark:text-gray-400">Last 7 days activity</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-red-500 shadow-lg">
                                                <TrendingUp className="h-6 w-6 text-white" />
                                            </div>
                                        </div>

                                        {/* Trend Chart */}
                                        <div className="h-44 md:h-60">
                                            {loadingStates.charts ? (
                                                <div className="h-full flex flex-col">
                                                    {/* Chart skeleton */}
                                                    <div className="flex-1 flex items-end justify-between space-x-2">
                                                        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                                                            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                                                                <div className="w-full flex flex-col space-y-1">
                                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t animate-pulse" style={{ height: `${Math.random() * 80 + 20}px` }}></div>
                                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-b animate-pulse" style={{ height: `${Math.random() * 60 + 10}px` }}></div>
                                                                </div>
                                                                <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Legend skeleton */}
                                                    <div className="flex justify-center space-x-6 mt-4">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {(() => {
                                                        // Prepare trend data for last 7 days
                                                        const trendData = [];
                                                        const today = new Date();

                                                        for (let i = 6; i >= 0; i--) {
                                                            const date = new Date(today);
                                                            date.setDate(date.getDate() - i);
                                                            const dateStr = date.toISOString().split('T')[0];

                                                            // Filter transactions for this date
                                                            const dayTransactions = recentActivities?.stockTrendTransactions || [];
                                                            const stockIn = dayTransactions.filter(t => {
                                                                const transactionDate = new Date(t.created_at);
                                                                const transactionDateStr = transactionDate.toISOString().split('T')[0];
                                                                return t.type === 'in' && transactionDateStr === dateStr;
                                                            }).reduce((sum, t) => sum + t.quantity, 0);

                                                            const stockOut = dayTransactions.filter(t => {
                                                                const transactionDate = new Date(t.created_at);
                                                                const transactionDateStr = transactionDate.toISOString().split('T')[0];
                                                                return t.type === 'out' && transactionDateStr === dateStr;
                                                            }).reduce((sum, t) => sum + t.quantity, 0);

                                                            trendData.push({
                                                                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                                                                stockIn,
                                                                stockOut
                                                            });
                                                        }

                                                        const maxValue = Math.max(...trendData.map(d => Math.max(d.stockIn, d.stockOut)), 1);
                                                        const isMobile = window.innerWidth < 768;
                                                        const barHeight = isMobile ? 60 : 100;

                                                        return (
                                                            <div className="h-full flex flex-col">
                                                                {/* Chart */}
                                                                <div className="flex-1 flex items-end justify-between space-x-2 mb-1">
                                                                    {trendData.map((day, index) => (
                                                                        <div key={index} className="flex-1 flex flex-col items-center space-y-2 animate-slide-in" style={{ animationDelay: `${index * 150}ms` }}>
                                                                            {/* Bars */}
                                                                            <div className="w-full flex flex-col space-y-1">
                                                                                <div
                                                                                    className="w-full bg-green-500 rounded-t cursor-pointer transition-all duration-200 hover:bg-green-600 relative group"
                                                                                    style={{
                                                                                        height: `${(day.stockIn / maxValue) * barHeight}px`,
                                                                                        minHeight: day.stockIn > 0 ? '4px' : '0px'
                                                                                    }}
                                                                                    title={`Stock In: ${day.stockIn} units`}
                                                                                >
                                                                                    {/* Tooltip */}
                                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                                                        Stock In: {day.stockIn} units
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="w-full bg-red-500 rounded-b cursor-pointer transition-all duration-200 hover:bg-red-600 relative group"
                                                                                    style={{
                                                                                        height: `${(day.stockOut / maxValue) * barHeight}px`,
                                                                                        minHeight: day.stockOut > 0 ? '4px' : '0px'
                                                                                    }}
                                                                                    title={`Stock Out: ${day.stockOut} units`}
                                                                                >
                                                                                    {/* Tooltip */}
                                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                                                                        Stock Out: {day.stockOut} units
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* Date */}
                                                                            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                                                {day.date}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Legend */}
                                                                <div className="flex justify-center space-x-6 mt-1">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400">Stock In</span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                                                                        <span className="text-sm text-gray-600 dark:text-gray-400">Stock Out</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activities - Large Tile */}
                                <div className="col-span-12 lg:col-span-6">
                                    <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 p-6 shadow-lg dark:from-cyan-900/20 dark:to-teal-900/20 h-full border border-cyan-200 dark:border-cyan-700">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h3>
                                                <p className="text-gray-600 dark:text-gray-400">Stock movements & item updates</p>
                                            </div>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                                                <BarChart3 className="h-6 w-6 text-white" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {loadingStates.activities ? (
                                                <>
                                                    {[1, 2, 3].map((index) => (
                                                        <div key={index} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-700">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                                        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2 mt-1">
                                                                        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    {(() => {
                                                        // Combine and sort all activities by time
                                                        const allActivities = [
                                                            ...(recentActivities?.stockTransactions || []).map(t => ({
                                                                ...t,
                                                                type: 'transaction',
                                                                time: t.created_at
                                                            })),
                                                            ...(recentActivities?.itemActivities || []).map(i => ({
                                                                ...i,
                                                                type: 'item',
                                                                time: i.activity_time
                                                            }))
                                                        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 3);

                                                        return allActivities.map((activity, index) => {
                                                            if (activity.type === 'transaction') {
                                                                return (
                                                                    <div key={`stock-${index}`} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-700">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ${activity.type === 'in'
                                                                                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                                                                : 'bg-gradient-to-br from-red-500 to-pink-600'
                                                                                }`}>
                                                                                {activity.type === 'in' ? (
                                                                                    <Plus className="h-4 w-4 text-white" />
                                                                                ) : (
                                                                                    <Minus className="h-4 w-4 text-white" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                                        {activity.item?.item_id || 'Unknown Item'}
                                                                                    </span>
                                                                                    {activity.type === 'in' ? (
                                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                                                                            Stock In
                                                                                        </span>
                                                                                    ) : (
                                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                                                                            Stock Out
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center space-x-2 mt-1">
                                                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                                        {activity.quantity} units
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {getRelativeTime(activity.created_at)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div key={`item-${index}`} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-700">
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm bg-gradient-to-br from-blue-500 to-purple-600">
                                                                                <Package className="h-4 w-4 text-white" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                                        {activity.item_id}
                                                                                    </span>
                                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                                                                        {activity.activity_type}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center">
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                                {getRelativeTime(activity.activity_time)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        });
                                                    })()}

                                                    {(!recentActivities?.stockTransactions?.length && !recentActivities?.itemActivities?.length) && (
                                                        <div className="text-center py-8">
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">No recent activities</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
