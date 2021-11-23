const axios = require('axios');


module.exports.districtRender = (req,res)=>{
  let districtsId = req.cookies.districtsId;
  res.render('findingCenters/findCenter',{districtsId});    
}

module.exports.centerDistricts = (req,res)=>{
  let districtsId = req.cookies.districtsId;
  res.render('findingCenters/centers',{districtsId});
}

module.exports.centerRender = async(req,res)=>{
  let centerId = req.cookies.centerId;
  let d = new Date();
  let month = d.getMonth()+1;
  let day = d.getDate();
  let output = (day<10 ? '0' : '') + day + '-' +(month<10 ? '0' : '') + month + '-'+ d.getFullYear();
  const response = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=${centerId}&date=${output}`);
  let center = response.data.centers;
  res.render('findingCenters/center',{centerId,center});
}

module.exports.centers = (req, res) => {
  let  districtsId  = req.body.districts;
  res.cookie("districtsId", districtsId);
  res.redirect("/findingCenters/centers");
}

module.exports.selectedCenter = (req, res) => {
  let  centerId  = req.body.centerId;
  res.cookie("centerId", centerId);
  res.redirect("/findingCenters/center");
}