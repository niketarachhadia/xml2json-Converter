# XMl2JSON Converter

Thinkful Full Stack Web Development Bootcamp Capstone Project 2 - Mean Stack Application: Xml2JSON

![Screenshots](https://niketarachhadia.github.io/portfolio/images/x2j.png)

## Overview

XML2JSON is a simple and efficient tool for converting XML documents to JSON format. The tool also stores all converted documents on server side for future retrieval. On Server side, REST APIs are built using Node and ExpressJS storing documents in MongoDB. The client web application is built using HTML5, CSS and JavaScript(JQuery).

##Use Case

This app is handy when you need to convert XML documents to JSON format for data cleanup, testing, app development or any usecase.
The app provides these functionalities:
* Provide URL of XML document (if it is hosted) or copy paste XML content from local machine
* Convert XML to JSON and Save document for future use on server
* Download converted JSON document
* Delete previously converted (and saved) JSON document
* Open previously converted (and saved) JSON document and make changes

##UX

The initial wireframes can be seen below:

![Initial Wireframes](https://raw.githubusercontent.com/niketarachhadia/xml2json-Converter/master/public/images/mockup.png)

XML2JSON Converter provides very focused user interface for operational efficiency and ease of use. Also with use of JQuery and custom CSS, it tries to remain as light weight as possible.

##Working Prototype

You can access a working prototype of the app here: https://still-sierra-81249.herokuapp.com/

##Technical

* Server Side: The app uses MongoDB for storing XML and JSON documents along with metadata. Conversion and CRUD APIs are developed on Node.js using Express.js. Mongoose is utilized as ORM. The actual conversion takes place on server side using xml2js library with custom extension.
* Client Side: This is a JQuery app with custom CSS framework to achieve responsive, seamless and lightweight web experience. JQuery provides control flow and interaction with server side APIs using AJAX. CSS is used for consistent styling and grid system.
