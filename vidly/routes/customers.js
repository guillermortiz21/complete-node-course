const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  isGold:{
    type: Boolean,
    default: false
  },
  phone:{
    type: String,
    minlength: 3,
    required: true
  }
}));

router.get('/', async (req, res) => {
  const customer = await Customer.find().sort('name');
  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await lookUpCustomer(req.params.id);
  if(!customer) return res.status(404).send(`Customer with id ${req.params.id} was not found`);
  res.send(customer);
});

router.post('/', async (req, res) => {
  const {error} = validateCustomer(req.body);
  if(error) return res.status(400).send(`Error creating a customer: ${error.details[0].message}`);
  
  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });

  try{
    customer = await customer.save()
    res.send(customer);
  }catch(err){
    let errorMessages = '';
    for(field in err.errors){
      errorMessages += err.errors[field].message + '\n';
    }
    res.status(400).send(errorMessages);
  }
});

router.put('/:id', async (req, res) => {
  const {error} = validateCustomer(req.body);
  if(error) return res.status(400).send(`Error updating a customer: ${error.details[0].message}`);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id, 
    {name: req.body.name, isGold: req.body.isGold, phone: req.body.phone}, 
    {useFindAndModify:false, new: true}
  );
  if(!customer) return res.status(404).send(`Customer with id ${req.params.id} was not found`);
  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id, {useFindAndModify:false});
  if(!customer) return res.status(404).send(`Customer with id ${req.params.id} was not found`);

  res.send(customer);
});

const lookUpCustomer = async function(customerId){
  try{
    const customer = await Customer.find({_id: customerId});
    if(customer.length > 0) return customer[0];
    return null;
  }catch(err){
    return null;
  }
}

const validateCustomer = function(customer){
  const schema = Joi.object({
    name: Joi.string().required(),
    isGold: Joi.boolean(),
    phone: Joi.string().required(),
  });
  return schema.validate(customer);
}

module.exports = router;