import { useState } from 'react';

const CreateContactForm = ({ onClose, onSubmit, projectNumber }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    title: '',
    email: '',
    organization: '',
    telephone: '',
    ext: '',
    mobilePhone: '',
    fax: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(formData);
    onClose();
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4a7c59',
    marginBottom: '6px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid rgba(142, 169, 78, 0.3)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#2d4a1f',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '12px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(142, 169, 78, 0.3)',
  };

  const buttonStyle = {
    flex: 1,
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0
  };

  const scrollAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    paddingBottom: '10px'
  };

  const footerStyle = {
    paddingTop: '5px',
    position: 'sticky',
    bottom: 0
  };

  return (
    <form onSubmit={handleSubmit} style={formContainerStyle}>
      <div style={scrollAreaStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle} htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="First name"
              onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="middleInitial">Middle Initial</label>
            <input
              type="text"
              id="middleInitial"
              name="middleInitial"
              value={formData.middleInitial}
              onChange={handleChange}
              style={inputStyle}
              placeholder="M.I."
              maxLength="1"
              onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="Last name"
              onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Job title"
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="email@example.com"
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="organization">Organization</label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Organization name"
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle} htmlFor="telephone">Telephone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="(XXX) XXX-XXXX"
              onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="ext">Ext</label>
            <input
              type="text"
              id="ext"
              name="ext"
              value={formData.ext}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ext"
              onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="mobilePhone">Mobile Phone</label>
          <input
            type="tel"
            id="mobilePhone"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            style={inputStyle}
            placeholder="(XXX) XXX-XXXX"
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="fax">Fax</label>
          <input
            type="tel"
            id="fax"
            name="fax"
            value={formData.fax}
            onChange={handleChange}
            style={inputStyle}
            placeholder="(XXX) XXX-XXXX"
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            style={textareaStyle}
            placeholder="Additional notes or comments..."
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          />
        </div>
      </div>

      <div style={footerStyle}>
        <div style={buttonContainerStyle}>
          <button
            type="button"
            onClick={onClose}
            style={{
              ...buttonStyle,
              background: 'rgba(200, 200, 200, 0.5)',
              color: '#666'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(200, 200, 200, 0.7)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(200, 200, 200, 0.5)'}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              ...buttonStyle,
              background: 'rgba(142, 169, 78, 0.85)',
              color: '#ffffff'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(142, 169, 78, 1)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(142, 169, 78, 0.85)'}
          >
            Create Contact
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateContactForm;
