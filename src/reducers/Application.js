import * as constants from 'utils/Constants';

const initialState = {
  webs: [],
  sourceWeb: "",
  targetWeb: "",
  sourceLists: [],
  targetLists: [],
  sourceListInfo: [],
  targetListInfo: [],
  loadingWebs: false,
  loadingSourceLists: false,
  loadingTargetLists: false,
  comparedLists: [{
    comparedProps: []
  }],
};

function application(state = initialState, action) {
  switch (action.type) {
    case constants.SET_ALL_WEBS:
      return { ...state, webs: action.payload };
    case constants.SET_SOURCE_LISTS:
      return { ...state, sourceLists: action.payload, sourceWeb: action.web };
    case constants.SET_TARGET_LISTS:
      return { ...state, targetLists: action.payload, targetWeb: action.web };
    case constants.SET_SOURCE_LIST_INFO:
      return { ...state, sourceListInfo: action.payload };
    case constants.SET_TARGET_LIST_INFO:
      return { ...state, targetListInfo: action.payload };
    case constants.LOADING_WEBS:
      return { ...state, loadingWebs: action.loading }
    case constants.LOADING_SOURCE_LISTS:
      return { ...state, loadingSourceLists: action.loading }
    case constants.LOADING_TARGET_LISTS:
      return { ...state, loadingTargetLists: action.loading }
    case constants.SET_COMPARED_LISTS:
      return { ...state, comparedLists: action.payload }
    default:
      return state;
  }
}

export default application;