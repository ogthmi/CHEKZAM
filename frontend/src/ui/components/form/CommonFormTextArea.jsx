import Form from 'react-bootstrap/Form';

export const CustomerFormTextArea = ({ value, onChange, placeholder, rows = 3, helperText }) => {
    return (
        <Form.Group>
            <Form.Control
                as="textarea"
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {helperText && <Form.Text className="text-muted">{helperText}</Form.Text>}
        </Form.Group>
    );
};

