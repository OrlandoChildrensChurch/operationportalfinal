import React, { Component } from 'react'
import { Button } from 'react-bootstrap/'
import { Redirect } from 'react-router-dom'

// https://github.com/clsavino/react-shift-scheduler

export class AdminDashboard extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            redirectAnnouncements: false,
            redirectProfile: false,
            redirectCal: false,
            redirectLogout: false,
            redirectCBC: false,
            redirectVol: false,
            redirectBus: false,
            redirectTraining: false,
            redirectSBC: false,
            redirectJobs: false,
            redirectClasses: false,
            jwt: props.location.state.jwt,
            loggedin: props.location.state.loggedin
        }
    }
    
    renderRedirect = () => {
        if(this.state.redirectAnnouncements){
            return <Redirect to={{
                pathname: '/admin-announcements',
                state: { 
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt,
                }
            }}/>
        }
        else if(this.state.redirectProfile){
            return <Redirect to={{
                pathname: '/admin-profile',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if(this.state.redirectCal){
            return <Redirect to={{
                pathname: '/admin-calendar',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if(this.state.redirectLogout){
            return <Redirect to={{
                pathname: '/',
                state: {
                    loggedin: false
                }
            }}/>
        }
        else if(this.state.redirectCBC){
            return <Redirect to={{
                pathname: '/child-birthday-calendar',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if(this.state.redirectVol){
            return <Redirect to={{
                pathname: '/admin-volunteer-list',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if(this.state.redirectBus){
            return <Redirect to={{
                pathname: '/admin-bus-list',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if (this.state.redirectTraining) {
            return <Redirect to={{
                pathname: '/admin-training-list',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }} />
        }
        else if(this.state.redirectSBC){
            return <Redirect to={{
                pathname: '/staff-birthday-calendar',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if (this.state.redirectJobs) {
            return <Redirect to={{
                pathname: '/admin-job-list',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }} />
        }
        else if (this.state.redirectClasses) {
            return <Redirect to={{
                pathname: '/admin-class-list',
                state: {
                    loggedin: this.state.loggedin,
                    jwt: this.state.jwt
                }
            }} />
        }
        
    }

    setRedirectCBC = () => {
        this.setState({
            redirectCBC: true
        })
    }

    setRedirectVol = () => {
        this.setState({
            redirectVol: true
        })
    }

    setRedirectBus = () => {
        this.setState({
            redirectBus: true
        })
    }

    setRedirectTraining = () => {
        this.setState({
            redirectTraining: true
        })
    }

    setRedirectSBC = () => {
        this.setState({
            redirectSBC: true
        })
    }

    setRedirectAnnouncements = () => {
        this.setState({
            redirectAnnouncements: true
        })
    }

    setRedirectProfile = () => {
        this.setState({
            redirectProfile: true
        })
    }

    setRedirectCal = () => {
        this.setState({
            redirectCal: true
        })
    }

    setRedirectJobs = () => {
        this.setState({
            redirectJobs: true
        })
    }

    setRedirectClasses = () => {
        this.setState({
            redirectClasses: true
        })
    }

    setRedirectLogout = () => {
        this.setState({
            redirectLogout: true
        })
    }
  

  render () {
    return(
        <div style={styling.mainDiv}>
            {this.renderRedirect()}
            <Button variant="primary" size="lg" style={styling.logout} onClick={this.setRedirectLogout}>
                    Logout
            </Button>
            <center>
                <div style={styling.header}>
                    <h1>Admin Dashboard</h1>
                </div>
            </center>
            <center>
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectProfile}>
                    Edit Profile
                </Button>

                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectAnnouncements}>
                    View Announcements
                </Button>

                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectCal}>
                    View Calendar
                </Button>

                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectCBC}>
                    Children's Birthday Calendar
                </Button>
            </center>  
            <center>
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectVol}>
                    View Volunteers
                </Button>

                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectSBC}>
                    Staff Birthday Calendar
                </Button>
            </center>  
            <center>
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectBus}>
                    Manage Buses
                </Button>

                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectTraining}>
                    Manage Trainings
                </Button>

                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectJobs}>
                    Manage Volunteer Jobs
                </Button>

                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirectClasses}>
                    Manage Classes
                </Button>
            </center>  
        </div>
    )
  }
}

const styling = {
    header: {
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: '20px'
    },
    butt: {
        marginRight: '25px',
        marginLeft: '25px',
        marginTop: '75px',
        width: '200px',
        height: '200px'
    },
    logout: {
        marginTop: '15px',
        marginLeft: '15px'
    },
    mainDiv: {
        marginBottom: '20px'
    }
}




