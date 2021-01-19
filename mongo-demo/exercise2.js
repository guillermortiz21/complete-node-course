/*
  Get all the published frontend and backend courses,
  sort them by their price in a descending order,
  pick only their name and author,
  and display them
*/

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mongo-exercises',
  {useNewUrlParser:true, useUnifiedTopology:true}
)
  .then(() => console.log('Connected to mongo'))
  .catch((err) => console.log(`Error connecting: ${err}`));


// Create schema
const courseSchema = new mongoose.Schema({
  tags: [String],
  date: {type: Date, default: Date.now},
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('course', courseSchema);

async function getCourses(){
  return await Course
    .find({isPublished: true, tags: {$in: ['backend','frontend']}})
    .sort({price: -1})
    .select({name: 1, author: 1})
}

getCourses().then((courses) => console.log(courses));