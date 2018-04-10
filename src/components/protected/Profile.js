
import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import { Panel, Row, Col, FormGroup, Button} from 'react-bootstrap';

import { changePassword, changeProfile } from '../../actions/api';
import { LinkContainer } from 'react-router-bootstrap';

import { Field, reduxForm, SubmissionError } from 'redux-form';
import { InputField } from '../forms/FormItems';
import { isRequired } from '../forms/validation';

class ProfileForm extends Component {
    render () {
        const {handleSubmit, pristine, submitting} = this.props
        return (
            <form onSubmit={ handleSubmit }>
                <Field name="first_name" type="text" component={InputField} label="First Name" placeholder="" validate={isRequired} />
                <Field name="last_name" type="text" component={InputField} label="Last Name" placeholder="" />
                <button className="btn btn-primary" type="submit" disabled={pristine || submitting}>Submit</button>
            </form>
        )
    }
}

const ProfileReduxForm = reduxForm({
    // a unique name for the form
    form: 'edit-profile-form'
})(ProfileForm)

const PasswordForm = reduxForm({
    form: 'password-form'
})(({handleSubmit, pristine, submitting}) => (
    <form onSubmit={ handleSubmit }>
        <Field name="current_password" type="password" component={InputField} label="Current Password" placeholder="" validate={isRequired} />
        <Field name="new_password" type="password" component={InputField} label="New password" placeholder="" validate={isRequired} />
        <Field name="confirm_password" type="password" component={InputField} label="Confirm password" placeholder="" validate={isRequired} />
        <button className="btn btn-primary" type="submit" disabled={pristine || submitting}>Submit</button>
    </form>
));

class Profile extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {user} = this.props;
        console.log(user);
        this.setState({});
    }

    updateProfile = (body) => {
        return this.props.changeProfile(body).then(res => {
            console.log(res);
        });
    }

    updatePassword = ({current_password, new_password, confirm_password}) => {
        if (new_password != confirm_password) {
            throw new SubmissionError({confirm_password: "New password does not match with confirm password"});
            return;
        }
        return this.props.changePassword({new_password, current_password}).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
            throw new SubmissionError({current_password: err.message});
        });
    }
    
    render() {
        const {user} = this.props;
        let profile = { first_name: user.first_name, last_name: user.last_name };
        return (
            <div>
                <Panel header="Profile">
                <ProfileReduxForm initialValues={profile} onSubmit={this.updateProfile} />
                </Panel>
                <Panel header="Password" >
                <PasswordForm onSubmit={this.updatePassword}/>
                </Panel>
            </div>
        );
    }
}
const mapDispatchToProps = {
    changePassword, changeProfile
}

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.auth,
});

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(Profile)