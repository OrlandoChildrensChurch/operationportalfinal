import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, Form } from 'react-bootstrap/'
import { Redirect } from 'react-router-dom'
import './legend.css'

// https://www.npmjs.com/package/react-big-calendar
// http://intljusticemission.github.io/react-big-calendar/examples/index.html#intro

const localizer = momentLocalizer(moment)

export class AdminCalendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            eventsapi: [{}],
            groups: [{}],
            saturdayinfo: [{}],
            redirect: false,
            redirectEvents: false,
            redirectGroups: false,
            redirectAbsent: false,
            redirectVolunteers: false,
            clicked: {},
            jwt: props.location.state.jwt,
            name: '',
            description: '',
            date: '',
            groupdate: '',
            groupname: '',
            groupleader: '',
            groupphone: '', 
            groupemail: '',
            groupcount: '', 
            regexp : /^[0-9\b]+$/,
            retrieved: false,
            retrievedGroup: false,
            resultGroup: ''
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleGroupNameChange = this.handleGroupNameChange.bind(this)
        this.handleGroupCount = this.handleGroupCount.bind(this)
        this.handleGroupDateChange = this.handleGroupDateChange.bind(this)
        this.handleGroupLeaderChange = this.handleGroupLeaderChange.bind(this)
        this.handleGroupEmailChange = this.handleGroupEmailChange.bind(this)
        this.handleGroupPhoneChange = this.handleGroupPhoneChange.bind(this)

        this.getInfo()
        this.getSaturdays()
    }

    componentWillUnmount = () => {
        this.mounted = false
    }
    
    componentDidMount = () => {
        this.mounted = true
    }
    
    renderRedirect = () => {
        if(this.state.redirect){
            return <Redirect to={{
                pathname: '/admin-dashboard',
                state: {
                    jwt: this.state.jwt
                }
                
            }}/>
        }
        else if(this.state.redirectEvents){
            return <Redirect to={{
                pathname: '/admin-event-details',
                state: {
                    clicked: this.state.clicked,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if(this.state.redirectGroups){
            return <Redirect to={{
                pathname: '/admin-group-details',
                state: {
                    clicked: this.state.clicked,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if(this.state.redirectVolunteers){
            return <Redirect to={{
                pathname: '/admin-attending-volunteers',
                state: {
                    clicked: this.state.clicked,
                    jwt: this.state.jwt
                }
            }}/>
        }
        else if(this.state.redirectAbsent){
            return <Redirect to={{
                pathname: '/admin-all-absences',
                state: {
                    clicked: this.state.clicked,
                    jwt: this.state.jwt
                }
            }}/>
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    getEventDetails = (ep) => {
        console.log(ep.year)
        this.setState({
            clicked: ep,
            redirectEvents: true
        })
        console.log(this.state.clicked)
    }

    getGroupDetails = (ep) => {
        console.log(ep)
        this.setState({
            clicked: ep,
            redirectGroups: true
        })
        console.log(this.state.clicked)
    }

    getAbsentDetails = (ep) => {
        console.log(ep)
        this.setState({
            clicked: ep,
            redirectAbsent: true
        })
        console.log(this.state.clicked)
    }

    getVolunteerDetails = (ep) => {
        console.log(ep)
        this.setState({
            clicked: ep,
            redirectVolunteers: true
        })
        console.log(this.state.clicked)
    }

    handleGroupPhoneChange = (e) => {
        let idd = e.target.value
        if(idd === '' || this.state.regexp.test(idd)) {
            this.setState({
                groupphone: idd,
            })
        }
        console.log(this.state.groupphone)
    }

    handleGroupNameChange = (e) => {
        this.setState({
            groupname: e.target.value
        })
        console.log(this.state.groupname)
    }

    handleGroupCount = (e) => {
        let idd = e.target.value
        if(idd === '' || this.state.regexp.test(idd)) {
            this.setState({
                groupcount: idd,
            })
        }
        console.log(this.state.groupcount)
    }

    handleGroupDateChange = (e) => {
        this.setState({
            groupdate: e.target.value
        })
        console.log(this.state.groupdate)
    }

    handleGroupLeaderChange = (e) => {
        this.setState({
            groupleader: e.target.value
        })
        console.log(this.state.groupleader)
    }

    handleGroupEmailChange = (e) => {
        this.setState({
            groupemail: e.target.value
        })
        console.log(this.state.groupemail)
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value
        })
        console.log(this.state.name)
    }

    handleDescriptionChange = (e) => {
        this.setState({
            description: e.target.value
        })
        console.log(this.state.description)
    }

    handleDateChange = (e) => {
        this.setState({
            date: e.target.value
        })
        console.log(this.state.date)
    }

    getSaturdays = () => {
        var my_date = new Date()
        var month = my_date.getMonth()
        var year = my_date.getFullYear()

        var saturdays = [];

        for (var i = 0; i <= new Date(year, month, 0).getDate(); i++) {    
            var date = new Date(year, month, i);

            if (date.getDay() == 6) {
                saturdays.push(date.toISOString())
            } 
        };
        for(var i = 0; i < saturdays.length; i++) {
            console.log(saturdays[i])
            this.getSaturdayDetails(saturdays[i])
        }
    }

    getSaturdayDetails = (ep) => {
        console.log(typeof ep)
        let year = Number.parseInt(ep.substring(0, 4))
        // starts at 0 for january 
        let month = Number.parseInt(ep.substring(5, 7)) 
        let day = Number.parseInt(ep.substring(8, 10))
        let date = month + '/' + day + '/' + year
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
                    console.log(date + 'details successful')
                    this.setState({
                        retrieved: true
                    })
                    return res.text()
                }
                else if((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true){
                    console.log(date + 'details unsuccessful')
                    return res.text()
                }
            })
            .then((data) => {
                if(this.state.retrieved) {
                    var res = JSON.parse(data)
                    var people
                    var absences
                    var dump = [{}]
                    if(res.people != null && res.absences != null) {
                        people = res.people.map((details) => {
                            let ret = {
                                'title': details.preferredName + ' Attending',
                                desc: details.firstName + ' ' + details.lastName + ' is attending.',
                                'allDay': true,
                                'start': new Date(year, month - 1, day),
                                'end': new Date(year, month - 1, day),
                                year: year,
                                month: month,
                                day: day,
                                group: false,
                                volunteer: true,
                                absent: false
                            }
                            return ret
                        })
                        absences = res.absences.map((details) => {
                            let ret = {
                                'title': details.preferredName + ' not Attending',
                                desc: details.firstName + ' ' + details.lastName + ' is not attending.',
                                'allDay': true,
                                'start': new Date(year, month - 1, day),
                                'end': new Date(year, month - 1, day),
                                year: year,
                                month: month,
                                day: day,
                                group: false,
                                volunteer: false,
                                absent: true
                            }
                            return ret
                        })
                        var sat = this.state.saturdayinfo
                        dump = dump.concat(people).concat(absences)
                        sat = sat.concat(dump)
                        this.setState({
                            saturdayinfo: sat
                        })
                    }
                }
                
            })
        }
        catch(e) {
            console.log(e)
        }
    }

    getInfo = () => {
        let date = new Date()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        fetch('/api/calendar?month=' + month + '&year=' + year , {
          // method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
        })
        .then((res) => {
            console.log(res.status)
            if((res.status === 200 || res.status === 201) && this.mounted === true){
                console.log('Retrieval for calendar successful')
                return res.text()
            }
            else if((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true){
                console.log('Retrieval failed')
                return
            }
        })
        .then((data) => {
            let res = JSON.parse(data)
            let gro = res.groups
            let eve = res.events
            
            let e = eve.map((details) => {
                let year = Number.parseInt(details.date.substring(0, 4))
                // starts at 0 for january 
                let month = Number.parseInt(details.date.substring(5, 7)) 
                let day = Number.parseInt(details.date.substring(8, 10))
                let ret = {
                    id: details.id,
                    year: year,
                    month: month,
                    day: day,
                    'title': details.name,
                    'allDay': true,
                    desc: details.description,
                    'start': new Date(year, month - 1, day),
                    'end': new Date(year, month - 1, day),
                    group: false,
                    volunteer: false
                }
                return ret
            })

            let g = gro.map((details) => {
                let year = Number.parseInt(details.date.substring(0, 4))
                // starts at 0 for january 
                let month = Number.parseInt(details.date.substring(5, 7)) 
                let day = Number.parseInt(details.date.substring(8, 10))
                                  
                let ret = {
                    id: details.id,
                    year: year,
                    month: month,
                    day: day,
                    'title': details.name,
                    'allDay': true,
                    desc: 'Groupname:' + details.name,
                    'start': new Date(year, month - 1, day),
                    'end': new Date(year, month - 1, day),
                    group: true,
                    volunteer: false

                }
                return ret
            })

            if(this.mounted === true){
                this.setState({
                    groups: g,
                    eventsapi: e
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    callAddEndpoint = (e) => {
        let a = this.state.date
        let year = a.substring(0, 4)
        let month = a.substring(5, 7)
        let day = a.substring(8, 10)
        let nue = year + '-' + month + '-' + day
        try {
            fetch('/api/calendar/event-creation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.jwt}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    'date': nue,
                    'name': this.state.name,
                    'description': this.state.description 
                })
            })
            .then((res) => {
                console.log(res.status)
                if((res.status === 200 || res.status === 201) && this.mounted === true){
                    console.log('add event successful')
                    
                    return res.text()
                }
                else if((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true){
                    console.log('add event failed')
                    return res.text()
                }
            })
            .then(() => {
                // reload the page to show new event that has been added
                window.location.reload(false) 
            })
        }
        catch(e){
            console.log('did not connect')
        }
    }

    signupAGroup = () => {
        console.log('clicked')
        let a = this.state.groupdate
        let year = a.substring(0, 4)
        let month = a.substring(5, 7)
        let day = a.substring(8, 10)
        let nue = year + '-' + month + '-' + day
        try {
            fetch('api/calendar/signup/group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.jwt}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    'date': nue,
                    'group': {
                        'name': this.state.groupname,
                        'count': Number.parseInt(this.state.groupcount),
                        'leaderName': this.state.groupleader,
                        'phone': this.state.groupphone,
                        'email': this.state.groupemail
                    }
                })
            })
            .then((res) => {
                console.log(res.status)
                if((res.status === 200 || res.status === 201) && this.mounted === true){
                    console.log('add group successful')
                    this.setState({
                        retrievedGroup: true
                    })
                    return res.text()
                }
                else if((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true){
                    console.log('add group failed')
                    this.setState({
                        retrievedGroup: false,
                        resultGroup: 'Did not add group. Date provided must be a Saturday'
                    })
                    return res.text()
                }
            })
            .then((data) => {
                var res = JSON.parse(data)
            })
            .then(() => {
                if(this.state.retrievedGroup) {
                    window.location.reload(false) 
                }
                
            })
        }
        catch(e) {
            console.log(e)
        }
    }

    addEvent = () => {
        return (
            <div style={styling.add}>
                <h2>Add an Event</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" onChange={this.handleDateChange}/>
                        <Form.Text>
                            Date of Event
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name of Event" onChange={this.handleNameChange}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" type="text" placeholder="Description of Event" onChange={this.handleDescriptionChange}/>
                    </Form.Group>
                    
                    <Button variant="link" variant="primary" size="lg" onClick={this.callAddEndpoint}>
                        Add Event
                    </Button>
                </Form>
            </div>
        )
    }

    signUpGroup = () => {
        return (
            <div style={styling.add}>
                <h2>Signup a Group</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" onChange={this.handleGroupDateChange}/>
                        <Form.Text>
                            Date must be a Saturday
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Name of Group" onChange={this.handleGroupNameChange}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Group Leader Name</Form.Label>
                        <Form.Control type="text" placeholder="Name of Group Leader" onChange={this.handleGroupLeaderChange}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Email for Group" onChange={this.handleGroupEmailChange}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text' maxLength='10' placeholder="Group Phone Number" value={this.state.groupphone} onChange={this.handleGroupPhoneChange}/>
                        <Form.Text>
                            Please format with no spaces, parenthesis, or dashes. Ex: ##########
                        </Form.Text>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Group Size</Form.Label>
                        <Form.Control type="text" placeholder="Number of people in Group" value={this.state.groupcount} onChange={this.handleGroupCount}/>
                    </Form.Group>
                    
                    <Button variant="link" variant="primary" size="lg" onClick={this.signupAGroup}>
                        Signup Group
                    </Button>
                    <p style={this.state.retrievedGroup ? { color: 'green' } : { color: 'red' }}>{this.state.resultGroup}</p>
                </Form>
            </div>
        )
    }

    render () {
        var a = this.state.saturdayinfo.concat(this.state.groups).concat(this.state.eventsapi)
        return(
            <div>
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirect}>
                    Back to Dashboard
                </Button>
                <div style={styling.cal}>
                    <h1>Admin Calendar</h1>
                    <Calendar
                        selectable
                        popup
                        localizer = {localizer}
                        events = {a}
                        startAccessor = "start"
                        endAccessor = "end"
                        onSelectEvent={e => {
                                if(e.group) {
                                    this.getGroupDetails(e)
                                }
                                else if(e.volunteer) {
                                    this.getVolunteerDetails(e)
                                }
                                else if(e.absent) {
                                    this.getAbsentDetails(e)
                                }
                                else {
                                    this.getEventDetails(e)
                                }
                            }
                        }
                        eventPropGetter={
                            (event, start, end, isSelected) => {
                                if(event.group) {
                                    let newStyle = {
                                        backgroundColor: "lightgrey",
                                        color: 'white',
                                        borderRadius: "5px",
                                        border: "none"
                                    };
                                    newStyle.backgroundColor = "green"
                                    return {
                                        className: "",
                                        style: newStyle
                                    }
                                }
                                if(event.volunteer) {
                                    let newStyle = {
                                        backgroundColor: "lightgrey",
                                        color: 'white',
                                        borderRadius: "5px",
                                        border: "none"
                                    };
                                    newStyle.backgroundColor = "orange"
                                    return {
                                        className: "",
                                        style: newStyle
                                    }
                                }
                                if(event.absent) {
                                    let newStyle = {
                                        backgroundColor: "lightgrey",
                                        color: 'white',
                                        borderRadius: "5px",
                                        border: "none"
                                    };
                                    newStyle.backgroundColor = "red"
                                    return {
                                        className: "",
                                        style: newStyle
                                    }
                                }
                            }
                        }
                    />
                    
                    <div className='my-legend'>
                        <div className='legend-scale'>
                            <ul className='legend-labels'>
                                <li><span style={{background:'green'}}></span>groups</li>
                                <li><span style={{background:'red'}}></span>absent</li>
                                <li><span style={{background:'#3174ae'}}></span>events</li>
                                <li><span style={{background:'orange'}}></span>volunteers</li>
                            </ul>
                        </div>
                    </div>
                    <br></br>
                    {this.addEvent()}
                    {this.signUpGroup()}
                </div>
                
                <br></br>
                {this.renderRedirect()}
                
                
            </div> 
        )
    }
}

const styling = {
    cal: {
        height: '550px',
        padding: '20px 20px'
    },
    butt: {
        marginTop: '15px',
        marginLeft: '15px'
    },
    add: {
        marginBottom: '25px'
    }
} 