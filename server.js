var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var request = require('request');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
var urlParser = bodyParser.urlencoded({
  extended: true
});
app.use(urlParser);

var runServer = function(callback){
	mongoose.connect(config.DATABASE_URL, function(err){
		if(err && callback){
			return callback(err);
		}
	
		app.listen(config.PORT, function(){
			console.log('Listening on localhost:' + config.PORT);
			if(callback){ 
				callback();
			}
		});	
	});
};

if(require.main === module){
	runServer(function(err){
		if(err){
			console.error(err);
		}
	});
};

exports.app = app;
exports.runServer = runServer;

var Document = require('./models/document');

var fs = require('fs'); // File System Module
var xml2js = require('xml2js'); // XML2JS Module
var parser = new xml2js.Parser({explicitArray : false}); // Creating XML to JSON parser object

app.post('/documents', function(req, res){
	var doc_name = req.body.doc_name;
	var mode = req.body.mode;
	var xml_doc = "";
	if(mode == 'text'){
		xml_doc = req.body.xmlOrUrl;
		xml2json(doc_name,xml_doc,res);
	} 
	if(mode == 'url'){
        var url = req.body.xmlOrUrl;
		request({ url: url,
    		        json: true},function (error, response, body) {
    		  	if (!error && response.statusCode === 200) {
        		xml2json(doc_name,body,res);
    			}
		  });
	}
});

function xml2json(doc_name,xml_doc,res){
	parser.parseString(xml_doc, function (err, result) {
        	var json_doc= JSON.stringify(result);
        	Document.create({
			doc_name:doc_name,
               		xml_doc : xml_doc,
              		json_doc : json_doc
                	},function(err,document){
		               	if(err){
        	                	return res.status(500).json({
                	                	message: 'Internal  Server Error'
                        		});
                		}
                		res.status(201).json(document);
	            	});
    		});
}
app.get('/documents', function(req, res){
	Document.find(function(err, documents){
		if(err){
			return res.status(500).json({
				message: 'Internal Server Error'
			});
		}
		res.json(documents);
	});
});
app.get('/documents/:id/:mode', function(req, res){
	id = req.params.id;
    Document.findById(id,function(err, document){
      if(err){
        return res.status(500).json({
          message: 'Internal Server Error'
        });
      }
      
      if(req.params.mode=='download'){
      	res.header("Content-Type", "application/octet-stream");
      	res.header("Content-Disposition", "attachment; filename="+document.doc_name);
      	res.json(document.json_doc);
      }else{
      	res.json(document);
      }   
   });
});
app.delete('/documents/:id',function(req,res){
	Document.findByIdAndRemove(req.params.id,function(err,document){
		if(err){
			res.status(404).json({message:'Invalid Id'});
		}
		res.status(200).json({message:'Document deleted Successfully'});
	});
});

app.put('/documents/:id', function(req, res){
    var id = req.params.id;
	var doc_name = req.body.doc_name;
	var xml_doc = "";
	var mode = req.body.mode;

	Document.findById(id, function(err,document){
		if (err){
			return res.status(500).json({
			message: 'Internal Server Error'
			});
		}
		if(mode == 'text'){
		        xml_doc = req.body.xmlOrUrl;
	                update_xml2json(doc_name,xml_doc,res,document);
		}
		if(mode == 'url'){
			 var url = req.body.xmlOrUrl;
             request({ url: url,
     			   json: true},function (error, response, body) {
            			if (!error && response.statusCode === 200) {
	                       update_xml2json(doc_name,body,res,document);
            			}
      		});
		}
	});
});

function update_xml2json(doc_name,xml_doc,res,document){
	 parser.parseString(xml_doc, function (err, result) {
        
        document.json_doc= JSON.stringify(result);
		document.xml_doc = xml_doc;
		document.doc_name = doc_name;
		
		document.save(function(err){
   		         if(err){
                    res.status(400).json({
                    message: "Not Found"
                    });
            }
            res.status(201).json({message: 'Document Updated'});
        });
   });		
}
app.use('*', function(req, res){
	res.status(404).json({
		message: 'Not Found'
	});
});
