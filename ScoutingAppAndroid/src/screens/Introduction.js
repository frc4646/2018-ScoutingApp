import React, { Component } from 'react';
import { ListView } from 'realm/react-native';
import {
  Subheader
} from 'react-native-material-ui';
import { CenterTopContainer as Container } from './../container';
import {
  Cell,
  DataTable,
  Header,
  HeaderCell,
  Row,
} from 'react-native-data-table';

export default class Introduction extends Component {
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
  }

  componentWillMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows({
        1: {
          match: 1,
          red: [
            123,
            234,
            345
          ],
          blue: [
            567,
            678,
            789
          ]
        },
        2: {
          match: 2,
          red: [
            123,
            234,
            345
          ],
          blue: [
            567,
            678,
            789
          ]
        }
      })
    });
  }

  render() {
    return (
      <Container>
        <Subheader text={'Halo'} />
        <DataTable
          dataSource={this.state.dataSource}  
          renderRow={row => {
            console.log(row.match);
            return (
              <Row key={Math.random()}>
                <Cell width={1} key={Math.random()}>
                  {row.match}
                </Cell>
                {row.blue.map(team => {
                  return (
                    <Cell key={Math.random()}>
                      {team}
                    </Cell>
                  );
                })}
                {row.red.map(team => {
                  return (
                    <Cell key={Math.random()}>
                      {team}
                    </Cell>
                  );
                })}
              </Row>
            )
          }}
        />
      </Container>
    );
  }
};