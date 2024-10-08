import React from 'react';

const BenefitsEnrollment = () => {
  const benefitOptions = [
    { id: 'medical', label: 'Medical' },
    { id: 'dental', label: 'Dental' },
    { id: 'vision', label: 'Vision' },
  ];

  const coverageOptions = [
    { value: 'employee-only', label: 'Employee Only' },
    { value: 'employee-spouse', label: 'Employee + Spouse' },
    { value: 'employee-child', label: 'Employee + Child(ren)' },
    { value: 'employee-family', label: 'Employee + Family' },
  ];

  return (
    <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Benefits Enrollment</h1>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label" htmlFor="dependent-name">Dependent Name (if applicable)</label>
            <input 
              type="text" 
              id="dependent-name" 
              className="input input-bordered w-full" 
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="relationship">Relationship (if applicable)</label>
            <select id="relationship" className="select select-bordered w-full">
              <option value="">Select an option</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-6">Benefits</h2>
        <div className="form-control mb-4">
          <label className="label" htmlFor="benefit-type">Select Benefit Type</label>
          <select id="benefit-type" className="select select-bordered w-full">
            <option value="">Select a benefit type</option>
            {benefitOptions.map((benefit) => (
              <option key={benefit.id} value={benefit.id}>{benefit.label}</option>
            ))}
          </select>
        </div>

        <div className="form-control mb-4">
          <label className="label" htmlFor="coverage">Select Coverage</label>
          <select id="coverage" className="select select-bordered w-full">
            <option value="">Select an option</option>
            {coverageOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-6">Upload Documents</h2>
        <div className="form-control mb-4">
          <label className="label" htmlFor="proof-documents">Upload Proof Documents</label>
          <input 
            type="file" 
            id="proof-documents" 
            className="input input-bordered w-full" 
            accept=".pdf,.doc,.docx,.jpg,.png"
          />
          <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
        </div>

        <button type="submit" className="btn btn-primary mt-6">Enroll</button>
      </form>
    </div>
  );
};

export default BenefitsEnrollment;