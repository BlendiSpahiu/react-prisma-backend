import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors(), (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/posts', async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
});

app.get('/post/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await prisma.post.findUnique({ where: { id: +postId } });
  res.json(post);
});

app.post('/insert-post', async (req, res) => {
  const newPost = await prisma.post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      authorName: req.body.authorName,
      authorEmail: req.body.authorEmail,
    },
  });
  res.json(newPost);
});

app.delete('/delete-post/:id', async (req, res) => {
  await prisma.post.delete({
    where: {
      id: +req.params.id,
    },
  });
});

app.listen(4400, () => console.log('Server ready at http://localhost:4400'));
