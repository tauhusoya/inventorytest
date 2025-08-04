<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Items List</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }
        .header p {
            margin: 5px 0 0 0;
            font-size: 14px;
            color: #666;
        }
        .filters {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
        .filters p {
            margin: 5px 0;
            font-size: 11px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
        }
        td {
            border: 1px solid #ddd;
            padding: 6px 8px;
            font-size: 10px;
        }
        .quantity-badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .quantity-red {
            background-color: #fee;
            color: #c53030;
        }
        .quantity-yellow {
            background-color: #fffbeb;
            color: #d69e2e;
        }
        .quantity-green {
            background-color: #f0fff4;
            color: #38a169;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .summary {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #e8f5e8;
            border-radius: 5px;
        }
        .summary p {
            margin: 5px 0;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Items Inventory List</h1>
        <p>Generated on: {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>

    @if(!empty($filters['search']) || !empty($filters['brand']) || !empty($filters['model']))
    <div class="filters">
        <p><strong>Applied Filters:</strong></p>
        @if(!empty($filters['search']))
            <p>Search: "{{ $filters['search'] }}"</p>
        @endif
        @if(!empty($filters['brand']))
            <p>Brand: {{ $filters['brand'] }}</p>
        @endif
        @if(!empty($filters['model']))
            <p>Model: {{ $filters['model'] }}</p>
        @endif
    </div>
    @endif

    <div class="summary">
        <p><strong>Summary:</strong></p>
        <p>Total Items: {{ $items->count() }}</p>
        <p>Total Value: RM {{ number_format($items->sum('cost'), 2) }}</p>
        <p>Low Stock Items (≤10): {{ $items->where('quantity', '<=', 10)->count() }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Cost (RM)</th>
                <th>Retail (RM)</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $item)
            <tr>
                <td>{{ $item->item_id }}</td>
                <td>{{ $item->name }}</td>
                <td>{{ Str::limit($item->description, 50) }}</td>
                <td>{{ $item->brand }}</td>
                <td>{{ $item->model }}</td>
                <td>{{ number_format($item->cost, 2) }}</td>
                <td>{{ number_format($item->retail, 2) }}</td>
                <td>
                    <span class="quantity-badge 
                        @if($item->quantity == 0) quantity-red
                        @elseif($item->quantity <= 10) quantity-yellow
                        @else quantity-green
                        @endif">
                        {{ $item->quantity }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px;">
                    No items found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>This report was generated from the Inventory Management System</p>
        <p>Generated on: {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>
</body>
</html> 