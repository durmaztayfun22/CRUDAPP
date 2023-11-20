// server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs'
import dotenv from 'dotenv'
// import fs from 'fs';
// import path from 'path';
import Blog from './blog.js';

dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log(file.originalname)
    cb(null,file.originalname);
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDatabase =async ()=> {
  try {
    const url = process.env.MONGO;
    await mongoose.connect(url, {
      useNewUrlParser: true, useUnifiedTopology: true,
    });
    console.log('connect to database')
  } catch (error) {
    console.log(error)
  }
}

connectDatabase()
  app.get('/api/veri', async (req, res) => {
    try {
      const veriler = await Blog.find().sort({ createdAt: -1 });
      const verilerWithImages = veriler.map((veri) => {
        if (veri.image) {
          const cleanFileName = veri.image.replace(/^.*[\\/]/, '');
          const imagePath = `uploads/${cleanFileName}`;
          return {
            _id: veri._id,
            name: veri.name,
            weight: veri.weight,
            stature: veri.stature,
            goal: veri.goal,
            image: imagePath,
          };
        } else {
          // Eğer veri.image değeri undefined ise, başka bir işlem yapabilir veya atlayabilirsiniz.
          // Örneğin, boş bir nesne döndürebilirsiniz: return {};
          // veya bu veriyi filtreleyebilirsiniz: return null;
    
        }
      }).filter(Boolean); // Bu satır, null olan öğeleri filtreleyerek gerçekten tanımlı olanları korur.

      res.json(verilerWithImages);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Veriler alınamadı.' });
    }
  });

  app.post('/', upload.single('image'), async (req, res) => {
   
  try {
    const newBlog = new Blog({
      image: req.body.image,
      name: req.body.name,
      weight: req.body.weight,
      stature: req.body.stature,
      goal: req.body.goal,
    });

    const result = await newBlog.save();
    console.log(result)
    res.status(201).json(result);

    console.log('veriler gönderildi');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Veri kaydedilemedi.' });
  }
});

  
  

app.delete('/api/veri/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (deletedBlog) {
      // If the blog post is deleted from the database, delete the associated image file
      if (deletedBlog.image) {
        const cleanFileName = deletedBlog.image.replace(/^.*[\\/]/, '');
        const imagePath = `uploads/${cleanFileName}`;
        console.log(imagePath)
        // Use the fs.unlink method to delete the image file
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Image file could not be deleted.' });
          }
          console.log('Image file deleted successfully.');
        });
      }

      res.json({ redirect: '/' });
      console.log('Veri ve ilişkili resim silindi');
    } else {
      res.status(404).json({ error: 'Blog post not found.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Veri silinemedi.' });
  }
});


app.use('/uploads', express.static('uploads'));

const port = 8080;
app.listen(port, () => {
  console.log(`Port dinleniyor: ${port}`);
});


// import Blog from '../backend/blog.js';