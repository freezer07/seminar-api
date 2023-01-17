const express = require('express');
const app = express();
const port = 3000;
const createError = require('http-errors');
const path = require('path');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', {delimiter: '?'});
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/seminar/', apiRouter);

// app.use(function(req, res, next) {
//   var err = createError(404);
//   next(err);
// });
  
app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
})