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
  // const coursesBetween10And20 = await Course
  //   .find({price: {$gte: 10, $lte: 20}});
  // const coursesThatAre10_15Or20 = await Course
  //   .find({price: {$in: [10,15,20]}})
  
  // Logical operators!
  // or
  // and
  //  const logical = await Course
  //    .find()
  //    .or([{author: 'Mosh'},{isPublished:true}])// Get the courses that are by  Mosh or that are published
  //    .and([{author: 'Mosh'},{isPublished:true}])// Get the courses that are by  Mosh a that are published

  // Regular expressions!
  // const coursesThatStartWithMosh = await Course
  //   .find({autor: /^Mosh/}) // String that starts with Mosh
  // const coursesThatEndsWithMosh = await Course
  //   .find({autor: /Mosh$/i}) // String that starts with Mosh. The i is to make it not case sensitive
  // const coursesThatContainsWithMosh = await Course
  //   .find({autor: /.*Mosh.*/i}) // String that contains Mosh, case insensitive
  
  // Counting!
  const countingCourses = await Course
    .find({author: 'Mosh',isPublished: true})
    .countDocuments()
  console.log(countingCourses);
  
  // Pagination!
  const pageNumber = 2;
  const pageSize = 10;
  // In the endpoint this would be like /api/courses?pageNumber=2&pageSize=10
  const countingCourses2 = await Course
    .find({author: 'Mosh',isPublished: true})
    .skip((pageNumber - 1) * pageSize) // Skip a certain number of Documents.
    .limit(pageSize)
  console.log(countingCourses2);
}

//getCourses();

// Lets update a course!

//const Course = mongoose.model('Course', courseSchema);

async function updateCourse(id){
  /*
  Query first approach:
    1. Find by id
    2. modify properties
    3. save

  Update first approach:
    1. Update directly
    2. get the updated document.
  */

  // Query first approach
  console.log(Course);
  const course = await Course.findById(id)
  // Check if course exists
  if(!course) return;

  course.isPublished = true,
  course.author = 'Another author'

  const result = await course.save();
  console.log(result);
}

updateCourse('600616739c21be0d48a2c884');