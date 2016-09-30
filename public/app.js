var Xml2Json = function(){
	this.documents=[];
	this.documentList = $('.document-list');
	
	this.convertBtn = $('#convert-btn');
	this.convertBtn.click(this.onConvertBtnClick.bind(this));

	this.main = $('main');
	this.main.on('click','li',this.onExistingDocumentClick.bind(this));
	this.main.on('click', 'li .delete-document', this.onDeleteDocumentClick.bind(this));
	this.documentListTemplate = Handlebars.compile($("#document-list-template").html());
 	this.getDocuments();
};

//page load display all documents

Xml2Json.prototype.getDocuments = function(newDocument){
	if(newDocument!==undefined && newDocument._id!==undefined){
		
		$('#xml-text').val(newDocument.xml_doc);
		$('#json-text').val(JSON.stringify(JSON.parse(newDocument.json_doc),null,2));
		$('#doc-name').val(newDocument.doc_name);
	}
	var ajax = $.ajax('/documents', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(this.onGetDocumentsDone.bind(this));
};

Xml2Json.prototype.onGetDocumentsDone = function(documents){
	
	this.documents = documents;
	this.updateDocumentsView();
};

Xml2Json.prototype.updateDocumentsView = function(){
	var context = {
		documents: this.documents
	};
	var documentList = $(this.documentListTemplate(context));
	this.documentList.replaceWith(documentList);
	this.documentList = documentList;
};
// Convert button click 
Xml2Json.prototype.onConvertBtnClick = function(event){
	
	var url = $('#url-text').val();
	var xml = $('#xml-text').val();
	var name = $('#doc-name').val();
	if(url=='' && xml==''){
		alert("error");
		return;
	}
	if(url!==""){
		var mode = 'url';
		this.addDocument(url,name,mode);
	}
	else{
		var mode = 'text';
		this.addDocument(xml,name,mode); 
	}
};

Xml2Json.prototype.addDocument = function(xmlOrUrl,name,mode){
	var document = { 'xmlOrUrl':xmlOrUrl,
		'doc_name':name,
		'mode':mode
	};
	var ajax = $.ajax('/documents', {
        type: 'POST',
        data: JSON.stringify(document),
        dataType: 'json',
        contentType: 'application/json'
	});
    ajax.done(this.getDocuments.bind(this));	
};
// existing document click
Xml2Json.prototype.onExistingDocumentClick = function(event) {
	
	var existingDocumentId = $(event.target).parents('li').data('id');
	this.getExistingDocument(existingDocumentId);

};
Xml2Json.prototype.getExistingDocument = function(id){
	var ajax = $.ajax('/documents/'+id,{
		type: 'GET',
		dataType:'json'
	});
		
	ajax.done(this.onGetExistingDocumentDone.bind(this));
};
Xml2Json.prototype.onGetExistingDocumentDone = function(document){
		$('#xml-text').val(document.xml_doc);
		$('#json-text').val(JSON.stringify(JSON.parse(document.json_doc),null,2));
		$('#doc-name').val(document.doc_name);
};
// on delete click
Xml2Json.prototype.onDeleteDocumentClick = function(event){
	var documentId = $(event.target).parents('li').data('id');
	this.deleteDocument(documentId);
};
Xml2Json.prototype.deleteDocument = function(id){
	var ajax = $.ajax('/documents/'+id,{
		type:'DELETE',
		dataType: 'json'
	});
	 ajax.done(this.getDocuments.bind(this));	
};

 $(document).ready(function() {
    var app = new Xml2Json();
});