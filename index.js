import express, { json, urlencoded } from 'express';
import session from 'express-session';

// constants
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.set('view engine', 'ejs');

app.use(json());
app.use(urlencoded({ extended: true }));

const sessionConfig = {
  secret: "keyboard cat",
  cookie: {},
};

app.use(session(sessionConfig));

// #1
app.get('/setname', function (req, res) {
  req.session.name = 'John Doe';
  res.send(`Hello ${req.session.name}`);
});

// #1
app.get('/getname', function (req, res) {
  res.send(req.session.name);
});

// #2.1
app.get('/session/login', function (req, res) {
  res.render('pages/login');
});

// #2.2
app.post('/session/connect', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'John' && password === 'Doe') {
    console.log('Authenticated!');
    req.session.isConnected = true;
    res.status(200).redirect("/session/admin");
    return;
  }

  res.status(400).render('pages/login');
});

// #2.3
app.get('/session/admin', (req, res) => {
  if (req.session.isConnected) {
    res.send('Admin site');
  }

  res.status(401).end();
});

// #2.4
app.get('/session/logout', (req, res) => {
  if (req.session.isConnected) req.session.isConnected = false;
  res.status(200).end();
});

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(port);
