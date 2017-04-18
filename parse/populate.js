const model = require('../model/model');
const refresh = require('./refresh');

const connected = model.connect();

connected.then(refresh.all());
