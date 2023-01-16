const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const createError = require('http-errors');
const router = express.Router();

const sm_event = require('../api/seminar_event');
const sm_visitor = require('../api/seminar_visitor');

// for create new event
router.route('/event')
.post((req, res, next) => {
  sm_event.createEvent(req.body, (result)=>{
    return res.json({
      result_code: +result,
      result_msg: (result)? 'success':'failed'
    });
  });
})
// for update speaker to event
.put((req, res, next) => {
  sm_event.updateEvent(req.body, (result)=>{
    return res.json({
      result_code: +result,
      result_msg: (result)? 'success':'failed'
    });
  });
})
// for get detail's event
.get((req, res, next) => {
  sm_event.getEvent(req.query, (result)=>{
    return res.json({
      result_code: 0,
      result_msg: (result)? 'success':'failed',
      event_data: (result)? result:[]
    });
  });
});

router.route('/visitor')
// for upload visitor csv list
.post((req, res, next) => {
  sm_visitor.postCSVToDB(req.body, (result)=>{
    return res.json({
      result_code: +result,
      result_msg: (result)? 'success':'failed'
    });
  });
})
// for update visitor web link and also used for update invitation status
.put((req, res, next) => {
  sm_visitor.updateVisitor(req.body, (result)=>{
    return res.json({
      result_code: +result,
      result_msg: (result)? 'success':'failed'
    });
  });
})
// for get visitor that can filter
.get((req, res, next) => {
  sm_visitor.getVisitor(req.query, (result)=>{
    return res.json({
      result_code: 1,
      result_msg: (result)? 'success':'failed',
      visitor_data: (result)? result:[]
    });
  });
});

// for only accept invitation
router.route('/accept_inv').get((req, res, next) => {
  sm_visitor.acceptInvitation(req.query, (result)=>{
    return res.json({
      result_code: +result,
      result_msg: (result)? 'success':'failed'
    });
  });
});


module.exports = router;