import './Button.scss';

const Button = (props) => {
    const { children, isDisabled, ...restProps } = props;
    return (
        <button className="button" disabled={isDisabled} {...restProps}>
            <span className='button__content'>{children}</span>
        </button>
    );
}

Button.defaultProps = {
    isDisabled: false,
}

Button.displayName = 'Button';

export default Button;