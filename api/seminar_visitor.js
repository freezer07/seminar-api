const express = require('express');
const db = require('../config/db');
const moment = require('moment');
const ObjectsToCsv = require('objects-to-csv');
const csv = require("csvtojson");
const fs = require("fs");

class SeminarVisitor {

  constructor(dataJson) {
    this.dataJson = dataJson;
  }

  visitorModelData (dataJson={}, callback) {
    let result = [];
    if( Object.keys(dataJson).length>0 && (dataJson!==undefined && typeof dataJson!=='undefined') ){
      dataJson.forEach((val, idx)=>{
        result.push({
          'visitor_id': val['id'],
          'visitor_first_name': val['first_name'],
          'visitor_last_name': val['last_name'],
          'visitor_email': val['email'],
          'visitor_gender': val['gender'],
          'visitor_image_url': val['image'],
          'vistitor_country': val['country'],
          'visitor_web_url': null,
          'visitor_is_accept_inv': null,
          'created_at': moment().format('YYYY-MM-DD HH:mm:ss'),
          'updated_at:': null
        });
      });
    }else{
      if( typeof callback==='function' ){
        callback(result);
      }else{
        return result;
      }
    }
  }

  postCSVToDB (dataJson={}, callback) {
    const closest = this;
    if( (Object.keys(dataJson).length<=0) || (dataJson===undefined || typeof dataJson==='undefined') ){
      dataJson = require('../MOCK_DATA');
    }

    let result = false;
    if( Object.keys(dataJson).length>0 ){
      let visitorModelData = this.visitorModelData(dataJson);

      (async () => {
        const csv = new ObjectsToCsv(visitorModelData);
       
        // Save to file:
        await csv.toDisk('./uploads/visitor_list.csv');
       
        // Return the CSV file as string:
        // console.log(await csv.toString());
        result = true;
        closest.UploadCsvDataToMySQL('./uploads/visitor_list.csv', 'visitor_list');

        if( typeof callback==='function' ){
          callback(result);
        }else{
          return result;
        }
      })();
    }else{
      if( typeof callback==='function' ){
        callback(result);
      }else{
        return result;
      }
    }
  }

  UploadCsvDataToMySQL (filePath='', tb='visitor_list', callback) {
    let result = false;
    if( filePath!='' ){
      csv()
      .fromFile(filePath)
      .then(function(jsonFromCSV){ //when parse finished, result will be emitted here.
        // gen data for insert string
        let data = [];
        jsonFromCSV.forEach((val1, idx1)=>{
          let dataRow = [];
          for(let idx2 in val1){
            dataRow.push(val1[idx2]||null);
          }
          data.push(dataRow);
        });

        // console.log(data);

        let query = `INSERT INTO ${tb} (visitor_id, visitor_first_name, visitor_last_name, visitor_email, visitor_gender, visitor_image_url, vistitor_country, visitor_web_url, visitor_is_accept_inv, created_at, updated_at) VALUES ?`;
        db.query(query, [data], (error, response) => {
          if( error ){
            result = false;
          }else{
            result = true;
          }
          // console.log(error || response);
          fs.unlinkSync(filePath);

          if( typeof callback==='function' ){
            callback(result);
          }else{
            return result;
          }
        });
      });
    }

    if( typeof callback==='function' ){
      callback(result);
    }else{
      return result;
    }
  }

  getVisitor (param={}, callback) {
    let visitor_id = param['visitor_id']||0;
    let visitor_first_name = param['first_name']||'';
    let visitor_last_name = param['last_name']||'';
    let visitor_email = param['email']||'';
    let visitor_gender = param['gender']||'';
    let visitor_country = param['country']||'';
    let visitor_web_url = param['web_url_link']||'';
    let visitor_is_accept_inv = param['is_accept_inv']||null;

    let result = null;
    let whereStr = [];
    if( visitor_id!='' ){
      whereStr.push(` visitor_id like '${visitor_id}' `);
    }
    if( visitor_first_name!='' ){
      whereStr.push(` visitor_first_name like '%${visitor_first_name}%' `);
    }
    if( visitor_last_name!='' ){
      whereStr.push(` visitor_last_name like '%${visitor_last_name}%' `);
    }
    if( visitor_email!='' ){
      whereStr.push(` visitor_email like '%${visitor_email}%' `);
    }
    if( visitor_gender!='' ){
      whereStr.push(` visitor_gender like '%${visitor_gender}%' `);
    }
    if( visitor_country!='' ){
      whereStr.push(` visitor_country like '%${visitor_country}%' `);
    }
    if( visitor_is_accept_inv!==null ){
      whereStr.push(` visitor_is_accept_inv = ${visitor_is_accept_inv} `);
    }
    if( visitor_web_url!='' ){
      whereStr.push(` visitor_web_url like '%${visitor_web_url}%' `);
    }
    whereStr = whereStr.join(" AND ");

    let query = `
      SELECT visitor.*
      FROM visitor_list as visitor
      WHERE ${whereStr}
    `;
    console.log(query);

    db.query(query, [], (error, results, fields)=>{
      result = results;
      if( typeof callback==='function' ){
        callback(result);
      }else{
        return result;
      }
    });
  }

  updateVisitor (param={}, callback) {
    let visitor_id = +param['visitor_id']||0;
    let visitor_first_name = param['first_name']||'';
    let visitor_last_name = param['last_name']||'';
    let visitor_email = param['email']||'';
    let visitor_gender = param['gender']||'';
    let visitor_image_url = param['image']||'';
    let vistitor_country = param['country']||'';
    let visitor_web_url = param['web_url_link']||'';
    let visitor_is_accept_inv = +param['is_accept_invitation']===1? 1:0;

    let result = false;
    if( visitor_id>0 ){
      let query = `
        UPDATE visitor_list
        SET ? WHERE visitor_id = ?
      `;
      let preparedData = {};
      if( visitor_first_name!='' ){
        preparedData['visitor_first_name'] = visitor_first_name;
      }
      if( visitor_last_name!='' ){
        preparedData['visitor_last_name'] = visitor_last_name;
      }
      if( visitor_email!='' ){
        preparedData['visitor_email'] = visitor_email;
      }
      if( visitor_gender!='' ){
        preparedData['visitor_gender'] = visitor_gender;
      }
      if( visitor_image_url!='' ){
        preparedData['visitor_image_url'] = visitor_image_url;
      }
      if( vistitor_country!='' ){
        preparedData['vistitor_country'] = vistitor_country;
      }
      if( visitor_web_url!='' ){
        preparedData['visitor_web_url'] = visitor_web_url;
      }
      if( visitor_is_accept_inv==1 ){
        preparedData['visitor_is_accept_inv'] = visitor_is_accept_inv;
      }

      if( Object.keys(preparedData).length>0 ){
        db.query(query, [preparedData, visitor_id], (error, response) => {
          if( error ){
            result = false;
          }else{
            result = true;
          }

          if( typeof callback==='function' ){
            callback(result);
          }else{
            return result;
          }
        });
      }else{
        if( typeof callback==='function' ){
          callback(result);
        }else{
          return result;
        }
      }
    }else{
      if( typeof callback==='function' ){
        callback(result);
      }else{
        return result;
      }
    }
  }

  acceptInvitation (param={}, callback) {
    let visitor_id = +param['visitor_id']||0;
    let visitor_is_accept_inv = +param['is_accept_inv']===1? 1:0;

    let result = false;
    if( visitor_id>0 ){
      let query = `
        UPDATE visitor_list
        SET ?
        WHERE visitor_id = ?
      `;
      let preparedData = {};
      if( visitor_is_accept_inv===1 ){
        preparedData['visitor_is_accept_inv'] = visitor_is_accept_inv;
      }

      if( Object.keys(preparedData).length>0 ){
        db.query(query, [preparedData, visitor_id], (error, response) => {
          if( error ){
            result = false;
          }else{
            result = true;
          }

          if( typeof callback==='function' ){
            callback(result);
          }else{
            return result;
          }
        });
      }else{
        if( typeof callback==='function' ){
          callback(result);
        }else{
          return result;
        }
      }
    }else{
      if( typeof callback==='function' ){
        callback(result);
      }else{
        return result;
      }
    }
  }

}

module.exports = new SeminarVisitor();