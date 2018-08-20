/*jshint esversion: 6 */
// import React from 'react';
// import * as constants from 'Constants';
// import * as utils from 'utils/Utils';
import Promise from 'promise';
import $ from 'jquery';

let expCount = 0;

export const get = (url, sender = "") => {
  return new Promise(function (resolve, reject) {
    console.log(sender + " url in SP_API: " + url);
    $.ajax({
      url: encodeURI(url),
      type: "GET",
      headers: {
        "Accept": "application/json;odata=verbose"
      },
      success: function (data) {
        // console.log(data);
        // console.log(data.d.results ? data.d.results : [data.d]);
        resolve(data.d.results ? data.d.results : [data.d]);
      },
      error: function (data) {
        console.log("sharepointAPI/get - " + data);
        reject(data.responseText);
      }
    });
  });
};


export const getAllWebs = (startUrl) => {
  //let count = 0;
  return new Promise(function (fulfill) {
    let callbackFunction = function (urlData) {
      fulfill(urlData);
    };
    getSubwebs(startUrl, getSubwebs, callbackFunction, []);
  });
}


export const getSubwebs = (url, getSubwebs, callback, urlData) => {
  expCount++;
  $.ajax({
    url: url + "/_api/web/webinfos",
    type: "GET",
    headers: {
      "Accept": "application/json;odata=verbose"
    },
    success: function (data) {
      $.merge(urlData, data.d.results)
      data.d.results.forEach(item => {
        getSubwebs(item.ServerRelativeUrl, getSubwebs, callback, urlData);
      })
      expCount--;
      if (expCount === 0) {
        callback(urlData);
      }
    },
    error: function (data) {
      return data.statusText;
    }
  });
}
