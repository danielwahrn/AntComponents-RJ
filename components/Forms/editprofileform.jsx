import React, { Component } from 'react';
import { Field, reduxForm, change, registerField } from 'redux-form';
import { isDirty } from 'redux-form/immutable';
import { connect } from 'react-redux';
import changeCase from 'change-case';
import { required, format, file, numericality, length } from 'redux-form-validators';
import { Prompt } from 'react-router';
import ReactTooltip from 'react-tooltip';
import {Divider, Table} from 'antd';
import {  SelectField, DatePickerField } from 'components/common/reduxform';
const toUcFirst = (str) => changeCase.upperCaseFirst(changeCase.noCase(str));
const toLowerCase = (str) => changeCase.noCase(str);

import DateOfBirthInput from 'components/common/DateOfBirthInput';
import LocationSearchInput from 'components/common/LocationSearchInput';
import ImageUpload from 'components/common/reduxform/ImageUpload';
import { InputField, ImagePreview } from 'components/common/reduxform';
import scrollToFirstError from 'components/common/reduxform/ScrollToInvalid';
import FormButtons from 'components/common/FormButtons';
import PrettyCheckbox from 'components/common/reduxform/PrettyCheckbox';
import Family from './Family';

const RenderCommunicationRow = ({ communicationType, letters, sms, email, portal }) => (
	<tr>
		<td>{communicationType}</td>
		<td>
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(communicationType)}Letters`} />
		</td>
		<td>
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(communicationType)}Sms`} />
		</td>
		<td>
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(communicationType)}Email`} />
		</td>
		<td>
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(communicationType)}Portal`} />
		</td>
	</tr>
);

const communicationColumns = [
	{
		title: 'Communication',
		key: 'commmunication',
		render: record => (
			<div>{record.communicationType}</div>
		)
	},
	{
		title: 'Letters',
		key: 'letters',
		render: (record) => (
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(record.communicationType)}Letters`} />
		)
	},
	{
		title: 'SMS',
		key: 'sms',
		render: (record) => (
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(record.communicationType)}SMS`} />
		)
	},
	{
		title: 'Email',
		key: 'email',
		render: (record) => (
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(record.communicationType)}Email`} />
		)
	},
	{
		title: 'Patient Portal',
		key: 'portal',
		render: (record) => (
			<Field component={PrettyCheckbox} name={`comm${toUcFirst(record.communicationType)}Portal`} />
		)
	},
]



const COUNTRIES = gon.countries;
const TITLE = gon.title;
const GENDER = gon.gender;
const OCCUPATIONS = gon.occupation;
const RELATIONSHIP = gon.relationship;
const PRACTITIONERS = gon.practitioners;
const PRICE_LISTS = gon.price_lists;
const PATIENT_RECORD_STATES = gon.patient_record_states;
const CONTACT_PREFERENCES = gon.contact_preferences;

const emergencyContact = (emergencyContact) => {
	if (emergencyContact) {
		return {
			emergencyContactId: emergencyContact.id,
			emergencyContactTitle: toLowerCase(emergencyContact.title),
			emergencyContactFirstName: emergencyContact.firstName,
			emergencyContactLastName: emergencyContact.lastName,
			emergencyContactRelationship: emergencyContact.relationship,
			emergencyContactNumber: emergencyContact.contactNumber
		};
	} else {
		return {
			emergencyContactTitle: '',
			emergencyContactFirstName: '',
			emergencyContactLastName: '',
			emergencyContactRelationship: '',
			emergencyContactNumber: ''
		};
	}
};

const extractId = (item) => {
	if (item) {
		return item.id;
	}
};

const InitalizeCommunicationSettings = (communicationSettings) => {
	let defaultSetting = [];
	communicationSettings.map(({ communicationType, letters, sms, portal, email }) => {
		defaultSetting[`comm${toUcFirst(communicationType)}Letters`] = letters;
		defaultSetting[`comm${toUcFirst(communicationType)}Sms`] = sms;
		defaultSetting[`comm${toUcFirst(communicationType)}email`] = email;
		defaultSetting[`comm${toUcFirst(communicationType)}Portal`] = portal;
	});
	return Object.assign({}, defaultSetting);
};

// validation

class EditProfileForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			removeProfilePhoto: false,
			isNewPhotoAdded: false,
			shouldBlockNavigation: this.props.isDirty
		};

		this.handleOnDelete = this.handleOnDelete.bind(this);
		this.handleChangeImage = this.handleChangeImage.bind(this);
	}
	componentDidMount() {
		this.props.initialize(this.initializeFormFields(this.props));
		this.props.dispatch(registerField('EditProfileForm', 'removeProfilePhoto', false));
		if (this.props.shouldBlockNavigation) {
			window.onbeforeunload = () => true;
		} else {
			window.onbeforeunload = undefined;
		}
	}

	handleChangeImage = () => {
		this.props.change('removeProfilePhoto', false); // change field
		this.setState({ removeProfilePhoto: false, isNewPhotoAdded: true }); // change temporary state
	};

	handleOnDelete = () => {
		this.props.change('removeProfilePhoto', true);
		this.setState({ removeProfilePhoto: true });
	};

	initializeFormFields(props) {
		const {
			title,
			firstName,
			lastName,
			dobUiFormat,
			gender,
			nationality,
			occupation,
			email,
			mobilePhone,
			homePhone,
			workPhone,
			homeAddressId,
			publicHealthcareNumber,
			privateHealthcareNumber,
			publicHealthcarePatientId,
			privateHealthcarePatientId,
			addressLine1,
			addressLine2,
			addressLine3,
			city,
			postcode,
			country,
			preferredPhone,
			preferredWritten,
			generalAddress
		} = this.props.profile;

		const { priceList, primaryPractitioner, secondaryPractitioner } = this.props.patientRecord;

		const priceListId = extractId(priceList);
		const primaryPractitionerId = extractId(primaryPractitioner);
		const secondaryPractitionerId = extractId(secondaryPractitioner);
		const { communicationSettings } = props;
		const initializeCommSettings = InitalizeCommunicationSettings(communicationSettings);

		return {
			title: toLowerCase(title),
			firstName,
			lastName,
			dob: dobUiFormat,
			gender: toLowerCase(gender),
			// nationality: toLowerCase(nationality),
			occupation,
			email,
			mobilePhone,
			homePhone,
			workPhone,
			homeAddressLine1: addressLine1,
			homeAddressLine2: addressLine2,
			homeAddressLine3: addressLine3,
			homeCity: city,
			homeState: this.props.profile.state,
			homePostcode: postcode,
			homeCountry: country,
			publicHealthcareNumber,
			privateHealthcareNumber,
			publicHealthcarePatientId,
			privateHealthcarePatientId,
			preferredPhoneMethod: preferredPhone,
			preferredWrittenMethod: preferredWritten,
			generalAddress: generalAddress,
			...emergencyContact(this.props.emergencyContact),
			...initializeCommSettings,
			primaryPractitionerId,
			secondaryPractitionerId,
			priceListId,
			state: toLowerCase(this.props.patientRecord.state)
		};
	}

	render() {
		const { hideEditPatientProfile, profile, handleSubmit, communicationSettings } = this.props;

		const { isPhotoAdded, photo, preferredPhone } = profile;

		const {
			relatives,
			searchFamilyMembersRequest,
			searchFamilyMembersResult,
			addFamilyMemberRequest,
			deleteFamilyMemberRequest,
			deleteFamilyMemberState,
			openAddFamilyState,
			openAddFamilyModal,
			hideAddFamilyModal,
			setFamilyMember,
			selectedFamilyMember,
			clearFamilyMember,
			isDirty
		} = this.props;

		this.state.shouldBlockNavigation = isDirty;
		const TitleOptions = TITLE.map((title) => ({ name: toUcFirst(title), id: title }));
		const genderOptions = GENDER.map((gender) => ({ name: toUcFirst(gender.name), id: gender.id }));
		const RelationOptions = RELATIONSHIP.map((relation) => ({ name: toUcFirst(relation), id: relation }));
		const PractitionersOptions = PRACTITIONERS.map((practitioner) => ({ name: practitioner.first_name + practitioner.last_name, id: practitioner.id }));
		const PriceListOptions = PRICE_LISTS.map((item) => ({ name: item.name, id: item.id }));
		const contactOptions = CONTACT_PREFERENCES.map((method) => ({ name: toUcFirst(method), id: method }));
		const stateOptions = PATIENT_RECORD_STATES.map((state) => ({ name: toUcFirst(state), id: state }));
		const countryOptions = COUNTRIES.map((country) => ({ name: toUcFirst(country), id: country }));
		console.log('GENDER', GENDER)

		return (
			<form id="form" onSubmit={handleSubmit} className="form-horizontal" noValidate="novalidate">
				<Prompt
					when={this.state.shouldBlockNavigation}
					message="You have unsaved changes, are you sure you want to leave?"
				/>
				<section>
					<FormButtons onCancel={hideEditPatientProfile} />
				</section>
				<section className="panel">
					<div className="panel-body">
						<div className="app-heading">
							<div className="icon-title">
								<i className="far far fa-user" aria-hidden="true" />
								<h3 className="section-title">Profile</h3>
							</div>
						</div>					
					
						<div className="form-group">
							<label className="col-sm-3 control-label">Profile</label>
							{/* OLD PHOTO with Delete option */}
							<div className="col-sm-4">
								{isPhotoAdded &&
								!this.state.removeProfilePhoto &&
								!this.state.isNewPhotoAdded && (
									<div className="col-sm-4">
										<i
											className="fal fa-trash-alt"
											onClick={(e) =>
												window.confirm('Are you sure want to delete?') &&
												this.handleOnDelete(e)}
										/>
										<ImagePreview url={photo} />
									</div>
								)}
								{/* NEW PHOTO with Preview Option */}
								{(!isPhotoAdded || this.state.removeProfilePhoto || this.state.isNewPhotoAdded) && (
									<Field name="photo" component={ImageUpload} onChange={this.handleChangeImage} />
								)}
							</div>
						</div>

						{/* <Field
							component="hidden"
							name="removeProfilePhoto"
							defaultValue={this.state.removeProfilePhoto}
							className="form-control"
						/> */}

						{/* <div className="form-group">
							<label className="col-sm-3 control-label">Title</label>
							<div className="col-sm-6">
								<Field component="select" name="title" className="form-control" required>
									{TITLE.map((title) => <option value={title}>{toUcFirst(title)}</option>)}
								</Field>
								
							</div>
						</div> */}
						<Field
							name="title"
							label="Title"
							className="form-control"
							options={TitleOptions}
							component={SelectField}
							isRequired={true}
							labelCol={3}
							controlCol={6}
						/>
						<Field
							name="firstName"
							validate={[ required(), length({ max: 20 }) ]}
							label="First name"
							isRequired={true}
							className="form-control"
							component={InputField}
							labelCol={3}
							controlCol={5}
						/>
						<Field
							name="lastName"
							validate={[ required() ]}
							label="Last name"
							isRequired={true}
							className="form-control"
							component={InputField}
							labelCol={3}
							controlCol={5}
						/>

						<div className="form-group">
							<label className="col-sm-3 control-label">Date of birth(dd/mm/yyyy)</label>
							<div className="col-sm-7">
								<Field 
								component={DateOfBirthInput} 
								name="dob" className="form-control" />
							</div>
						</div>
						{/* <div className="form-group">
							<label className="col-sm-3 control-label">Gender</label>
							<div className="col-sm-4">
								<Field name="gender" component="select" className="form-control">
									{GENDER.map((gender) => <option value={gender}>{toUcFirst(gender)}</option>)}
								</Field>
								
							</div>
						</div> */}
						<Field
							name="gender"
							label="Gender"
							className="form-control"
							options={genderOptions}
							component={SelectField}
							labelCol={3}
							controlCol={4}
						/>
						{/* <div className="form-group">
							<label className="col-sm-3 control-label">Nationality</label>
							<div className="col-sm-7">
								<Field name="nationality" component="select" className="form-control">
									<option value="">Select nationality</option>
									{NATIONALITIES.map((nation) => <option value={nation}>{toUcFirst(nation)}</option>)}
								</Field>
							</div>
						</div> */}
						{/* <div className="form-group">
							<label className="col-sm-3 control-label">Occupation</label>
							<div className="col-sm-7">
								<Field name="occupation" component="select" className="form-control">
									<option value="">Select Occupation</option>
									{OCCUPATIONS.map((occupation) => <option value={occupation}>{occupation}</option>)}
								</Field>
							</div>
						</div> */}
						{/* <div className="form-group">
							<label className="col-sm-3 control-label">Status</label>
							<div className="col-sm-4">
								<Field name="state" component="select" className="form-control">
									<option value="">Select status</option>
									{PATIENT_RECORD_STATES.map((state) => (
										<option value={state}>{toUcFirst(state)}</option>
									))}
								</Field>
								
							</div>
							
						</div> */}
						<Field
							name="state"
							label="Select status"
							className="form-control"
							options={stateOptions}
							component={SelectField}
							labelCol={3}
							controlCol={4}
						/>
						<Divider />
						<div className="app-heading">
							<div className="icon-title">
								<i className="far fa-address-card" aria-hidden="true" />
								<h3 className="section-title">Contact Information</h3>
							</div>
						</div>
						{/* <Field name="patient[email]" validate={email()} label="Email" customMessage={'Please enter valid email'}  className="form-control" component={InputField} /> */}
						<Field
							name="email"
							type="email"
							label="Email"
							component={InputField}
							labelCol={3}
							controlCol={5}
							message={'Please enter valid email'}
							validate={format({ with: /^$|^.*@.*\..*$/i, message: 'Please enter valid email address' })}
						/>

						<Field
							name="mobilePhone"
							type="input"
							label="Mobile phone"
							component={InputField}
							isPreferred={preferredPhone == 'mobile'}
							labelCol={3}
							controlCol={7}
							inputGroup={'fal fa-mobile-android-alt'}
							validate={format({ with: /(^$)|(^\d{10}$)/i, message: 'Please enter mobile number' })}
						/>

						<Field
							name="homePhone"
							type="input"
							label="Home phone"
							component={InputField}
							isPreferred={preferredPhone == 'home'}
							labelCol={3}
							controlCol={7}
							inputGroup={'fal fa-phone-office'}
						/>
						<Field
							name="workPhone"
							type="input"
							label="Work phone"
							component={InputField}
							isPreferred={preferredPhone == 'work'}
							labelCol={3}
							controlCol={7}
							inputGroup={'fal fa-phone-office'}
						/>
					

					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Address</label>
						<div className="col-sm-7">
							<Field component="input" name="homeAddressLine1" className="form-control" />
							

							<div className="input-group">
								<span className="input-group-addon">
								<i className="fal fa-map-marker-alt" />
								</span>
								
							</div>
						</div>
						<div className="col-sm-7"></div>
					</div> */}
					<Field
						name="homeAddressLine1"
						validate={[ required() ]}
						label="Address"
						isRequired={true}
						className="form-control"
						component={InputField}
						labelCol={3}
						controlCol={5}
					/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label" />
						<div className="col-sm-7">
							<Field component="input" name="homeAddressLine2" className="form-control" />
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field
						name="homeAddressLine2"
						className="form-control"
						component={InputField}
						labelCol={3}
						controlCol={7}
					/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label" />
						<div className="col-sm-7">
							<Field component="input" name="homeAddressLine3" className="form-control" />
						</div>
						
						<div className="col-sm-7" />
					</div> */}
					<Field
						name="homeAddressLine3"
						className="form-control"
						component={InputField}
						labelCol={3}
						controlCol={7}
					/>

					{/* <div className="form-group">
						<div className="col-sm-3" />
						<div className="col-sm-3">
							<label className="control-label">City</label>
							<Field component="input" name="homeCity" className="form-control" />
						</div>
						<div className="col-sm-2">
							<label className="control-label">State</label>
							<Field component="input" name="homeState" className="form-control" />
						</div>
						<div className="col-sm-2">
							<label className="control-label">Post code</label>
							<Field component="input" name="homePostcode" className="form-control" />
						</div>
					</div> */}
					<div className="form-group">
					<div className="col-sm-3" />
					<div className="col-sm-3">
					<Field
						name="homeState"
						label="State"
						className="form-control"
						component={InputField}
						labelCol={12}
						controlCol={12}
					/>
					</div>
					<div className="col-sm-2">
					<Field
						name="homeCity"
						label="City"
						className="form-control"
						component={InputField}
						labelCol={12}
						controlCol={12}
					/>
					</div>
					<div className="col-sm-2">
					<Field
						name="homePostCode"
						label="Post Code"
						className="form-control"
						component={InputField}
						labelCol={12}
						controlCol={12}
					/>
					</div>
					</div>
					
					
					
					{/* <div className="form-group">
						<label className="col-sm-3 control-label"> Country </label>
						<div className="col-sm-7">
							<Field name="homeCountry" component="select" className="form-control">
								{COUNTRIES.map((country) => <option value={country}>{toUcFirst(country)}</option>)}
							</Field>
							
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field
							name="homeCountry"
							label="Country"
							className="form-control"
							options={countryOptions}
							component={SelectField}
							labelCol={3}
							controlCol={7}
						/>
					<Divider />
					<div className="app-heading">
						<div className="icon-title">
							<i className="far fa-address-card" aria-hidden="true" />
							<h3 class="section-title">Emergency Contact</h3>
						</div>
					</div>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Title</label>
						<div className="col-sm-4">
							<Field component="select" name="emergencyContactTitle" className="form-control" required>
								{TITLE.map((title) => <option value={title}>{toUcFirst(title)}</option>)}
							</Field>
							
						</div>
					</div> */}
					<Field
							name="emergencyContactTitle"
							label="Title"
							className="form-control"
							options={TitleOptions}
							component={SelectField}
							isRequired={true}
							labelCol={3}
							controlCol={4}
						/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Firstname</label>
						<div className="col-sm-7">
							<Field component="input" name="emergencyContactFirstName" className="form-control" />
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field 
						name="emergencyContactFirstName"
						label="Firstname"
						component={InputField}
						className="form-control"
						labelCol={3}
						controlCol={7}
					/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Last name</label>
						<div className="col-sm-7">
							<Field component="input" name="emergencyContactLastName" className="form-control" />
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field 
						name="emergencyContactLastName"
						label="Last name"
						component={InputField}
						className="form-control"
						labelCol={3}
						controlCol={7}
					/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Relationship</label>
						<div className="col-sm-7">
							<Field
								component="select"
								name="emergencyContactRelationship"
								className="form-control"
								required
							>
								{RELATIONSHIP.map((relation) => (
									<option value={relation}>{toUcFirst(relation)}</option>
								))}
							</Field>
							
						</div>
					</div> */}
					<Field
							name="emergencyContactRelationship"
							label="Relationship"
							className="form-control"
							options={RelationOptions}
							component={SelectField}
							isRequired={true}
							labelCol={3}
							controlCol={7}
						/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Contact number</label>
						<div className="col-sm-7">
							<Field component="input" name="emergencyContactNumber" className="form-control" required />
						</div>
					</div> */}
					<Field 
						name="emergencyContactNumber"
						label="Contact number"
						component={InputField}
						className="form-control"
						labelCol={3}
						controlCol={7}
					/>
					<Divider />

					<div className="app-heading">
						<div className="icon-title">
							<i className="far fa-notes-medical" aria-hidden="true" />
							<h3 className="section-title">Health Fund</h3>
						</div>
					</div>

					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Health Fund Account Number</label>
						<div className="col-sm-7">
							<Field component="input" name="privateHealthcareNumber" className="form-control" />
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field 
						name="privateHealthcareNumber"
						label="Health Fund Account Number"
						component={InputField}
						className="form-control"
						labelCol={3}
						controlCol={7}
					/>

					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Health Fund Patient ID</label>
						<div className="col-sm-7">
							<Field component="input" name="privateHealthcarePatientId" className="form-control" />
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field 
						name="privateHealthcarePatientId"
						label="Health Fund Patient ID"
						component={InputField}
						className="form-control"
						labelCol={3}
						controlCol={7}
					/>

					{/* <div className="form-group">
						<label className="col-sm-3 control-label">National Health Fund Number</label>
						<div className="col-sm-7">
							<Field component="input" name="publicHealthcareNumber" className="form-control" />
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field 
						name="publicHealthcareNumber"
						label="National Health Fund Number"
						component={InputField}
						className="form-control"
						labelCol={3}
						controlCol={7}
					/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">National Fund Patient ID</label>
						<div className="col-sm-7">
							<Field component="input" name="publicHealthcarePatientId" className="form-control" />
						</div>
						<div className="col-sm-7" />
					</div> */}
					<Field 
						name="publicHealthcarePatientId"
						label="National Fund Patient I"
						component={InputField}
						className="form-control"
						labelCol={3}
						controlCol={7}
					/>
					<Divider />
					<div className="app-heading">
						<div className="icon-title">
							<i className="far fa-building" aria-hidden="true" />
							<h3 className="section-title">Practice Information</h3>
						</div>
					</div>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Primary practitioner</label>
						<div className="col-sm-8">
							<Field name="primaryPractitionerId" component="select" className="form-control">
								<option value="">Select </option>
								{PRACTITIONERS.map(({ id, first_name, last_name }) => (
									<option value={id}>
										{first_name} {last_name}
									</option>
								))}
							</Field>
							
						</div>
					</div> */}
					<Field
							name="primaryPractitionerId"
							label="Primary practitioner"
							className="form-control"
							options={PractitionersOptions}
							component={SelectField}
							isRequired={true}
							labelCol={3}
							controlCol={8}
						/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Secondary practitioner</label>
						<div className="col-sm-8">
							<Field name="secondaryPractitionerId" component="select" className="form-control">
								<option value="">Select </option>
								{PRACTITIONERS.map(({ id, first_name, last_name }) => (
									<option value={id}>
										{first_name} {last_name}
									</option>
								))}
							</Field>
							
						</div>
					</div> */}
					<Field
							name="secondaryPractitionerId"
							label="Secondary practitioner"
							className="form-control"
							options={PractitionersOptions}
							component={SelectField}
							isRequired={true}
							labelCol={3}
							controlCol={8}
						/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Price list</label>
						<div className="col-sm-8">
							<Field name="priceListId" component="select" className="form-control">
								{PRICE_LISTS.map(({ id, name }) => <option value={id}>{name}</option>)}
							</Field>
							
						</div>
					</div> */}
					<Field
							name="priceListId"
							label="Price list"
							className="form-control"
							options={PriceListOptions}
							component={SelectField}
							isRequired={true}
							labelCol={3}
							controlCol={8}
						/>
					<Divider />

					<Family
						relatives={relatives}
						searchFamilyMembersRequest={searchFamilyMembersRequest}
						searchFamilyMembersResult={searchFamilyMembersResult}
						addFamilyMemberRequest={addFamilyMemberRequest}
						deleteFamilyMemberRequest={deleteFamilyMemberRequest}
						deleteFamilyMemberState={deleteFamilyMemberState}
						openAddFamilyState={openAddFamilyState}
						openAddFamilyModal={openAddFamilyModal}
						hideAddFamilyModal={hideAddFamilyModal}
						setFamilyMember={setFamilyMember}
						selectedFamilyMember={selectedFamilyMember}
						clearFamilyMember={clearFamilyMember}
						isEdit={true}
					/>

					<div className="app-heading">
						<div className="icon-title">
							<i className="far fa-comment-alt-exclamation" aria-hidden="true" />
							<h3 className="section-title">Contact Preferences</h3>
						</div>
					</div>

					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Preferred Phone Contact Method</label>
						<div className="col-sm-4">
							<Field name="preferredPhoneMethod" component="select" className="form-control">
								{CONTACT_PREFERENCES.map((method) => (
									<option value={method}>{toUcFirst(method)}</option>
								))}
							</Field>
							
								
						</div>
					</div> */}
					<Field
							name="preferredPhoneMethod"
							label="Preferred Phone Contact Method"
							className="form-control"
							options={contactOptions}
							component={SelectField}
							isRequired={true}
							labelCol={3}
							controlCol={4}
						/>
					{/* <div className="form-group">
						<label className="col-sm-3 control-label">Preferred Written Contact Method</label>
						<div className="col-sm-4">
							<Field name="preferredWrittenMethod" component="select" className="form-control">
								<option value="">Select </option>
								{CONTACT_PREFERENCES.map((method) => (
									<option value={method}>{toUcFirst(method)}</option>
								))}
							</Field>
						</div>
					</div> */}

					{/* <div className="form-group">
						<label className="col-sm-3 control-label">General Information Address</label>
						<div className="col-sm-4">
							<Field name="generalAddress" component="select" className="form-control">
								{CONTACT_PREFERENCES.map((method) => (
									<option value={method}>{toUcFirst(method)}</option>
								))}
							</Field>
						</div>
					</div> */}

					{/* <div className="form-group">
						<label className="col-sm-3 control-label">
							Billing Address <span className="required">*</span>
						</label>
						<div className="col-sm-4">
							<select id="company" className="form-control">
								<option value>Choose a title</option>
								<option value="apple">Apple</option>
								<option value="google">Google</option>
								<option value="microsoft">Microsoft</option>
								<option value="yahoo">Yahoo</option>
							</select>
						</div>
					</div> */}

					<div>
						{/* <h4 className="subtitle">Communications Settings</h4> */}
						<div className="app-heading">
							<div className="icon-title">
								<i className="far far fa-user" aria-hidden="true" />
								<h3 className="section-title">Communications Settings</h3>
							</div>
						</div>
						<div className="form-group">
						<div className="col-sm-12">
							<Table columns={communicationColumns} dataSource={communicationSettings}/>
						</div>
							<form action="#" method="post">
								<div className="responsive-table">
									<div className="table-bordered">
										<table className="table table-hover app-table">
											<thead>
												<tr>
													<th>Communication</th>
													<th>Letters</th>
													<th>SMS</th>
													<th>Email</th>
													<th>Patient Portal</th>
												</tr>
											</thead>
											<tbody>
												{communicationSettings &&
													communicationSettings.map((setting) =>
														RenderCommunicationRow(setting)
													)}
											</tbody>
										</table>
									</div>
								</div>
							</form>
						</div>
					</div>
					<FormButtons onCancel={hideEditPatientProfile} />

					{/* <div className="form-group">
						<div className="col-sm-12">
							<button type="submit" name="submit">
								{' '}
								Save
							</button>
						</div>
					</div> */}
					</div>
				</section>
				<ReactTooltip />
			</form>
		);
	}
}

const mapStateToProps = (state) => ({
	isDirty: isDirty('EditProfileForm')(state)
});

EditProfileForm = connect(mapStateToProps, mapDispatchToProps)(EditProfileForm);

EditProfileForm = reduxForm({
	form: 'EditProfileForm',
	onSubmitFail: (errors) => scrollToFirstError(errors)
})(EditProfileForm);

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({ change }, dispatch);
};

export default EditProfileForm;
