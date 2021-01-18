// Connect to mongo db

const mongoose = require('mongoose');
// playground is the name of the db
// mongo will create it automatically
mongoose.connect('mongodb://localhost:27017/playground', 
  {useNewUrlParser:true, useUnifiedTopology:true}
)
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => console.log(`Could not connect to mongodb...: ${err.message}`));

// This schema will define the shape of the course documents inside mongo db
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {type: Date, default: Date.now},
  isPublished: Boolean
});

/*
Possible types
  String
  Number
  Date
  Buffer
  Boolean
  ObjectID
  Array
*/

// The schema is the form of a Class
// The model is a Class that can have many objects
// You need to compile the courseSchema into a model.
// Params are: singular name and schema
const Course = mongoose.model('Course', courseSchema);

async function createCourse(){  
  // Now we can create objects based on this class
  // The param is the initializer
  const course = new Course({
    name: 'Angular Course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true
  });
  
  // Now we can save this to the database.
  
  const result = await course.save();
  // result has the document that was added to the database
  console.log(result);
}

//createCourse();

// Lets query courses from the db
async function getCourses(){
  // You can get all the courses with:
  const courses = await Course.find();
  console.log(courses);

  // you can find some objects with
  // Also you can add nice things!
  const find = await Course
    .find({author: 'Mosh',isPublished: true})
    .limit(10) // get no more than 10
    .sort({name: 1}) // 1 is ascending, -1 is descending
    .select({name: 1, tags: 1}) // select just a few properties
  console.log(find);

  // Comparison operators!
  // eq -> equal
  // ne -> not equal 
  // gt -> greater than
  // gte -> greater than or equal to
  // lt -> less than
  // lte -> less than or equal
  // in
  // nin -> not in
  const withComparisons = await Course
    .find({price: {$gte: 10}})

}

getCourses();


