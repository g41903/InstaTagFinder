//sqliteTest.js

var casper = require('casper').create({
	verbose: true,
	logLevel: "debug",

	waitTimeout: 100000,
	pageSettings: {
		loadImages: false,
		loadPlugins: false
	},
	viewportSize: {
		height: 1000,
		width: 1024
	},

	// clientScripts:  [
 //        '/home/g41903/instagram-hashtag-gist/node_modules/sqlite3/lib/sqlite3.js'
 //    ]
});

casper.start();
casper.then(function() {
	test();
});
casper.run();

function test() {

	casper.echo("test");
	this.injectJs('node_modules/sqlite3/lib/sqlite3.js');
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database(':memory:');

	db.serialize(function() {
		db.run("CREATE TABLE lorem (info TEXT)");

		var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
		for (var i = 0; i < 10; i++) {
			stmt.run("Ipsum " + i);
		}
		stmt.finalize();

		db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
			console.log(row.id + ": " + row.info);
		});
	});

	db.close();

};