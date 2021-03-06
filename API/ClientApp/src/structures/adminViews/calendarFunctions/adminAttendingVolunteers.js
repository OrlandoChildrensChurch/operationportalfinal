import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap/'
import { Redirect } from 'react-router-dom'
import './cards.css'


export class AdminAttendingVolunteers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            redirectJob: false,
            jwt: props.location.state.jwt,
            clicked: props.location.state.clicked,
            volunteers: [{}],
            retrieved: false
        }
        this.getVolunteers()
    }

    // finish volunteer trainings
    // get all jobs and attending volunteers
    // display volunteers and their information
    // make page for showing jobs and volunteers


    componentWillUnmount = () => {
        this.mounted = false
    }
    
    componentDidMount = () => {
        this.mounted = true
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    setRedirectJob = () => {
        this.setState({
            redirectJob: true
        })
    }

    renderRedirect = () => {
        if(this.state.redirect) {
            return (
                <Redirect to={{
                    pathname: '/admin-calendar',
                    state: {
                        jwt: this.state.jwt
                    }
                }}/>
            )
        }
        else if(this.state.redirectJob) {
            return (
                <Redirect to={{
                    pathname: '/admin-job-roster',
                    state: {
                        jwt: this.state.jwt,
                        clicked: this.state.clicked
                    }
                }}/>
            )
        }
    }

    getVolunteers = () => {
        var a = this.state.clicked
        var date = a.month + '/' + a.day + '/' + a.year
        try {
            fetch('api/calendar/details?date=' + date , {
                // method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.state.jwt}`
                  }
            })
            .then((res) => {
                console.log(res.status)
                if((res.status === 200 || res.status === 201) && this.mounted === true){
                    console.log(date + ' details successful')
                    return res.text()
                }
                else if((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true){
                    console.log(date + ' details unsuccessful')
                    return res.text()
                }
            })
            .then((data) => {
                var res = JSON.parse(data)
                if(res.people != null) {
                    res = res.people
                    this.setState({
                        retrieved: true,
                        volunteers: res
                    })
                    console.log(this.state.volunteers)
                }
            })
        }
        catch(e) {
            console.log(e)
        }
    }

    renderVolunteers = () => {
        if(this.state.retrieved){
            let eve = this.state.volunteers.map((v, index) => {
                if(v.trainings != undefined) {
                    var train = v.trainings.map((details) => {
                        return (
                            details.name + ' | '
                        )
                    })
                }
                if(v.languages != undefined) {
                    var language = v.languages.map((details) => {
                        return (
                            details + ' | ' 
                        )
                    })
                }
                return (
                    <div key={index}>
                        <Card style={{width: '25rem'}}>
                            <Card.Header as='h5'>
                                {v.firstName + " " +  v.lastName}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    Information
                                </Card.Title>
                                <Card.Text>
                                    ID: {v.id}<br></br>
                                    Preferred Name: {v.preferredName}<br></br>
                                    Email: {v.email}<br></br>
                                    Phone: {v.phone}<br></br>
                                    Birthday: {v.birthday}<br></br>
                                    <br></br>
                                    Role: {v.role}<br></br>
                                    Weeks Attended: {v.weeksAttended}<br></br>
                                    <br></br>
                                    Trainings:<br></br>
                                    {train}
                                    <br></br>
                                    Languages:<br></br>
                                    {language}
                                    <br></br>
                                    <br></br>
                                    Orientation: {v.orientation ? 'Yes' : 'No'}<br></br>
                                    Blue Shirt: {v.blueShirt  ? 'Yes' : 'No'}<br></br>
                                    Name Tag: {v.nameTag  ? 'Yes' : 'No'}<br></br>
                                    Personal Interview: {v.personalInterviewCompleted  ? 'Yes' : 'No'}<br></br>
                                    Background Check: {v.backgroundCheck  ? 'Yes' : 'No'}<br></br>
                                    Year Started: {v.yearStarted}<br></br>
                                    Can Edit Inventory: {v.canEditInventory  ? 'Yes' : 'No'}<br></br>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                )
            })
            return (
                <div className="row">
                    {eve}
                </div>
            )

        }
    }

    render() {
        var a = this.state.clicked
        var date = a.month + '/' + a.day + '/' + a.year
        return (
            <div>
                {this.renderRedirect()}
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirect}>
                    Back to Dashboard
                </Button>

                <Button variant="primary" size="lg" style={styling.ann} className="float-right" onClick={this.setRedirectJob}>
                    View Job Roster
                </Button>
                <h1 style={styling.head}>All Attending Volunteers on {date}</h1>
                <div style={styling.deckDiv}>
                    {this.renderVolunteers()}
                </div>
            </div>
        )
    }
}

const styling = {
    head: {
        marginBottom: '15px',
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
        marginLeft:'7%'
    },
    ann: {
        marginTop: '15px',
        marginRight: '15px',
        marginBottom: '15px'
    }
}