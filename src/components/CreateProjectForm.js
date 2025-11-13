import { useState } from 'react';

const CreateProjectForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    projectNumber: '',
    projectName: '',
    projectStatus: 'Active',
    projectType: '',
    regulationType: '',
    address1: '',
    city: '',
    state: '',
    zipCode: '',
    projectBaseCost: ''
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

  const radioGroupStyle = {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  };

  const radioLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#2d4a1f',
    cursor: 'pointer'
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

  const usStates = [
    '', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

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
        <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="clientId">Client *</label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
        >
          <option value="">Select a client</option>
          <option value="9">0000</option>
          <option value="66">Alberici Corporation</option>
          <option value="39">Alfred Benesch &amp; Company</option>
          <option value="10">Another Test</option>
          <option value="73">Ariel Business Group, Inc.</option>
          <option value="16">August</option>
          <option value="12">Balahsubramanyan Regional Mind Control and Relocation Center for Young Professionals of Discriminating Taste</option>
          <option value="81">BALLY'S CORPORATION</option>
          <option value="87">BCAL-TC LESSEE LLC</option>
          <option value="31">Beta Client</option>
          <option value="92">Bulley &amp; Andrews</option>
          <option value="93">Bulley and Andrews</option>
          <option value="1">Chicago Housing Authority</option>
          <option value="3">Chicago Public Building Commission</option>
          <option value="77">City of Atlanta</option>
          <option value="24">City of East Chicago</option>
          <option value="74">City of East Chicago, Planning and Economic Business Development</option>
          <option value="91">City of Houston - IAH</option>
          <option value="42">City Test</option>
          <option value="43">City Test Client</option>
          <option value="61">Clayco/CBRE</option>
          <option value="63">client client</option>
          <option value="56">CMO, A JOINT VENTURE</option>
          <option value="27">Cook County of Illinois Demo</option>
          <option value="71">CRPT</option>
          <option value="59">D &amp; K Associates-Demo</option>
          <option value="36">DR Kool</option>
          <option value="5">East Chicago, City of</option>
          <option value="13">Edwards Development</option>
          <option value="49">F. H. Paschen, S. N. Nielsen</option>
          <option value="38">Federal Test</option>
          <option value="68">Foundation</option>
          <option value="78">Gary Sanitary District</option>
          <option value="75">Gilbane, Inc.</option>
          <option value="70">Green City University</option>
          <option value="84">Hispanic American Construction Industry Association</option>
          <option value="26">Illinois Sports Facilities Authority</option>
          <option value="65">James McHugh Construction Co.</option>
          <option value="83">John G. Shedd Aquarium</option>
          <option value="58">Kwame Building Group</option>
          <option value="45">LA Metro</option>
          <option value="19">Luis Arriaga, Inc.</option>
          <option value="51">Maman Corp</option>
          <option value="37">Massport Demo 1</option>
          <option value="64">Melissa Test Client</option>
          <option value="18">Michael Diamond, Inc.</option>
          <option value="60">MO City Test</option>
          <option value="94">Monoceros Corporation</option>
          <option value="17">new client</option>
          <option value="85">Norfolk Southern</option>
          <option value="22">October 13 Client</option>
          <option value="29">Orange Bay Company, Inc.</option>
          <option value="55">PARIC Corporation</option>
          <option value="7">Parsons Transportation Group</option>
          <option value="14">Patagonia</option>
          <option value="82">Pepper Construction Company</option>
          <option value="6">Primestor Development</option>
          <option value="46">Pullman Park Development LLC</option>
          <option value="79">Racine County, Wisconsin</option>
          <option value="80">Reed Construction</option>
          <option value="76">Related Midwest</option>
          <option value="44">Roundy's Supermarkets Inc.</option>
          <option value="96">RSD Construction</option>
          <option value="25">Rush University Medical Center</option>
          <option value="53">S. M. Wilson &amp; Co.</option>
          <option value="32">Senor Birriel</option>
          <option value="54">SLATE/City of St. Louis</option>
          <option value="72">SLDC-TEST ENVIRONMENT</option>
          <option value="15">Spacely Space Sprockets</option>
          <option value="57">SpendDemo</option>
          <option value="62">St. Louis Development Corporation</option>
          <option value="52">Tarlton Corporation</option>
          <option value="35">temp 3</option>
          <option value="20">Test Client</option>
          <option value="2">Test Data</option>
          <option value="8">Test For Client_Creation</option>
          <option value="41">Test State</option>
          <option value="23">test2</option>
          <option value="21">Trinal Employee-Created Client</option>
          <option value="69">Trinal Test Center</option>
          <option value="40">Turner Test</option>
          <option value="47">U.S. Architectural Glass &amp; Metal</option>
          <option value="4">University of Chicago Medical Center</option>
          <option value="33">University State College</option>
          <option value="34">Vic Test</option>
          <option value="28">victor</option>
          <option value="30">Victor Birriel</option>
          <option value="50">Vitatech</option>
          <option value="48">Vitatech Electromagnetics, LLC.</option>
          <option value="11">Walsh Construction</option>
          <option value="67">William A. Randolph</option>
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="projectNumber">Project Number *</label>
        <input
          type="text"
          id="projectNumber"
          name="projectNumber"
          value={formData.projectNumber}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="Enter project number"
          onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="projectName">Project Name *</label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="Enter project name"
          onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle}>Project Status *</label>
        <div style={radioGroupStyle}>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="projectStatus"
              value="Prelim"
              checked={formData.projectStatus === 'Prelim'}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            />
            Prelim
          </label>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="projectStatus"
              value="Active"
              checked={formData.projectStatus === 'Active'}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            />
            Active
          </label>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="projectStatus"
              value="Inactive"
              checked={formData.projectStatus === 'Inactive'}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            />
            Inactive
          </label>
          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="projectStatus"
              value="Complete"
              checked={formData.projectStatus === 'Complete'}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            />
            Complete
          </label>
        </div>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="projectType">Project Type *</label>
        <select
          id="projectType"
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
        >
          <option value="">Select project type</option>
          <option value="1">Construction Management</option>
          <option value="2">General Contractor</option>
          <option value="3">Design-Build</option>
          <option value="4">Private Property Manager</option>
          <option value="5">Professional Services</option>
          <option value="6">Letting</option>
          <option value="7">Emergency Work Authorization</option>
          <option value="8">Emergency Agreement</option>
          <option value="9">Joint Venture (JV)</option>
          <option value="10">TAX Abatement</option>
          <option value="11">TIF</option>
          <option value="12">TIF and Tax Abatement</option>
          <option value="13">CDA</option>
          <option value="14">NGA</option>
          <option value="15">Major Projects</option>
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="regulationType">Regulation Type *</label>
        <select
          id="regulationType"
          name="regulationType"
          value={formData.regulationType}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
        >
          <option value="">Select regulation type</option>
          <option value="1">Executive Order 28 Amended</option>
          <option value="2">Ordinance 70767</option>
        </select>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="address1">Address Line 1 *</label>
        <input
          type="text"
          id="address1"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="Enter street address"
          onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
        />
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="city">City *</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="Enter city"
          onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div>
          <label style={labelStyle} htmlFor="state">State *</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          >
            <option value="">Select state</option>
            {usStates.filter(s => s).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle} htmlFor="zipCode">ZIP Code *</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="ZIP"
            maxLength="10"
            onFocus={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(142, 169, 78, 0.3)'}
          />
        </div>
      </div>

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="projectBaseCost">Project Base Cost *</label>
        <input
          type="number"
          id="projectBaseCost"
          name="projectBaseCost"
          value={formData.projectBaseCost}
          onChange={handleChange}
          required
          style={inputStyle}
          placeholder="Enter project cost"
          min="0"
          step="0.01"
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
            Create Project
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateProjectForm;
