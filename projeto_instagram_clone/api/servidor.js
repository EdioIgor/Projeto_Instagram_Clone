var express = require('express'),
	bodyParser = require('body-parser'),
	mongodb = require('mongodb'),
	objectId = require('mongodb').ObjectId;

var app = express();

//middleware da aplicação
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
	'instagram_clone',
	new mongodb.Server('localhost', 27017, {}),
	{}
);

console.log('Servidor inicializado. Porta: ' + port);

app.get('/', function(req, res){

	res.send({msg:'API Instagram Clone'});
});

//POST: criar postagens
app.post('/postagens', function(req, res){

	var dados = req.body;

	db.open( function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.insert(dados, function(err, records){
				if(err){
					res.json({'status' : 'erro'});
				} else {
					res.json({'status' : 'postagem inserida'});
				}
				mongoclient.close();
			});
		});
	});

});


//GET: listar todas as postagens adicionadas
app.get('/postagens', function(req, res){
	db.open( function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.find().toArray(function(err, results){
				if(err){
					res.json(err);
				} else {
					res.json(results);
				}
				mongoclient.close();
			});
		});
	});

});


//GET: listar postagem por ID
app.get('/postagens/:id', function(req, res){
	db.open( function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.find(objectId(req.params.id)).toArray(function(err, results){
				if(err){
					res.json(err);
				} else {
					res.status(200).json(results);
				}
				mongoclient.close();
			});
		});
	});

});


//PUT: atualizar postagem por ID
app.put('/postagens/:id', function(req, res){
	db.open( function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.update(
				{ _id : objectId(req.params.id) },
				{ $set : { titulo : req.body.titulo}},
				{},
				function(err, records){
					if(err){
						res.json(err);
					} else {
						res.json(records);
					}

					mongoclient.close();
				}
			);
		});
	});
});


//DELETE: excluir postagens por ID
app.delete('/postagens/:id', function(req, res){
	db.open( function(err, mongoclient){
		mongoclient.collection('postagens', function(err, collection){
			collection.remove({ _id : objectId(req.params.id)}, function(err, records){
				if(err){
					res.json(err);
				} else {
					res.json(records);
				}
			});
		});
	});
});
