import './Input.scss';

const Input = (props) => {
    const { id, label, error, errorMessage, ...restProps } = props;
    return (
        <div className='input'>
            {label ? <label htmlFor={id} className="input__label">
                {label}
            </label> : null}
            <div className="input__container">
                <input
                    id={id}
                    className="input__field"
                    {...restProps}
                />
            </div>
            {error ? (
                <p className="input__error" id="email-error">
                    {errorMessage}
                </p>
            ) : null}
        </div>
    )
}

Input.defaultProps = {
    type: 'text',
    error: false,
    errorMessage: 'Please enter a valid value',
}

Input.displayName = 'Input';

export default Input;