// Bootstraps the layout process
var treemap = function(container, options) {
    var bounds = container.bounds;
	bounds.x = options.padding;
	bounds.width -= 2 * options.padding;
	bounds.y = options.padding_top;
	bounds.height -= options.padding + options.padding_top;
	_treemap(bounds, $(container).children(), options);
}

// Arrange elements contained in the collection to cover the bounds
var _treemap = function(bounds, collection, options) {
	if (collection.size() == 0) {
		return;
	}
	
	// Clone options
	var options = Object.create(options);
	
	options.debug ? console.log(bounds) : null;
	// Find collection member which has the most leafs
	var total_leafs = leafs(collection);
	var max_leafs = 0;
	var biggest_element = null;
	collection.each(function(member) {
		var member_leafs = leafs($(member));
		if (member_leafs > max_leafs) {
			max_leafs = member_leafs;
			biggest_element = member;
		}
	});
	options.debug ? console.log("Found that the biggest member is ", biggest_element, " with ", max_leafs, " leafs over ", total_leafs, " total leafs") : null;
	
	// Now define bounds for this biggest member and then iterate on other members and remaining bounds
    if (options.layout == "col" || (options.layout != "row" && bounds.width / bounds.height >= options.aspect_ratio)) {
		// Use "columns" layout
		
		// Update biggest_element's bounds
		var new_bounds = biggest_element.bounds;
		new_bounds.x = bounds.x;
		new_bounds.y = bounds.y;
		new_bounds.width = (bounds.width - (total_leafs-1)*options.padding) * max_leafs / total_leafs;
		new_bounds.height = bounds.height;
		options.debug ? console.log(new_bounds) : null;
		biggest_element.bounds = new_bounds;
		
		// Layout biggest_element's children
		bounds.width -= new_bounds.width + options.padding;
		bounds.x += new_bounds.width + options.padding;
		treemap(biggest_element, options);
		
		// If we work on leafs, fix the layout for more readability
		options.layout = max_leafs == 1 ? "col" : options.layout;
		options.debug ? console.log("max_leafs=", max_leafs, ", layout=", options.layout) : null;
		_treemap(bounds, collection.not($(biggest_element)), options);
    } else {
		// Use "rows" layout
		
		// Update biggest_element's bounds
        var new_bounds = biggest_element.bounds;
		new_bounds.x = bounds.x;
		new_bounds.y = bounds.y;
		new_bounds.width = bounds.width;
		new_bounds.height = (bounds.height - (total_leafs-1)*options.padding) * max_leafs / total_leafs;
		options.debug ? console.log(new_bounds) : null;
		biggest_element.bounds = new_bounds;
		
		// Layout biggest_element's children
		bounds.height -= new_bounds.height + options.padding;
		bounds.y += new_bounds.height + options.padding;
		treemap(biggest_element, options);
		
		// If we work on leafs, fix the layout for more readability
		options.layout = max_leafs == 1 ? "row" : options.layout;
		options.debug ? console.log("max_leafs=", max_leafs, ", layout=", options.layout) : null;
		_treemap(bounds, collection.not($(biggest_element)), options);
    }
}

var leafs = function(collection) {
	return collection.clone().add(collection.find("element")).filter(function(o) {
		return $(o).children().size() == 0
	}).size();
}