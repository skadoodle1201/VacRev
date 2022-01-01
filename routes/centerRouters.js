const express = require('express');
const router =  express.Router();

const center  = require('../controllers/centerControllers');

router.route('/findCenter') // Getting the Districs
  .get(center.districtRender)

router.route('/centers')   //Getting Centers in districs
  .get(center.centerDistricts)
  .post(center.centers)

router.route('/center')    //Getting the Selected center
  .get(center.centerRender)
  .post(center.selectedCenter)


module.exports =router;