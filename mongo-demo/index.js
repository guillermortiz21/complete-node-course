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

createCourse();


