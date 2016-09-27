var mongoose = require('mongoose');
var DocumentSchema = new mongoose.Schema({
	xml_doc : String,
    doc_name : String,
	json_doc : String
	
});
var Document = mongoose.model('Document',DocumentSchema);

module.exports = Document;


