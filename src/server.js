const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { Sequelize, Model, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

class BlogPost extends Model {}
BlogPost.init({
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'blogPost' });

sequelize.sync();

const init = () => {
  const app = express();
  dotenv.config();

  middleware(app);
  endpoints(app);

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Listening at http://locahost:${PORT}`);
  });
};

const middleware = (app) => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
};

const endpoints = (app) => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/posts', async (req, res) => {
    const result = await BlogPost.findAll();
    res.json(result);
  });

  app.get('/posts/:id', async (req, res) => {
    const result = await BlogPost.findByPk(req.params.id);
    res.json(result);
  });

  app.post('/posts', async (req, res) => {
    const result = await BlogPost.create(req.body);
    res.json(result);
  });

  app.put('/posts/:id', async (req, res) => {
    const result = await BlogPost.findByPk(req.params.id);
    if (result) {
      await result.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });

  app.delete('/users/:id', async (req, res) => {
    const result = await BlogPost.findByPk(req.params.id);
    if (result) {
      await result.destroy();
      res.json({ message: 'Post deleted' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  });
};

init();