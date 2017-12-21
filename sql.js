const { Pool, Client } = require('pg')
const connectionString = "postgres://postgres:password@URL/database";
const pool = new Pool({
    connectionString: connectionString,
})
// 新增雨量資料
function Insert_rainfalldata(data) {

    //雨量資料設定
    var valueString = ";";
    var value
    for (i = 0; i < data.cwbopendata.location.length; i++) {
        value = ",('" + data.cwbopendata.location[i].stationId[0] + "','" + data.cwbopendata.location[i].time[0].obsTime[0] + "','" + data.cwbopendata.location[i].weatherElement[7].elementValue[0].value[0] + "')"
        valueString = value + valueString;
    }
    if (valueString.charAt(0) === ',')
        valueString = valueString.slice(1);
    //新增雨量資料
    var queryString = 'INSERT INTO "rainfall_valueTEST" ("stationID", "recDate", "rainfallValue") VALUES ' + valueString;
    pool.query(queryString, (err, res) => {

        //callback("successful!")
        findStation(data);


    })

}


function findStation(data) {
    //InsertString是新增雨量站資料的QueryString
    var InsertString = 'INSERT INTO "rainfallstationTEST" ("stationID", "stationName","elevation","lon","lat","county") VALUES '
    var insertvalueString = ";";
    var exist = [];
    for (i = 0; i < data.cwbopendata.location.length; i++) {
        //選出雨量站ID 並比對資料庫是否已存在，存在 true 不存在false
        var stationID = data.cwbopendata.location[i].stationId[0];
        var existQuery = 'select exists(select 1 from "rainfallstationTEST" where "stationID"=\'' + stationID + '\'), "stationID" from "rainfall_valueTEST" where "stationID"=\'' + stationID + '\'';
        pool.query(existQuery, (err, response) => {
            exist = response.rows;
            if (exist[0].exists == false) {
                ID = exist[0].stationID;
                for (j = 0; j < data.cwbopendata.location.length; j++) {

                    if (ID == data.cwbopendata.location[j].stationId[0]) {

                        var insertValue = "('" + data.cwbopendata.location[j].stationId[0] +
                            "','" +
                            data.cwbopendata.location[j].locationName[0] +
                            "','" +
                            data.cwbopendata.location[j].weatherElement[0].elementValue[0].value[0] +
                            "','" +
                            data.cwbopendata.location[j].lon[0] +
                            "','" +
                            data.cwbopendata.location[j].lat[0] +
                            "','" +
                            data.cwbopendata.location[j].parameter[0].parameterValue[0] + "');";
                        pool.query(InsertString + insertValue, (err, res) => {
                            console.log(insertValue);

                        })

                    }


                }

            }

        })
    }
}


exports.insertData = Insert_rainfalldata;
