import React from 'react';
//import Select from 'react-select';
import { toUcFirst } from 'modules/utils/string';
import {Select} from 'antd'
const {Option} = Select;
const RenderOption = ({ label, value, defaultValue }) => <Option value={value}>{toUcFirst(label)} </Option>;

const SelectField = ({
	input,
	label,
	isRequired,
	labelCol,
	controlCol,
	customMessage,
	type,
	options,
	multi,
	name,
	meta: { touched, error, warning }
}) => {
	const isError = touched && error;
	labelCol = labelCol ? `col-sm-${labelCol}` : ``;
	controlCol = controlCol ? `col-sm-${controlCol}` : ``;
	customMessage = customMessage ? customMessage : 'This field is required.';
	const { value } = input;
console.log("selectoptiopn", options)
console.log('multi', multi)
	return (
		<div className={isError ? 'form-group  has-error from' : 'form-group'}>
			<label className={`${labelCol}  control-label`}>
				{label} {isRequired && <span className="required-field">*</span>}
			</label>
			<div className={`${controlCol}`}>
				<div>
					{' '}
					{/* {multi ? (
						<Select
							multi
							{...input}
							name={name}
							options={options}
							value={input.value}
							onChange={(value) => input.onChange(value)}
							onBlur={() => input.onBlur(input.value)}
							options={options}
							placeholder={`Select ${label}`}
						>
							<Option value="mr">MR.</Option>
								<Option value="mrs">MRS.</Option>
								<Option value="ms">MS.</Option>
								<Option value="dr">DR.</Option>
						</Select>
					) : (
						<Select {...input} className="form-control" placeholder={label} type={type}>
							<Option value="">Select {label}</Option>
							{options &&
								options.map((option, i) => (
									<RenderOption
										key={i}
										label={option.name || option.label || option}
										value={option.id || option.key || option}
										defaultValue={value}
									/>
								))}
						</Select>
					)} */}
					<Select {...input} className="" 
						value={input.value}
						onChange={(value) => {
							 input.onChange(value);
						}}
						placeholder={`Select ${label}`}
					>
						{options &&
							options.map((option, i) => (
	
							<Option key={option.id}>{option.name}</Option>))
					}
			
						</Select>
				</div>

				{isError && <span className="error">{error}</span>}
			</div>
		</div>
	);
};

export default SelectField;
