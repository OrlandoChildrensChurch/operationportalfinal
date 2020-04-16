import React, { Component } from 'react'
import { Button, Card, Dropdown, DropdownButton, Spinner } from 'react-bootstrap/'
import { Redirect } from 'react-router-dom'
import '../cards.css'
import { EditDetailsButton } from '../../customButtons'
import QRCode from 'qrcode.react'

export class AdminChildQRList extends Component {
    constructor(props) {
        super(props)

        if (props.location.state == null) {
            this.state = {
                loggedin: false
            }
            return
        }

        this.state = {
            jwt: props.location.state.jwt,
            loggedin: props.location.state.loggedin,
            loading: false,
            redirect: false,
            edit: false,
            editId: 0,
            busId: 0,
            busList: [],
            fullRoster: [],
            roster: [],
        };

        this.getBusList()
        this.getChildren()
    }

    calculateAge = (birthday) => {
        var bDate = new Date(birthday);
        var birthYear = bDate.getFullYear();
        var birthMonth = bDate.getMonth();
        var birthDay = bDate.getDate();
        var now = new Date();
        var curYear = now.getFullYear();
        var curMonth = now.getMonth();
        var curDay = now.getDate();
        var diff = curYear - birthYear;
        if (birthMonth > curMonth) diff--;
        else {
            if (birthMonth == curMonth) {
                if (birthDay > curDay) diff--;
            }
        }
        return diff;
    }


    getBusList() {
        fetch('/api/bus-list', {
            // method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then((res) => {
            if ((res.status === 200 || res.status === 201) && this.mounted === true) {
                return res.json()
            }
            else if ((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true) {
                return
            }
        })
        .then((data) => {
            if (this.mounted === true) {
                console.log(data.buses)

                this.setState({
                    busList: data.buses,
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getChildren() {
        fetch('/api/roster', {
            // method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.jwt}`
            }
        })
        .then((res) => {
            if ((res.status === 200 || res.status === 201) && this.mounted === true) {
                return res.json()
            }
            else if ((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true) {
                return
            }
        })
        .then((data) => {
            if (this.mounted === true) {
                console.log(data.fullRoster)

                this.setState({
                    fullRoster: data.fullRoster,
                    roster: data.fullRoster,
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    // Sets variable to false when ready to leave page
    componentWillUnmount = () => {
        this.mounted = false
        this.loading = false
    }

    // Will set a variable to true when component is fully mounted
    componentDidMount = () => {
        this.mounted = true
        this.loading = true
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: '/admin-dashboard',
                state: {
                    jwt: this.state.jwt,
                    loggedin: this.state.loggedin
                }
            }} />
        }
    }

    renderBusDropdown = () => {
        if (this.state.busList != null) {
            const p = this.state.busList.map((b, index) => {
                return (
                    <div key={index}>
                        <Dropdown.Item as="button"  onClick={() => this.updateBusId(b.id)}>{b.name}</Dropdown.Item>
                    </div>
                )
                
            })
            return (
                <div>
                    <span>
                        <DropdownButton id="dropdown-basic-button" title="Select Bus" size="lg" style={styling.butt}>
                            {p}
                        </DropdownButton>
                        <p>
                            Current Bus: {this.state.busId == 0 ? "No Bus" : this.state.busId}
                        </p>
                    </span>
                </div>
            )
        }
    }

    updateBusId = (e) => {
        this.setState({
            busId: e
        })
    }

    renderRoster = () => {
        if (this.state.roster != null) {
            const p = this.state.roster.map((c, index) => {
                return (
                    c.bus.id == this.state.busId 
                    ? <div key={index}>
                        <Card style={{ width: '25rem' }}>
                            <Card.Header as='h5'>
                                {(c.preferredName || c.firstName) + ' ' + (c.preferredName ? '(' + c.firstName + ')' : '') + ' ' + c.lastName} <span style={{ fontWeight: 'bold', color: 'red', float: 'right' }}>{c.isSuspended ? 'SUSPENDED' : ''}</span>
                            </Card.Header>
                            <Card.Body>
                                <div style={styling.imgContainer}>
                                    <QRCode value={(c.id)} />
                                </div>
                                <table style={styling.childTable}>
                                    <tbody>
                                        <tr>
                                            <th style={styling.childTH}>Bus: </th>
                                            <td>{(c.bus && c.bus.id) ? c.bus.name : 'Not Assigned'}</td>
                                        </tr>
                                        <tr>
                                            <th style={styling.childTH}>Suspension start: </th>
                                            <td>{c.isSuspended ? (new Date(c.suspendedStart)).toDateString() : 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <th style={styling.childTH}>Suspension end: </th>
                                            <td>{c.isSuspended ? (new Date(c.suspendedEnd)).toDateString() : 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card>
                    </div>
                    : <div key={index}></div>
                )
            })
            return (
                <div className="row">
                    {p}
                </div>
            )
        }
    }


    renderNotice = () => {
        return (
            <div style={styling.center}>
                No Bus Selected!
            </div>
        )
    }

    renderLoading = () => {
        return (
            <div style={styling.center}>
                <Spinner animation="border" />
            </div>
        )
    }

    renderNothing = () => {
        return (
            <div>
            </div>
        )
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    render() {
        if (!this.state.loggedin) {
            return <Redirect to={{
                pathname: '/login',
            }} />
        }
        console.log("Rendered: " + this.state.busId)
        return (this.state.roster != null && this.state.roster.length > 0)
            ? (<div>
                {this.renderRedirect()}
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirect}>
                    Back to Dashboard
                </Button>

                <h1 style={styling.head}>QR List</h1>

                {this.renderBusDropdown()}

                <div style={styling.deckDiv}>
                    {this.state.loading ? this.renderLoading() : this.renderNothing()}
                    {this.state.busId == 0 ? this.renderNotice() : this.renderRoster()}
                </div>
            </div>) 
            : (<div>
                {this.renderRedirect()}
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirect}>
                    Back to Dashboard
                </Button>

                <h1 style={styling.head}>QR List</h1>

                <p style={styling.center}>
                    Please wait while we load the information!
                    {this.renderLoading()}
                </p>
            </div>)
    }
}

const styling = {
    head: {
        marginBottom: "15px",
        textAlign: "center"
    },
    center: {
        textAlign: "center"
    },
    outderdiv: {
        padding: '20px 20px',
        marginLeft: '75px'
    },
    butt: {
        marginTop: '15px',
        marginLeft: '15px',
        marginBottom: '15px'
    },
    table: {
        height: '400px',
        width: '1000px'
    },
    deckDiv: {
        justifyContent: 'center',
        alignContent: 'center',
        outline: 'none',
        border: 'none',
        overflowWrap: 'normal',
        marginLeft: '7%'
    },
    ann: {
        marginTop: '15px',
        marginRight: '15px',
        marginBottom: '15px'
    },
    right: {
        float: 'right'
    },
    childTable: {
        tableLayout: 'fixed',
        width: '100%',
        marginBottom:'10px'
    },
    childTH: {
        textAlign: 'right'
    },
    image: {
        maxWidth: '300px',
        maxHeight: '300px',
        height: 'auto',
    },
    imgContainer: {
        textAlign: 'center',
        minHeight: '200px',
    }
}