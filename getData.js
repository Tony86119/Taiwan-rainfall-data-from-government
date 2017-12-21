
const request = require('request');
var schedule = require('node-schedule');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var http = require('http')
var valueSQL = require('./sql');
var fs = require("fs");


//排程
function scheduleCronstyle() {
   //set your schedulejob 
   schedule.scheduleJob('30 1 * * * *', function(){
  console.log('scheduleCronstyle:' + new Date());

  parser.on('error', function (err) { console.log('Parser error', err); });

  var data = '';
  http.get('http://opendata.cwb.gov.tw/opendataapi?dataid=O-A0002-001&authorizationkey="_your key from government_"', function (res) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      res.on('data', function (data_) { data += data_.toString(); });
      res.on('end', function () {
        //console.log('data', data);
        console.log('done');
        //parse XML
        parser.parseString(data, function (err, result) {
          valueSQL.insertData(result);
          if (err) {
            console.log(err)
          }
          else {
            console.log('FINISHED');
          }

        });
      });
    }
  });


  }); 
}

scheduleCronstyle();
//offlineTEST();


//離線測試用
function offlineTEST() {
  var imageFile = fs.readFileSync("./XMLfile.xml");
  var data = new Buffer(imageFile).toString();

  parser.on('error', function (err) { console.log('Parser error', err); });
  parser.parseString(data, function (err, result) {
    valueSQL.insertData(result);

    console.log('FINISHED', err, result);
  });

}
