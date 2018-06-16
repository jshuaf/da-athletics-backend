const model = require('./model/model');
const Program = require('./model/Program');

model.connect().then(() => Program.remove({ name: 'Track & Field, Coed' }));
