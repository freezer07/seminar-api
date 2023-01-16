const express = require('express');
const db = require('../config/db');

class SeminarEvent {

  constructor(dataJson) {
    this.dataJson = dataJson;
  }

  createEvent (param={}, callback) {
    let event_name = param['event_name']||'';
    let event_speaker_id = param['speaker_id']||0;
    let event_place_id = param['place_id']||0;
    let event_url_link = param['web_url_link']||'';
    let event_start = param['start']||'';
    let event_end = param['end']||'';

    let result = false;
    if( event_name!='' ){
      let query = `
        INSERT INTO event_list
        SET ?
      `;
      let preparedData = {
        event_name: event_name
      };
      if( event_speaker_id>0 ){
        preparedData['event_speaker_id'] = event_speaker_id;
      }
      if( event_place_id>0 ){
        preparedData['event_place_id'] = event_place_id;
      }
      if( event_url_link!='' ){
        preparedData['event_url_link'] = event_url_link;
      }
      if( event_start!='' ){
        preparedData['event_start'] = event_start;
      }
      if( event_end!='' ){
        preparedData['event_end'] = event_end;
      }

      db.query(query, preparedData, (error, response) => {
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
  }

  updateEvent (param={}, callback) {
    let event_id = +param['event_id']||0;
    let event_name = param['event_name']||'';
    let event_speaker_id = param['speaker_id']||0;
    let event_place_id = param['place_id']||0;
    let event_url_link = param['web_url_link']||'';
    let event_start = param['start']||'';
    let event_end = param['end']||'';

    let result = false;
    if( event_id>0 ){
      let query = `
        UPDATE event_list
        SET ? WHERE event_id = ?
      `;
      let preparedData = {
        event_name: event_name
      };
      if( event_speaker_id>0 ){
        preparedData['event_speaker_id'] = event_speaker_id;
      }
      if( event_place_id>0 ){
        preparedData['event_place_id'] = event_place_id;
      }
      if( event_url_link>0 ){
        preparedData['event_url_link'] = event_url_link;
      }
      if( event_start>0 ){
        preparedData['event_start'] = event_start;
      }
      if( event_end>0 ){
        preparedData['event_end'] = event_end;
      }

      db.query(query, [preparedData, event_id], (error, response) => {
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
  }

  getEvent (param={}, callback) {
    let event_id = param['event_id']||0;

    let result = null;
    if( event_id!='' ){
      let query = `
        SELECT
          ev.*,
          speaker.speaker_first_name, speaker.speaker_last_name,
          place.place_name, place.place_longitude, place.place_latitude
        FROM event_list as ev
        LEFT JOIN speaker_list as speaker
          ON ev.event_speaker_id = speaker.speaker_id
        LEFT JOIN place_list as place
          ON ev.event_place_id = place.place_id
        WHERE ev.event_id = ?
      `;

      db.query(query, [event_id], (error, results, fields)=>{
        result = results;
        if( typeof callback==='function' ){
          callback(error||result);
        }else{
          return error||result;
        }
      });
    }else{
      if( typeof callback==='function' ){
        callback(result);
      }else{
        return result;
      }
    }
  }

}

module.exports = new SeminarEvent();