﻿import React, { Component } from 'react';
import { Form, FormControl, FormGroup, FormLabel, Button } from 'react-bootstrap/'
import { Redirect } from 'react-router-dom'

export class AdminTrainingCreate extends Component {
    constructor(props) {
        super(props)

        if (props.location.state != null) {
            this.state = {
                jwt: props.location.state.jwt,
                loggedin: props.location.state.loggedin,
                name: '',
                redirect: false,
                result: '',
                success: false
            };
            this.handleNameChange = this.handleNameChange.bind(this)
            this.onSubmit = this.onSubmit.bind(this);
        }
        else {
            this.state = {
                loggedin: false
            }
        }
        
    }

    componentDidMount() {
        this.mounted = true
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (!this.state.name) {
            this.setState({
                success: false,
                result: 'Training name cannot be empty'
            })
            return
        }

        try {
            fetch('/api/volunteer-training-creation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.state.jwt}`
                },
                body: JSON.stringify({Name: this.state.name})
            })
            .then((res) => {
                if ((res.status === 200 || res.status === 201) && this.mounted === true) {
                    this.setState({
                        result: 'Added the new training successfully!',
                        success: true,
                    })
                    return
                }
                else if ((res.status === 401 || res.status === 400 || res.status === 500) && this.mounted === true) {
                    this.setState({
                        success: false,
                    })
                    return res.json()
                }
            })
            .then((data) => {
                if (!this.state.success) {
                    this.setState({
                        result: data.error
                    })
                }
                else {
                    this.setState({
                        name: ''
                    })
                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: '/admin-training-list',
                state: {
                    jwt: this.state.jwt,
                    loggedin: this.state.loggedin
                }
            }} />
        }
    }

    render() {
        if (!this.state.loggedin) {
            return <Redirect to={{
                pathname: '/login',
            }} />
        }
        return (
            <div>
                <Button variant="primary" size="lg" style={styling.butt} onClick={this.setRedirect}>
                    Back to List
          </Button>
                <div style={styling.header}>
                    <h1>Create Training</h1>
                </div>
                <div className="box" style={styling.outerDiv}>
                    <Form style={styling.formDiv}>
                        <FormGroup>
                            <FormLabel>Training Name</FormLabel>
                            <FormControl type="text" placeholder="Training Name" value={this.state.name} onChange={this.handleNameChange} />
                        </FormGroup>

                        <p style={ this.state.success ? { color: 'green' } : { color: 'red'} }>{this.state.result}</p>
                        <div>
                            <center>
                                {this.renderRedirect()}
                                <Button variant="link" variant="primary" size="lg" onClick={this.onSubmit} style={{ justifyContent: 'center' }}>
                                    Create
                                </Button>
                            </center>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

const styling = {
    formDiv: {
        width: '50%',
    },
    outerDiv: {
        display: 'flex',
        justifyContent: 'center',
        margin: '8%'
    },
    header: {
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: '40px'
    },
    butt: {
        marginTop: '15px',
        marginLeft: '15px'
    }
}