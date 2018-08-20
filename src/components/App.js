import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Glyphicon } from 'react-bootstrap';
import * as constants from 'utils/Constants';
import Select from 'components/Select';
import { Circle } from 'better-react-spinkit';
import TableHeaders from 'components/TableHeaders';

const mapStateToProps = (state) => {
  return {
    application: state.application
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sourceWebChanged: (event) => {
      let web = event.target.value;
      console.log("selection", event.target.value);
      dispatch({type: constants.GET_LISTS, listType: constants.LIST_TYPE_SOURCE, web});
    },
    targetWebChanged: (event) => {
      let web = event.target.value;
      console.log("selection", event.target.value);
      dispatch({type: constants.GET_LISTS, listType: constants.LIST_TYPE_TARGET, web});
    },
    sourceListChanged: (event) => {
      let list = event.target.value;
      console.log("selection", event.target.value);
      dispatch({type: constants.GET_LISTS_INFO, listType: constants.LIST_TYPE_SOURCE, list});
    },
    targetListChanged: (event) => {
      let list = event.target.value;
      console.log("selection", event.target.value);
      dispatch({type: constants.GET_LISTS_INFO, listType: constants.LIST_TYPE_TARGET, list});
    },
    compareLists: () => {
      dispatch({type: constants.GET_COMPARED_LISTS});
    }
  };
};

const App = ({application, compareLists, sourceWebChanged, targetWebChanged, sourceListChanged, targetListChanged}) => {

  let resultItems = application.comparedLists.map((item,index) => {

    let comparedProps = item.comparedProps.map((prop,index) => {
      return(
        <tr>
          <td>{prop.prop}</td>
          <td>{prop.source}</td>
          <td>{prop.targetMatch ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}</td>
          <td>{prop.target}</td>
        </tr>
      );
    })

    return(
      <tbody key={index}>
        <tr>
          <td>
            {item.sourceField}
          </td>
          <td>
            {item.targetMatch ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}
          </td>
          <td>
            {item.targetField ? item.targetField : "N/A"}
          </td>
        </tr>
        {item.targetMatch ? 
          <table className="comparedPropsTable">
            <thead>
              <tr>
                <th>Prop Name</th>
                <th>Source Value</th>
                <th></th>
                <th>Target Value</th>
              </tr>
            </thead>
            <tbody>
              {comparedProps}
            </tbody>
          </table> 
          : null}
      </tbody>
    );
  })



  return (
    <div className="App">
      <Row className="mainRow">
        <Col md={12}>

          <Row>
            <Col md={6} className="columnLeft">
              {application.loadingWebs ? 
                <Circle size={20} color="darkGrey"/>
                : <Select options={application.webs} label="Source Web" onChange={sourceWebChanged} />
              }
            </Col>
            <Col md={6}>
              {application.loadingWebs ? 
                  <Circle size={20} color="darkGrey"/>
                  : <Select options={application.webs} label="Target Web" onChange={targetWebChanged} />
              }
            </Col>
          </Row>

          <Row className="endRowOptions">
            <Col md={6} className="columnLeft">
              {application.loadingSourceLists ? 
                <Circle size={20} color="darkGrey"/>
                : <Select options={application.sourceLists} label="Source List" onChange={sourceListChanged} />
              }
            </Col>
            <Col md={6} className="targetListCompareButton">
            {application.loadingTargetLists ? 
                <Circle size={20} color="darkGrey"/>
                : <Select options={application.targetLists} label="Target List" onChange={targetListChanged} />
            }
              <Button className="compareButton" onClick={() => compareLists()}>Compare Lists</Button>
            </Col>
          </Row>

          <Row className="resultsRow">
            <Col md={12}>
              <div className="resultContainer">
                <table className="resultTable">
                  <thead>
                    <tr>
                      <th colSpan="2">Source</th>
                      <th></th>
                      <th>Target</th>
                    </tr>
                  </thead>
                  <TableHeaders tableData={application.comparedLists} />
                </table>
              </div>
            </Col>
          </Row>
      
        </Col>
      </Row>
    </div>
  );
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
