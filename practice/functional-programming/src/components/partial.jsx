export const partialComponent = (Component,partialProps) => {
    return props => {
        return <Component {...partialProps} {...props} />
    }
}

export const Button = ({ size, color, text, ...otherProps }) => {
    return (
        <button
            style={{
                fontSize: size === 'small' ? '8px' : '32px',
                backgroundColor: color
            }}
            {...otherProps}
        >
            {text}
        </button>
    );
};

export const RedButton = partialComponent(Button, {color: "crimson"});
export const SmallRedButton = partialComponent(RedButton, {size: "small"});