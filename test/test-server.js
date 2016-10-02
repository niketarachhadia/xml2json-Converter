global.DATABASE_URL = 'mongodb://localhost/xml2json-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Document = require('../models/document');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Xml2Json', function() {
  before(function(done) {
      server.runServer(function() {
          Document.create({xml_doc:'<card><name>John Doe</name><title>CEO, Widget Inc.</title></card>',doc_name: 'card',
        	json_doc:'{"card":{"name":"John Doe","title":"CEO, Widget Inc."}}'},function() {
             	done();
         	});
      });
  });
	it('should list documents on get',function(done){
		chai.request(app)
				.get('/documents')
				.end(function(err,res){
					should.equal(err, null);
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.should.have.length(1);
					res.body[0].should.be.a('object');
					res.body[0].should.have.property('xml_doc');
					res.body[0].xml_doc.should.be.a('string');
					res.body[0].should.have.property('doc_name');
					res.body[0].doc_name.should.be.a('string');
					res.body[0].should.have.property('json_doc');
					res.body[0].json_doc.should.be.a('string');
				  done();					
					});
   });
	it('should get an document on get',function(done){
	  chai.request(app)
        .post('/documents')
        .send({'xmlOrUrl':'<note><to>Tove</to><from>Jani</from><heading>Reminder</heading></note>',
      				 'mode':'text',
      				 'doc_name':'note'})
        .end(function(err, res){
					var id=res.body._id;
					chai.request(app)
							.get('/documents/'+id+'/data')
							.end(function(err, res){
								should.equal(err,null);
								res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('xml_doc');
					      res.body.xml_doc.should.be.a('string');
					      res.body.should.have.property('doc_name');
					      res.body.doc_name.should.be.a('string');
					      res.body.should.have.property('json_doc');
					      res.body.json_doc.should.be.a('string');
								done();
							});
	    	});
	});
	it('should add an document on post',function(done){
		chai.request(app)
				.post('/documents')
				.send({'xmlOrUrl':'http://www.w3schools.com/xml/cd_catalog.xml',
							'mode':'url','doc_name':'cd_catalog'})
				.end(function(err, res){
					should.equal(err, null);
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.property('xml_doc');
		      res.body.xml_doc.should.be.a('string');
		      res.body.should.have.property('doc_name');
		      res.body.doc_name.should.be.a('string');
		      res.body.should.have.property('json_doc');
		      res.body.json_doc.should.be.a('string');
					done();
				});		
	});

	it('should delete an document on delete',function(done){
	  chai.request(app)
        .post('/documents')
        .send({'xmlOrUrl':'<note><to>Tove</to><from>Jani</from><heading>Reminder</heading></note>',
      				 'mode':'text',
      				 'doc_name':'note'})
        .end(function(err, res){
					var id=res.body._id;
					console.log(id);
					console.log(err);
					chai.request(app)
							.delete('/documents/'+id)
							.end(function(err, res){
								should.equal(err,null);
								res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
								done();
							});
	    	});
	});
  after(function(done){
      Document.remove(function() {
          done();
      });
  });
});						

