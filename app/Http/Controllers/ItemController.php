<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Item::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('item_id', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
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

        $items = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Items/Index', [
            'items' => $items,
            'filters' => $request->only(['search', 'brand', 'model']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Items/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|string|unique:items,item_id|max:255',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'brand' => 'required|in:PiRGE,Jaya Mata,Atasan Bicak',
            'model' => 'required|string|max:255',
            'cost' => 'required|numeric|min:0',
            'retail' => 'required|numeric|min:0',
        ]);

        $data = $request->all();
        $data['quantity'] = 0; // Set default quantity to 0

        Item::create($data);

        return redirect()->route('items.index')->with('success', 'Item created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        return Inertia::render('Items/Show', [
            'item' => $item,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', [
            'item' => $item,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        $request->validate([
            'item_id' => 'required|string|unique:items,item_id,' . $item->id . '|max:255',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'brand' => 'required|in:PiRGE,Jaya Mata,Atasan Bicak',
            'model' => 'required|string|max:255',
            'cost' => 'required|numeric|min:0',
            'retail' => 'required|numeric|min:0',
        ]);

        $item->update($request->all());

        return redirect()->route('items.index')->with('success', 'Item updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item deleted successfully!');
    }

    /**
     * Get models based on brand
     */
    public function getModels(Request $request)
    {
        $brand = $request->brand;
        $models = [];

        switch ($brand) {
            case 'PiRGE':
                $models = ['Model A', 'Model B', 'Model C'];
                break;
            case 'Jaya Mata':
                $models = ['Model X', 'Model Y', 'Model Z'];
                break;
            case 'Atasan Bicak':
                $models = ['Model 1', 'Model 2', 'Model 3'];
                break;
        }

        return response()->json(['models' => $models]);
    }

    /**
     * Show the import form
     */
    public function import()
    {
        return Inertia::render('Items/Import');
    }

    /**
     * Process the bulk import
     */
    public function processImport(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('csv_file');
        $path = $file->getRealPath();
        
        $data = array_map('str_getcsv', file($path));
        $headers = array_shift($data); // Remove header row
        
        $imported = 0;
        $duplicates = 0;
        $errors = [];
        $errorCount = 0;
        
        foreach ($data as $index => $row) {
            try {
                $itemData = array_combine($headers, $row);
                
                // Validate required fields
                if (empty($itemData['item_id']) || empty($itemData['name'])) {
                    $errors[] = "Row " . ($index + 2) . ": Missing required fields (item_id, name)";
                    $errorCount++;
                    continue;
                }
                
                // Check if item_id already exists
                if (Item::where('item_id', $itemData['item_id'])->exists()) {
                    $errors[] = "Row " . ($index + 2) . ": Item ID '{$itemData['item_id']}' already exists";
                    $duplicates++;
                    continue;
                }
                
                // Create item
                Item::create([
                    'item_id' => $itemData['item_id'],
                    'name' => $itemData['name'],
                    'description' => $itemData['description'] ?? '',
                    'brand' => $itemData['brand'],
                    'model' => $itemData['model'] ?? '',
                    'cost' => floatval($itemData['cost'] ?? 0),
                    'retail' => floatval($itemData['retail'] ?? 0),
                    'quantity' => intval($itemData['quantity'] ?? 0),
                ]);
                
                $imported++;
                
            } catch (\Exception $e) {
                $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
                $errorCount++;
            }
        }
        
        // Build detailed message
        $message = "Import completed! ";
        $message .= "Successfully imported: {$imported} items";
        
        if ($duplicates > 0) {
            $message .= ", Duplicates skipped: {$duplicates} items";
        }
        
        if ($errorCount > 0) {
            $message .= ", Errors: {$errorCount} items";
        }
        
        return redirect()->route('items.index')->with('success', $message);
    }

    /**
     * Export items to PDF
     */
    public function debug(Request $request)
    {
        $items = Item::select('id', 'item_id', 'name', 'quantity', 'created_at', 'updated_at')->get();
        
        return response()->json([
            'items' => $items,
            'total_items' => $items->count(),
            'items_with_quantity' => $items->where('quantity', '>', 0)->count(),
            'items_with_zero_quantity' => $items->where('quantity', 0)->count(),
        ]);
    }

    public function export(Request $request)
    {
        $query = Item::query();

        // Apply same filters as index method
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('item_id', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        $items = $query->orderBy('created_at', 'desc')->get();

        $pdf = \PDF::loadView('pdf.items', [
            'items' => $items,
            'filters' => $request->only(['search', 'brand', 'model']),
        ]);

        return $pdf->download('items-list.pdf');
    }
}

