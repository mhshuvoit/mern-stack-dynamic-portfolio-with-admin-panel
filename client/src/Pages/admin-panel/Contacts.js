import React, { Fragment } from 'react'
import Navigation from '../../components/admin-panel/Navigation'
import { Button } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import Axios from 'axios'
import Spinner from '../../components/admin-panel/Spinner'
import WentWrong from '../../components/admin-panel/Wentwrong'

class Contacts extends React.Component {
    state = {
        contactdata: [],
        dataId: '',
        btnTxt: 'Delete',
        spinner: true,
        error: false
    }

    componentDidMount() {
        Axios.get('/contact/get')
            .then(result => {
                if (result === null) {
                    this.setState({
                        error: true,
                        spinner: false
                    })
                }
                this.setState({
                    contactdata: result.data.response,
                    spinner: false
                })
            })
            .catch(error => {
                this.setState({
                    error: true,
                    spinner: false
                })
            })
    }

    contactDelete = () => {
        Axios.delete('/contact/' + this.state.dataId)
            .then(result => {
                this.setState({
                    contactdata: this.state.contactdata.filter(el => el._id !== this.state.dataId),
                    btnTxt: 'Delete Success'
                })
            })
            .catch(err => {
                this.setState({
                    btnTxt: 'Delete Unsuccess'
                })
            })
    }

    render() {
        if (this.state.spinner === true) {
            return (
                <Navigation title="loding...">
                    <Spinner />
                </Navigation>
            )
        } else if (this.state.error === true) {
            return <WentWrong />
        } else {
            const columns = [
                { dataField: 'name', text: 'Name' },
                { dataField: 'email', text: 'Email' },
                { dataField: 'msg', text: 'Msg' }
            ]
            const selectRow = {
                mode: 'radio',
                onSelect: (row, isSelect, rowIndex) => {
                    this.setState({ dataId: row['_id'] })
                }
            }
            return (
                <Navigation title="Contacts">
                    <Fragment>
                        <Button
                            onClick={this.contactDelete}
                            className='m-3 btn-danger'>
                            {this.state.btnTxt}
                        </Button>
                        <BootstrapTable
                            keyField='_id'
                            data={this.state.contactdata}
                            columns={columns}
                            pagination={paginationFactory()}
                            selectRow={selectRow} />
                    </Fragment>
                </Navigation>
            )
        }
    }
}

export default Contacts