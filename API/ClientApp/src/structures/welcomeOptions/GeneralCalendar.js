import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import events from './dummydata/events'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button } from 'react-bootstrap/'
import { Redirect } from 'react-router-dom'

// https://www.npmjs.com/package/react-big-calendar
// http://intljusticemission.github.io/react-big-calendar/examples/index.html#intro

const localizer = momentLocalizer(moment)

export class GeneralCalendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: [{}],
            redirect: false,
            clicked: {}
        }
        this.getInfo()
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
                console.log('Retrieval successful')
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
                    group: true

                }
                return ret
            })

            if(this.mounted === true){
                this.setState({
                    groups: g,
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
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
                pathname: '/'
            }}/>
        }
    }

    
    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }


    render () {
        // var a = this.state.groups.concat(this.state.eventsapi)
        return(
            <div>
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirect}>
                    Back to Dashboard
                </Button>
                <div style={styling.cal}>
                    <h1>All Attending Groups</h1>
                    <Calendar
                        selectable
                        popup
                        localizer = {localizer}
                        events = {this.state.groups}
                        startAccessor = "start"
                        endAccessor = "end"
                        onSelectEvent={e => {alert('Group name: ' + e.title)}}
                        eventPropGetter={
                            (event, start, end, isSelected) => {
                              let newStyle = {
                                backgroundColor: "lightgrey",
                                color: 'white',
                                borderRadius: "5px",
                                border: "none"
                              };
                        
                              if (event.group){
                                newStyle.backgroundColor = "green"
                              }
                        
                              return {
                                className: "",
                                style: newStyle
                              };
                            }
                        }
                    />
                    <div className='my-legend'>
                        <div className='legend-scale'>
                            <ul className='legend-labels'>
                                <li><span style={{background:'green'}}></span>groups</li>
                            </ul>
                        </div>
                    </div>
                </div>
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
    }
}


