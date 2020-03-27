import React, { Component } from 'react';
import {Input} from 'antd';

const InputField = ({
	input,
	label,
	isRequired,
	isPreferred,
	labelCol,
	inputGroup,
	inputGroupPosition,
	controlCol,
	customMessage,
	type,
	meta: { touched, error, warning }
}) => {
	const isError = touched && error;	
	labelCol = labelCol ? `col-sm-${labelCol}` : ``;
	controlCol = controlCol ? `col-sm-${controlCol}` : ``;
	customMessage = customMessage ? customMessage : 'This field is required.';
	inputGroupPosition = inputGroupPosition ? inputGroupPosition : 'pre';

	return (
		<div className={isError ? 'form-group has-error' : 'form-group'}>
			<label className={`${labelCol}  control-label`}>
				{label} {isRequired && <span className="required-field">*</span>}
			</label>
			<div className={`${controlCol}`}>
				{inputGroup && (
					<div className="input-group">
						{' '}
						{inputGroupPosition == 'pre' && (
							<span className="input-group-addon">
								<i className={inputGroup} aria-hidden="true" />
							</span>
						)}
						<Input {...input} className='form-control' placeholder={label} type={type} />
						{inputGroupPosition == 'post' && (
							<span className="input-group-addon">{inputGroup}</span>
						)}
						
					</div>
				)}
				{!inputGroup && <Input {...input} className="form-control" placeholder={label} type={type} />}
				{isError && <span className="error">{error}</span>}
			</div>
			{isPreferred && (
				<div className="col-sm-1 field-icon">
					<i
						data-tip="Marked as preferred contact method"
						className="far fa-check-circle"
						aria-hidden="true"
					/>
				</div>
			)}
		</div>
	);
};

export default InputField;
