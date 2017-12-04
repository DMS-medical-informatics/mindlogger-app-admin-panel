import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import {Row, Col, Panel, Table, Pagination, Button} from 'react-bootstrap'
import moment from 'moment'
import firebase from 'firebase'

import {base, storageRef} from '../../config/constants'

class Answers extends Component {
    state = { page:1 }
    componentWillMount() {
        const {userId} = this.props
        
        base.bindToState("answers", {
        context: this,
        state: 'answers',
        keepKeys: true,
        asArray: true,
        queries: {
            orderByChild: 'participant',
            equalTo: userId
        }
        });
    }

    downloadAnswer = (answer) => {
        console.log(answer)
        const path = `answers/${answer.activity_type}_${answer.title}_${moment(answer.updated_at).format('M-D-YYYY')}.json`
        var ref = storageRef.child(path)
        var newMetadata = {
            cacheControl: 'public,max-age=3600',
        }
        let uploadTask
        switch(answer.activity_type) {
            default:
                console.log(JSON.stringify(answer))
                uploadTask = ref.putString(JSON.stringify(answer,null, 2))
                break
        }
        if(!uploadTask) return
        uploadTask.then(function(snapshot) {
            var downloadUrl = snapshot.downloadURL;
            window.location.href = downloadUrl;
        });
    }
    render () {
        const {answers, page} = this.state
        console.log(answers)
        
        // let data = [
        //   { name: "http requests", data: [{date: new Date('2014/09/15 13:24:54'), foo: 'bar1'}, {date: new Date('2014/09/15 13:25:03'), foo: 'bar2'}, {date: new Date('2014/09/15 13:25:05'), foo: 'bar1'}] },
        //   { name: "SQL queries", data: [{date: new Date('2014/09/15 13:24:57'), foo: 'bar4'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar6'}, {date: new Date('2014/09/15 13:25:04'), foo: 'bar2'}] }
        // ]
        return (
        <div>
            <h2 className="text-center">Answers</h2>

            <Row>
            <Col xs={12}>
                { answers ? (
                <Panel header={`Total ${answers.length} Answers`}>
                    <Link to='/users'><Button>Back</Button></Link>
                    <Table responsive bordered>
                        <thead>
                        <tr>
                            <th>Taken at</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {answers && answers.slice((page-1)*10,10).map((answer, index) => (
                            <tr key={index}>
                            <td>{moment(answer.updated_at).format('llll')}</td>
                            <td>{answer.activity_type}</td>
                            <td>{answer.title}</td>
                            <td>
                                <Button bsStyle="info" onClick={() => this.downloadAnswer(answer)}>Download</Button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div>
                        <Pagination prev next first last boundaryLinks
                        items={answers.length/10+1} maxButtons={5} activePage={page}
                        onSelect={this.selectPage} />
                    </div>
                </Panel>
                    ) :
                    (
                        <Panel>
                            <Link to='/users'><Button>Back</Button></Link>
                            <p>Loading...</p>
                        </Panel>
                    )
                }
            </Col>
            </Row>
        </div>
        )
    }
}
const mapDispatchToProps = {
  }
  
const mapStateToProps = (state, ownProps) => ({
    userId: ownProps.match.params.id
})
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(Answers)