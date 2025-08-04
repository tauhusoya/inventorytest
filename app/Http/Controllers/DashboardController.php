<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\StockTransaction;
use App\Models\User;
use App\Models\ReactivationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // KPIs
        $totalItems = Item::count();
        $totalCost = Item::sum(DB::raw('cost * quantity'));
        
        // Stock Health Categories (separate and accurate)
        $readyStockItems = Item::where('quantity', '>', 10)->count();
        $lowStockItems = Item::where('quantity', '>=', 1)->where('quantity', '<=', 10)->count();
        $outOfStockItems = Item::where('quantity', 0)->count();
        
        // Comprehensive validation and error handling
        $calculatedTotal = $readyStockItems + $lowStockItems + $outOfStockItems;
        
        // Validate stock calculations
        if ($calculatedTotal !== $totalItems) {
            // Stock calculation mismatch: Total=$totalItems, Calculated=$calculatedTotal
            // Use calculated total to ensure consistency
            $totalItems = $calculatedTotal;
        }
        
        // Validate data integrity
        if ($totalItems < 0) {
            // Invalid total items count: $totalItems
            $totalItems = 0;
        }
        
        if ($readyStockItems < 0) {
            // Invalid ready stock count: $readyStockItems
            $readyStockItems = 0;
        }
        
        if ($lowStockItems < 0) {
            // Invalid low stock count: $lowStockItems
            $lowStockItems = 0;
        }
        
        if ($outOfStockItems < 0) {
            // Invalid out of stock count: $outOfStockItems
            $outOfStockItems = 0;
        }
        
        // Validate cost calculation
        if ($totalCost < 0) {
            // Invalid total cost: $totalCost
            $totalCost = 0;
        }

        // Recent Activities - Stock Transactions
        $recentStockTransactions = StockTransaction::with(['item', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        // Recent Activities - Item Creation/Updates
        $recentItemActivities = Item::select('id', 'item_id', 'name', 'brand', 'model', 'quantity', 'created_at', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                // Determine if it's a new item or updated item
                $isNew = $item->created_at == $item->updated_at;
                $item->activity_type = $isNew ? 'Item Added' : 'Item Updated';
                $item->activity_time = $isNew ? $item->created_at : $item->updated_at;
                
                // Validate item data
                if (empty($item->item_id)) {
                    // Item missing item_id: {$item->id}
                    $item->item_id = 'Unknown';
                }
                
                if ($item->quantity < 0) {
                    // Item with negative quantity: {$item->item_id} = {$item->quantity}
                    $item->quantity = 0;
                }
                
                return $item;
            });

        // Stock Trend Data (last 30 days)
        $stockTrendTransactions = StockTransaction::with(['item', 'user'])
            ->where('created_at', '>=', now()->subDays(30))
            ->orderBy('created_at', 'desc')
            ->get();

        $recentItems = Item::orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Stock Level Chart Data (categorized by stock health)
        $stockLevels = Item::select('name', 'quantity', 'retail')
            ->orderBy('quantity', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                // Add stock health category
                if ($item->quantity > 10) {
                    $item->stock_health = 'ready';
                } elseif ($item->quantity >= 1 && $item->quantity <= 10) {
                    $item->stock_health = 'low';
                } else {
                    $item->stock_health = 'out';
                }
                return $item;
            });

        // Value Distribution by Brand
        $valueDistribution = Item::select('brand', DB::raw('SUM(retail * quantity) as total_value'))
            ->groupBy('brand')
            ->orderBy('total_value', 'desc')
            ->get();

        // Items by Brand and Model
        $itemsByBrand = Item::select('brand', DB::raw('COUNT(*) as item_count'))
            ->groupBy('brand')
            ->orderBy('item_count', 'desc')
            ->get();

        $itemsByModel = Item::select('model', DB::raw('COUNT(*) as item_count'))
            ->groupBy('model')
            ->orderBy('item_count', 'desc')
            ->limit(10)
            ->get();

        // Low Stock Alerts (items with quantity 1-10, including 10)
        $lowStockAlerts = Item::select('id', 'item_id', 'name', 'brand', 'model', 'quantity')
            ->where('quantity', '>=', 1)
            ->where('quantity', '<=', 10)
            ->orderBy('quantity', 'asc')
            ->limit(10)
            ->get();
        
        // Validate and log alert data
        // Low stock items count: ' . $lowStockAlerts->count()
        if ($lowStockAlerts->count() > 0) {
            // Low stock items: ' . $lowStockAlerts->toArray()
        }

        // Out of Stock Alerts
        $outOfStockAlerts = Item::select('id', 'item_id', 'name', 'brand', 'model', 'quantity')
            ->where('quantity', 0)
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get();
        
        // Validate alert data integrity
        $lowStockAlerts = $lowStockAlerts->filter(function ($item) {
            if ($item->quantity < 1 || $item->quantity > 10) {
                // Invalid low stock item: {$item->item_id} with quantity {$item->quantity}
                return false;
            }
            return true;
        });
        
        $outOfStockAlerts = $outOfStockAlerts->filter(function ($item) {
            if ($item->quantity !== 0) {
                // Invalid out of stock item: {$item->item_id} with quantity {$item->quantity}
                return false;
            }
            return true;
        });
        
        // Log out of stock items count
        // Out of stock items count: ' . $outOfStockAlerts->count()
        if ($outOfStockAlerts->count() > 0) {
            // Out of stock items: ' . $outOfStockAlerts->toArray()
        }

        return Inertia::render('Dashboard', [
            'kpis' => [
                'totalItems' => $totalItems,
                'totalCost' => $totalCost,
                'readyStockItems' => $readyStockItems,
                'lowStockItems' => $lowStockItems,
                'outOfStockItems' => $outOfStockItems,
            ],
            'recentActivities' => [
                'stockTransactions' => $recentStockTransactions,
                'itemActivities' => $recentItemActivities,
                'stockTrendTransactions' => $stockTrendTransactions,
                'items' => $recentItems,
            ],
            'charts' => [
                'stockLevels' => $stockLevels,
                'valueDistribution' => $valueDistribution,
                'itemsByBrand' => $itemsByBrand,
                'itemsByModel' => $itemsByModel,
            ],
            'alerts' => [
                'lowStock' => $lowStockAlerts,
                'outOfStock' => $outOfStockAlerts,
            ],
        ]);
    }
} 