<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\StockTransaction;
use App\Models\StockBatch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = StockTransaction::with(['item', 'user']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('item', function ($itemQuery) use ($search) {
                    $itemQuery->where('name', 'like', "%{$search}%")
                              ->orWhere('item_id', 'like', "%{$search}%");
                })
                ->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('first_name', 'like', "%{$search}%")
                              ->orWhere('last_name', 'like', "%{$search}%");
                })
                ->orWhere('reason', 'like', "%{$search}%")
                ->orWhere('type', 'like', "%{$search}%")
                ->orWhere('quantity', 'like', "%{$search}%")
                ->orWhereDate('created_at', 'like', "%{$search}%");
            });
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(10);

        $items = Item::orderBy('name')->get();

        return Inertia::render('Stock/Index', [
            'transactions' => $transactions,
            'items' => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    public function stockIn(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
            'custom_reason' => 'nullable|string|max:255',
        ]);

        // Generate batch number
        $batchNumber = 'BATCH-' . date('Ymd') . '-' . Str::random(6);

        // Create stock batch
        $stockBatch = StockBatch::create([
            'item_id' => $request->item_id,
            'batch_number' => $batchNumber,
            'initial_quantity' => $request->quantity,
            'remaining_quantity' => $request->quantity,
            'user_id' => auth()->id(),
        ]);

        // Determine the final reason
        $finalReason = $request->reason === 'Other' && $request->filled('custom_reason') 
            ? $request->custom_reason 
            : $request->reason;

        // Create stock transaction
        StockTransaction::create([
            'item_id' => $request->item_id,
            'type' => 'in',
            'quantity' => $request->quantity,
            'reason' => $finalReason,
            'user_id' => auth()->id(),
            'batch_id' => $batchNumber,
            'remaining_quantity' => $request->quantity,
            'is_old_stock' => false,
        ]);

        // Update item quantity
        $item = Item::find($request->item_id);
        $oldQuantity = $item->quantity;
        $newQuantity = $oldQuantity + $request->quantity;
        $item->update(['quantity' => $newQuantity]);

        // Log the transaction for debugging
        \Log::info("Stock IN: Item {$item->name} (ID: {$item->id}) - Old: {$oldQuantity}, Added: {$request->quantity}, New: {$newQuantity}, Batch: {$batchNumber}");

        return redirect()->route('stock.index')->with('success', 'Stock in recorded successfully!');
    }

    public function stockOut(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
            'custom_reason' => 'nullable|string|max:255',
        ]);

        $item = Item::find($request->item_id);

        // Check if enough stock
        if ($item->quantity < $request->quantity) {
            return back()->withErrors(['quantity' => 'Insufficient stock. Available: ' . $item->quantity]);
        }

        // Get available batches (FIFO - oldest first)
        $availableBatches = StockBatch::where('item_id', $request->item_id)
            ->where('remaining_quantity', '>', 0)
            ->orderBy('created_at', 'asc')
            ->get();

        // Determine the final reason
        $finalReason = $request->reason === 'Other' && $request->filled('custom_reason') 
            ? $request->custom_reason 
            : $request->reason;

        $remainingQuantity = $request->quantity;
        $transactions = [];

        foreach ($availableBatches as $batch) {
            if ($remainingQuantity <= 0) break;

            $quantityToDeduct = min($remainingQuantity, $batch->remaining_quantity);
            
            // Create stock transaction for this batch
            $transactions[] = StockTransaction::create([
                'item_id' => $request->item_id,
                'type' => 'out',
                'quantity' => $quantityToDeduct,
                'reason' => $finalReason,
                'user_id' => auth()->id(),
                'batch_id' => $batch->batch_number,
                'remaining_quantity' => $batch->remaining_quantity - $quantityToDeduct,
                'is_old_stock' => $batch->created_at->diffInDays(now()) > 30, // Consider old if > 30 days
            ]);

            // Update batch remaining quantity
            $batch->update(['remaining_quantity' => $batch->remaining_quantity - $quantityToDeduct]);
            
            $remainingQuantity -= $quantityToDeduct;
        }

        // Update item quantity
        $oldQuantity = $item->quantity;
        $newQuantity = $oldQuantity - $request->quantity;
        $item->update(['quantity' => $newQuantity]);

        // Log the transaction for debugging
        \Log::info("Stock OUT: Item {$item->name} (ID: {$item->id}) - Old: {$oldQuantity}, Removed: {$request->quantity}, New: {$newQuantity}");

        return redirect()->route('stock.index')->with('success', 'Stock out recorded successfully!');
    }

    public function getStockAging(Request $request)
    {
        $query = StockBatch::with(['item', 'user']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('item', function ($itemQuery) use ($search) {
                $itemQuery->where('name', 'like', "%{$search}%")
                          ->orWhere('item_id', 'like', "%{$search}%");
            });
        }

        // Filter by age
        if ($request->filled('age_filter')) {
            $days = $request->age_filter;
            $query->where('created_at', '<=', now()->subDays($days));
        }

        $batches = $query->orderBy('created_at', 'desc')->paginate(10);

        // Calculate aging statistics
        $agingStats = [
            'total_batches' => StockBatch::count(),
            'active_batches' => StockBatch::where('remaining_quantity', '>', 0)->count(),
            'depleted_batches' => StockBatch::where('remaining_quantity', '<=', 0)->count(),
            'old_stock_batches' => StockBatch::where('created_at', '<=', now()->subDays(30))->count(),
        ];

        return response()->json([
            'batches' => $batches,
            'aging_stats' => $agingStats,
        ]);
    }

    public function getItems(Request $request)
    {
        $search = $request->get('search', '');
        
        $items = Item::where('name', 'like', "%{$search}%")
            ->orWhere('item_id', 'like', "%{$search}%")
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'item_id', 'name', 'quantity']);

        return response()->json($items);
    }

    public function getCalculatorItems(Request $request)
    {
        $query = Item::query();
        
        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('item_id', 'like', "%{$search}%");
            });
        }
        
        // Brand filter
        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }
        
        // Model filter
        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }
        
        $items = $query->orderBy('name')->paginate(10);
        
        return response()->json($items);
    }

    public function calculate(Request $request)
    {
        $selectedItemIds = $request->get('item_ids', []);
        
        if (!empty($selectedItemIds)) {
            $items = Item::whereIn('id', $selectedItemIds)->get();
        } else {
            $items = collect(); // Empty collection when no items selected
        }
        
        $totalCost = $items->sum(function ($item) {
            return $item->cost * $item->quantity;
        });
        
        $totalRetail = $items->sum(function ($item) {
            return $item->retail * $item->quantity;
        });
        
        $totalMargin = $totalRetail - $totalCost;
        $marginPercentage = $totalCost > 0 ? ($totalMargin / $totalCost) * 100 : 0;

        return response()->json([
            'items' => $items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'item_id' => $item->item_id,
                    'name' => $item->name,
                    'brand' => $item->brand,
                    'model' => $item->model,
                    'cost' => $item->cost,
                    'retail' => $item->retail,
                    'quantity' => $item->quantity,
                    'total_cost' => $item->cost * $item->quantity,
                    'total_retail' => $item->retail * $item->quantity,
                    'profit_margin' => ($item->retail * $item->quantity) - ($item->cost * $item->quantity),
                ];
            }),
            'totalCost' => number_format($totalCost, 2),
            'totalRetail' => number_format($totalRetail, 2),
            'totalProfitMargin' => number_format($totalMargin, 2),
            'profitMarginPercentage' => number_format($marginPercentage, 2),
            'itemCount' => $items->count(),
            'totalQuantity' => $items->sum('quantity'),
        ]);
    }

    public function getLowStock(Request $request)
    {
        $query = Item::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('item_id', 'like', "%{$search}%");
            });
        }

        // Filter for low stock only (quantity > 0 and <= 10)
        $query->where('quantity', '>', 0)
              ->where('quantity', '<=', 10);

        $items = $query->orderBy('quantity', 'asc')
                      ->orderBy('name', 'asc')
                      ->paginate(10);

        return response()->json($items);
    }

    public function getOutOfStock(Request $request)
    {
        $query = Item::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('item_id', 'like', "%{$search}%");
            });
        }

        // Filter for out of stock only (quantity = 0)
        $query->where('quantity', '=', 0);

        $items = $query->orderBy('name', 'asc')
                      ->paginate(10);

        return response()->json($items);
    }
}
