const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const Review = require("./models/Reviews")
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
mongoose.set('strictQuery', true);

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect("mongodb+srv://adnanhakak:5nAHIyP85VHMMmY8@cluster0.jou7e7v.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected mongo db")
  }).catch((err) => {
    console.log(err)
  })

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  console.log(userDoc)
  if (!userDoc) {
    return res.status(400).json({ creds: "invalid" })
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });

});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });

});

app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username']).populate('reviews')
      .sort({ createdAt: -1 })
    // .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id)
      .populate('author', ['username'])
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          select: 'username',
        },
      });

    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the post' });
  }
});


app.delete("/post/:id", async (req, res) => {
  jwt.verify(req.cookies.token, secret, {}, async (err, info) => {
    if (err) throw err;
    let postInfo = await Post.findById(req.params.id).populate("author")
    if (postInfo?.author?.username === info.username) {
      await Review.deleteMany({ postId: req.params.id });
      let deleted = await Post.findByIdAndDelete(req.params.id)
      res.json(deleted)
    }
  })
})

////////////////////////reviews //////////////////////////
app.post("/review/:id", async (req, res) => {
  jwt.verify(req.cookies.token, secret, {}, async (err, info) => {
    const { review, rating ,id} = req.body;
    const reviewRes = await Review.create({ review, rating, author: info.id,postId:id });
    let currentPost = await Post.findById(req.params.id)
    currentPost.reviews.push(reviewRes)
    await currentPost.save()
    res.json(reviewRes)
  })
})

app.delete("/review/:id", async (req, res) => {
  jwt.verify(req.cookies.token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log(req.body)
    if (req.body.author._id === info.id) {
      console.log({ paramsid: req.params.id, bobdyid: req.body.id, requnderscoreid: req.body._id })
      await Review.findByIdAndDelete(req.params.id)
      await Post.findByIdAndUpdate(req.body.postId, { $pull: { reviews: req.body._id } });
      res.json({ success: "true" })
    } else {
      res.json("invalid request")
    }
  })
})

app.put("/review/:id", async (req, res) => {
  jwt.verify(req.cookies.token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (req.body.props.author._id === info.id) {
      await Review.findByIdAndUpdate(req.params.id,
        { rating: req.body.newRating, review: req.body.newReview },
        { new: true })
      res.json({ success: "true" })
    } else {
      res.json("invalid request")
    }
  })
})

app.listen(4000)
