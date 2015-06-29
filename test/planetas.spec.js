var request = require('supertest-as-promised');
var api = require('../server.js');
var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;

request = request(api);

describe('Test de planetas: ', function() {

  before(function (done) {
    MongoClient.connect('mongodb://localhost:27017/planetasDB', done);
  });

  describe('POST /planetas', function() {
    it('debería crear un planeta', function (done) {
      var data = {
        "planeta": {
          "nombre": "Mercurio",
          "radio": "2.440 km",
          "distSol": "57.910.000 km",
          "dia": "1.404 horas",
          "ano": "87,97 dias",
          "tempMedia": "179º C",
          "gravedad": "2,78 m/s2"
        }
      };

      request
      .post('/planetas')
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .end(function(err, res) {
        var planeta;

        var body = res.body;
        console.log('body', body);

        // Planeta existe
        expect(body).to.have.property('planeta');
        planeta = body.planeta;

        // Propiedades
        expect(planeta).to.have.property('nombre', 'Mercurio');
        expect(planeta).to.have.property('radio', '2.440 km');
        expect(planeta).to.have.property('distSol', '57.910.000 km');
        expect(planeta).to.have.property('dia', '1.404 horas');
        expect(planeta).to.have.property('ano', '87,97 dias');
        expect(planeta).to.have.property('tempMedia', '179º C');
        expect(planeta).to.have.property('gravedad', '2,78 m/s2');
        expect(planeta).to.have.property('_id');

        done(err);
      });
    });
  });

  describe('GET /planetas', function() {
    it('debería obtener todos los planetas existentes', function (done) {
      var data = {
        "planeta": {
          "nombre": "Mercurio",
          "radio": "2.440 km",
          "distSol": "57.910.000 km",
          "dia": "1.404 horas",
          "ano": "87,97 dias",
          "tempMedia": "179º C",
          "gravedad": "2,78 m/s2"
        }
      };

      request
      .post('/planetas')
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .then(function getPlanetas(res) {

        return request.get('/planetas')
          .set('Accept', 'application/json')
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/);
      }, done)
      .then(function assertions(res) {
        var planeta;
        var body = res.body;
        console.log('GET body', body);
        var keys = Object.keys(body.planetas);

        // Planeta existe
        expect(body.planetas).to.have.property(keys[0]);

        done();
      }, done);

    });
  });

  describe('GET /planetas/:id', function() {
    it('debería obtener un planeta existente', function (done) {
      var id;
      var data = {
        "planeta": {
          "nombre": "Mercurio",
          "radio": "2.440 km",
          "distSol": "57.910.000 km",
          "dia": "1.404 horas",
          "ano": "87,97 dias",
          "tempMedia": "179º C",
          "gravedad": "2,78 m/s2"
        }
      };

      request
      .post('/planetas')
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .then(function getPlaneta(res) {

        var body = res.body;
        console.log('body', body);
        id = body.planeta._id;

        return request.get('/planetas/' + id)
          .set('Accept', 'application/json')
          .send()
          .expect(200)
          .expect('Content-Type', /application\/json/);
      }, done)
      .then(function assertions(res) {
        var planeta;
        var body = res.body;
        console.log('GET body', body);
        // Planeta existe
        expect(body).to.have.property('planeta');
        planeta = body.planeta;

        // Propiedades
        expect(planeta).to.have.property('_id', id);
        expect(planeta).to.have.property('nombre', 'Mercurio');
        expect(planeta).to.have.property('radio', '2.440 km');
        expect(planeta).to.have.property('distSol', '57.910.000 km');
        expect(planeta).to.have.property('dia', '1.404 horas');
        expect(planeta).to.have.property('ano', '87,97 dias');
        expect(planeta).to.have.property('tempMedia', '179º C');
        expect(planeta).to.have.property('gravedad', '2,78 m/s2');

        done();
      }, done);

    });
  });

  describe('PUT /planetas/:id', function() {
    it('deberia actualizar un planeta existente', function (done) {
      var id;
      var data = {
        "planeta": {
          "nombre": "Mercurio",
          "radio": "2.440 km",
          "distSol": "57.910.000 km",
          "dia": "1.404 horas",
          "ano": "87,97 dias",
          "tempMedia": "179º C",
          "gravedad": "2,78 m/s2"
        }
      };

      request
      .post('/planetas')
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .then(function putPlaneta(res) {

        var update = {
        "planeta": {
          "nombre": "Venus",
          "radio": "6.052 km",
          "distSol": "108.208.930 km",
          "tempMedia": "457º C",
          "gravedad": "8,9 m/s2"
        }
      };

      id = res.body.planeta._id;

      return request.put('/planetas/' + id)
               .set('Accept', 'application/json')
               .send(update)
               .expect(200)
               .expect('Content-Type', /application\/json/);
      }, done)
      .then(function assertions(res) {
        var planeta;
        var body = res.body;
        console.log('GET body', body);
        // Planeta existe
        expect(body).to.have.property('planeta');
        planeta = body.planeta;

        // Propiedades
        expect(planeta).to.have.property('_id', id);
        expect(planeta).to.have.property('nombre', 'Venus');
        expect(planeta).to.have.property('radio', '6.052 km');
        expect(planeta).to.have.property('distSol', '108.208.930 km');
        expect(planeta).to.have.property('tempMedia', '457º C');
        expect(planeta).to.have.property('gravedad', '8,9 m/s2');

        done();
      }, done);

    });
  });

  describe('DELETE /planetas/:id', function() {
    it('deberia eliminar un planeta existente', function (done) {
      var id;
      var data = {
        "planeta": {
          "nombre": "Mercurio",
          "radio": "2.440 km",
          "distSol": "57.910.000 km",
          "dia": "1.404 horas",
          "ano": "87,97 dias",
          "tempMedia": "179º C",
          "gravedad": "2,78 m/s2"
        }
      };

      request
      .post('/planetas')
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .then(function deletePlaneta(res) {
        id = res.body.planeta._id;

      return request.delete('/planetas/' + id)
               .set('Accept', 'application/json')
               .expect(204)
      }, done)
      .then(function assertions(res) {
        var planeta;
        var body = res.body;

        // Respuesta vacia
        expect(body).to.be.empty;

        // Probamos que de verdad no exista
        return request.get('/planetas/' + id)
          .set('Accept', 'application/json')
          .send()
          .expect(404)
      }, done)
      .then(function confirmation(res) {
        var body = res.body;
        expect(body).to.have.property('error', 'Planeta no encontrado');
        done();
      }, done);

    });
  });

});