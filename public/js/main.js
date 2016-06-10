
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(rootX, rootY)
{
	var stack = [{ x: rootX, y: rootY }];
	while (stack.length > 0)
	{
		var front = stack.pop();
		var x = front.x;
		var y = front.y;
		if (x === y)
		{
			continue;
		}
		if (typeof x === 'object')
		{
			var c = 0;
			for (var key in x)
			{
				++c;
				if (!(key in y))
				{
					return false;
				}
				if (key === 'ctor')
				{
					continue;
				}
				stack.push({ x: x[key], y: y[key] });
			}
			if ('ctor' in x)
			{
				stack.push({ x: x.ctor, y: y.ctor});
			}
			if (c !== Object.keys(y).length)
			{
				return false;
			}
		}
		else if (typeof x === 'function')
		{
			throw new Error('Equality error: general function equality is ' +
							'undecidable, and therefore, unsupported');
		}
		else
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	var ord;
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}
	else if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b
			? EQ
			: a < b
				? LT
				: GT;
	}
	else if (x.ctor === '::' || x.ctor === '[]')
	{
		while (true)
		{
			if (x.ctor === '[]' && y.ctor === '[]')
			{
				return EQ;
			}
			if (x.ctor !== y.ctor)
			{
				return x.ctor === '[]' ? LT : GT;
			}
			ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
	}
	else if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}
	else
	{
		throw new Error('Comparison error: comparison is only defined on ints, ' +
						'floats, times, chars, strings, lists of comparable values, ' +
						'and tuples of comparable values.');
	}
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};
	for (var key in oldRecord)
	{
		var value = (key in updatedFields) ? updatedFields[key] : oldRecord[key];
		newRecord[key] = value;
	}
	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		var name = v.func ? v.func.name : v.name;
		return '<function' + (name === '' ? '' : ':') + name + '>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin' || v.ctor === 'Set_elm_builtin')
		{
			var name, list;
			if (v.ctor === 'Set_elm_builtin')
			{
				name = 'Set';
				list = A2(
					_elm_lang$core$List$map,
					function(x) {return x._0; },
					_elm_lang$core$Dict$toList(v._0)
				);
			}
			else
			{
				name = 'Dict';
				list = _elm_lang$core$Dict$toList(v);
			}
			return name + '.fromList ' + toString(list);
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p0) {
		var _p1 = _p0;
		return A2(f, _p1._0, _p1._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$snd = function (_p2) {
	var _p3 = _p2;
	return _p3._1;
};
var _elm_lang$core$Basics$fst = function (_p4) {
	var _p5 = _p4;
	return _p5._0;
};
var _elm_lang$core$Basics$always = F2(
	function (a, _p6) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$Never = function (a) {
	return {ctor: 'Never', _0: a};
};

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$oneOf = function (maybes) {
	oneOf:
	while (true) {
		var _p1 = maybes;
		if (_p1.ctor === '[]') {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var _p3 = _p1._0;
			var _p2 = _p3;
			if (_p2.ctor === 'Nothing') {
				var _v3 = _p1._1;
				maybes = _v3;
				continue oneOf;
			} else {
				return _p3;
			}
		}
	}
};
var _elm_lang$core$Maybe$andThen = F2(
	function (maybeValue, callback) {
		var _p4 = maybeValue;
		if (_p4.ctor === 'Just') {
			return callback(_p4._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p5 = maybe;
		if (_p5.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p5._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p6 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p6.ctor === '_Tuple2') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p6._0._0, _p6._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p7 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p7.ctor === '_Tuple3') && (_p7._0.ctor === 'Just')) && (_p7._1.ctor === 'Just')) && (_p7._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p7._0._0, _p7._1._0, _p7._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p8 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p8.ctor === '_Tuple4') && (_p8._0.ctor === 'Just')) && (_p8._1.ctor === 'Just')) && (_p8._2.ctor === 'Just')) && (_p8._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p8._0._0, _p8._1._0, _p8._2._0, _p8._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p9 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p9.ctor === '_Tuple5') && (_p9._0.ctor === 'Just')) && (_p9._1.ctor === 'Just')) && (_p9._2.ctor === 'Just')) && (_p9._3.ctor === 'Just')) && (_p9._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p9._0._0, _p9._1._0, _p9._2._0, _p9._3._0, _p9._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}


function range(lo, hi)
{
	var list = Nil;
	if (lo <= hi)
	{
		do
		{
			list = Cons(hi, list);
		}
		while (hi-- > lo);
	}
	return list;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,
	range: range,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return _elm_lang$core$Basics$not(
			A2(
				_elm_lang$core$List$any,
				function (_p2) {
					return _elm_lang$core$Basics$not(
						isOkay(_p2));
				},
				list));
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			_elm_lang$core$Native_List.range(
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						_elm_lang$core$List_ops['::'],
						f(x),
						acc);
				}),
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (x, xs$) {
				return pred(x) ? A2(_elm_lang$core$List_ops['::'], x, xs$) : xs$;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return A2(_elm_lang$core$List_ops['::'], _p10._0, xs);
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return A2(_elm_lang$core$List_ops['::'], x, y);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return A2(
						_elm_lang$core$List_ops['::'],
						A2(f, x, _p11._0),
						accAcc);
				} else {
					return _elm_lang$core$Native_List.fromArray(
						[]);
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				_elm_lang$core$Native_List.fromArray(
					[b]),
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return A2(_elm_lang$core$List_ops['::'], x, y);
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		_elm_lang$core$Native_List.fromArray(
			[]),
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: A2(_elm_lang$core$List_ops['::'], x, _p16),
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: A2(_elm_lang$core$List_ops['::'], x, _p15)
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_List.fromArray(
					[]),
				_1: _elm_lang$core$Native_List.fromArray(
					[])
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: A2(_elm_lang$core$List_ops['::'], _p19._0, _p20._0),
				_1: A2(_elm_lang$core$List_ops['::'], _p19._1, _p20._1)
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_List.fromArray(
				[]),
			_1: _elm_lang$core$Native_List.fromArray(
				[])
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		} else {
			var step = F2(
				function (x, rest) {
					return A2(
						_elm_lang$core$List_ops['::'],
						sep,
						A2(_elm_lang$core$List_ops['::'], x, rest));
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_p21._1);
			return A2(_elm_lang$core$List_ops['::'], _p21._0, spersed);
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		} else {
			var _p22 = list;
			if (_p22.ctor === '[]') {
				return list;
			} else {
				return A2(
					_elm_lang$core$List_ops['::'],
					_p22._0,
					A2(_elm_lang$core$List$take, n - 1, _p22._1));
			}
		}
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v23 = A2(_elm_lang$core$List_ops['::'], value, result),
					_v24 = n - 1,
					_v25 = value;
				result = _v23;
				n = _v24;
				value = _v25;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			_elm_lang$core$Native_List.fromArray(
				[]),
			n,
			value);
	});

var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		_elm_lang$core$Native_List.range(
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(task, callback)
{
	return {
		ctor: '_Task_andThen',
		task: task,
		callback: callback
	};
}

function onError(task, callback)
{
	return {
		ctor: '_Task_onError',
		task: task,
		callback: callback
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		numSteps = step(numSteps, process);
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function addPublicModule(object, name, main)
{
	var init = main ? makeEmbed(name, main) : mainIsUndefined(name);

	object['worker'] = function worker(flags)
	{
		return init(undefined, flags, false);
	}

	object['embed'] = function embed(domNode, flags)
	{
		return init(domNode, flags, true);
	}

	object['fullscreen'] = function fullscreen(flags)
	{
		return init(document.body, flags, true);
	};
}


// PROGRAM FAIL

function mainIsUndefined(name)
{
	return function(domNode)
	{
		var message = 'Cannot initialize module `' + name +
			'` because it has no `main` value!\nWhat should I show on screen?';
		domNode.innerHTML = errorHtml(message);
		throw new Error(message);
	};
}

function errorHtml(message)
{
	return '<div style="padding-left:1em;">'
		+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
		+ '<pre style="padding-left:1em;">' + message + '</pre>'
		+ '</div>';
}


// PROGRAM SUCCESS

function makeEmbed(moduleName, main)
{
	return function embed(rootDomNode, flags, withRenderer)
	{
		try
		{
			var program = mainToProgram(moduleName, main);
			if (!withRenderer)
			{
				program.renderer = dummyRenderer;
			}
			return makeEmbedHelp(moduleName, program, rootDomNode, flags);
		}
		catch (e)
		{
			rootDomNode.innerHTML = errorHtml(e.message);
			throw e;
		}
	};
}

function dummyRenderer()
{
	return { update: function() {} };
}


// MAIN TO PROGRAM

function mainToProgram(moduleName, wrappedMain)
{
	var main = wrappedMain.main;

	if (typeof main.init === 'undefined')
	{
		var emptyBag = batch(_elm_lang$core$Native_List.Nil);
		var noChange = _elm_lang$core$Native_Utils.Tuple2(
			_elm_lang$core$Native_Utils.Tuple0,
			emptyBag
		);

		return _elm_lang$virtual_dom$VirtualDom$programWithFlags({
			init: function() { return noChange; },
			view: function() { return main; },
			update: F2(function() { return noChange; }),
			subscriptions: function () { return emptyBag; }
		});
	}

	var flags = wrappedMain.flags;
	var init = flags
		? initWithFlags(moduleName, main.init, flags)
		: initWithoutFlags(moduleName, main.init);

	return _elm_lang$virtual_dom$VirtualDom$programWithFlags({
		init: init,
		view: main.view,
		update: main.update,
		subscriptions: main.subscriptions,
	});
}

function initWithoutFlags(moduleName, realInit)
{
	return function init(flags)
	{
		if (typeof flags !== 'undefined')
		{
			throw new Error(
				'You are giving module `' + moduleName + '` an argument in JavaScript.\n'
				+ 'This module does not take arguments though! You probably need to change the\n'
				+ 'initialization code to something like `Elm.' + moduleName + '.fullscreen()`'
			);
		}
		return realInit();
	};
}

function initWithFlags(moduleName, realInit, flagDecoder)
{
	return function init(flags)
	{
		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Err')
		{
			throw new Error(
				'You are trying to initialize module `' + moduleName + '` with an unexpected argument.\n'
				+ 'When trying to convert it to a usable Elm value, I run into this problem:\n\n'
				+ result._0
			);
		}
		return realInit(result._0);
	};
}


// SETUP RUNTIME SYSTEM

function makeEmbedHelp(moduleName, program, rootDomNode, flags)
{
	var init = program.init;
	var update = program.update;
	var subscriptions = program.subscriptions;
	var view = program.view;
	var makeRenderer = program.renderer;

	// ambient state
	var managers = {};
	var renderer;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var results = init(flags);
		var model = results._0;
		renderer = makeRenderer(rootDomNode, enqueue, view(model));
		var cmds = results._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			renderer.update(view(model));
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, handleMsg, loop);
	}

	var task = A2(andThen, init, loop);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			var value = converter(cmdList._0);
			for (var i = 0; i < subs.length; i++)
			{
				subs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function send(value)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, value);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		var value = result._0;
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	mainToProgram: mainToProgram,
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,
	addPublicModule: addPublicModule,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();
var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	_elm_lang$core$Native_List.fromArray(
		[]));
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (result, callback) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$formatError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;
	var i = 0;
	var is = [];
	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}
	return _elm_lang$core$Native_List.fromArray(is);
}

function toInt(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
		start = 1;
	}
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
	}
	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function toFloat(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
		}
		start = 1;
	}
	var dotCount = 0;
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if ('0' <= c && c <= '9')
		{
			continue;
		}
		if (c === '.')
		{
			dotCount += 1;
			if (dotCount <= 1)
			{
				continue;
			}
		}
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	return _elm_lang$core$Result$Ok(parseFloat(s));
}

function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();
var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(_elm_lang$core$List_ops['::'], key, keyList);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2(_elm_lang$core$List_ops['::'], value, valueList);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					_elm_lang$core$List_ops['::'],
					{ctor: '_Tuple2', _0: key, _1: value},
					list);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				var _p3 = _p2;
				var _p9 = _p3._1;
				var _p8 = _p3._0;
				var _p4 = _p8;
				if (_p4.ctor === '[]') {
					return {
						ctor: '_Tuple2',
						_0: _p8,
						_1: A3(rightStep, rKey, rValue, _p9)
					};
				} else {
					var _p7 = _p4._1;
					var _p6 = _p4._0._1;
					var _p5 = _p4._0._0;
					return (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) ? {
						ctor: '_Tuple2',
						_0: _p7,
						_1: A3(leftStep, _p5, _p6, _p9)
					} : ((_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) ? {
						ctor: '_Tuple2',
						_0: _p8,
						_1: A3(rightStep, rKey, rValue, _p9)
					} : {
						ctor: '_Tuple2',
						_0: _p7,
						_1: A4(bothStep, _p5, _p6, rValue, _p9)
					});
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				_elm_lang$core$Native_List.fromArray(
					[
						'Internal red-black tree invariant violated, expected ',
						msg,
						' and got ',
						_elm_lang$core$Basics$toString(c),
						'/',
						lgot,
						'/',
						rgot,
						'\nPlease report this bug to <https://github.com/elm-lang/core/issues>'
					])));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v11_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v11_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v11_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v13 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v14 = _p14._3;
				n = _v13;
				dict = _v14;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v17 = targetKey,
							_v18 = _p15._3;
						targetKey = _v17;
						dict = _v18;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v19 = targetKey,
							_v20 = _p15._4;
						targetKey = _v19;
						dict = _v20;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v23 = _p18._1,
					_v24 = _p18._2,
					_v25 = _p18._4;
				k = _v23;
				v = _v24;
				r = _v25;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v33_6:
	do {
		_v33_5:
		do {
			_v33_4:
			do {
				_v33_3:
				do {
					_v33_2:
					do {
						_v33_1:
						do {
							_v33_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v33_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v33_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v33_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v33_3;
																		} else {
																			break _v33_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v33_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v33_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v33_4;
																	} else {
																		break _v33_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v33_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v33_1;
																} else {
																	break _v33_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v33_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v33_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v33_5;
																	} else {
																		break _v33_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v33_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v33_5;
																	} else {
																		break _v33_6;
																	}
																}
															} else {
																break _v33_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v33_5;
															} else {
																break _v33_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v33_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v33_3;
																} else {
																	break _v33_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v33_4;
															} else {
																break _v33_6;
															}
														default:
															break _v33_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v33_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v33_1;
														} else {
															break _v33_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v33_5;
													} else {
														break _v33_6;
													}
												default:
													break _v33_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v33_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v33_3;
														} else {
															break _v33_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v33_4;
													} else {
														break _v33_6;
													}
												default:
													break _v33_6;
											}
										} else {
											break _v33_6;
										}
									}
								} else {
									break _v33_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (c, l, r) {
		var _p29 = {ctor: '_Tuple2', _0: l, _1: r};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = c;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: c, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						c,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: c, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						c,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var l$ = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, c, k, v, l$, r);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	_elm_lang$core$Native_List.fromArray(
		[]));
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function decodeObject(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function decodeTuple(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'tuple',
		func: f,
		decoders: decoders
	};
}

function andThen(decoder, callback)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function customAndThen(decoder, callback)
{
	return {
		ctor: '<decoder>',
		tag: 'customAndThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function decodeObject1(f, d1)
{
	return decodeObject(f, [d1]);
}

function decodeObject2(f, d1, d2)
{
	return decodeObject(f, [d1, d2]);
}

function decodeObject3(f, d1, d2, d3)
{
	return decodeObject(f, [d1, d2, d3]);
}

function decodeObject4(f, d1, d2, d3, d4)
{
	return decodeObject(f, [d1, d2, d3, d4]);
}

function decodeObject5(f, d1, d2, d3, d4, d5)
{
	return decodeObject(f, [d1, d2, d3, d4, d5]);
}

function decodeObject6(f, d1, d2, d3, d4, d5, d6)
{
	return decodeObject(f, [d1, d2, d3, d4, d5, d6]);
}

function decodeObject7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return decodeObject(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function decodeObject8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return decodeObject(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODING TUPLES

function decodeTuple1(f, d1)
{
	return decodeTuple(f, [d1]);
}

function decodeTuple2(f, d1, d2)
{
	return decodeTuple(f, [d1, d2]);
}

function decodeTuple3(f, d1, d2, d3)
{
	return decodeTuple(f, [d1, d2, d3]);
}

function decodeTuple4(f, d1, d2, d3, d4)
{
	return decodeTuple(f, [d1, d2, d3, d4]);
}

function decodeTuple5(f, d1, d2, d3, d4, d5)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5]);
}

function decodeTuple6(f, d1, d2, d3, d4, d5, d6)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5, d6]);
}

function decodeTuple7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function decodeTuple8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok')
				? result
				: badField(field, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'tuple':
			var decoders = decoder.decoders;
			var len = decoders.length;

			if ( !(value instanceof Array) || value.length !== len )
			{
				return badPrimitive('a Tuple with ' + len + ' entries', value);
			}

			var answer = decoder.func;
			for (var i = 0; i < len; i++)
			{
				var result = runHelp(decoders[i], value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'customAndThen':
			var result = runHelp(decoder.decoder, value);
			if (result.tag !== 'ok')
			{
				return result;
			}
			var realResult = decoder.callback(result.value);
			if (realResult.ctor === 'Err')
			{
				return badPrimitive('something custom', value);
			}
			return ok(realResult._0);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'map-many':
		case 'tuple':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
		case 'customAndThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),

	decodeObject1: F2(decodeObject1),
	decodeObject2: F3(decodeObject2),
	decodeObject3: F4(decodeObject3),
	decodeObject4: F5(decodeObject4),
	decodeObject5: F6(decodeObject5),
	decodeObject6: F7(decodeObject6),
	decodeObject7: F8(decodeObject7),
	decodeObject8: F9(decodeObject8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	decodeTuple1: F2(decodeTuple1),
	decodeTuple2: F3(decodeTuple2),
	decodeTuple3: F4(decodeTuple3),
	decodeTuple4: F5(decodeTuple4),
	decodeTuple5: F6(decodeTuple5),
	decodeTuple6: F7(decodeTuple6),
	decodeTuple7: F8(decodeTuple7),
	decodeTuple8: F9(decodeTuple8),

	andThen: F2(andThen),
	customAndThen: F2(customAndThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$tuple8 = _elm_lang$core$Native_Json.decodeTuple8;
var _elm_lang$core$Json_Decode$tuple7 = _elm_lang$core$Native_Json.decodeTuple7;
var _elm_lang$core$Json_Decode$tuple6 = _elm_lang$core$Native_Json.decodeTuple6;
var _elm_lang$core$Json_Decode$tuple5 = _elm_lang$core$Native_Json.decodeTuple5;
var _elm_lang$core$Json_Decode$tuple4 = _elm_lang$core$Native_Json.decodeTuple4;
var _elm_lang$core$Json_Decode$tuple3 = _elm_lang$core$Native_Json.decodeTuple3;
var _elm_lang$core$Json_Decode$tuple2 = _elm_lang$core$Native_Json.decodeTuple2;
var _elm_lang$core$Json_Decode$tuple1 = _elm_lang$core$Native_Json.decodeTuple1;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$customDecoder = _elm_lang$core$Native_Json.customAndThen;
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$object8 = _elm_lang$core$Native_Json.decodeObject8;
var _elm_lang$core$Json_Decode$object7 = _elm_lang$core$Native_Json.decodeObject7;
var _elm_lang$core$Json_Decode$object6 = _elm_lang$core$Native_Json.decodeObject6;
var _elm_lang$core$Json_Decode$object5 = _elm_lang$core$Native_Json.decodeObject5;
var _elm_lang$core$Json_Decode$object4 = _elm_lang$core$Native_Json.decodeObject4;
var _elm_lang$core$Json_Decode$object3 = _elm_lang$core$Native_Json.decodeObject3;
var _elm_lang$core$Json_Decode$object2 = _elm_lang$core$Native_Json.decodeObject2;
var _elm_lang$core$Json_Decode$object1 = _elm_lang$core$Native_Json.decodeObject1;
var _elm_lang$core$Json_Decode_ops = _elm_lang$core$Json_Decode_ops || {};
_elm_lang$core$Json_Decode_ops[':='] = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Json_Decode_ops[':='], x, y);
				}),
			decoder,
			fields);
	});
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.decodeObject1;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

//import Native.Json //

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';



////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: null
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (!a.options === b.options)
	{
		if (a.stopPropagation !== b.stopPropagation || a.preventDefault !== b.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}



////////////  RENDERER  ////////////


function renderer(parent, tagger, initialVirtualNode)
{
	var eventNode = { tagger: tagger, parent: null };

	var domNode = render(initialVirtualNode, eventNode);
	parent.appendChild(domNode);

	var state = 'NO_REQUEST';
	var currentVirtualNode = initialVirtualNode;
	var nextVirtualNode = initialVirtualNode;

	function registerVirtualNode(vNode)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextVirtualNode = vNode;
	}

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/core/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var patches = diff(currentVirtualNode, nextVirtualNode);
				domNode = applyPatches(domNode, currentVirtualNode, patches, eventNode);
				currentVirtualNode = nextVirtualNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return { update: registerVirtualNode };
}


var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(cb) { setTimeout(cb, 1000 / 60); };



////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;
		
			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}
            
			var subEventRoot = {
				tagger: tagger,
				parent: eventNode
			};
			
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return document.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? document.createElementNS(vNode.namespace, vNode.tag)
				: document.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
				{
					message = tagger(message);
				}
				else
				{
					for (var i = tagger.length; i--; )
					{
						message = tagger[i](message);
					}
				}
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: null,
		eventNode: null
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-insert', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;
            
			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}
            
			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return redraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			domNode.elm_event_node_ref.tagger = patch.data;
			return domNode;

		case 'p-remove':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-insert':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function redraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}



////////////  PROGRAMS  ////////////


function programWithFlags(details)
{
	return {
		init: details.init,
		update: details.update,
		subscriptions: details.subscriptions,
		view: details.view,
		renderer: renderer
	};
}


return {
	node: node,
	text: text,

	custom: custom,

	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),

	programWithFlags: programWithFlags
};

}();
var _elm_lang$virtual_dom$VirtualDom$programWithFlags = _elm_lang$virtual_dom$Native_VirtualDom.programWithFlags;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main$ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$svg = _elm_lang$html$Html$node('svg');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_App$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html_App$program = function (app) {
	return _elm_lang$html$Html_App$programWithFlags(
		_elm_lang$core$Native_Utils.update(
			app,
			{
				init: function (_p0) {
					return app.init;
				}
			}));
};
var _elm_lang$html$Html_App$beginnerProgram = function (_p1) {
	var _p2 = _p1;
	return _elm_lang$html$Html_App$programWithFlags(
		{
			init: function (_p3) {
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_p2.model,
					_elm_lang$core$Native_List.fromArray(
						[]));
			},
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p2.update, msg, model),
						_elm_lang$core$Native_List.fromArray(
							[]));
				}),
			view: _p2.view,
			subscriptions: function (_p4) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html_App$map = _elm_lang$virtual_dom$VirtualDom$map;

var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'charset', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type$ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$autosave = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'autosave', value);
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'maxLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'form', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'media', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'colSpan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'rowSpan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$fst,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Basics$snd, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode_ops[':='], 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	_elm_lang$core$Native_List.fromArray(
		['target', 'checked']),
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	_elm_lang$core$Native_List.fromArray(
		['target', 'value']),
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

var _elm_lang$svg$Svg$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$svg$Svg$svgNamespace = A2(
	_elm_lang$virtual_dom$VirtualDom$property,
	'namespace',
	_elm_lang$core$Json_Encode$string('http://www.w3.org/2000/svg'));
var _elm_lang$svg$Svg$node = F3(
	function (name, attributes, children) {
		return A3(
			_elm_lang$virtual_dom$VirtualDom$node,
			name,
			A2(_elm_lang$core$List_ops['::'], _elm_lang$svg$Svg$svgNamespace, attributes),
			children);
	});
var _elm_lang$svg$Svg$svg = _elm_lang$svg$Svg$node('svg');
var _elm_lang$svg$Svg$foreignObject = _elm_lang$svg$Svg$node('foreignObject');
var _elm_lang$svg$Svg$animate = _elm_lang$svg$Svg$node('animate');
var _elm_lang$svg$Svg$animateColor = _elm_lang$svg$Svg$node('animateColor');
var _elm_lang$svg$Svg$animateMotion = _elm_lang$svg$Svg$node('animateMotion');
var _elm_lang$svg$Svg$animateTransform = _elm_lang$svg$Svg$node('animateTransform');
var _elm_lang$svg$Svg$mpath = _elm_lang$svg$Svg$node('mpath');
var _elm_lang$svg$Svg$set = _elm_lang$svg$Svg$node('set');
var _elm_lang$svg$Svg$a = _elm_lang$svg$Svg$node('a');
var _elm_lang$svg$Svg$defs = _elm_lang$svg$Svg$node('defs');
var _elm_lang$svg$Svg$g = _elm_lang$svg$Svg$node('g');
var _elm_lang$svg$Svg$marker = _elm_lang$svg$Svg$node('marker');
var _elm_lang$svg$Svg$mask = _elm_lang$svg$Svg$node('mask');
var _elm_lang$svg$Svg$missingGlyph = _elm_lang$svg$Svg$node('missingGlyph');
var _elm_lang$svg$Svg$pattern = _elm_lang$svg$Svg$node('pattern');
var _elm_lang$svg$Svg$switch = _elm_lang$svg$Svg$node('switch');
var _elm_lang$svg$Svg$symbol = _elm_lang$svg$Svg$node('symbol');
var _elm_lang$svg$Svg$desc = _elm_lang$svg$Svg$node('desc');
var _elm_lang$svg$Svg$metadata = _elm_lang$svg$Svg$node('metadata');
var _elm_lang$svg$Svg$title = _elm_lang$svg$Svg$node('title');
var _elm_lang$svg$Svg$feBlend = _elm_lang$svg$Svg$node('feBlend');
var _elm_lang$svg$Svg$feColorMatrix = _elm_lang$svg$Svg$node('feColorMatrix');
var _elm_lang$svg$Svg$feComponentTransfer = _elm_lang$svg$Svg$node('feComponentTransfer');
var _elm_lang$svg$Svg$feComposite = _elm_lang$svg$Svg$node('feComposite');
var _elm_lang$svg$Svg$feConvolveMatrix = _elm_lang$svg$Svg$node('feConvolveMatrix');
var _elm_lang$svg$Svg$feDiffuseLighting = _elm_lang$svg$Svg$node('feDiffuseLighting');
var _elm_lang$svg$Svg$feDisplacementMap = _elm_lang$svg$Svg$node('feDisplacementMap');
var _elm_lang$svg$Svg$feFlood = _elm_lang$svg$Svg$node('feFlood');
var _elm_lang$svg$Svg$feFuncA = _elm_lang$svg$Svg$node('feFuncA');
var _elm_lang$svg$Svg$feFuncB = _elm_lang$svg$Svg$node('feFuncB');
var _elm_lang$svg$Svg$feFuncG = _elm_lang$svg$Svg$node('feFuncG');
var _elm_lang$svg$Svg$feFuncR = _elm_lang$svg$Svg$node('feFuncR');
var _elm_lang$svg$Svg$feGaussianBlur = _elm_lang$svg$Svg$node('feGaussianBlur');
var _elm_lang$svg$Svg$feImage = _elm_lang$svg$Svg$node('feImage');
var _elm_lang$svg$Svg$feMerge = _elm_lang$svg$Svg$node('feMerge');
var _elm_lang$svg$Svg$feMergeNode = _elm_lang$svg$Svg$node('feMergeNode');
var _elm_lang$svg$Svg$feMorphology = _elm_lang$svg$Svg$node('feMorphology');
var _elm_lang$svg$Svg$feOffset = _elm_lang$svg$Svg$node('feOffset');
var _elm_lang$svg$Svg$feSpecularLighting = _elm_lang$svg$Svg$node('feSpecularLighting');
var _elm_lang$svg$Svg$feTile = _elm_lang$svg$Svg$node('feTile');
var _elm_lang$svg$Svg$feTurbulence = _elm_lang$svg$Svg$node('feTurbulence');
var _elm_lang$svg$Svg$font = _elm_lang$svg$Svg$node('font');
var _elm_lang$svg$Svg$fontFace = _elm_lang$svg$Svg$node('fontFace');
var _elm_lang$svg$Svg$fontFaceFormat = _elm_lang$svg$Svg$node('fontFaceFormat');
var _elm_lang$svg$Svg$fontFaceName = _elm_lang$svg$Svg$node('fontFaceName');
var _elm_lang$svg$Svg$fontFaceSrc = _elm_lang$svg$Svg$node('fontFaceSrc');
var _elm_lang$svg$Svg$fontFaceUri = _elm_lang$svg$Svg$node('fontFaceUri');
var _elm_lang$svg$Svg$hkern = _elm_lang$svg$Svg$node('hkern');
var _elm_lang$svg$Svg$vkern = _elm_lang$svg$Svg$node('vkern');
var _elm_lang$svg$Svg$linearGradient = _elm_lang$svg$Svg$node('linearGradient');
var _elm_lang$svg$Svg$radialGradient = _elm_lang$svg$Svg$node('radialGradient');
var _elm_lang$svg$Svg$stop = _elm_lang$svg$Svg$node('stop');
var _elm_lang$svg$Svg$circle = _elm_lang$svg$Svg$node('circle');
var _elm_lang$svg$Svg$ellipse = _elm_lang$svg$Svg$node('ellipse');
var _elm_lang$svg$Svg$image = _elm_lang$svg$Svg$node('image');
var _elm_lang$svg$Svg$line = _elm_lang$svg$Svg$node('line');
var _elm_lang$svg$Svg$path = _elm_lang$svg$Svg$node('path');
var _elm_lang$svg$Svg$polygon = _elm_lang$svg$Svg$node('polygon');
var _elm_lang$svg$Svg$polyline = _elm_lang$svg$Svg$node('polyline');
var _elm_lang$svg$Svg$rect = _elm_lang$svg$Svg$node('rect');
var _elm_lang$svg$Svg$use = _elm_lang$svg$Svg$node('use');
var _elm_lang$svg$Svg$feDistantLight = _elm_lang$svg$Svg$node('feDistantLight');
var _elm_lang$svg$Svg$fePointLight = _elm_lang$svg$Svg$node('fePointLight');
var _elm_lang$svg$Svg$feSpotLight = _elm_lang$svg$Svg$node('feSpotLight');
var _elm_lang$svg$Svg$altGlyph = _elm_lang$svg$Svg$node('altGlyph');
var _elm_lang$svg$Svg$altGlyphDef = _elm_lang$svg$Svg$node('altGlyphDef');
var _elm_lang$svg$Svg$altGlyphItem = _elm_lang$svg$Svg$node('altGlyphItem');
var _elm_lang$svg$Svg$glyph = _elm_lang$svg$Svg$node('glyph');
var _elm_lang$svg$Svg$glyphRef = _elm_lang$svg$Svg$node('glyphRef');
var _elm_lang$svg$Svg$textPath = _elm_lang$svg$Svg$node('textPath');
var _elm_lang$svg$Svg$text$ = _elm_lang$svg$Svg$node('text');
var _elm_lang$svg$Svg$tref = _elm_lang$svg$Svg$node('tref');
var _elm_lang$svg$Svg$tspan = _elm_lang$svg$Svg$node('tspan');
var _elm_lang$svg$Svg$clipPath = _elm_lang$svg$Svg$node('clipPath');
var _elm_lang$svg$Svg$colorProfile = _elm_lang$svg$Svg$node('colorProfile');
var _elm_lang$svg$Svg$cursor = _elm_lang$svg$Svg$node('cursor');
var _elm_lang$svg$Svg$filter = _elm_lang$svg$Svg$node('filter');
var _elm_lang$svg$Svg$script = _elm_lang$svg$Svg$node('script');
var _elm_lang$svg$Svg$style = _elm_lang$svg$Svg$node('style');
var _elm_lang$svg$Svg$view = _elm_lang$svg$Svg$node('view');

var _elm_lang$svg$Svg_Attributes$writingMode = _elm_lang$virtual_dom$VirtualDom$attribute('writing-mode');
var _elm_lang$svg$Svg_Attributes$wordSpacing = _elm_lang$virtual_dom$VirtualDom$attribute('word-spacing');
var _elm_lang$svg$Svg_Attributes$visibility = _elm_lang$virtual_dom$VirtualDom$attribute('visibility');
var _elm_lang$svg$Svg_Attributes$unicodeBidi = _elm_lang$virtual_dom$VirtualDom$attribute('unicode-bidi');
var _elm_lang$svg$Svg_Attributes$textRendering = _elm_lang$virtual_dom$VirtualDom$attribute('text-rendering');
var _elm_lang$svg$Svg_Attributes$textDecoration = _elm_lang$virtual_dom$VirtualDom$attribute('text-decoration');
var _elm_lang$svg$Svg_Attributes$textAnchor = _elm_lang$virtual_dom$VirtualDom$attribute('text-anchor');
var _elm_lang$svg$Svg_Attributes$stroke = _elm_lang$virtual_dom$VirtualDom$attribute('stroke');
var _elm_lang$svg$Svg_Attributes$strokeWidth = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-width');
var _elm_lang$svg$Svg_Attributes$strokeOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-opacity');
var _elm_lang$svg$Svg_Attributes$strokeMiterlimit = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-miterlimit');
var _elm_lang$svg$Svg_Attributes$strokeLinejoin = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-linejoin');
var _elm_lang$svg$Svg_Attributes$strokeLinecap = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-linecap');
var _elm_lang$svg$Svg_Attributes$strokeDashoffset = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-dashoffset');
var _elm_lang$svg$Svg_Attributes$strokeDasharray = _elm_lang$virtual_dom$VirtualDom$attribute('stroke-dasharray');
var _elm_lang$svg$Svg_Attributes$stopOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('stop-opacity');
var _elm_lang$svg$Svg_Attributes$stopColor = _elm_lang$virtual_dom$VirtualDom$attribute('stop-color');
var _elm_lang$svg$Svg_Attributes$shapeRendering = _elm_lang$virtual_dom$VirtualDom$attribute('shape-rendering');
var _elm_lang$svg$Svg_Attributes$pointerEvents = _elm_lang$virtual_dom$VirtualDom$attribute('pointer-events');
var _elm_lang$svg$Svg_Attributes$overflow = _elm_lang$virtual_dom$VirtualDom$attribute('overflow');
var _elm_lang$svg$Svg_Attributes$opacity = _elm_lang$virtual_dom$VirtualDom$attribute('opacity');
var _elm_lang$svg$Svg_Attributes$mask = _elm_lang$virtual_dom$VirtualDom$attribute('mask');
var _elm_lang$svg$Svg_Attributes$markerStart = _elm_lang$virtual_dom$VirtualDom$attribute('marker-start');
var _elm_lang$svg$Svg_Attributes$markerMid = _elm_lang$virtual_dom$VirtualDom$attribute('marker-mid');
var _elm_lang$svg$Svg_Attributes$markerEnd = _elm_lang$virtual_dom$VirtualDom$attribute('marker-end');
var _elm_lang$svg$Svg_Attributes$lightingColor = _elm_lang$virtual_dom$VirtualDom$attribute('lighting-color');
var _elm_lang$svg$Svg_Attributes$letterSpacing = _elm_lang$virtual_dom$VirtualDom$attribute('letter-spacing');
var _elm_lang$svg$Svg_Attributes$kerning = _elm_lang$virtual_dom$VirtualDom$attribute('kerning');
var _elm_lang$svg$Svg_Attributes$imageRendering = _elm_lang$virtual_dom$VirtualDom$attribute('image-rendering');
var _elm_lang$svg$Svg_Attributes$glyphOrientationVertical = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-orientation-vertical');
var _elm_lang$svg$Svg_Attributes$glyphOrientationHorizontal = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-orientation-horizontal');
var _elm_lang$svg$Svg_Attributes$fontWeight = _elm_lang$virtual_dom$VirtualDom$attribute('font-weight');
var _elm_lang$svg$Svg_Attributes$fontVariant = _elm_lang$virtual_dom$VirtualDom$attribute('font-variant');
var _elm_lang$svg$Svg_Attributes$fontStyle = _elm_lang$virtual_dom$VirtualDom$attribute('font-style');
var _elm_lang$svg$Svg_Attributes$fontStretch = _elm_lang$virtual_dom$VirtualDom$attribute('font-stretch');
var _elm_lang$svg$Svg_Attributes$fontSize = _elm_lang$virtual_dom$VirtualDom$attribute('font-size');
var _elm_lang$svg$Svg_Attributes$fontSizeAdjust = _elm_lang$virtual_dom$VirtualDom$attribute('font-size-adjust');
var _elm_lang$svg$Svg_Attributes$fontFamily = _elm_lang$virtual_dom$VirtualDom$attribute('font-family');
var _elm_lang$svg$Svg_Attributes$floodOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('flood-opacity');
var _elm_lang$svg$Svg_Attributes$floodColor = _elm_lang$virtual_dom$VirtualDom$attribute('flood-color');
var _elm_lang$svg$Svg_Attributes$filter = _elm_lang$virtual_dom$VirtualDom$attribute('filter');
var _elm_lang$svg$Svg_Attributes$fill = _elm_lang$virtual_dom$VirtualDom$attribute('fill');
var _elm_lang$svg$Svg_Attributes$fillRule = _elm_lang$virtual_dom$VirtualDom$attribute('fill-rule');
var _elm_lang$svg$Svg_Attributes$fillOpacity = _elm_lang$virtual_dom$VirtualDom$attribute('fill-opacity');
var _elm_lang$svg$Svg_Attributes$enableBackground = _elm_lang$virtual_dom$VirtualDom$attribute('enable-background');
var _elm_lang$svg$Svg_Attributes$dominantBaseline = _elm_lang$virtual_dom$VirtualDom$attribute('dominant-baseline');
var _elm_lang$svg$Svg_Attributes$display = _elm_lang$virtual_dom$VirtualDom$attribute('display');
var _elm_lang$svg$Svg_Attributes$direction = _elm_lang$virtual_dom$VirtualDom$attribute('direction');
var _elm_lang$svg$Svg_Attributes$cursor = _elm_lang$virtual_dom$VirtualDom$attribute('cursor');
var _elm_lang$svg$Svg_Attributes$color = _elm_lang$virtual_dom$VirtualDom$attribute('color');
var _elm_lang$svg$Svg_Attributes$colorRendering = _elm_lang$virtual_dom$VirtualDom$attribute('color-rendering');
var _elm_lang$svg$Svg_Attributes$colorProfile = _elm_lang$virtual_dom$VirtualDom$attribute('color-profile');
var _elm_lang$svg$Svg_Attributes$colorInterpolation = _elm_lang$virtual_dom$VirtualDom$attribute('color-interpolation');
var _elm_lang$svg$Svg_Attributes$colorInterpolationFilters = _elm_lang$virtual_dom$VirtualDom$attribute('color-interpolation-filters');
var _elm_lang$svg$Svg_Attributes$clip = _elm_lang$virtual_dom$VirtualDom$attribute('clip');
var _elm_lang$svg$Svg_Attributes$clipRule = _elm_lang$virtual_dom$VirtualDom$attribute('clip-rule');
var _elm_lang$svg$Svg_Attributes$clipPath = _elm_lang$virtual_dom$VirtualDom$attribute('clip-path');
var _elm_lang$svg$Svg_Attributes$baselineShift = _elm_lang$virtual_dom$VirtualDom$attribute('baseline-shift');
var _elm_lang$svg$Svg_Attributes$alignmentBaseline = _elm_lang$virtual_dom$VirtualDom$attribute('alignment-baseline');
var _elm_lang$svg$Svg_Attributes$zoomAndPan = _elm_lang$virtual_dom$VirtualDom$attribute('zoomAndPan');
var _elm_lang$svg$Svg_Attributes$z = _elm_lang$virtual_dom$VirtualDom$attribute('z');
var _elm_lang$svg$Svg_Attributes$yChannelSelector = _elm_lang$virtual_dom$VirtualDom$attribute('yChannelSelector');
var _elm_lang$svg$Svg_Attributes$y2 = _elm_lang$virtual_dom$VirtualDom$attribute('y2');
var _elm_lang$svg$Svg_Attributes$y1 = _elm_lang$virtual_dom$VirtualDom$attribute('y1');
var _elm_lang$svg$Svg_Attributes$y = _elm_lang$virtual_dom$VirtualDom$attribute('y');
var _elm_lang$svg$Svg_Attributes$xmlSpace = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:space');
var _elm_lang$svg$Svg_Attributes$xmlLang = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:lang');
var _elm_lang$svg$Svg_Attributes$xmlBase = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/XML/1998/namespace', 'xml:base');
var _elm_lang$svg$Svg_Attributes$xlinkType = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:type');
var _elm_lang$svg$Svg_Attributes$xlinkTitle = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:title');
var _elm_lang$svg$Svg_Attributes$xlinkShow = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:show');
var _elm_lang$svg$Svg_Attributes$xlinkRole = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:role');
var _elm_lang$svg$Svg_Attributes$xlinkHref = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:href');
var _elm_lang$svg$Svg_Attributes$xlinkArcrole = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:arcrole');
var _elm_lang$svg$Svg_Attributes$xlinkActuate = A2(_elm_lang$virtual_dom$VirtualDom$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:actuate');
var _elm_lang$svg$Svg_Attributes$xChannelSelector = _elm_lang$virtual_dom$VirtualDom$attribute('xChannelSelector');
var _elm_lang$svg$Svg_Attributes$x2 = _elm_lang$virtual_dom$VirtualDom$attribute('x2');
var _elm_lang$svg$Svg_Attributes$x1 = _elm_lang$virtual_dom$VirtualDom$attribute('x1');
var _elm_lang$svg$Svg_Attributes$xHeight = _elm_lang$virtual_dom$VirtualDom$attribute('x-height');
var _elm_lang$svg$Svg_Attributes$x = _elm_lang$virtual_dom$VirtualDom$attribute('x');
var _elm_lang$svg$Svg_Attributes$widths = _elm_lang$virtual_dom$VirtualDom$attribute('widths');
var _elm_lang$svg$Svg_Attributes$width = _elm_lang$virtual_dom$VirtualDom$attribute('width');
var _elm_lang$svg$Svg_Attributes$viewTarget = _elm_lang$virtual_dom$VirtualDom$attribute('viewTarget');
var _elm_lang$svg$Svg_Attributes$viewBox = _elm_lang$virtual_dom$VirtualDom$attribute('viewBox');
var _elm_lang$svg$Svg_Attributes$vertOriginY = _elm_lang$virtual_dom$VirtualDom$attribute('vert-origin-y');
var _elm_lang$svg$Svg_Attributes$vertOriginX = _elm_lang$virtual_dom$VirtualDom$attribute('vert-origin-x');
var _elm_lang$svg$Svg_Attributes$vertAdvY = _elm_lang$virtual_dom$VirtualDom$attribute('vert-adv-y');
var _elm_lang$svg$Svg_Attributes$version = _elm_lang$virtual_dom$VirtualDom$attribute('version');
var _elm_lang$svg$Svg_Attributes$values = _elm_lang$virtual_dom$VirtualDom$attribute('values');
var _elm_lang$svg$Svg_Attributes$vMathematical = _elm_lang$virtual_dom$VirtualDom$attribute('v-mathematical');
var _elm_lang$svg$Svg_Attributes$vIdeographic = _elm_lang$virtual_dom$VirtualDom$attribute('v-ideographic');
var _elm_lang$svg$Svg_Attributes$vHanging = _elm_lang$virtual_dom$VirtualDom$attribute('v-hanging');
var _elm_lang$svg$Svg_Attributes$vAlphabetic = _elm_lang$virtual_dom$VirtualDom$attribute('v-alphabetic');
var _elm_lang$svg$Svg_Attributes$unitsPerEm = _elm_lang$virtual_dom$VirtualDom$attribute('units-per-em');
var _elm_lang$svg$Svg_Attributes$unicodeRange = _elm_lang$virtual_dom$VirtualDom$attribute('unicode-range');
var _elm_lang$svg$Svg_Attributes$unicode = _elm_lang$virtual_dom$VirtualDom$attribute('unicode');
var _elm_lang$svg$Svg_Attributes$underlineThickness = _elm_lang$virtual_dom$VirtualDom$attribute('underline-thickness');
var _elm_lang$svg$Svg_Attributes$underlinePosition = _elm_lang$virtual_dom$VirtualDom$attribute('underline-position');
var _elm_lang$svg$Svg_Attributes$u2 = _elm_lang$virtual_dom$VirtualDom$attribute('u2');
var _elm_lang$svg$Svg_Attributes$u1 = _elm_lang$virtual_dom$VirtualDom$attribute('u1');
var _elm_lang$svg$Svg_Attributes$type$ = _elm_lang$virtual_dom$VirtualDom$attribute('type');
var _elm_lang$svg$Svg_Attributes$transform = _elm_lang$virtual_dom$VirtualDom$attribute('transform');
var _elm_lang$svg$Svg_Attributes$to = _elm_lang$virtual_dom$VirtualDom$attribute('to');
var _elm_lang$svg$Svg_Attributes$title = _elm_lang$virtual_dom$VirtualDom$attribute('title');
var _elm_lang$svg$Svg_Attributes$textLength = _elm_lang$virtual_dom$VirtualDom$attribute('textLength');
var _elm_lang$svg$Svg_Attributes$targetY = _elm_lang$virtual_dom$VirtualDom$attribute('targetY');
var _elm_lang$svg$Svg_Attributes$targetX = _elm_lang$virtual_dom$VirtualDom$attribute('targetX');
var _elm_lang$svg$Svg_Attributes$target = _elm_lang$virtual_dom$VirtualDom$attribute('target');
var _elm_lang$svg$Svg_Attributes$tableValues = _elm_lang$virtual_dom$VirtualDom$attribute('tableValues');
var _elm_lang$svg$Svg_Attributes$systemLanguage = _elm_lang$virtual_dom$VirtualDom$attribute('systemLanguage');
var _elm_lang$svg$Svg_Attributes$surfaceScale = _elm_lang$virtual_dom$VirtualDom$attribute('surfaceScale');
var _elm_lang$svg$Svg_Attributes$style = _elm_lang$virtual_dom$VirtualDom$attribute('style');
var _elm_lang$svg$Svg_Attributes$string = _elm_lang$virtual_dom$VirtualDom$attribute('string');
var _elm_lang$svg$Svg_Attributes$strikethroughThickness = _elm_lang$virtual_dom$VirtualDom$attribute('strikethrough-thickness');
var _elm_lang$svg$Svg_Attributes$strikethroughPosition = _elm_lang$virtual_dom$VirtualDom$attribute('strikethrough-position');
var _elm_lang$svg$Svg_Attributes$stitchTiles = _elm_lang$virtual_dom$VirtualDom$attribute('stitchTiles');
var _elm_lang$svg$Svg_Attributes$stemv = _elm_lang$virtual_dom$VirtualDom$attribute('stemv');
var _elm_lang$svg$Svg_Attributes$stemh = _elm_lang$virtual_dom$VirtualDom$attribute('stemh');
var _elm_lang$svg$Svg_Attributes$stdDeviation = _elm_lang$virtual_dom$VirtualDom$attribute('stdDeviation');
var _elm_lang$svg$Svg_Attributes$startOffset = _elm_lang$virtual_dom$VirtualDom$attribute('startOffset');
var _elm_lang$svg$Svg_Attributes$spreadMethod = _elm_lang$virtual_dom$VirtualDom$attribute('spreadMethod');
var _elm_lang$svg$Svg_Attributes$speed = _elm_lang$virtual_dom$VirtualDom$attribute('speed');
var _elm_lang$svg$Svg_Attributes$specularExponent = _elm_lang$virtual_dom$VirtualDom$attribute('specularExponent');
var _elm_lang$svg$Svg_Attributes$specularConstant = _elm_lang$virtual_dom$VirtualDom$attribute('specularConstant');
var _elm_lang$svg$Svg_Attributes$spacing = _elm_lang$virtual_dom$VirtualDom$attribute('spacing');
var _elm_lang$svg$Svg_Attributes$slope = _elm_lang$virtual_dom$VirtualDom$attribute('slope');
var _elm_lang$svg$Svg_Attributes$seed = _elm_lang$virtual_dom$VirtualDom$attribute('seed');
var _elm_lang$svg$Svg_Attributes$scale = _elm_lang$virtual_dom$VirtualDom$attribute('scale');
var _elm_lang$svg$Svg_Attributes$ry = _elm_lang$virtual_dom$VirtualDom$attribute('ry');
var _elm_lang$svg$Svg_Attributes$rx = _elm_lang$virtual_dom$VirtualDom$attribute('rx');
var _elm_lang$svg$Svg_Attributes$rotate = _elm_lang$virtual_dom$VirtualDom$attribute('rotate');
var _elm_lang$svg$Svg_Attributes$result = _elm_lang$virtual_dom$VirtualDom$attribute('result');
var _elm_lang$svg$Svg_Attributes$restart = _elm_lang$virtual_dom$VirtualDom$attribute('restart');
var _elm_lang$svg$Svg_Attributes$requiredFeatures = _elm_lang$virtual_dom$VirtualDom$attribute('requiredFeatures');
var _elm_lang$svg$Svg_Attributes$requiredExtensions = _elm_lang$virtual_dom$VirtualDom$attribute('requiredExtensions');
var _elm_lang$svg$Svg_Attributes$repeatDur = _elm_lang$virtual_dom$VirtualDom$attribute('repeatDur');
var _elm_lang$svg$Svg_Attributes$repeatCount = _elm_lang$virtual_dom$VirtualDom$attribute('repeatCount');
var _elm_lang$svg$Svg_Attributes$renderingIntent = _elm_lang$virtual_dom$VirtualDom$attribute('rendering-intent');
var _elm_lang$svg$Svg_Attributes$refY = _elm_lang$virtual_dom$VirtualDom$attribute('refY');
var _elm_lang$svg$Svg_Attributes$refX = _elm_lang$virtual_dom$VirtualDom$attribute('refX');
var _elm_lang$svg$Svg_Attributes$radius = _elm_lang$virtual_dom$VirtualDom$attribute('radius');
var _elm_lang$svg$Svg_Attributes$r = _elm_lang$virtual_dom$VirtualDom$attribute('r');
var _elm_lang$svg$Svg_Attributes$primitiveUnits = _elm_lang$virtual_dom$VirtualDom$attribute('primitiveUnits');
var _elm_lang$svg$Svg_Attributes$preserveAspectRatio = _elm_lang$virtual_dom$VirtualDom$attribute('preserveAspectRatio');
var _elm_lang$svg$Svg_Attributes$preserveAlpha = _elm_lang$virtual_dom$VirtualDom$attribute('preserveAlpha');
var _elm_lang$svg$Svg_Attributes$pointsAtZ = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtZ');
var _elm_lang$svg$Svg_Attributes$pointsAtY = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtY');
var _elm_lang$svg$Svg_Attributes$pointsAtX = _elm_lang$virtual_dom$VirtualDom$attribute('pointsAtX');
var _elm_lang$svg$Svg_Attributes$points = _elm_lang$virtual_dom$VirtualDom$attribute('points');
var _elm_lang$svg$Svg_Attributes$pointOrder = _elm_lang$virtual_dom$VirtualDom$attribute('point-order');
var _elm_lang$svg$Svg_Attributes$patternUnits = _elm_lang$virtual_dom$VirtualDom$attribute('patternUnits');
var _elm_lang$svg$Svg_Attributes$patternTransform = _elm_lang$virtual_dom$VirtualDom$attribute('patternTransform');
var _elm_lang$svg$Svg_Attributes$patternContentUnits = _elm_lang$virtual_dom$VirtualDom$attribute('patternContentUnits');
var _elm_lang$svg$Svg_Attributes$pathLength = _elm_lang$virtual_dom$VirtualDom$attribute('pathLength');
var _elm_lang$svg$Svg_Attributes$path = _elm_lang$virtual_dom$VirtualDom$attribute('path');
var _elm_lang$svg$Svg_Attributes$panose1 = _elm_lang$virtual_dom$VirtualDom$attribute('panose-1');
var _elm_lang$svg$Svg_Attributes$overlineThickness = _elm_lang$virtual_dom$VirtualDom$attribute('overline-thickness');
var _elm_lang$svg$Svg_Attributes$overlinePosition = _elm_lang$virtual_dom$VirtualDom$attribute('overline-position');
var _elm_lang$svg$Svg_Attributes$origin = _elm_lang$virtual_dom$VirtualDom$attribute('origin');
var _elm_lang$svg$Svg_Attributes$orientation = _elm_lang$virtual_dom$VirtualDom$attribute('orientation');
var _elm_lang$svg$Svg_Attributes$orient = _elm_lang$virtual_dom$VirtualDom$attribute('orient');
var _elm_lang$svg$Svg_Attributes$order = _elm_lang$virtual_dom$VirtualDom$attribute('order');
var _elm_lang$svg$Svg_Attributes$operator = _elm_lang$virtual_dom$VirtualDom$attribute('operator');
var _elm_lang$svg$Svg_Attributes$offset = _elm_lang$virtual_dom$VirtualDom$attribute('offset');
var _elm_lang$svg$Svg_Attributes$numOctaves = _elm_lang$virtual_dom$VirtualDom$attribute('numOctaves');
var _elm_lang$svg$Svg_Attributes$name = _elm_lang$virtual_dom$VirtualDom$attribute('name');
var _elm_lang$svg$Svg_Attributes$mode = _elm_lang$virtual_dom$VirtualDom$attribute('mode');
var _elm_lang$svg$Svg_Attributes$min = _elm_lang$virtual_dom$VirtualDom$attribute('min');
var _elm_lang$svg$Svg_Attributes$method = _elm_lang$virtual_dom$VirtualDom$attribute('method');
var _elm_lang$svg$Svg_Attributes$media = _elm_lang$virtual_dom$VirtualDom$attribute('media');
var _elm_lang$svg$Svg_Attributes$max = _elm_lang$virtual_dom$VirtualDom$attribute('max');
var _elm_lang$svg$Svg_Attributes$mathematical = _elm_lang$virtual_dom$VirtualDom$attribute('mathematical');
var _elm_lang$svg$Svg_Attributes$maskUnits = _elm_lang$virtual_dom$VirtualDom$attribute('maskUnits');
var _elm_lang$svg$Svg_Attributes$maskContentUnits = _elm_lang$virtual_dom$VirtualDom$attribute('maskContentUnits');
var _elm_lang$svg$Svg_Attributes$markerWidth = _elm_lang$virtual_dom$VirtualDom$attribute('markerWidth');
var _elm_lang$svg$Svg_Attributes$markerUnits = _elm_lang$virtual_dom$VirtualDom$attribute('markerUnits');
var _elm_lang$svg$Svg_Attributes$markerHeight = _elm_lang$virtual_dom$VirtualDom$attribute('markerHeight');
var _elm_lang$svg$Svg_Attributes$local = _elm_lang$virtual_dom$VirtualDom$attribute('local');
var _elm_lang$svg$Svg_Attributes$limitingConeAngle = _elm_lang$virtual_dom$VirtualDom$attribute('limitingConeAngle');
var _elm_lang$svg$Svg_Attributes$lengthAdjust = _elm_lang$virtual_dom$VirtualDom$attribute('lengthAdjust');
var _elm_lang$svg$Svg_Attributes$lang = _elm_lang$virtual_dom$VirtualDom$attribute('lang');
var _elm_lang$svg$Svg_Attributes$keyTimes = _elm_lang$virtual_dom$VirtualDom$attribute('keyTimes');
var _elm_lang$svg$Svg_Attributes$keySplines = _elm_lang$virtual_dom$VirtualDom$attribute('keySplines');
var _elm_lang$svg$Svg_Attributes$keyPoints = _elm_lang$virtual_dom$VirtualDom$attribute('keyPoints');
var _elm_lang$svg$Svg_Attributes$kernelUnitLength = _elm_lang$virtual_dom$VirtualDom$attribute('kernelUnitLength');
var _elm_lang$svg$Svg_Attributes$kernelMatrix = _elm_lang$virtual_dom$VirtualDom$attribute('kernelMatrix');
var _elm_lang$svg$Svg_Attributes$k4 = _elm_lang$virtual_dom$VirtualDom$attribute('k4');
var _elm_lang$svg$Svg_Attributes$k3 = _elm_lang$virtual_dom$VirtualDom$attribute('k3');
var _elm_lang$svg$Svg_Attributes$k2 = _elm_lang$virtual_dom$VirtualDom$attribute('k2');
var _elm_lang$svg$Svg_Attributes$k1 = _elm_lang$virtual_dom$VirtualDom$attribute('k1');
var _elm_lang$svg$Svg_Attributes$k = _elm_lang$virtual_dom$VirtualDom$attribute('k');
var _elm_lang$svg$Svg_Attributes$intercept = _elm_lang$virtual_dom$VirtualDom$attribute('intercept');
var _elm_lang$svg$Svg_Attributes$in2 = _elm_lang$virtual_dom$VirtualDom$attribute('in2');
var _elm_lang$svg$Svg_Attributes$in$ = _elm_lang$virtual_dom$VirtualDom$attribute('in');
var _elm_lang$svg$Svg_Attributes$ideographic = _elm_lang$virtual_dom$VirtualDom$attribute('ideographic');
var _elm_lang$svg$Svg_Attributes$id = _elm_lang$virtual_dom$VirtualDom$attribute('id');
var _elm_lang$svg$Svg_Attributes$horizOriginY = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-origin-y');
var _elm_lang$svg$Svg_Attributes$horizOriginX = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-origin-x');
var _elm_lang$svg$Svg_Attributes$horizAdvX = _elm_lang$virtual_dom$VirtualDom$attribute('horiz-adv-x');
var _elm_lang$svg$Svg_Attributes$height = _elm_lang$virtual_dom$VirtualDom$attribute('height');
var _elm_lang$svg$Svg_Attributes$hanging = _elm_lang$virtual_dom$VirtualDom$attribute('hanging');
var _elm_lang$svg$Svg_Attributes$gradientUnits = _elm_lang$virtual_dom$VirtualDom$attribute('gradientUnits');
var _elm_lang$svg$Svg_Attributes$gradientTransform = _elm_lang$virtual_dom$VirtualDom$attribute('gradientTransform');
var _elm_lang$svg$Svg_Attributes$glyphRef = _elm_lang$virtual_dom$VirtualDom$attribute('glyphRef');
var _elm_lang$svg$Svg_Attributes$glyphName = _elm_lang$virtual_dom$VirtualDom$attribute('glyph-name');
var _elm_lang$svg$Svg_Attributes$g2 = _elm_lang$virtual_dom$VirtualDom$attribute('g2');
var _elm_lang$svg$Svg_Attributes$g1 = _elm_lang$virtual_dom$VirtualDom$attribute('g1');
var _elm_lang$svg$Svg_Attributes$fy = _elm_lang$virtual_dom$VirtualDom$attribute('fy');
var _elm_lang$svg$Svg_Attributes$fx = _elm_lang$virtual_dom$VirtualDom$attribute('fx');
var _elm_lang$svg$Svg_Attributes$from = _elm_lang$virtual_dom$VirtualDom$attribute('from');
var _elm_lang$svg$Svg_Attributes$format = _elm_lang$virtual_dom$VirtualDom$attribute('format');
var _elm_lang$svg$Svg_Attributes$filterUnits = _elm_lang$virtual_dom$VirtualDom$attribute('filterUnits');
var _elm_lang$svg$Svg_Attributes$filterRes = _elm_lang$virtual_dom$VirtualDom$attribute('filterRes');
var _elm_lang$svg$Svg_Attributes$externalResourcesRequired = _elm_lang$virtual_dom$VirtualDom$attribute('externalResourcesRequired');
var _elm_lang$svg$Svg_Attributes$exponent = _elm_lang$virtual_dom$VirtualDom$attribute('exponent');
var _elm_lang$svg$Svg_Attributes$end = _elm_lang$virtual_dom$VirtualDom$attribute('end');
var _elm_lang$svg$Svg_Attributes$elevation = _elm_lang$virtual_dom$VirtualDom$attribute('elevation');
var _elm_lang$svg$Svg_Attributes$edgeMode = _elm_lang$virtual_dom$VirtualDom$attribute('edgeMode');
var _elm_lang$svg$Svg_Attributes$dy = _elm_lang$virtual_dom$VirtualDom$attribute('dy');
var _elm_lang$svg$Svg_Attributes$dx = _elm_lang$virtual_dom$VirtualDom$attribute('dx');
var _elm_lang$svg$Svg_Attributes$dur = _elm_lang$virtual_dom$VirtualDom$attribute('dur');
var _elm_lang$svg$Svg_Attributes$divisor = _elm_lang$virtual_dom$VirtualDom$attribute('divisor');
var _elm_lang$svg$Svg_Attributes$diffuseConstant = _elm_lang$virtual_dom$VirtualDom$attribute('diffuseConstant');
var _elm_lang$svg$Svg_Attributes$descent = _elm_lang$virtual_dom$VirtualDom$attribute('descent');
var _elm_lang$svg$Svg_Attributes$decelerate = _elm_lang$virtual_dom$VirtualDom$attribute('decelerate');
var _elm_lang$svg$Svg_Attributes$d = _elm_lang$virtual_dom$VirtualDom$attribute('d');
var _elm_lang$svg$Svg_Attributes$cy = _elm_lang$virtual_dom$VirtualDom$attribute('cy');
var _elm_lang$svg$Svg_Attributes$cx = _elm_lang$virtual_dom$VirtualDom$attribute('cx');
var _elm_lang$svg$Svg_Attributes$contentStyleType = _elm_lang$virtual_dom$VirtualDom$attribute('contentStyleType');
var _elm_lang$svg$Svg_Attributes$contentScriptType = _elm_lang$virtual_dom$VirtualDom$attribute('contentScriptType');
var _elm_lang$svg$Svg_Attributes$clipPathUnits = _elm_lang$virtual_dom$VirtualDom$attribute('clipPathUnits');
var _elm_lang$svg$Svg_Attributes$class = _elm_lang$virtual_dom$VirtualDom$attribute('class');
var _elm_lang$svg$Svg_Attributes$capHeight = _elm_lang$virtual_dom$VirtualDom$attribute('cap-height');
var _elm_lang$svg$Svg_Attributes$calcMode = _elm_lang$virtual_dom$VirtualDom$attribute('calcMode');
var _elm_lang$svg$Svg_Attributes$by = _elm_lang$virtual_dom$VirtualDom$attribute('by');
var _elm_lang$svg$Svg_Attributes$bias = _elm_lang$virtual_dom$VirtualDom$attribute('bias');
var _elm_lang$svg$Svg_Attributes$begin = _elm_lang$virtual_dom$VirtualDom$attribute('begin');
var _elm_lang$svg$Svg_Attributes$bbox = _elm_lang$virtual_dom$VirtualDom$attribute('bbox');
var _elm_lang$svg$Svg_Attributes$baseProfile = _elm_lang$virtual_dom$VirtualDom$attribute('baseProfile');
var _elm_lang$svg$Svg_Attributes$baseFrequency = _elm_lang$virtual_dom$VirtualDom$attribute('baseFrequency');
var _elm_lang$svg$Svg_Attributes$azimuth = _elm_lang$virtual_dom$VirtualDom$attribute('azimuth');
var _elm_lang$svg$Svg_Attributes$autoReverse = _elm_lang$virtual_dom$VirtualDom$attribute('autoReverse');
var _elm_lang$svg$Svg_Attributes$attributeType = _elm_lang$virtual_dom$VirtualDom$attribute('attributeType');
var _elm_lang$svg$Svg_Attributes$attributeName = _elm_lang$virtual_dom$VirtualDom$attribute('attributeName');
var _elm_lang$svg$Svg_Attributes$ascent = _elm_lang$virtual_dom$VirtualDom$attribute('ascent');
var _elm_lang$svg$Svg_Attributes$arabicForm = _elm_lang$virtual_dom$VirtualDom$attribute('arabic-form');
var _elm_lang$svg$Svg_Attributes$amplitude = _elm_lang$virtual_dom$VirtualDom$attribute('amplitude');
var _elm_lang$svg$Svg_Attributes$allowReorder = _elm_lang$virtual_dom$VirtualDom$attribute('allowReorder');
var _elm_lang$svg$Svg_Attributes$alphabetic = _elm_lang$virtual_dom$VirtualDom$attribute('alphabetic');
var _elm_lang$svg$Svg_Attributes$additive = _elm_lang$virtual_dom$VirtualDom$attribute('additive');
var _elm_lang$svg$Svg_Attributes$accumulate = _elm_lang$virtual_dom$VirtualDom$attribute('accumulate');
var _elm_lang$svg$Svg_Attributes$accelerate = _elm_lang$virtual_dom$VirtualDom$attribute('accelerate');
var _elm_lang$svg$Svg_Attributes$accentHeight = _elm_lang$virtual_dom$VirtualDom$attribute('accent-height');

var _user$project$Icons$updateIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M31.7,65.5h-6.1c0-21.7,17.7-39.4,39.4-39.4c9.3,0,18.4,3.3,25.5,9.4l-3.9,4.6c-6-5.1-13.7-7.9-21.6-7.9 C46.7,32.2,31.7,47.2,31.7,65.5z'),
						_elm_lang$svg$Svg_Attributes$fill('#0069AF')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M33.4,84.8'),
						_elm_lang$svg$Svg_Attributes$fill('#0069AF'),
						_elm_lang$svg$Svg_Attributes$stroke('#000000'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('6'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('74.5,40.3 97,51.3 91.8,25.3'),
						_elm_lang$svg$Svg_Attributes$fill('#0069AF')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M63.7,102.3c-9.3,0-18.4-3.3-25.5-9.4l3.9-4.6c6,5.1,13.7,7.9,21.6,7.9C82,96.2,97,81.3,97,62.9h6.1 C103,84.6,85.4,102.3,63.7,102.3z'),
						_elm_lang$svg$Svg_Attributes$fill('#0069AF')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M94,43.2'),
						_elm_lang$svg$Svg_Attributes$fill('#0069AF'),
						_elm_lang$svg$Svg_Attributes$stroke('#000000'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('6'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('52.7,87.1 30.2,76.2 35.4,102.1'),
						_elm_lang$svg$Svg_Attributes$fill('#0069AF')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$networkIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$circle,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('64.5'),
						_elm_lang$svg$Svg_Attributes$cy('63.6'),
						_elm_lang$svg$Svg_Attributes$r('34.8'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#6D2B90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$ellipse,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('64.5'),
						_elm_lang$svg$Svg_Attributes$cy('63.6'),
						_elm_lang$svg$Svg_Attributes$rx('19.8'),
						_elm_lang$svg$Svg_Attributes$ry('34.8'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#6D2B90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$line,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x1('30'),
						_elm_lang$svg$Svg_Attributes$y1('64'),
						_elm_lang$svg$Svg_Attributes$x2('98.5'),
						_elm_lang$svg$Svg_Attributes$y2('64'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#6D2B90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$line,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x1('64.2'),
						_elm_lang$svg$Svg_Attributes$y1('98.2'),
						_elm_lang$svg$Svg_Attributes$x2('64.2'),
						_elm_lang$svg$Svg_Attributes$y2('29.7'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#6D2B90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M99.4,63.6c0-11.2-5.3-21.1-13.5-27.5c-5.9,4.6-13.3,7.3-21.4,7.3S49,40.7,43.1,36.1 C35,42.5,29.7,52.4,29.7,63.6c0,10.8,4.9,20.5,12.7,26.9c6-5,13.8-8,22.2-8c8.4,0,16.2,3,22.2,8C94.4,84.1,99.4,74.4,99.4,63.6z'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#6D2B90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M42.3,90.5c6,5,13.8,8,22.2,8c8.4,0,16.2-3,22.2-8c-6-5-13.8-8-22.2-8C56.1,82.5,48.4,85.5,42.3,90.5z'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#6D2B90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M85.9,36.1c-5.9-4.6-13.3-7.3-21.4-7.3S49,31.5,43.1,36.1c5.9,4.6,13.3,7.3,21.4,7.3S80,40.7,85.9,36.1z'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#6D2B90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$monitorSharpIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M103.5,27.9H23.7c-1.2,0-2.1,1.3-2.1,2.9v65.7c0,1.6,1,2.9,2.1,2.9h79.8c1.2,0,2.1-1.3,2.1-2.9V30.8 C105.6,29.2,104.7,27.9,103.5,27.9z M86.1,95.7c-1,0-1.9-0.8-1.9-1.8c0-1,0.8-1.8,1.9-1.8c1,0,1.9,0.8,1.9,1.8 C88,94.9,87.1,95.7,86.1,95.7z M92.5,95.7c-1,0-1.9-0.8-1.9-1.8c0-1,0.8-1.8,1.9-1.8c1,0,1.9,0.8,1.9,1.8 C94.4,94.9,93.5,95.7,92.5,95.7z M98.9,95.7c-1,0-1.9-0.8-1.9-1.8c0-1,0.8-1.8,1.9-1.8c1,0,1.9,0.8,1.9,1.8 C100.8,94.9,100,95.7,98.9,95.7z M101.6,88.4c0,0.5-0.3,1-0.7,1H26.3c-0.4,0-0.7-0.4-0.7-1V33.5c0-0.5,0.3-1,0.7-1h74.6 c0.4,0,0.7,0.4,0.7,1V88.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#00596A')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$transform('matrix(1.2 0 0 1 48.6175 75.4754)'),
						_elm_lang$svg$Svg_Attributes$fill('#00596A'),
						_elm_lang$svg$Svg_Attributes$fontFamily('HelveticaNeue-Bold'),
						_elm_lang$svg$Svg_Attributes$fontSize('43px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text('#')
					]))
			]));
}();
var _user$project$Icons$labelLeftIcon = function (value) {
	var containerHeight = 256;
	var containerWidth = 256;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('0'),
						_elm_lang$svg$Svg_Attributes$y('240'),
						_elm_lang$svg$Svg_Attributes$fill('#fff'),
						_elm_lang$svg$Svg_Attributes$fontFamily('Arial-Black'),
						_elm_lang$svg$Svg_Attributes$fontSize('240px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text(value)
					]))
			]));
};
var _user$project$Icons$labelIcon = function (value) {
	var containerHeight = 256;
	var containerWidth = 256;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('128'),
						_elm_lang$svg$Svg_Attributes$y('240'),
						_elm_lang$svg$Svg_Attributes$fill('#fff'),
						_elm_lang$svg$Svg_Attributes$textAnchor('middle'),
						_elm_lang$svg$Svg_Attributes$fontFamily('Arial-Black'),
						_elm_lang$svg$Svg_Attributes$fontSize('240px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text(value)
					]))
			]));
};
var _user$project$Icons$closeIcon = function () {
	var containerHeight = 256;
	var containerWidth = 256;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('0'),
						_elm_lang$svg$Svg_Attributes$y('240'),
						_elm_lang$svg$Svg_Attributes$fill('#fff'),
						_elm_lang$svg$Svg_Attributes$textAnchor('middle'),
						_elm_lang$svg$Svg_Attributes$fontFamily('Arial-Black'),
						_elm_lang$svg$Svg_Attributes$fontSize('240px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text('X')
					]))
			]));
}();
var _user$project$Icons$rightIcon = function () {
	var containerHeight = 128;
	var containerWidth = 256;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('39.6'),
						_elm_lang$svg$Svg_Attributes$y('55.41'),
						_elm_lang$svg$Svg_Attributes$width('156.97'),
						_elm_lang$svg$Svg_Attributes$height('17.75'),
						_elm_lang$svg$Svg_Attributes$fill('#231f20')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('215.8,64.4 169.9,18.5 159.4,29.6 193.7,63.9 158.6,98.9 169.7,110'),
						_elm_lang$svg$Svg_Attributes$fill('#231f20')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$leftIcon = function () {
	var containerHeight = 128;
	var containerWidth = 256;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('58.78'),
						_elm_lang$svg$Svg_Attributes$y('55.41'),
						_elm_lang$svg$Svg_Attributes$width('156.97'),
						_elm_lang$svg$Svg_Attributes$height('17.75'),
						_elm_lang$svg$Svg_Attributes$fill('#231f20')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('39.58 64.38 85.41 18.54 95.91 29.55 61.6 63.87 96.68 98.95 85.67 109.96 39.58 64.38'),
						_elm_lang$svg$Svg_Attributes$fill('#231f20')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$exitOsdIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M106.8,28.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C81.1,28.2,93.8,28.2,106.8,28.2zM101.2,52.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C83.1,52.4,91.9,52.4,101.2,52.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#0290AB')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M31.4,84.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3H62l0,5H31.5v37.6'),
						_elm_lang$svg$Svg_Attributes$fill('#0290AB')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('4.9'),
						_elm_lang$svg$Svg_Attributes$y('61'),
						_elm_lang$svg$Svg_Attributes$transform('matrix(0.7071 -0.7071 0.7071 0.7071 -26.598 64.3651)'),
						_elm_lang$svg$Svg_Attributes$width('119'),
						_elm_lang$svg$Svg_Attributes$height('5.5'),
						_elm_lang$svg$Svg_Attributes$fill('#0290AB')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('4.9'),
						_elm_lang$svg$Svg_Attributes$y('61'),
						_elm_lang$svg$Svg_Attributes$transform('matrix(-0.7071 -0.7071 0.7071 -0.7071 64.4724 155.2838)'),
						_elm_lang$svg$Svg_Attributes$width('119'),
						_elm_lang$svg$Svg_Attributes$height('5.5'),
						_elm_lang$svg$Svg_Attributes$fill('#0290AB')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$darkFlatThemeIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('10'),
						_elm_lang$svg$Svg_Attributes$y('10'),
						_elm_lang$svg$Svg_Attributes$width('108.8'),
						_elm_lang$svg$Svg_Attributes$height('108.8'),
						_elm_lang$svg$Svg_Attributes$fill('#a1a2a6')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$defaultFlatThemeIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('10'),
						_elm_lang$svg$Svg_Attributes$y('10'),
						_elm_lang$svg$Svg_Attributes$width('108.8'),
						_elm_lang$svg$Svg_Attributes$height('108.8'),
						_elm_lang$svg$Svg_Attributes$fill('#005fa9')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$darkThemeIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$linearGradient,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$id('SVGID_1_'),
						_elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$svg$Svg$stop,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$svg$Svg_Attributes$offset('0'),
								_elm_lang$svg$Svg_Attributes$stopColor('#a1a2a6')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						A2(
						_elm_lang$svg$Svg$stop,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$svg$Svg_Attributes$offset('1'),
								_elm_lang$svg$Svg_Attributes$stopColor('#4c4c4e')
							]),
						_elm_lang$core$Native_List.fromArray(
							[]))
					])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('10'),
						_elm_lang$svg$Svg_Attributes$y('10'),
						_elm_lang$svg$Svg_Attributes$width('108.8'),
						_elm_lang$svg$Svg_Attributes$height('108.8'),
						_elm_lang$svg$Svg_Attributes$fill('url(#SVGID_1_)')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$defaultThemeIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$linearGradient,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$id('SVGID_1_'),
						_elm_lang$svg$Svg_Attributes$gradientUnits('userSpaceOnUse')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$svg$Svg$stop,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$svg$Svg_Attributes$offset('0'),
								_elm_lang$svg$Svg_Attributes$stopColor('#005fa9')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						A2(
						_elm_lang$svg$Svg$stop,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$svg$Svg_Attributes$offset('1'),
								_elm_lang$svg$Svg_Attributes$stopColor('#00417a')
							]),
						_elm_lang$core$Native_List.fromArray(
							[]))
					])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('10'),
						_elm_lang$svg$Svg_Attributes$y('10'),
						_elm_lang$svg$Svg_Attributes$width('108.8'),
						_elm_lang$svg$Svg_Attributes$height('108.8'),
						_elm_lang$svg$Svg_Attributes$fill('url(#SVGID_1_)')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$themeIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M125,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$ellipse,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$transform('matrix(0.7707 -0.6372 0.6372 0.7707 -13.9444 62.9444)'),
						_elm_lang$svg$Svg_Attributes$cx('80.5'),
						_elm_lang$svg$Svg_Attributes$cy('50.8'),
						_elm_lang$svg$Svg_Attributes$rx('6.3'),
						_elm_lang$svg$Svg_Attributes$ry('23.5'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#3C2F90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M55.8,102.5C53,104.8,44,98.6,35.7,88.6s-12.7-20-9.9-22.4l32.6-27c0,0,1.5,8.9,11.4,20.8s18.7,15.5,18.7,15.5L55.8,102.5z'),
						_elm_lang$svg$Svg_Attributes$fill('none'),
						_elm_lang$svg$Svg_Attributes$stroke('#3C2F90'),
						_elm_lang$svg$Svg_Attributes$strokeWidth('4'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M85.6,62.3c0,0,5.8,4.8,9.2,8.3s4.8,16.2,2.7,20.8c-2.2,4.7-0.1,9,2.9,9.4c2.9,0.4,4.7-1.3,5.4-6.2c0.7-4.9,0.9-19.3-13.9-30.5'),
						_elm_lang$svg$Svg_Attributes$fill('#3C2F90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M52.1,67.2c0-0.1-4.5-6.7-8.6-14.5c-5.7-10.7-8.1-18.5-7.2-23.1c0.4-1.9,1.3-3.3,2.7-4.2c3.9-2.5,9.1,0.4,19.9,11.5l-2.6,2.6c-10.4-10.5-14-11.8-15.3-11c-0.3,0.2-0.8,0.7-1.1,1.8C38.4,38,50.4,58.1,55.2,65.2c0,0,0.4,1.6-0.4,2.3S52.1,67.2,52.1,67.2z'),
						_elm_lang$svg$Svg_Attributes$fill('#3C2F90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M76.4,54.2L92,57.4c0,0,4.5,7.1,4.3,8.6c-0.2,1.5-1.7,5.6-5,3.7c-3.4-1.9-9.1-6.3-9.9-8c-0.7-1.7-5.8-6.8-5.8-6.8'),
						_elm_lang$svg$Svg_Attributes$fill('#3C2F90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$monitorCountIcon = function () {
	var containerHeight = 256;
	var containerWidth = 256;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M217.3,58.5H40.6c-2.6,0-4.7,2.9-4.7,6.4v145.5c0,3.5,2.2,6.4,4.7,6.4h176.7c2.6,0,4.7-2.9,4.7-6.4V64.8 C222,61.3,219.9,58.5,217.3,58.5z M178.7,208.6c-2.2-0.1-3.9-2-3.8-4.2c0.1-2.2,2-3.9,4.2-3.8c2.1,0.1,3.8,1.9,3.8,4 C182.9,206.8,181.1,208.6,178.7,208.6C178.8,208.6,178.8,208.6,178.7,208.6z M192.9,208.6c-2.2-0.1-4-1.9-3.9-4.1\n                          c0.1-2.2,1.9-4,4.1-3.9c2.2,0.1,3.9,1.8,3.9,4C197,206.8,195.2,208.6,192.9,208.6z M207.1,208.6c-2.2-0.1-4-1.9-3.9-4.1\n                          c0.1-2.2,1.9-4,4.1-3.9c2.2,0.1,3.9,1.8,3.9,4C211.2,206.8,209.4,208.6,207.1,208.6C207.1,208.6,207.1,208.6,207.1,208.6\n                          L207.1,208.6z M213.1,192.3c0.2,1-0.5,2-1.5,2.2c0,0,0,0,0,0H46.3c-1-0.2-1.7-1.1-1.6-2.2c0,0,0,0,0,0V70.8c-0.2-1,0.5-2,1.5-2.2\n                          c0,0,0,0,0,0h165.2c1,0.2,1.7,1.1,1.6,2.2c0,0,0,0,0,0L213.1,192.3L213.1,192.3z'),
						_elm_lang$svg$Svg_Attributes$fill('#065A6B')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$transform('matrix(1.2 0 0 1 95.7905 163.7627)'),
						_elm_lang$svg$Svg_Attributes$fill('#065A6B'),
						_elm_lang$svg$Svg_Attributes$fontFamily('HelveticaNeue-Bold'),
						_elm_lang$svg$Svg_Attributes$fontSize('95px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text('#')
					]))
			]));
}();
var _user$project$Icons$selectIcon = function (isOn) {
	var iconColor = isOn ? '#129848' : '#58595b';
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('52.6,95.9 31.2,75.3 36.2,62.3 51.7,82.6 83.9,32.2 95.7,41.3'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
};
var _user$project$Icons$exitPipIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M106.8,28.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C81.1,28.2,93.8,28.2,106.8,28.2zM101.2,52.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C83.1,52.4,91.9,52.4,101.2,52.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M31.4,84.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3H62l0,5H31.5v37.6'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('4.9'),
						_elm_lang$svg$Svg_Attributes$y('61'),
						_elm_lang$svg$Svg_Attributes$transform('matrix(0.7071 -0.7071 0.7071 0.7071 -26.598 64.3651)'),
						_elm_lang$svg$Svg_Attributes$width('119'),
						_elm_lang$svg$Svg_Attributes$height('5.5'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('4.9'),
						_elm_lang$svg$Svg_Attributes$y('61'),
						_elm_lang$svg$Svg_Attributes$transform('matrix(-0.7071 -0.7071 0.7071 -0.7071 64.4724 155.2838)'),
						_elm_lang$svg$Svg_Attributes$width('119'),
						_elm_lang$svg$Svg_Attributes$height('5.5'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$resizeIcon = function (isOn) {
	var iconColor = isOn ? '#21409A' : '#58595b';
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M24.4,95.1c0-17.5,0-34.7,0-52.3c11.9,0,23.7,0,35.9,0c0.1,1.5,0.2,3,0.3,5c-10.2,0-30.5,0-30.5,0v37.6l17.7-17.1H35l-0.3-5.3c0,0,14.4,0,21.9,0c0,6.9,0,14,0,21.6c-1.4,0.1-2.9,0.2-5,0.3c0-3.8,0-12.9,0-12.9S38.6,85,34.2,89.8c17.5,0,39.1,0,58.5,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7C73.6,95.1,49.2,95.1,24.4,95.1z'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M103.3,33.1c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C77.6,33.1,90.4,33.1,103.3,33.1zM97.8,57.3c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C79.7,57.3,88.5,57.3,97.8,57.3z'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
};
var _user$project$Icons$upDownIcon = function (isOn) {
	var iconColor = isOn ? '#0069af' : '#58595b';
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('40.6'),
						_elm_lang$svg$Svg_Attributes$y('30.3'),
						_elm_lang$svg$Svg_Attributes$width('8.4'),
						_elm_lang$svg$Svg_Attributes$height('52.4'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('44.8,21.2 23.2,42.9 28.4,47.8 44.6,31.6 61.1,48.2 66.3,43'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('78.6'),
						_elm_lang$svg$Svg_Attributes$y('45.2'),
						_elm_lang$svg$Svg_Attributes$width('8.4'),
						_elm_lang$svg$Svg_Attributes$height('52.2'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('82.7,106.5 104.3,84.8 99.1,79.9 83,96.1 66.4,79.5 61.2,84.7'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
};
var _user$project$Icons$leftRightIcon = function (isOn) {
	var iconColor = isOn ? '#00747d' : '#58595b';
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('30.5'),
						_elm_lang$svg$Svg_Attributes$y('40.7'),
						_elm_lang$svg$Svg_Attributes$width('52.2'),
						_elm_lang$svg$Svg_Attributes$height('8.4'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('21.5,44.9 43.1,23.3 48.1,28.5 31.9,44.7 48.4,61.2 43.2,66.4'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$x('45.5'),
						_elm_lang$svg$Svg_Attributes$y('78.7'),
						_elm_lang$svg$Svg_Attributes$width('52.2'),
						_elm_lang$svg$Svg_Attributes$height('8.4'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('106.7,82.8 85.1,104.4 80.2,99.2 96.3,83 79.8,66.5 85,61.3'),
						_elm_lang$svg$Svg_Attributes$fill(iconColor)
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
};
var _user$project$Icons$osdIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M49.8,67.3l1.1,3.7c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.1,0.4,0.1l3.4-0.6c0.6,1.2,1.5,2.2,2.4,3.1l-1.4,3.1 c0,0.1-0.1,0.2,0,0.4c0,0.1,0.1,0.2,0.2,0.3l3.3,1.8c0.1,0.1,0.2,0.1,0.4,0.1c0.1,0,0.2-0.1,0.3-0.2l1.9-2.8 c1.2,0.4,2.5,0.5,3.9,0.4l1.2,3.2c0,0.1,0.1,0.2,0.3,0.3c0.1,0.1,0.2,0.1,0.4,0l3.7-1.1c0.1,0,0.2-0.1,0.3-0.2 c0.1-0.1,0.1-0.2,0.1-0.4l-0.6-3.4c1.2-0.6,2.2-1.5,3.1-2.4l3.1,1.4c0.1,0,0.2,0.1,0.4,0c0.1,0,0.2-0.1,0.3-0.2l1.8-3.3 c0.1-0.1,0.1-0.2,0.1-0.4c0-0.1-0.1-0.2-0.2-0.3l-2.8-1.9c0.4-1.2,0.5-2.5,0.4-3.9l3.2-1.2c0.1,0,0.2-0.1,0.3-0.3 c0.1-0.1,0.1-0.2,0-0.4l-1.1-3.7c0-0.1-0.1-0.2-0.2-0.3c-0.1-0.1-0.2-0.1-0.4-0.1l-3.4,0.6c-0.6-1.2-1.5-2.2-2.4-3.1l1.4-3.1 c0-0.1,0.1-0.2,0-0.4c0-0.1-0.1-0.2-0.2-0.3l-3.3-1.8c-0.1-0.1-0.2-0.1-0.4-0.1c-0.1,0-0.2,0.1-0.3,0.2l-1.9,2.8 c-1.2-0.4-2.5-0.5-3.9-0.4l-1.3-3.2c0-0.1-0.1-0.2-0.3-0.3c-0.1-0.1-0.2-0.1-0.4,0l-3.7,1c-0.1,0-0.2,0.1-0.3,0.2 c-0.1,0.1-0.1,0.2-0.1,0.4l0.6,3.4c-1.2,0.6-2.2,1.5-3.1,2.4l-3.1-1.4c-0.1,0-0.2-0.1-0.4,0c-0.1,0-0.2,0.1-0.3,0.2l-1.8,3.3 c-0.1,0.1-0.1,0.2-0.1,0.4c0,0.1,0.1,0.2,0.2,0.3l2.8,1.9c-0.4,1.2-0.5,2.5-0.4,3.9l-3.2,1.3c-0.1,0-0.2,0.1-0.3,0.3 C49.8,67,49.8,67.1,49.8,67.3z M58.7,66.7c-1-3.6,1.1-7.4,4.7-8.5c3.6-1,7.4,1.1,8.5,4.7c1,3.6-1.1,7.4-4.7,8.5 C63.5,72.4,59.8,70.3,58.7,66.7z'),
						_elm_lang$svg$Svg_Attributes$fill('#0290AB')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M102.2,92H27.6V36.6h74.7V92z M33.6,86h62.7V42.6H33.6V86z'),
						_elm_lang$svg$Svg_Attributes$fill('#0290AB')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$pipIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M104.3,33.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C78.6,33.2,91.3,33.2,104.3,33.2zM98.7,57.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C80.6,57.4,89.4,57.4,98.7,57.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#3C2F90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M28.9,89.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3h36.2l0,5H29v37.6'),
						_elm_lang$svg$Svg_Attributes$fill('#3C2F90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M32.2,72.5l1.1,3.8c0,0.1,0.1,0.2,0.2,0.3c0.1,0.1,0.2,0.1,0.4,0.1l3.5-0.7c0.7,1.2,1.5,2.3,2.5,3.2l-1.4,3.3c0,0.1-0.1,0.3,0,0.4c0,0.1,0.1,0.2,0.2,0.3l3.5,1.9c0.1,0.1,0.2,0.1,0.4,0.1c0.1,0,0.2-0.1,0.3-0.2l2-2.9c1.3,0.4,2.7,0.5,4,0.5l1.3,3.3c0,0.1,0.1,0.2,0.3,0.3c0.1,0.1,0.3,0.1,0.4,0l3.8-1.1c0.1,0,0.2-0.1,0.3-0.2c0.1-0.1,0.1-0.2,0.1-0.4l-0.7-3.5c1.2-0.7,2.3-1.5,3.2-2.5l3.3,1.4c0.1,0,0.3,0.1,0.4,0c0.1,0,0.2-0.1,0.3-0.2l1.9-3.5c0.1-0.1,0.1-0.2,0.1-0.4c0-0.1-0.1-0.2-0.2-0.3l-2.9-2c0.4-1.3,0.5-2.7,0.5-4l3.3-1.3c0.1-0.1,0.2-0.1,0.3-0.3c0.1-0.1,0.1-0.3,0-0.4l-1.1-3.8c0-0.1-0.1-0.2-0.2-0.3c-0.1-0.1-0.2-0.1-0.4-0.1l-3.5,0.7c-0.7-1.2-1.5-2.3-2.5-3.2l1.4-3.3c0-0.1,0.1-0.3,0-0.4c0-0.1-0.1-0.2-0.2-0.3l-3.5-1.9c-0.1-0.1-0.2-0.1-0.4-0.1c-0.1,0-0.2,0.1-0.3,0.2l-2,2.9c-1.3-0.4-2.7-0.5-4-0.5l-1.3-3.3c0-0.1-0.1-0.2-0.3-0.3c-0.1-0.1-0.3-0.1-0.4,0L42,54.9c-0.1,0-0.2,0.1-0.3,0.2c-0.1,0.1-0.1,0.2-0.1,0.4l0.7,3.5c-1.2,0.7-2.3,1.5-3.2,2.5l-3.3-1.4c-0.1,0-0.3-0.1-0.4,0c-0.1,0-0.2,0.1-0.3,0.2l-1.9,3.5c-0.1,0.1-0.1,0.2-0.1,0.4c0,0.1,0.1,0.2,0.2,0.3l2.9,2c-0.4,1.3-0.5,2.7-0.5,4l-3.3,1.3c-0.1,0-0.2,0.1-0.3,0.3C32.2,72.3,32.2,72.4,32.2,72.5z M41.5,71.9c-1.1-3.8,1.1-7.7,4.9-8.8c3.8-1.1,7.7,1.1,8.8,4.9c1.1,3.8-1.1,7.7-4.9,8.8C46.5,77.9,42.6,75.7,41.5,71.9z'),
						_elm_lang$svg$Svg_Attributes$fill('#3C2F90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$pipButtonIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M104.3,33.2c0,9.9,0,19.6,0,29.5c-12.8,0-25.5,0-38.4,0c0-9.8,0-19.5,0-29.5C78.6,33.2,91.3,33.2,104.3,33.2zM98.7,57.4c0-6.5,0-12.5,0-18.6c-9.3,0-18.4,0-27.3,0c0,6.4,0,12.4,0,18.6C80.6,57.4,89.4,57.4,98.7,57.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M28.9,89.8c17.5,0,43.3,0,62.8,0c0-7.5,0-14.7,0-22.3c1.9,0,3.4,0,5.2,0c0,9.1,0,18.2,0,27.7c-24.4,0-48.7,0-73.6,0c0-17.5,0-52.3,0-52.3h36.2l0,5H29v37.6'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$informationIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M66.7,103.1c-21.3,0-38.7-17.3-38.7-38.7s17.3-38.7,38.7-38.7s38.7,17.3,38.7,38.7S88,103.1,66.7,103.1zM66.7,34.4c-16.6,0-30.1,13.5-30.1,30.1s13.5,30.1,30.1,30.1S96.8,81,96.8,64.5S83.3,34.4,66.7,34.4'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M71.2,85c0,2.5-2,4.4-4.4,4.4l0,0c-2.5,0-4.4-2-4.4-4.4V59.5c0-2.5,2-4.4,4.4-4.4l0,0c2.5,0,4.4,2,4.4,4.4V85z'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$circle,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('66.7'),
						_elm_lang$svg$Svg_Attributes$cy('46.5'),
						_elm_lang$svg$Svg_Attributes$r('5.8'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$menuIconHeader = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M14.43,72.7l3.44,12a1.68,1.68,0,0,0,1.87,1.2l11-2a39,39,0,0,0,7.93,10L34.17,104a1.69,1.69,0,0,0,0,1.19,1.67,1.67,0,0,0,.77.9l10.89,6a1.68,1.68,0,0,0,2.17-.48l6.32-9.2a39,39,0,0,0,12.66,1.44L71,114.31a1.67,1.67,0,0,0,2,.95l12-3.43A1.67,1.67,0,0,0,86.2,110l-2-11a39.15,39.15,0,0,0,10-7.93l10.23,4.46a1.68,1.68,0,0,0,2.09-.74l6-10.89a1.7,1.7,0,0,0-.48-2.17l-9.21-6.32a39,39,0,0,0,1.44-12.66l10.39-4.08a1.68,1.68,0,0,0,.95-2l-3.43-12a1.67,1.67,0,0,0-1.87-1.2l-11,2a39.08,39.08,0,0,0-7.93-10l4.46-10.23a1.68,1.68,0,0,0,0-1.19,1.66,1.66,0,0,0-.77-0.9l-10.88-6a1.68,1.68,0,0,0-2.17.48l-6.32,9.2a39.05,39.05,0,0,0-12.66-1.44L59,15a1.66,1.66,0,0,0-.82-0.86A1.64,1.64,0,0,0,57,14.1L45,17.53a1.64,1.64,0,0,0-1,.7,1.68,1.68,0,0,0-.25,1.16l2,11a39,39,0,0,0-10,7.93L25.66,33.84a1.67,1.67,0,0,0-2.09.75l-6,10.88a1.73,1.73,0,0,0-.17,1.18,1.7,1.7,0,0,0,.65,1L27.21,54a39,39,0,0,0-1.45,12.66L15.38,70.7a1.65,1.65,0,0,0-.86.82A1.69,1.69,0,0,0,14.43,72.7Zm29.11-1.87A22.34,22.34,0,1,1,71.17,86.15,22.34,22.34,0,0,1,43.54,70.83Z'),
						_elm_lang$svg$Svg_Attributes$transform('translate(14 14) scale(0.8)'),
						_elm_lang$svg$Svg_Attributes$fill('#FFF')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$menuIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M14.43,72.7l3.44,12a1.68,1.68,0,0,0,1.87,1.2l11-2a39,39,0,0,0,7.93,10L34.17,104a1.69,1.69,0,0,0,0,1.19,1.67,1.67,0,0,0,.77.9l10.89,6a1.68,1.68,0,0,0,2.17-.48l6.32-9.2a39,39,0,0,0,12.66,1.44L71,114.31a1.67,1.67,0,0,0,2,.95l12-3.43A1.67,1.67,0,0,0,86.2,110l-2-11a39.15,39.15,0,0,0,10-7.93l10.23,4.46a1.68,1.68,0,0,0,2.09-.74l6-10.89a1.7,1.7,0,0,0-.48-2.17l-9.21-6.32a39,39,0,0,0,1.44-12.66l10.39-4.08a1.68,1.68,0,0,0,.95-2l-3.43-12a1.67,1.67,0,0,0-1.87-1.2l-11,2a39.08,39.08,0,0,0-7.93-10l4.46-10.23a1.68,1.68,0,0,0,0-1.19,1.66,1.66,0,0,0-.77-0.9l-10.88-6a1.68,1.68,0,0,0-2.17.48l-6.32,9.2a39.05,39.05,0,0,0-12.66-1.44L59,15a1.66,1.66,0,0,0-.82-0.86A1.64,1.64,0,0,0,57,14.1L45,17.53a1.64,1.64,0,0,0-1,.7,1.68,1.68,0,0,0-.25,1.16l2,11a39,39,0,0,0-10,7.93L25.66,33.84a1.67,1.67,0,0,0-2.09.75l-6,10.88a1.73,1.73,0,0,0-.17,1.18,1.7,1.7,0,0,0,.65,1L27.21,54a39,39,0,0,0-1.45,12.66L15.38,70.7a1.65,1.65,0,0,0-.86.82A1.69,1.69,0,0,0,14.43,72.7Zm29.11-1.87A22.34,22.34,0,1,1,71.17,86.15,22.34,22.34,0,0,1,43.54,70.83Z'),
						_elm_lang$svg$Svg_Attributes$transform('translate(14 14) scale(0.8)'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$presetIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('130%'),
				_elm_lang$svg$Svg_Attributes$width('130%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M99.2,45.8c0,2.8-2.3,5.1-5.1,5.1H48.1c-2.8,0-5.1-2.3-5.1-5.1l0,0c0-2.8,2.3-5.1,5.1-5.1h46.1C97,40.6,99.2,42.9,99.2,45.8L99.2,45.8z'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$circle,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('33.5'),
						_elm_lang$svg$Svg_Attributes$cy('45.7'),
						_elm_lang$svg$Svg_Attributes$r('4.9'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M99.2,64.5c0,2.8-2.3,5.1-5.1,5.1H48.1c-2.8,0-5.1-2.3-5.1-5.1l0,0c0-2.8,2.3-5.1,5.1-5.1h46.1C97,59.3,99.2,61.6,99.2,64.5L99.2,64.5z'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$circle,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('33.5'),
						_elm_lang$svg$Svg_Attributes$cy('64.4'),
						_elm_lang$svg$Svg_Attributes$r('4.9'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M99.2,83.2c0,2.8-2.3,5.1-5.1,5.1H48.1c-2.8,0-5.1-2.3-5.1-5.1l0,0c0-2.8,2.3-5.1,5.1-5.1h46.1C97,78.1,99.2,80.3,99.2,83.2L99.2,83.2z'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$circle,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('33.5'),
						_elm_lang$svg$Svg_Attributes$cy('83.1'),
						_elm_lang$svg$Svg_Attributes$r('4.9'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$lockIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('110%'),
				_elm_lang$svg$Svg_Attributes$width('110%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M36.6,66.4c0,0,3.5-1.7,6.8,1.2l5.3,7.7c1.1,0.3,2.1-0.2,2.8-1.1V37.4c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v22.5c2,1.8,3,0.4,3.3-0.8V32c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v26.2c1.4,1.8,2.8,0.8,3.3,0.3V34.9c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v25.8c0.1,0.1,0.2,0.3,0.2,0.4c0.9,2,2.5,0.7,3.1,0.1V43.9c0-1.4,1.3-3.4,2.8-3.4h1.4c1.6,0,2.8,2,2.8,3.4v21.6c2.3,14.5,2.1,33.2-18.3,33.2c-21.8,0-24.6-7-26-11.5c-0.8-2.6-2-5.1-2.9-6.7l-6.1-10.3C35.1,69.2,35.3,67.4,36.6,66.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#BCBEC0')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$monitorIcon = F2(
	function (label, isSelected) {
		var containerHeight = 140;
		var containerWidth = 160;
		return A2(
			_elm_lang$svg$Svg$svg,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$svg$Svg_Attributes$version('1.1'),
					_elm_lang$svg$Svg_Attributes$height('100%'),
					_elm_lang$svg$Svg_Attributes$width('100%'),
					_elm_lang$svg$Svg_Attributes$x('0'),
					_elm_lang$svg$Svg_Attributes$y('0'),
					_elm_lang$svg$Svg_Attributes$viewBox(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'0 0 ',
						A2(
							_elm_lang$core$Basics_ops['++'],
							_elm_lang$core$Basics$toString(containerWidth),
							A2(
								_elm_lang$core$Basics_ops['++'],
								' ',
								_elm_lang$core$Basics$toString(containerHeight)))))
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$svg$Svg$path,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$svg$Svg_Attributes$d('M161,131.4c0,3-1.8,5.5-4.1,5.5H4.1c-2.2,0-4.1-2.5-4.1-5.5V5.5C0,2.5,1.8,0,4.1,0h152.9c2.2,0,4.1,2.5,4.1,5.5V131.4z'),
							_elm_lang$svg$Svg_Attributes$fill('#000')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$svg$Svg$path,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$svg$Svg_Attributes$d('M153.3,115.8c0,1-0.6,1.8-1.4,1.8H9c-0.7,0-1.4-0.8-1.4-1.8V10.7c0-1,0.6-1.8,1.4-1.8H152c0.7,0,1.4,0.8,1.4,1.8V115.8z'),
							_elm_lang$svg$Svg_Attributes$fill(
							isSelected ? '#34b3c7' : '#cbccce')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$svg$Svg$ellipse,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$svg$Svg_Attributes$fill('#848689'),
							_elm_lang$svg$Svg_Attributes$cx('123.6'),
							_elm_lang$svg$Svg_Attributes$cy('126.4'),
							_elm_lang$svg$Svg_Attributes$rx('3.6'),
							_elm_lang$svg$Svg_Attributes$ry('3.5')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$svg$Svg$ellipse,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$svg$Svg_Attributes$fill('#848689'),
							_elm_lang$svg$Svg_Attributes$cx('135.9'),
							_elm_lang$svg$Svg_Attributes$cy('126.4'),
							_elm_lang$svg$Svg_Attributes$rx('3.6'),
							_elm_lang$svg$Svg_Attributes$ry('3.5')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$svg$Svg$ellipse,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$svg$Svg_Attributes$fill('#848689'),
							_elm_lang$svg$Svg_Attributes$cx('148.2'),
							_elm_lang$svg$Svg_Attributes$cy('126.4'),
							_elm_lang$svg$Svg_Attributes$rx('3.6'),
							_elm_lang$svg$Svg_Attributes$ry('3.5')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$svg$Svg$text$,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$svg$Svg_Attributes$transform('matrix(1 0 0 1 80 90)'),
							_elm_lang$svg$Svg_Attributes$fontFamily('Arial-Black'),
							_elm_lang$svg$Svg_Attributes$textAnchor('middle'),
							_elm_lang$svg$Svg_Attributes$fontSize('80px')
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$svg$Svg$text(label)
						]))
				]));
	});
var _user$project$Icons$pipMenuIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M125,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M103.6,30.7c0,9.5,0,18.9,0,28.5c-12.4,0-24.5,0-37,0c0-9.4,0-18.8,0-28.5C78.8,30.7,91,30.7,103.6,30.7z M98.2,53.9c0-6.3,0-12.1,0-17.9c-9,0-17.7,0-26.3,0c0,6.2,0,12,0,17.9C80.7,53.9,89.3,53.9,98.2,53.9z'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M30.9,85.3c16.9,0,41.8,0,60.5,0c0-7.2,0-14.2,0-21.5c1.8,0,3.3,0,5.1,0c0,8.8,0,17.6,0,26.7 c-23.5,0-47,0-71,0c0-16.9,0-50.4,0-50.4h34.9l0,4.9H30.9v36.3'),
						_elm_lang$svg$Svg_Attributes$fill('#6D2B90')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$nightModeIcon = function () {
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M125.3,106.6c0,9.7-7.9,17.6-17.6,17.6H21.4c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M65.3,30.7c-1.3-0.6-2.6-1-3.9-1.4c7.4,11.3,9.4,25,4,37c-4.9,11-14.9,18.4-26.8,21.2c0.4,0.2,0.8,0.4,1.2,0.6 c15.8,7,34.4-0.1,41.4-15.9C88.2,56.3,81.1,37.7,65.3,30.7z'),
						_elm_lang$svg$Svg_Attributes$fill('#414042')
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();
var _user$project$Icons$decrementIcon = function () {
	var containerHeight = 300;
	var containerWidth = 180;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M171.1,11.3v51.8c0,0-71.3,19.2-67,87.6c3.8,60.9,67,85.3,67,85.3v50.6c0,0-26.5,17.5-45.7,0 S12.7,184.9,6.6,166.6s-5.7-17.1,0-34.3S112.8,23.5,132.2,10.1C156.6-1.3,171.1,11.3,171.1,11.3z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$transform('matrix(1 0 0 1 30 180)'),
						_elm_lang$svg$Svg_Attributes$fontFamily('Arial-BoldMT'),
						_elm_lang$svg$Svg_Attributes$fill('#414042'),
						_elm_lang$svg$Svg_Attributes$fontSize('110px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text('-')
					]))
			]));
}();
var _user$project$Icons$brightnessLine = F4(
	function (x1$, y1$, x2$, y2$) {
		return A2(
			_elm_lang$svg$Svg$line,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$svg$Svg_Attributes$x1(x1$),
					_elm_lang$svg$Svg_Attributes$y1(y1$),
					_elm_lang$svg$Svg_Attributes$x2(x2$),
					_elm_lang$svg$Svg_Attributes$y2(y2$),
					_elm_lang$svg$Svg_Attributes$cx('89'),
					_elm_lang$svg$Svg_Attributes$cy('148'),
					_elm_lang$svg$Svg_Attributes$r('24.5'),
					_elm_lang$svg$Svg_Attributes$stroke('#FFFF00'),
					_elm_lang$svg$Svg_Attributes$strokeWidth('10'),
					_elm_lang$svg$Svg_Attributes$strokeMiterlimit('10')
				]),
			_elm_lang$core$Native_List.fromArray(
				[]));
	});
var _user$project$Icons$brightnessIcon = function () {
	var containerHeight = 300;
	var containerWidth = 180;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$circle,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('89'),
						_elm_lang$svg$Svg_Attributes$cy('147'),
						_elm_lang$svg$Svg_Attributes$r('24.5'),
						_elm_lang$svg$Svg_Attributes$fill('#FFFF0B')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A4(_user$project$Icons$brightnessLine, '89', '80.6', '89', '113.3'),
				A4(_user$project$Icons$brightnessLine, '116.4', '122.9', '137.7', '101.2'),
				A4(_user$project$Icons$brightnessLine, '123.3', '149.7', '152.2', '149.7'),
				A4(_user$project$Icons$brightnessLine, '113.4', '174.3', '133.2', '194.8'),
				A4(_user$project$Icons$brightnessLine, '89', '181.1', '89', '213.1'),
				A4(_user$project$Icons$brightnessLine, '64.6', '174.3', '41', '194.8'),
				A4(_user$project$Icons$brightnessLine, '52.8', '149.7', '22.7', '149.7'),
				A4(_user$project$Icons$brightnessLine, '62', '120.1', '41', '97.7')
			]));
}();
var _user$project$Icons$incrementIcon = function () {
	var containerHeight = 300;
	var containerWidth = 180;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M8.1,289.2v-51.8c0,0,71.3-19.2,67-87.6c-3.8-60.9-67-85.3-67-85.3V13.9c0,0,26.5-17.5,45.7,0 s112.7,101.7,118.8,120c6.1,18.3,5.7,17.1,0,34.3C166.9,185.3,66.4,277,47,290.4C22.6,301.8,8.1,289.2,8.1,289.2z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$transform('matrix(1 0 0 1 86 180)'),
						_elm_lang$svg$Svg_Attributes$fontFamily('Arial-BoldMT'),
						_elm_lang$svg$Svg_Attributes$fill('#414042'),
						_elm_lang$svg$Svg_Attributes$fontSize('110px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text('+')
					]))
			]));
}();
var _user$project$Icons$brightnessSetupIcon = function () {
	var containerHeight = 128;
	var containerWidth = 176;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$circle,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$cx('89.3'),
						_elm_lang$svg$Svg_Attributes$cy('64.4'),
						_elm_lang$svg$Svg_Attributes$r('10.4'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M91.4,49.4c0,1.2-0.9,2.1-2.1,2.1l0,0c-1.2,0-2.1-0.9-2.1-2.1V38.8c0-1.2,0.9-2.1,2.1-2.1l0,0 c1.2,0,2.1,0.9,2.1,2.1V49.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M80.1,52.2c0.8,0.8,0.8,2.2,0,3l0,0c-0.8,0.8-2.2,0.8-3,0l-7.5-7.5c-0.8-0.8-0.8-2.2,0-3l0,0 c0.8-0.8,2.2-0.8,3,0L80.1,52.2z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M74.1,62.2c1.2,0,2.1,0.9,2.1,2.1l0,0c0,1.2-0.9,2.1-2.1,2.1H63.5c-1.2,0-2.1-0.9-2.1-2.1l0,0 c0-1.2,0.9-2.1,2.1-2.1H74.1z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M76.9,73.6c0.8-0.8,2.2-0.8,3,0l0,0c0.8,0.8,0.8,2.2,0,3L72.4,84c-0.8,0.8-2.2,0.8-3,0l0,0 c-0.8-0.8-0.8-2.2,0-3L76.9,73.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M86.9,79.6c0-1.2,0.9-2.1,2.1-2.1l0,0c1.2,0,2.1,0.9,2.1,2.1v10.6c0,1.2-0.9,2.1-2.1,2.1l0,0 c-1.2,0-2.1-0.9-2.1-2.1V79.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M98.2,76.7c-0.8-0.8-0.8-2.2,0-3l0,0c0.8-0.8,2.2-0.8,3,0l7.5,7.5c0.8,0.8,0.8,2.2,0,3l0,0 c-0.8,0.8-2.2,0.8-3,0L98.2,76.7z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M104.2,66.7c-1.2,0-2.1-0.9-2.1-2.1l0,0c0-1.2,0.9-2.1,2.1-2.1h10.6c1.2,0,2.1,0.9,2.1,2.1l0,0 c0,1.2-0.9,2.1-2.1,2.1H104.2z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M101.4,55.4c-0.8,0.8-2.2,0.8-3,0l0,0c-0.8-0.8-0.8-2.2,0-3l7.5-7.5c0.8-0.8,2.2-0.8,3,0l0,0 c0.8,0.8,0.8,2.2,0,3L101.4,55.4z'),
						_elm_lang$svg$Svg_Attributes$fill('#FFD400')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M48.3,63.9c0-16.2,10.9-29.9,25.8-34.1V8.2C69,3,60.6,3,55.4,8.2L9.5,54.1c-5.2,5.2-5.2,13.6,0,18.7 l45.9,45.9c5.2,5.2,13.6,5.2,18.7,0V97.9C59.2,93.8,48.3,80.1,48.3,63.9z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$transform('matrix(1 0 0 1 19.3679 71.0002)'),
						_elm_lang$svg$Svg_Attributes$fontFamily('HelveticaNeue-Bold'),
						_elm_lang$svg$Svg_Attributes$fontSize('28px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text('-')
					])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M129.5,63.9c0-16.2-10.9-29.9-25.8-34.1V8.2c5.2-5.2,13.6-5.2,18.7,0l45.9,45.9c5.2,5.2,5.2,13.6,0,18.7 l-45.9,45.9c-5.2,5.2-13.6,5.2-18.7,0V97.9C118.5,93.8,129.5,80.1,129.5,63.9z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$text$,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$transform('matrix(1 0 0 1 142.5398 71.0002)'),
						_elm_lang$svg$Svg_Attributes$fontFamily('HelveticaNeue-Bold'),
						_elm_lang$svg$Svg_Attributes$fontSize('24px')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg$text('+')
					]))
			]));
}();
var _user$project$Icons$powerIcon = function (isDisabled) {
	var color = isDisabled ? '#414042' : '#B71318';
	var containerHeight = 128;
	var containerWidth = 128;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M124.9,106.6c0,9.7-7.9,17.6-17.6,17.6H21.1c-9.7,0-17.6-7.9-17.6-17.6V20.4c0-9.7,7.9-17.6,17.6-17.6h86.2 c9.7,0,17.6,7.9,17.6,17.6V106.6z'),
						_elm_lang$svg$Svg_Attributes$fill('#D1D3D4')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M70.9,40.8c9.4,3.5,16,12.6,16,23.2c0,13.7-11.1,24.8-24.8,24.8S37.5,77.7,37.5,64c0-10.6,6.7-19.7,16.1-23.2'),
						_elm_lang$svg$Svg_Attributes$stroke(color),
						_elm_lang$svg$Svg_Attributes$strokeWidth('6'),
						_elm_lang$svg$Svg_Attributes$strokeLinecap('round'),
						_elm_lang$svg$Svg_Attributes$strokeMiterlimit('6'),
						_elm_lang$svg$Svg_Attributes$fill('none')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$path,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$d('M65.4,65.2c0,1.8-1.4,3.2-3.2,3.2l0,0c-1.8,0-3.2-1.4-3.2-3.2V36.1c0-1.8,1.4-3.2,3.2-3.2l0,0 c1.8,0,3.2,1.4,3.2,3.2V65.2z'),
						_elm_lang$svg$Svg_Attributes$fill(color)
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
};
var _user$project$Icons$selectAllIcon = function () {
	var color = '#231f20';
	var containerHeight = 48;
	var containerWidth = 204;
	return A2(
		_elm_lang$svg$Svg$svg,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$svg$Svg_Attributes$version('1.1'),
				_elm_lang$svg$Svg_Attributes$height('100%'),
				_elm_lang$svg$Svg_Attributes$width('100%'),
				_elm_lang$svg$Svg_Attributes$x('0'),
				_elm_lang$svg$Svg_Attributes$y('0'),
				_elm_lang$svg$Svg_Attributes$viewBox(
				A2(
					_elm_lang$core$Basics_ops['++'],
					'0 0 ',
					A2(
						_elm_lang$core$Basics_ops['++'],
						_elm_lang$core$Basics$toString(containerWidth),
						A2(
							_elm_lang$core$Basics_ops['++'],
							' ',
							_elm_lang$core$Basics$toString(containerHeight)))))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$height('9.2'),
						_elm_lang$svg$Svg_Attributes$width('81.3'),
						_elm_lang$svg$Svg_Attributes$fill(color),
						_elm_lang$svg$Svg_Attributes$x('9.95'),
						_elm_lang$svg$Svg_Attributes$y('19.1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$rect,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$height('9.2'),
						_elm_lang$svg$Svg_Attributes$width('81.3'),
						_elm_lang$svg$Svg_Attributes$fill(color),
						_elm_lang$svg$Svg_Attributes$x('110.85'),
						_elm_lang$svg$Svg_Attributes$y('19.1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('0 23.74 23.74 0 29.18 5.7 11.41 23.47 29.57 41.64 23.87 47.35 0 23.74'),
						_elm_lang$svg$Svg_Attributes$fill(color)
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$svg$Svg$polygon,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$svg$Svg_Attributes$points('202.09 23.74 178.35 0 172.91 5.7 190.69 23.47 172.51 41.64 178.22 47.35 202.09 23.74'),
						_elm_lang$svg$Svg_Attributes$fill(color)
					]),
				_elm_lang$core$Native_List.fromArray(
					[]))
			]));
}();

var _user$project$General$closeIconView = A2(
	_elm_lang$html$Html$div,
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1')
		]),
	_elm_lang$core$Native_List.fromArray(
		[
			A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-5')
				]),
			_elm_lang$core$Native_List.fromArray(
				[])),
			A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-3-5')
				]),
			_elm_lang$core$Native_List.fromArray(
				[_user$project$Icons$closeIcon]))
		]));
var _user$project$General$appTopBarHeaderIcon = function (html) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[html]))
			]));
};
var _user$project$General$appTopBarHeader = function (value) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-5')
					]),
				_elm_lang$core$Native_List.fromArray(
					[])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-3-5')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_user$project$Icons$labelLeftIcon(value)
					]))
			]));
};

var _user$project$Ports$in_longPressedMonitor = _elm_lang$core$Native_Platform.incomingPort('in_longPressedMonitor', _elm_lang$core$Json_Decode$string);
var _user$project$Ports$in_unlockLockCountdown = _elm_lang$core$Native_Platform.incomingPort('in_unlockLockCountdown', _elm_lang$core$Json_Decode$string);
var _user$project$Ports$in_updateLockCountdownSecondsLeft = _elm_lang$core$Native_Platform.incomingPort('in_updateLockCountdownSecondsLeft', _elm_lang$core$Json_Decode$int);
var _user$project$Ports$in_returnToHomeMode = _elm_lang$core$Native_Platform.incomingPort('in_returnToHomeMode', _elm_lang$core$Json_Decode$string);
var _user$project$Ports$out_onPressedMonitor = _elm_lang$core$Native_Platform.outgoingPort(
	'out_onPressedMonitor',
	function (v) {
		return v;
	});
var _user$project$Ports$out_onPressReleasedMonitor = _elm_lang$core$Native_Platform.outgoingPort(
	'out_onPressReleasedMonitor',
	function (v) {
		return v;
	});
var _user$project$Ports$out_onLockScreenPressed = _elm_lang$core$Native_Platform.outgoingPort(
	'out_onLockScreenPressed',
	function (v) {
		return v;
	});
var _user$project$Ports$out_returnToHomeMode = _elm_lang$core$Native_Platform.outgoingPort(
	'out_returnToHomeMode',
	function (v) {
		return v;
	});
var _user$project$Ports$toJS = _elm_lang$core$Native_Platform.outgoingPort(
	'toJS',
	function (v) {
		return v;
	});
var _user$project$Ports$fromJS = _elm_lang$core$Native_Platform.incomingPort('fromJS', _elm_lang$core$Json_Decode$int);

var _user$project$Types$defaultMonitor = F2(
	function (number$, isVisible$) {
		return {number: number$, isSelected: false, isVisible: isVisible$, vgaOne: 'XBAND RADAR', vgaTwo: 'XBAND RADAR', dviOne: 'XBAND RADAR', dviTwo: 'XBAND RADAR', videoOne: 'XBAND RADAR', videoTwo: 'XBAND RADAR', videoThree: 'XBAND RADAR', isVgaOneCycle: true, isVgaTwoCycle: false, isDviOneCycle: false, isDviTwoCycle: false, isVideoOneCycle: false, isVideoTwoCycle: false, isVideoThreeCycle: false, isPipUpDownPressed: false, isPipLeftRightPressed: false, isPipResizePressed: false, isOsdUpDownPressed: false, isOsdLeftRightPressed: false, isOsdSelectPressed: false, isOn: false};
	});
var _user$project$Types$themeLibrary = {
	defaultBackgroundStyle: {ctor: '_Tuple2', _0: 'background', _1: '-webkit-linear-gradient(-90deg, #005fa9, #00417a)'},
	defaultBackgroundFlatStyle: {ctor: '_Tuple2', _0: 'background', _1: '#005fa9'},
	defaultBackgroundNavStyle: {ctor: '_Tuple2', _0: 'background', _1: '#003169'},
	darkBackgroundStyle: {ctor: '_Tuple2', _0: 'background', _1: '-webkit-linear-gradient(-90deg, #a1a2a6, #4c4c4e)'},
	darkBackgroundFlatStyle: {ctor: '_Tuple2', _0: 'background', _1: '#a1a2a6'},
	darkBackgroundNavStyle: {ctor: '_Tuple2', _0: 'background', _1: '#4c4c4e'}
};
var _user$project$Types$getThemeStyle = function (theme) {
	var _p0 = theme;
	switch (_p0.ctor) {
		case 'DefaultTheme':
			return {ctor: '_Tuple2', _0: _user$project$Types$themeLibrary.defaultBackgroundStyle, _1: _user$project$Types$themeLibrary.defaultBackgroundNavStyle};
		case 'DefaultFlatTheme':
			return {ctor: '_Tuple2', _0: _user$project$Types$themeLibrary.defaultBackgroundFlatStyle, _1: _user$project$Types$themeLibrary.defaultBackgroundNavStyle};
		case 'DarkTheme':
			return {ctor: '_Tuple2', _0: _user$project$Types$themeLibrary.darkBackgroundStyle, _1: _user$project$Types$themeLibrary.darkBackgroundNavStyle};
		default:
			return {ctor: '_Tuple2', _0: _user$project$Types$themeLibrary.darkBackgroundFlatStyle, _1: _user$project$Types$themeLibrary.darkBackgroundNavStyle};
	}
};
var _user$project$Types$Monitor = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return function (n) {
														return function (o) {
															return function (p) {
																return function (q) {
																	return function (r) {
																		return function (s) {
																			return function (t) {
																				return function (u) {
																					return function (v) {
																						return function (w) {
																							return function (x) {
																								return function (y) {
																									return {number: a, isSelected: b, isVisible: c, vgaOne: d, vgaTwo: e, dviOne: f, dviTwo: g, videoOne: h, videoTwo: i, videoThree: j, isVgaOneCycle: k, isVgaTwoCycle: l, isDviOneCycle: m, isDviOneCycle: n, isDviTwoCycle: o, isVideoOneCycle: p, isVideoTwoCycle: q, isVideoThreeCycle: r, isPipUpDownPressed: s, isPipLeftRightPressed: t, isPipResizePressed: u, isOsdUpDownPressed: v, isOsdLeftRightPressed: w, isOsdSelectPressed: x, isOn: y};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Types$ThemeLibrary = F6(
	function (a, b, c, d, e, f) {
		return {defaultBackgroundStyle: a, defaultBackgroundFlatStyle: b, defaultBackgroundNavStyle: c, darkBackgroundStyle: d, darkBackgroundFlatStyle: e, darkBackgroundNavStyle: f};
	});
var _user$project$Types$DarkFlatTheme = {ctor: 'DarkFlatTheme'};
var _user$project$Types$DarkTheme = {ctor: 'DarkTheme'};
var _user$project$Types$DefaultFlatTheme = {ctor: 'DefaultFlatTheme'};
var _user$project$Types$DefaultTheme = {ctor: 'DefaultTheme'};

var _user$project$Home$buildVersion = A2(
	_elm_lang$html$Html$div,
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_lang$html$Html_Attributes$class('build-version')
		]),
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_lang$html$Html$text('v.1.052520161350')
		]));
var _user$project$Home$setVisibilityByPageIndex = F4(
	function (newPageIndex, monitorsPerPage, index, monitor) {
		var isVisible$ = _elm_lang$core$Native_Utils.eq((index / monitorsPerPage) | 0, newPageIndex) ? true : false;
		return _elm_lang$core$Native_Utils.update(
			monitor,
			{isVisible: isVisible$});
	});
var _user$project$Home$findMonitor = F2(
	function (number, monitors) {
		var _p0 = A2(
			_elm_lang$core$List$take,
			1,
			A2(
				_elm_lang$core$List$filter,
				function (m) {
					return _elm_lang$core$Native_Utils.eq(m.number, number);
				},
				monitors));
		if ((_p0.ctor === '::') && (_p0._1.ctor === '[]')) {
			return _p0._0;
		} else {
			return A2(_user$project$Types$defaultMonitor, '-1', false);
		}
	});
var _user$project$Home$setSelectedMonitorsToPowerPress = function (monitors) {
	return A2(
		_elm_lang$core$List$map,
		function (m) {
			return m.isSelected ? _elm_lang$core$Native_Utils.update(
				m,
				{
					isOn: _elm_lang$core$Basics$not(m.isOn)
				}) : m;
		},
		monitors);
};
var _user$project$Home$flipMonitorPage = F4(
	function (flips, maxFlips, monitorsPerPage, model) {
		var newPageIndex = A3(_elm_lang$core$Basics$clamp, 0, maxFlips - 1, model.monitorPageIndex + flips);
		var monitors$ = model.monitors;
		return _elm_lang$core$Native_Utils.update(
			model,
			{
				monitorPageIndex: newPageIndex,
				monitors: A2(
					_elm_lang$core$List$indexedMap,
					A2(_user$project$Home$setVisibilityByPageIndex, newPageIndex, monitorsPerPage),
					monitors$)
			});
	});
var _user$project$Home$setAllMonitorAsSelected = F2(
	function (monitors, isSelected$) {
		return A2(
			_elm_lang$core$List$map,
			function (m) {
				return _elm_lang$core$Native_Utils.update(
					m,
					{isSelected: isSelected$});
			},
			monitors);
	});
var _user$project$Home$toggleMonitorAsSelected = F2(
	function (monitor, monitors) {
		return A2(
			_elm_lang$core$List$map,
			function (m) {
				return _elm_lang$core$Native_Utils.eq(m.number, monitor.number) ? _elm_lang$core$Native_Utils.update(
					monitor,
					{
						isSelected: _elm_lang$core$Basics$not(monitor.isSelected)
					}) : m;
			},
			monitors);
	});
var _user$project$Home$setMonitorAsSelected = F2(
	function (monitor, monitors) {
		return A2(
			_elm_lang$core$List$map,
			function (m) {
				return _elm_lang$core$Native_Utils.eq(m.number, monitor.number) ? _elm_lang$core$Native_Utils.update(
					monitor,
					{
						isSelected: _elm_lang$core$Basics$not(true)
					}) : _elm_lang$core$Native_Utils.update(
					m,
					{isSelected: false});
			},
			monitors);
	});
var _user$project$Home$update = F2(
	function (msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'UpdateValue':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{test: _p1._0}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'SelectMonitor':
				var monitors$ = A2(_user$project$Home$toggleMonitorAsSelected, _p1._0, model.monitors);
				var powerMustBeDisabled = (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$List$length(
						A2(
							_elm_lang$core$List$filter,
							function (m) {
								return m.isSelected;
							},
							monitors$)),
					0) > 0) ? false : true;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{monitors: monitors$, isPowerDisabled: powerMustBeDisabled}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'SelectAllMonitors':
				var model$ = model;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							monitors: A2(_user$project$Home$setAllMonitorAsSelected, model.monitors, model.isSelectAllActive),
							isPowerDisabled: false,
							isSelectAllActive: _elm_lang$core$Basics$not(model.isSelectAllActive)
						}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'SelectMonitorToConfigure':
				var model$ = model;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							monitors: A2(_user$project$Home$setMonitorAsSelected, _p1._0, model$.monitors)
						}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'MonitorPressedDown':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[
							_user$project$Ports$out_onPressedMonitor(_p1._0)
						]));
			case 'MonitorPressReleased':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'LongPressedMonitor':
				var model$ = model;
				var foundMonitor = A2(_user$project$Home$findMonitor, _p1._0, model$.monitors);
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							monitors: A2(_user$project$Home$setMonitorAsSelected, foundMonitor, model$.monitors)
						}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'PowerPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							monitors: _user$project$Home$setSelectedMonitorsToPowerPress(model.monitors)
						}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'PresetPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'SystemPreferencesPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[]));
			default:
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[]));
		}
	});
var _user$project$Home$defaultModel = {
	componentId: 1,
	monitors: _elm_lang$core$Native_List.fromArray(
		[
			A2(_user$project$Types$defaultMonitor, '1', true),
			A2(_user$project$Types$defaultMonitor, '2', true),
			A2(_user$project$Types$defaultMonitor, '3', true),
			A2(_user$project$Types$defaultMonitor, '4', true),
			A2(_user$project$Types$defaultMonitor, '5', true),
			A2(_user$project$Types$defaultMonitor, '6', true),
			A2(_user$project$Types$defaultMonitor, '7', true),
			A2(_user$project$Types$defaultMonitor, '8', true),
			A2(_user$project$Types$defaultMonitor, '9', true),
			A2(_user$project$Types$defaultMonitor, '10', true),
			A2(_user$project$Types$defaultMonitor, '11', true),
			A2(_user$project$Types$defaultMonitor, '12', true)
		]),
	monitorsPerPage: 5,
	monitorPageIndex: 0,
	isPowerDisabled: true,
	isSelectAllActive: true,
	test: 0,
	selectedTheme: _user$project$Types$DefaultTheme
};
var _user$project$Home$init = A2(
	_elm_lang$core$Platform_Cmd_ops['!'],
	_user$project$Home$defaultModel,
	_elm_lang$core$Native_List.fromArray(
		[]));
var _user$project$Home$Model = F8(
	function (a, b, c, d, e, f, g, h) {
		return {componentId: a, monitors: b, monitorsPerPage: c, monitorPageIndex: d, isPowerDisabled: e, isSelectAllActive: f, test: g, selectedTheme: h};
	});
var _user$project$Home$SystemPreferencesPress = {ctor: 'SystemPreferencesPress'};
var _user$project$Home$PresetPress = {ctor: 'PresetPress'};
var _user$project$Home$PowerPress = {ctor: 'PowerPress'};
var _user$project$Home$homePanelView = function (model) {
	var powerButtonState = model.isPowerDisabled ? '_disabled' : '';
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('home-panel-view')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-panel-division div-1-4 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class(
								A2(_elm_lang$core$Basics_ops['++'], 'content-centered power ', powerButtonState)),
								_elm_lang$html$Html_Events$onClick(_user$project$Home$PowerPress)
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('div-3-5 vdiv-3-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Icons$powerIcon(model.isPowerDisabled)
									]))
							]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-panel-division div-1-4 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[_user$project$Icons$brightnessSetupIcon])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-panel-division div-1-4 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('content-centered night-mode')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('div-3-5 vdiv-3-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[_user$project$Icons$nightModeIcon]))
							]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-panel-division div-1-4 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class(' content-centered presets')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('div-3-5 vdiv-3-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[_user$project$Icons$pipMenuIcon]))
							]))
					]))
			]));
};
var _user$project$Home$LockScreenPressed = function (a) {
	return {ctor: 'LockScreenPressed', _0: a};
};
var _user$project$Home$homeMenuView = function (style$) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('sub-panel-view'),
				_elm_lang$html$Html_Attributes$style(style$)
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-menu-item vdiv-1-1 div-1-4 content-centered'),
						_elm_lang$html$Html_Events$onClick(
						_user$project$Home$LockScreenPressed(''))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('content-centered vdiv-1-1 div-1-1')
							]),
						_elm_lang$core$Native_List.fromArray(
							[_user$project$Icons$lockIcon]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-menu-item vdiv-1-1 div-1-4 content-centered'),
						_elm_lang$html$Html_Events$onClick(_user$project$Home$PresetPress)
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('content-centered vdiv-1-1 div-1-1')
							]),
						_elm_lang$core$Native_List.fromArray(
							[_user$project$Icons$presetIcon]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-menu-item vdiv-1-1 div-1-4 content-centered'),
						_elm_lang$html$Html_Events$onClick(_user$project$Home$SystemPreferencesPress)
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('content-centered vdiv-1-1 div-1-1')
							]),
						_elm_lang$core$Native_List.fromArray(
							[_user$project$Icons$menuIcon]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('home-menu-item vdiv-1-1 div-1-4 content-centered')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('content-centered vdiv-1-1 div-1-1')
							]),
						_elm_lang$core$Native_List.fromArray(
							[_user$project$Icons$informationIcon]))
					]))
			]));
};
var _user$project$Home$SelectMonitorToConfigure = function (a) {
	return {ctor: 'SelectMonitorToConfigure', _0: a};
};
var _user$project$Home$LongPressedMonitor = function (a) {
	return {ctor: 'LongPressedMonitor', _0: a};
};
var _user$project$Home$MonitorPressReleased = function (a) {
	return {ctor: 'MonitorPressReleased', _0: a};
};
var _user$project$Home$MonitorPressedDown = function (a) {
	return {ctor: 'MonitorPressedDown', _0: a};
};
var _user$project$Home$SelectAllMonitors = {ctor: 'SelectAllMonitors'};
var _user$project$Home$monitorViewPager = A2(
	_elm_lang$html$Html$div,
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_lang$html$Html_Attributes$class('monitor-pager-view')
		]),
	_elm_lang$core$Native_List.fromArray(
		[
			A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('div-1-10 vdiv-1-1')
				]),
			_elm_lang$core$Native_List.fromArray(
				[])),
			A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('div-4-5 vdiv-1-1')
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-2-5')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-3-5 content-centered')
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							A2(
							_elm_lang$html$Html$div,
							_elm_lang$core$Native_List.fromArray(
								[
									_elm_lang$html$Html_Attributes$class('div-1-5 vdiv-1-1 monitor-selectall-button'),
									_elm_lang$html$Html_Events$onClick(_user$project$Home$SelectAllMonitors)
								]),
							_elm_lang$core$Native_List.fromArray(
								[
									A2(
									_elm_lang$html$Html$div,
									_elm_lang$core$Native_List.fromArray(
										[
											_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-10')
										]),
									_elm_lang$core$Native_List.fromArray(
										[])),
									A2(
									_elm_lang$html$Html$div,
									_elm_lang$core$Native_List.fromArray(
										[
											_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-4-5 content-centered')
										]),
									_elm_lang$core$Native_List.fromArray(
										[_user$project$Icons$selectAllIcon])),
									A2(
									_elm_lang$html$Html$div,
									_elm_lang$core$Native_List.fromArray(
										[
											_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-10')
										]),
									_elm_lang$core$Native_List.fromArray(
										[]))
								]))
						]))
				])),
			A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('div-1-10 vdiv-1-1')
				]),
			_elm_lang$core$Native_List.fromArray(
				[]))
		]));
var _user$project$Home$SelectMonitor = function (a) {
	return {ctor: 'SelectMonitor', _0: a};
};
var _user$project$Home$monitorViewButton = F2(
	function (monitorsPerPage, monitor) {
		var maxMonitorDisplays = _elm_lang$core$Basics$toString(monitorsPerPage);
		return A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class(
					A2(
						_elm_lang$core$Basics_ops['++'],
						'div-1-',
						A2(_elm_lang$core$Basics_ops['++'], maxMonitorDisplays, ' monitor-view-container ')))
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('monitor-view content-centered'),
							_elm_lang$html$Html_Events$onClick(
							_user$project$Home$SelectMonitor(monitor)),
							_elm_lang$html$Html_Events$onDoubleClick(
							_user$project$Home$SelectMonitorToConfigure(monitor)),
							_elm_lang$html$Html_Events$onMouseDown(
							_user$project$Home$MonitorPressedDown(monitor.number)),
							_elm_lang$html$Html_Events$onMouseUp(
							_user$project$Home$MonitorPressReleased(monitor.number))
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							A2(
							_elm_lang$html$Html$div,
							_elm_lang$core$Native_List.fromArray(
								[
									_elm_lang$html$Html_Attributes$class(
									A2(
										_elm_lang$core$Basics_ops['++'],
										'div-4-5 vdiv-4-5 ',
										_elm_lang$core$Basics$toString(monitor.isSelected)))
								]),
							_elm_lang$core$Native_List.fromArray(
								[
									A2(
									_elm_lang$html$Html$div,
									_elm_lang$core$Native_List.fromArray(
										[
											_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1')
										]),
									_elm_lang$core$Native_List.fromArray(
										[
											A2(_user$project$Icons$monitorIcon, monitor.number, monitor.isSelected)
										]))
								]))
						]))
				]));
	});
var _user$project$Home$monitorViewButtons = function (model) {
	return A2(
		_elm_lang$core$List$map,
		_user$project$Home$monitorViewButton(model.monitorsPerPage),
		model.monitors);
};
var _user$project$Home$monitorPanelView = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('monitor-panel-view')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				_user$project$Home$monitorViewPager,
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-4-5 monitor-views-parent')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('monitor-views div-1-1')
							]),
						_user$project$Home$monitorViewButtons(model))
					]))
			]));
};
var _user$project$Home$view = function (model) {
	var _p2 = _user$project$Types$getThemeStyle(model.selectedTheme);
	var upperBodyStyle = _p2._0;
	var lowerBodyStyle = _p2._1;
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('main'),
				_elm_lang$html$Html_Attributes$style(
				_elm_lang$core$Native_List.fromArray(
					[upperBodyStyle]))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html$text(
				_elm_lang$core$Basics$toString(model.test)),
				_user$project$Home$monitorPanelView(model),
				_user$project$Home$homePanelView(model),
				_user$project$Home$homeMenuView(
				_elm_lang$core$Native_List.fromArray(
					[lowerBodyStyle])),
				_user$project$Home$buildVersion
			]));
};
var _user$project$Home$UpdateValue = function (a) {
	return {ctor: 'UpdateValue', _0: a};
};
var _user$project$Home$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		_elm_lang$core$Native_List.fromArray(
			[
				_user$project$Ports$fromJS(_user$project$Home$UpdateValue)
			]));
};

var _user$project$MonitorSetup$setOsdSelectButtonPress = function (model) {
	var monitor = model.selectedMonitor;
	return _elm_lang$core$Native_Utils.update(
		model,
		{
			selectedMonitor: _elm_lang$core$Native_Utils.update(
				monitor,
				{
					isOsdSelectPressed: _elm_lang$core$Basics$not(monitor.isOsdSelectPressed)
				})
		});
};
var _user$project$MonitorSetup$setOsdLeftRightButtonPress = function (model) {
	var monitor = model.selectedMonitor;
	return _elm_lang$core$Native_Utils.update(
		model,
		{
			selectedMonitor: _elm_lang$core$Native_Utils.update(
				monitor,
				{
					isOsdLeftRightPressed: _elm_lang$core$Basics$not(monitor.isOsdLeftRightPressed)
				})
		});
};
var _user$project$MonitorSetup$setOsdUpDownButtonPress = function (model) {
	var monitor = model.selectedMonitor;
	return _elm_lang$core$Native_Utils.update(
		model,
		{
			selectedMonitor: _elm_lang$core$Native_Utils.update(
				monitor,
				{
					isOsdUpDownPressed: _elm_lang$core$Basics$not(monitor.isOsdUpDownPressed)
				})
		});
};
var _user$project$MonitorSetup$setPipResizeButtonPress = function (model) {
	var monitor = model.selectedMonitor;
	return _elm_lang$core$Native_Utils.update(
		model,
		{
			selectedMonitor: _elm_lang$core$Native_Utils.update(
				monitor,
				{
					isPipResizePressed: _elm_lang$core$Basics$not(monitor.isPipResizePressed)
				})
		});
};
var _user$project$MonitorSetup$setPipLeftRightButtonPress = function (model) {
	var monitor = model.selectedMonitor;
	return _elm_lang$core$Native_Utils.update(
		model,
		{
			selectedMonitor: _elm_lang$core$Native_Utils.update(
				monitor,
				{
					isPipLeftRightPressed: _elm_lang$core$Basics$not(monitor.isPipLeftRightPressed)
				})
		});
};
var _user$project$MonitorSetup$setPipUpDownButtonPress = function (model) {
	var monitor = model.selectedMonitor;
	return _elm_lang$core$Native_Utils.update(
		model,
		{
			selectedMonitor: _elm_lang$core$Native_Utils.update(
				monitor,
				{
					isPipUpDownPressed: _elm_lang$core$Basics$not(monitor.isPipUpDownPressed)
				})
		});
};
var _user$project$MonitorSetup$activateCycleSignalMatrix = F2(
	function (signalType, monitor) {
		var newMonitor = function () {
			var _p0 = signalType;
			switch (_p0) {
				case 'VGA 1':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{
							isVgaOneCycle: _elm_lang$core$Basics$not(monitor.isVgaOneCycle),
							isVgaTwoCycle: false,
							isDviOneCycle: false,
							isDviTwoCycle: false,
							isVideoOneCycle: false,
							isVideoTwoCycle: false,
							isVideoThreeCycle: false
						});
				case 'VGA 2':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{
							isVgaOneCycle: false,
							isVgaTwoCycle: _elm_lang$core$Basics$not(monitor.isVgaTwoCycle),
							isDviOneCycle: false,
							isDviTwoCycle: false,
							isVideoOneCycle: false,
							isVideoTwoCycle: false,
							isVideoThreeCycle: false
						});
				case 'DVI 1':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{
							isVgaOneCycle: false,
							isVgaTwoCycle: false,
							isDviOneCycle: _elm_lang$core$Basics$not(monitor.isDviOneCycle),
							isDviTwoCycle: false,
							isVideoOneCycle: false,
							isVideoTwoCycle: false,
							isVideoThreeCycle: false
						});
				case 'DVI 2':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{
							isVgaOneCycle: false,
							isVgaTwoCycle: false,
							isDviOneCycle: false,
							isDviTwoCycle: _elm_lang$core$Basics$not(monitor.isDviTwoCycle),
							isVideoOneCycle: false,
							isVideoTwoCycle: false,
							isVideoThreeCycle: false
						});
				case 'VIDEO 1':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{
							isVgaOneCycle: false,
							isVgaTwoCycle: false,
							isDviOneCycle: false,
							isDviTwoCycle: false,
							isVideoOneCycle: _elm_lang$core$Basics$not(monitor.isVideoOneCycle),
							isVideoTwoCycle: false,
							isVideoThreeCycle: false
						});
				case 'VIDEO 2':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{
							isVgaOneCycle: false,
							isVgaTwoCycle: false,
							isDviOneCycle: false,
							isDviTwoCycle: false,
							isVideoOneCycle: false,
							isVideoTwoCycle: _elm_lang$core$Basics$not(monitor.isVideoTwoCycle),
							isVideoThreeCycle: false
						});
				case 'VIDEO 3':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{
							isVgaOneCycle: false,
							isVgaTwoCycle: false,
							isDviOneCycle: false,
							isDviTwoCycle: false,
							isVideoOneCycle: false,
							isVideoTwoCycle: false,
							isVideoThreeCycle: _elm_lang$core$Basics$not(monitor.isVideoThreeCycle)
						});
				default:
					return monitor;
			}
		}();
		return newMonitor;
	});
var _user$project$MonitorSetup$setOsdButtonPress = function (model) {
	return model;
};
var _user$project$MonitorSetup$setPipButtonPress = function (model) {
	return model;
};
var _user$project$MonitorSetup$setSignalInputChange = F3(
	function (signalType, value, monitor) {
		var newMonitor = function () {
			var _p1 = signalType;
			switch (_p1) {
				case 'VGA 1':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{vgaOne: value});
				case 'VGA 2':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{vgaTwo: value});
				case 'DVI 1':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{dviOne: value});
				case 'DVI 2':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{dviTwo: value});
				case 'VIDEO 1':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{videoOne: value});
				case 'VIDEO 2':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{videoTwo: value});
				case 'VIDEO 3':
					return _elm_lang$core$Native_Utils.update(
						monitor,
						{videoThree: value});
				default:
					return monitor;
			}
		}();
		return newMonitor;
	});
var _user$project$MonitorSetup$updateMonitorList = F2(
	function (monitor, monitors) {
		return A2(
			_elm_lang$core$List$map,
			function (m) {
				return _elm_lang$core$Native_Utils.eq(m.number, monitor.number) ? _elm_lang$core$Native_Utils.update(
					monitor,
					{isSelected: true}) : m;
			},
			monitors);
	});
var _user$project$MonitorSetup$Model = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return {selectedMonitor: a, isVgaOneSelectOpen: b, isVgaTwoSelectOpen: c, isDviOneSelectOpen: d, isDviTwoSelectOpen: e, isVideoOneSelectOpen: f, isVideoTwoSelectOpen: g, isVideoThreeSelectOpen: h, isOsdSetPressed: i, isPipSetPressed: j, segmentState: k, selectedTheme: l};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$MonitorSetup$Osd = {ctor: 'Osd'};
var _user$project$MonitorSetup$Pip = {ctor: 'Pip'};
var _user$project$MonitorSetup$None = {ctor: 'None'};
var _user$project$MonitorSetup$defaultModel = {
	selectedMonitor: A2(_user$project$Types$defaultMonitor, '1', true),
	isVgaOneSelectOpen: false,
	isVgaTwoSelectOpen: false,
	isDviOneSelectOpen: false,
	isDviTwoSelectOpen: false,
	isVideoOneSelectOpen: false,
	isVideoTwoSelectOpen: false,
	isVideoThreeSelectOpen: false,
	isOsdSetPressed: false,
	isPipSetPressed: false,
	segmentState: _user$project$MonitorSetup$None,
	selectedTheme: _user$project$Types$DefaultTheme
};
var _user$project$MonitorSetup$init = A2(
	_elm_lang$core$Platform_Cmd_ops['!'],
	_user$project$MonitorSetup$defaultModel,
	_elm_lang$core$Native_List.fromArray(
		[]));
var _user$project$MonitorSetup$update = F2(
	function (msg, model) {
		var _p2 = msg;
		switch (_p2.ctor) {
			case 'CloseMonitorConfiguration':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[
							_user$project$Ports$out_returnToHomeMode('')
						]));
			case 'SignalInputToggle':
				var selectedMonitor$ = model.selectedMonitor;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{
							selectedMonitor: A2(_user$project$MonitorSetup$activateCycleSignalMatrix, _p2._0, selectedMonitor$)
						}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'PipButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{segmentState: _user$project$MonitorSetup$Pip}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'OsdButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{segmentState: _user$project$MonitorSetup$Osd}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'PipUpDownButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_user$project$MonitorSetup$setPipUpDownButtonPress(model),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'PipLeftRightButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_user$project$MonitorSetup$setPipLeftRightButtonPress(model),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'PipResizeButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_user$project$MonitorSetup$setPipResizeButtonPress(model),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'OsdUpDownButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_user$project$MonitorSetup$setOsdUpDownButtonPress(model),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'OsdLeftRightButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_user$project$MonitorSetup$setOsdLeftRightButtonPress(model),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'OsdSelectButtonPress':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_user$project$MonitorSetup$setOsdSelectButtonPress(model),
					_elm_lang$core$Native_List.fromArray(
						[]));
			default:
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{segmentState: _user$project$MonitorSetup$None}),
					_elm_lang$core$Native_List.fromArray(
						[]));
		}
	});
var _user$project$MonitorSetup$ExitMonitorSettingSegmentPress = {ctor: 'ExitMonitorSettingSegmentPress'};
var _user$project$MonitorSetup$OsdSelectButtonPress = {ctor: 'OsdSelectButtonPress'};
var _user$project$MonitorSetup$OsdLeftRightButtonPress = {ctor: 'OsdLeftRightButtonPress'};
var _user$project$MonitorSetup$OsdUpDownButtonPress = {ctor: 'OsdUpDownButtonPress'};
var _user$project$MonitorSetup$monitorSettingSegmentStateViewOsd = function (monitorSettingState) {
	var monitor = monitorSettingState.selectedMonitor;
	var isLeftRightOn = monitor.isOsdLeftRightPressed ? 'disabled' : '';
	var isUpDownOn = monitor.isOsdUpDownPressed ? 'disabled' : '';
	var isSelectedOn = monitor.isOsdSelectPressed ? 'disabled' : '';
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1 content-centered')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-4-5 vdiv-4-5')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class(
										A2(_elm_lang$core$Basics_ops['++'], 'div-3-4 vdiv-3-4 osd-button monitor-button content-centered ', isLeftRightOn)),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$OsdLeftRightButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Icons$leftRightIcon(monitor.isOsdLeftRightPressed)
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class(
										A2(_elm_lang$core$Basics_ops['++'], 'div-3-4 vdiv-3-4 osd-button monitor-button content-centered ', isUpDownOn)),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$OsdUpDownButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Icons$upDownIcon(monitor.isOsdUpDownPressed)
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class(
										A2(_elm_lang$core$Basics_ops['++'], 'div-3-4 vdiv-3-4 osd-button monitor-button content-centered ', isSelectedOn)),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$OsdSelectButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Icons$selectIcon(monitor.isOsdSelectPressed)
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('div-3-4 vdiv-3-4 pip-button monitor-button content-centered '),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$ExitMonitorSettingSegmentPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[_user$project$Icons$exitOsdIcon]))
							]))
					]))
			]));
};
var _user$project$MonitorSetup$osdButtonSetView = function (model) {
	var getIsPressedSrc = function (value) {
		return value ? 'images/osd_type_button_pressed.svg' : 'images/osd_type_button.svg';
	};
	var monitor = model.selectedMonitor;
	var upDownSrc = getIsPressedSrc(monitor.isOsdUpDownPressed);
	var leftRightSrc = getIsPressedSrc(monitor.isOsdLeftRightPressed);
	var selectSrc = getIsPressedSrc(monitor.isOsdSelectPressed);
	var isVisible = _elm_lang$core$Basics$not(model.isOsdSetPressed) ? 'hidden' : '';
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class(
				A2(_elm_lang$core$Basics_ops['++'], 'div-1-3 ', isVisible))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('vdiv-1-2')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-2 align-center')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-1-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('LEFT/RIGHT')
									])),
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-4-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$img,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('vdiv-1-1'),
												_elm_lang$html$Html_Attributes$src(leftRightSrc),
												_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$OsdLeftRightButtonPress)
											]),
										_elm_lang$core$Native_List.fromArray(
											[]))
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-2 align-center')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-1-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('UP/DOWN')
									])),
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-4-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$img,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('vdiv-1-1'),
												_elm_lang$html$Html_Attributes$src(upDownSrc),
												_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$OsdUpDownButtonPress)
											]),
										_elm_lang$core$Native_List.fromArray(
											[]))
									]))
							]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('vdiv-1-2 align-center')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-1 align-center')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-1-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('SELECT')
									])),
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-4-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$img,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('vdiv-1-1'),
												_elm_lang$html$Html_Attributes$src(selectSrc),
												_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$OsdSelectButtonPress)
											]),
										_elm_lang$core$Native_List.fromArray(
											[]))
									]))
							]))
					]))
			]));
};
var _user$project$MonitorSetup$PipResizeButtonPress = {ctor: 'PipResizeButtonPress'};
var _user$project$MonitorSetup$PipLeftRightButtonPress = {ctor: 'PipLeftRightButtonPress'};
var _user$project$MonitorSetup$PipUpDownButtonPress = {ctor: 'PipUpDownButtonPress'};
var _user$project$MonitorSetup$monitorSettingSegmentStateViewPip = function (model) {
	var monitor = model.selectedMonitor;
	var isLeftRightOn = monitor.isPipLeftRightPressed ? 'disabled' : '';
	var isUpDownOn = monitor.isPipUpDownPressed ? 'disabled' : '';
	var isResizeOn = monitor.isPipResizePressed ? 'disabled' : '';
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1 content-centered')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-4-5 vdiv-4-5')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class(
										A2(_elm_lang$core$Basics_ops['++'], 'div-3-4 vdiv-3-4 pip-button monitor-button content-centered ', isLeftRightOn)),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$PipLeftRightButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Icons$leftRightIcon(monitor.isPipLeftRightPressed)
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class(
										A2(_elm_lang$core$Basics_ops['++'], 'div-3-4 vdiv-3-4 pip-button monitor-button content-centered ', isUpDownOn)),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$PipUpDownButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Icons$upDownIcon(monitor.isPipUpDownPressed)
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class(
										A2(_elm_lang$core$Basics_ops['++'], 'div-3-4 vdiv-3-4 pip-button monitor-button content-centered ', isResizeOn)),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$PipResizeButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Icons$resizeIcon(monitor.isPipResizePressed)
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('div-3-4 vdiv-3-4 pip-button monitor-button content-centered '),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$ExitMonitorSettingSegmentPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[_user$project$Icons$exitPipIcon]))
							]))
					]))
			]));
};
var _user$project$MonitorSetup$pipButtonSetView = function (model) {
	var getIsPressedSrc = function (value) {
		return value ? 'images/pip_type_button_pressed.svg' : 'images/pip_type_button.svg';
	};
	var monitor = model.selectedMonitor;
	var upDownSrc = getIsPressedSrc(monitor.isPipUpDownPressed);
	var leftRightSrc = getIsPressedSrc(monitor.isPipLeftRightPressed);
	var resizeSrc = getIsPressedSrc(monitor.isPipResizePressed);
	var isVisible = _elm_lang$core$Basics$not(model.isPipSetPressed) ? 'hidden' : '';
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class(
				A2(_elm_lang$core$Basics_ops['++'], 'div-1-3 ', isVisible))
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('vdiv-1-2')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-2 align-center')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-1-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('LEFT/RIGHT')
									])),
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-4-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$img,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('vdiv-1-1'),
												_elm_lang$html$Html_Attributes$src(leftRightSrc),
												_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$PipLeftRightButtonPress)
											]),
										_elm_lang$core$Native_List.fromArray(
											[]))
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-2 align-center')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-1-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('UP/DOWN')
									])),
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-4-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$img,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('vdiv-1-1'),
												_elm_lang$html$Html_Attributes$src(upDownSrc),
												_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$PipUpDownButtonPress)
											]),
										_elm_lang$core$Native_List.fromArray(
											[]))
									]))
							]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('vdiv-1-2 align-center')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-1 align-center')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-1-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('RESIZE')
									])),
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('vdiv-4-5')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$img,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('vdiv-1-1'),
												_elm_lang$html$Html_Attributes$src(resizeSrc),
												_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$PipResizeButtonPress)
											]),
										_elm_lang$core$Native_List.fromArray(
											[]))
									]))
							]))
					]))
			]));
};
var _user$project$MonitorSetup$OsdButtonPress = {ctor: 'OsdButtonPress'};
var _user$project$MonitorSetup$PipButtonPress = {ctor: 'PipButtonPress'};
var _user$project$MonitorSetup$monitorSettingSegmentStateViewNone = function (monitor) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('div-1-1 vdiv-1-1 content-centered')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-4-5 vdiv-4-5')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('div-3-4 vdiv-3-4 pip-button monitor-button content-centered '),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$PipButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[_user$project$Icons$pipIcon]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('div-1-4 content-centered')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('div-3-4 vdiv-3-4 pip-button monitor-button content-centered '),
										_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$OsdButtonPress)
									]),
								_elm_lang$core$Native_List.fromArray(
									[_user$project$Icons$osdIcon]))
							]))
					]))
			]));
};
var _user$project$MonitorSetup$monitorSettingLowerBodyView = function (model) {
	var view = function () {
		var _p3 = model.segmentState;
		switch (_p3.ctor) {
			case 'None':
				return _user$project$MonitorSetup$monitorSettingSegmentStateViewNone(model);
			case 'Pip':
				return _user$project$MonitorSetup$monitorSettingSegmentStateViewPip(model);
			default:
				return _user$project$MonitorSetup$monitorSettingSegmentStateViewOsd(model);
		}
	}();
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('monitor-setting-lower-body')
			]),
		_elm_lang$core$Native_List.fromArray(
			[view]));
};
var _user$project$MonitorSetup$CloseMonitorConfiguration = {ctor: 'CloseMonitorConfiguration'};
var _user$project$MonitorSetup$monitorSettingTopBarView = F2(
	function (monitorSettingScreenState, style$) {
		return A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('app-top-bar vdiv-1-10'),
					_elm_lang$html$Html_Attributes$style(
					_elm_lang$core$Native_List.fromArray(
						[style$]))
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('div-1-10 vdiv-1-1 content-centered nav-header')
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							_user$project$General$appTopBarHeader(
							A2(_elm_lang$core$Basics_ops['++'], '#', monitorSettingScreenState.selectedMonitor.number))
						])),
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('div-1-10 float-right'),
							_elm_lang$html$Html_Events$onClick(_user$project$MonitorSetup$CloseMonitorConfiguration)
						]),
					_elm_lang$core$Native_List.fromArray(
						[_user$project$General$closeIconView]))
				]));
	});
var _user$project$MonitorSetup$SignalInputToggle = function (a) {
	return {ctor: 'SignalInputToggle', _0: a};
};
var _user$project$MonitorSetup$signalMatrixView = F4(
	function (signalType, signalName, monitorSettingScreenState, monitor) {
		var isActivated = function () {
			var _p4 = signalType;
			switch (_p4) {
				case 'VGA 1':
					return monitor.isVgaOneCycle;
				case 'VGA 2':
					return monitor.isVgaTwoCycle;
				case 'DVI 1':
					return monitor.isDviOneCycle;
				case 'DVI 2':
					return monitor.isDviTwoCycle;
				case 'VIDEO 1':
					return monitor.isVideoOneCycle;
				case 'VIDEO 2':
					return monitor.isVideoTwoCycle;
				case 'VIDEO 3':
					return monitor.isVideoThreeCycle;
				default:
					return false;
			}
		}();
		return A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('signal-matrix-view vdiv-1-3')
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('signal-matrix-label div-1-1 vdiv-1-2 content-centered')
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html$text(signalType)
						])),
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('signal-matrix-container div-1-1 vdiv-1-2')
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							A2(
							_elm_lang$html$Html$div,
							_elm_lang$core$Native_List.fromArray(
								[
									_elm_lang$html$Html_Attributes$class(
									A2(_elm_lang$core$Basics_ops['++'], 'div-1-1 vdiv-1-1 content-centered ', signalType))
								]),
							_elm_lang$core$Native_List.fromArray(
								[
									A2(
									_elm_lang$html$Html$span,
									_elm_lang$core$Native_List.fromArray(
										[
											_elm_lang$html$Html_Attributes$class(
											A2(
												_elm_lang$core$Basics_ops['++'],
												'signal-matrix-input div-3-5 vdiv-1-1 content-centered ',
												isActivated ? ' activated' : '')),
											_elm_lang$html$Html_Events$onClick(
											_user$project$MonitorSetup$SignalInputToggle(signalType))
										]),
									_elm_lang$core$Native_List.fromArray(
										[
											_elm_lang$html$Html$text(signalName)
										]))
								]))
						])),
					A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('clear-both')
						]),
					_elm_lang$core$Native_List.fromArray(
						[]))
				]));
	});
var _user$project$MonitorSetup$monitorSettingUpperBodyView = function (model) {
	var monitor = model.selectedMonitor;
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('monitor-setting-upper-body div-1-1')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-1-3 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A4(_user$project$MonitorSetup$signalMatrixView, 'VGA 1', monitor.vgaOne, model, monitor),
						A4(_user$project$MonitorSetup$signalMatrixView, 'VGA 2', monitor.vgaTwo, model, monitor)
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-1-3 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A4(_user$project$MonitorSetup$signalMatrixView, 'DVI 1', monitor.dviOne, model, monitor),
						A4(_user$project$MonitorSetup$signalMatrixView, 'DVI 2', monitor.dviTwo, model, monitor)
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('div-1-3 vdiv-1-1')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A4(_user$project$MonitorSetup$signalMatrixView, 'VIDEO 1', monitor.videoOne, model, monitor),
						A4(_user$project$MonitorSetup$signalMatrixView, 'VIDEO 2', monitor.videoTwo, model, monitor),
						A4(_user$project$MonitorSetup$signalMatrixView, 'VIDEO 3', monitor.videoThree, model, monitor)
					]))
			]));
};
var _user$project$MonitorSetup$monitorSettingBodyView = F2(
	function (model, style$) {
		return A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('app-body vdiv-9-10'),
					_elm_lang$html$Html_Attributes$style(
					_elm_lang$core$Native_List.fromArray(
						[style$]))
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					_user$project$MonitorSetup$monitorSettingUpperBodyView(model),
					_user$project$MonitorSetup$monitorSettingLowerBodyView(model)
				]));
	});
var _user$project$MonitorSetup$view = function (model) {
	var _p5 = _user$project$Types$getThemeStyle(model.selectedTheme);
	var upperBodyStyle = _p5._0;
	var lowerBodyStyle = _p5._1;
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('main')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(_user$project$MonitorSetup$monitorSettingTopBarView, model, upperBodyStyle),
				A2(_user$project$MonitorSetup$monitorSettingBodyView, model, lowerBodyStyle)
			]));
};

var _user$project$Main$Model = F3(
	function (a, b, c) {
		return {homeModel: a, monitorSetupModel: b, viewMode: c};
	});
var _user$project$Main$MonitorSetupMode = {ctor: 'MonitorSetupMode'};
var _user$project$Main$HomeMode = {ctor: 'HomeMode'};
var _user$project$Main$ReturnToHomeMode = function (a) {
	return {ctor: 'ReturnToHomeMode', _0: a};
};
var _user$project$Main$UpdateLockCountdownSecondsLeft = function (a) {
	return {ctor: 'UpdateLockCountdownSecondsLeft', _0: a};
};
var _user$project$Main$UnlockLockCountdown = function (a) {
	return {ctor: 'UnlockLockCountdown', _0: a};
};
var _user$project$Main$LongPressedMonitor = function (a) {
	return {ctor: 'LongPressedMonitor', _0: a};
};
var _user$project$Main$MonitorSetupMainMsg = function (a) {
	return {ctor: 'MonitorSetupMainMsg', _0: a};
};
var _user$project$Main$HomeMainMsg = function (a) {
	return {ctor: 'HomeMainMsg', _0: a};
};
var _user$project$Main$init = function () {
	var _p0 = _user$project$MonitorSetup$init;
	var monitorSetupVal = _p0._0;
	var monitorSetupCmd = _p0._1;
	var _p1 = _user$project$Home$init;
	var homeVal = _p1._0;
	var homeCmd = _p1._1;
	return {
		ctor: '_Tuple2',
		_0: A3(_user$project$Main$Model, homeVal, monitorSetupVal, _user$project$Main$HomeMode),
		_1: _elm_lang$core$Platform_Cmd$batch(
			_elm_lang$core$Native_List.fromArray(
				[
					A2(_elm_lang$core$Platform_Cmd$map, _user$project$Main$HomeMainMsg, homeCmd),
					A2(_elm_lang$core$Platform_Cmd$map, _user$project$Main$MonitorSetupMainMsg, monitorSetupCmd)
				]))
	};
}();
var _user$project$Main$update = F2(
	function (msg, model) {
		var _p2 = msg;
		switch (_p2.ctor) {
			case 'HomeMainMsg':
				var _p3 = A2(_user$project$Home$update, _p2._0, model.homeModel);
				var newHomeModel = _p3._0;
				var cmd = _p3._1;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{homeModel: newHomeModel}),
					_elm_lang$core$Native_List.fromArray(
						[
							A2(_elm_lang$core$Platform_Cmd$map, _user$project$Main$HomeMainMsg, cmd)
						]));
			case 'MonitorSetupMainMsg':
				var _p4 = A2(_user$project$MonitorSetup$update, _p2._0, model.monitorSetupModel);
				var newMonitorSetupModel = _p4._0;
				var cmd = _p4._1;
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{monitorSetupModel: newMonitorSetupModel}),
					_elm_lang$core$Native_List.fromArray(
						[
							A2(_elm_lang$core$Platform_Cmd$map, _user$project$Main$MonitorSetupMainMsg, cmd)
						]));
			case 'LongPressedMonitor':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{viewMode: _user$project$Main$MonitorSetupMode}),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'UnlockLockCountdown':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'UpdateLockCountdownSecondsLeft':
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					model,
					_elm_lang$core$Native_List.fromArray(
						[]));
			default:
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_elm_lang$core$Native_Utils.update(
						model,
						{viewMode: _user$project$Main$HomeMode}),
					_elm_lang$core$Native_List.fromArray(
						[]));
		}
	});
var _user$project$Main$view = function (model) {
	var view = function () {
		var _p5 = model.viewMode;
		if (_p5.ctor === 'HomeMode') {
			return A2(
				_elm_lang$html$Html_App$map,
				_user$project$Main$HomeMainMsg,
				_user$project$Home$view(model.homeModel));
		} else {
			return A2(
				_elm_lang$html$Html_App$map,
				_user$project$Main$MonitorSetupMainMsg,
				_user$project$MonitorSetup$view(model.monitorSetupModel));
		}
	}();
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[view]));
};
var _user$project$Main$subscriptions = function (model) {
	return _elm_lang$core$Platform_Sub$batch(
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$core$Platform_Sub$map,
				_user$project$Main$HomeMainMsg,
				_user$project$Home$subscriptions(model.homeModel)),
				_user$project$Ports$in_longPressedMonitor(_user$project$Main$LongPressedMonitor),
				_user$project$Ports$in_returnToHomeMode(_user$project$Main$ReturnToHomeMode)
			]));
};
var _user$project$Main$main = {
	main: _elm_lang$html$Html_App$program(
		{init: _user$project$Main$init, update: _user$project$Main$update, view: _user$project$Main$view, subscriptions: _user$project$Main$subscriptions})
};

var Elm = {};
Elm['Main'] = Elm['Main'] || {};
_elm_lang$core$Native_Platform.addPublicModule(Elm['Main'], 'Main', typeof _user$project$Main$main === 'undefined' ? null : _user$project$Main$main);

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

