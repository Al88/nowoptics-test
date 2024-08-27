<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Events\ItemUpdated;
class ItemController extends Controller
{
    public function index()
    {
        return Item::all();
    }

    public function store(Request $request)
    {
        $item = Item::create($request->all());
        event(new ItemUpdated('created'));
        return response()->json($item, 201);
    }

    public function show(Item $item)
    {
        return $item;
    }

    public function update(Request $request, Item $item)
    {
        $item->update($request->all());
        broadcast(new ItemUpdated('updated'));
        return response()->json($item, 200);
    }

    public function destroy(Item $item)
    {
        $item->delete();
        broadcast(new ItemUpdated('deleted'));
        return response()->json(null, 204);
    }
}

