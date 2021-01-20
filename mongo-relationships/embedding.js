const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', {useNewUrlParser:true, useUnifiedTopology:true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId){
  //const course = await Course.findById(courseId)
  //course.author.name = 'Guillerm Ortiz';
  //course.save();
  
  //Update directly in db
  const course = await Course.update({_id: courseId}, {
    $set:{
      'author.name': 'John'
    }
    // To remove a subdocument you can use $unset
  })
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId){
  const course = await Course.findById(courseId);
  // The method id is a search by id inside mongo arrays
  const author = course.authors.id(authorId)
  author.remove()
  course.save();
}

/*createCourse('Node Course', [
  new Author({ name: 'Mosh' }),
  new Author({ name: 'John' })
]);*/
//addAuthor('60076d36ed9b1e053cbbbc94', new Author({name: 'Will'}));
removeAuthor('60076d36ed9b1e053cbbbc94', '60076dc086ded34b8803dd94');
//updateAuthor('600769835db4073e941a935c');
