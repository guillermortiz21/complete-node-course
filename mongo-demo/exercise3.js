/*
  Get all published courses that are $15 or more,
  or have the word 'by' in their title.
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
    .find({isPublished: true})
    .or([
      {price: {$gte: 15}}, 
      {name: /.*by.*/}
    ])
}

getCourses().then((courses) => console.log(courses));