
import React, { Component } from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {reset} from 'redux-form';
import {withRouter} from 'react-router';
import { Panel } from 'react-bootstrap';

import { changePassword, changeProfile } from '../../actions/api';

import { Field, reduxForm, SubmissionError } from 'redux-form';
import { InputField } from '../forms/FormItems';
import { isRequired } from '../forms/validation';

class ProfileForm extends Component {
    render () {
        const {handleSubmit, pristine, submitting} = this.props
        return (
            <form onSubmit={ handleSubmit }>
                <Field name="firstName" type="text" component={InputField} label="First Name" placeholder="" validate={isRequired} />
                <Field name="lastName" type="text" component={InputField} label="Last Name" placeholder="" />
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
        <Field name="password" type="password" component={InputField} label="New password" placeholder="" validate={isRequired} />
        <Field name="confirmPassword" type="password" component={InputField} label="Confirm password" placeholder="" validate={isRequired} />
        <button className="btn btn-primary" type="submit" disabled={pristine || submitting}>Submit</button>
    </form>
));

class Profile extends Component {

    componentWillMount() {
        const {user} = this.props;
        console.log(user);
        this.setState({});
    }

    updateProfile = (body) => {
        const {user, changeProfile} = this.props;
        return changeProfile(user._id, body).then(res => {
            console.log(res);
        });
    }

    updatePassword = ({password, confirmPassword}) => {
        const {user, changePassword, reset} = this.props;
        if (password !== confirmPassword) {
            throw new SubmissionError({confirmPassword: "New password does not match with confirm password"});
        }
        return changePassword(user._id, {password}).then(res => {
            console.log(res);
            reset('password-form');
        }).catch(err => {
            console.log(err);
            throw new SubmissionError({password: err.message});
        });
    }
    
    render() {
        const {user} = this.props;
        let profile = { firstName: user.firstName, lastName: user.lastName };
        return (
            <div>
                <Panel header="Profile">
                <ProfileReduxForm initialValues={profile} onSubmit={this.updateProfile} />
                </Panel>
                <Panel header="Password">
                <PasswordForm onSubmit={this.updatePassword}/>
                </Panel>
            </div>
        );
    }
}
const mapDispatchToProps = {
    changePassword, changeProfile, reset
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.entities.auth,
  user: state.entities.self,
});

export default compose(connect(mapStateToProps, mapDispatchToProps), withRouter)(Profile)