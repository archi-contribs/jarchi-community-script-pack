function convert(filename) {
    convertToType = getTypeFromFilename(filename);

    var relaxed = window.confirm('By default, selected concepts are converted, and relationships involving them that would no more be valid are converted to associations. Click OK for this behavior or Cancel if you want a "strict" mode where relationships are not changed.');

    $(selection).each(function (o) {
        $(concept(o)).outRels().each(function (r) {
            if (!$.model.isAllowedRelationship(r.type, convertToType, r.target.type)) {
                checkAndConvertRelationship(r, relaxed);
            }
        });
        $(concept(o)).inRels().each(function (r) {
            if (!$.model.isAllowedRelationship(r.type, r.source.type, convertToType)) {
                checkAndConvertRelationship(r, relaxed);
            }
        });
        concept(o).concept.type = convertToType;
    });
}

function checkAndConvertRelationship(r, relaxed) {
    if (relaxed) {
        r.documentation = 'This relationship has been converted from "' + r.type.replace(/-relationship$/, '') + '" to "association"\n' + r.documentation;
        r.type = "association-relationship";
    } else {
        window.alert('Relationship "' + r.name + '" from "' + r.source.name + '" to "' + r.target.name + '" will not be valid after conversion and "strict" mode is on. Conversion aborted.');
        exit();
    }
}

function concept(o) {
    return o.concept ? o.concept : o;
}

function getTypeFromFilename(fileName) {
    return fileName.replace(/^.*[\/\\]/, '').replace(/\.ajs$/, '').replace(/(%20|\s)/g, '-').toLowerCase();
}