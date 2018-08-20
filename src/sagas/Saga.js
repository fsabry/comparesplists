/*jshint esversion: 6 */
import { call, put, takeEvery, select } from 'redux-saga/effects';
import * as constants from 'utils/Constants';
import * as utils from 'utils/Utils';
import * as SP_API from 'utils/SharePointAPI';
// import * as selectors from 'sagas/Selectors';


function* getAllWebs(action){
  try{
    yield put({type: constants.LOADING_WEBS, loading: true});
    let url = "";
    let webs = yield call(SP_API.getAllWebs, url);
    let webOptions = webs.map(web => { return {label: web.ServerRelativeUrl, value: web.ServerRelativeUrl} });
    yield put({type: constants.SET_ALL_WEBS, payload: webOptions });
    yield put({type: constants.LOADING_WEBS, loading: false});
  }
  catch(e){
    console.log("--------ERROR getAllWebs-------", e);
  }
}

function* getLists(action){
  try{
    if(action.listType === constants.LIST_TYPE_SOURCE){
      yield put({type: constants.LOADING_SOURCE_LISTS, loading: true});
    }
    else{
      yield put({type: constants.LOADING_TARGET_LISTS, loading: true});
    }
    let webUrl = action.web;
    let url = webUrl + "/_api/web/lists";
    let lists = yield call(SP_API.get, url, "Saga - getLists");
    let listOptions = lists.map(list => { return {label: list.Title, value: list.Id}})

    if(action.listType === constants.LIST_TYPE_SOURCE){
      yield put({type: constants.SET_SOURCE_LISTS, payload: listOptions, web: webUrl})
      yield put({type: constants.LOADING_SOURCE_LISTS, loading: false});
    }
    else{
      yield put({type: constants.SET_TARGET_LISTS, payload: listOptions, web: webUrl})
      yield put({type: constants.LOADING_TARGET_LISTS, loading: false});
    }
  }
  catch(e){
    console.log("--------ERROR getLists-------", e);
  }
}

function* getListInfo(action){
  try{
    let stateData = yield select();
    let webUrl = action.listType === constants.LIST_TYPE_SOURCE ? stateData.application.sourceWeb : stateData.application.targetWeb;
    let url = webUrl + "/_api/web/lists(guid'" + action.list + "')/Fields?$filter=Hidden eq false and ReadOnlyField eq false and StaticName ne 'ContentType' and StaticName ne 'Attachments'";
    url += "&$select=" + constants.LIST_FIELD_PROPS.toString();
    let listInfo = yield call(SP_API.get, url, "Saga - getListInfo");

    if(action.listType === constants.LIST_TYPE_SOURCE){
      yield put({type: constants.SET_SOURCE_LIST_INFO, payload: listInfo})
    }
    else{
      yield put({type: constants.SET_TARGET_LIST_INFO, payload: listInfo})
    }
  }
  catch(e){
    console.log("--------ERROR getListInfo-------", e);
  }
}

function* compareProps(source, target){
  let comparedProps = [];
  let propsToCompare = constants.LIST_FIELD_PROPS;
  for(let prop of propsToCompare){
    let newComparedProp = {};
    if(source[prop]){
      newComparedProp.targetMatch = false;
      newComparedProp.prop = prop;
      newComparedProp.source = source[prop] ? source[prop] : "N/A";
      newComparedProp.target = target[prop] ? target[prop] : "N/A";
      
      if(target[prop] === source[prop]){
        newComparedProp.targetMatch = true;
      }
      comparedProps.push(newComparedProp);
    }
    else if(target[prop]){
      // if(utils.indexOfArrayObject(comparedProps, prop, "prop") === -1){
      newComparedProp.targetMatch = false;
      newComparedProp.prop = prop;
      newComparedProp.source = "N/A";
      newComparedProp.target = target[prop];
      comparedProps.push(newComparedProp);
      // }
    }
  }
  return comparedProps;
}

function* getComparedLists(action){
  try{
    let stateData = yield select();
    let sourceFields = stateData.application.sourceListInfo;
    let targetFields = stateData.application.targetListInfo;
    let results = [];
    for(let field of sourceFields){
      let newResult = {} //{targetMatch: true/false, source: [{titel: "Title", internalName: "InternalName" ...} , target: {titel: "Title", internalName: "InternalName" ...}}
      newResult.targetMatch = false;
      newResult.sourceField = field.Title;
      // newResult.sourceProps = {title: field.Title};
      //If Field exisits in targetFields
      if(utils.indexOfArrayObject(targetFields, field.Title, "Title") !== -1){
        let targetIndex = utils.indexOfArrayObject(targetFields, field.Title, "Title");
        newResult.targetMatch = true;
        newResult.targetField = targetFields[targetIndex].Title;
        // newResult.targetProps = {title: targetFields[targetIndex].Title};

        //compare props
        newResult.comparedProps = yield call(compareProps, field, targetFields[targetIndex]); //compareProps(sourceField, targetField);
        

      }
      //If field not exists in target Fields
      else{
        newResult.targetField = null;
        newResult.comparedProps = [];
      }
      results.push(newResult);
    }

    //check additional fields in targetFields
    for(let field of targetFields){
      if(utils.indexOfArrayObject(results, field.Title, "sourceField") === -1){
        let comparedProps = yield call(compareProps, {}, field);
        results.push({targetMatch: false, sourceField: "N/A", targetField: field.Title, comparedProps});
      }
    }

    yield put({type: constants.SET_COMPARED_LISTS, payload: results});

  }
  catch(e){
    console.log("--------ERROR getComparedLIsts-------", e);
  }
}

function* saga() {
  yield takeEvery(constants.GET_ALL_WEBS, getAllWebs);
  yield takeEvery(constants.GET_LISTS, getLists);
  yield takeEvery(constants.GET_LISTS_INFO, getListInfo);
  yield takeEvery(constants.GET_COMPARED_LISTS, getComparedLists);
}

export default saga;
