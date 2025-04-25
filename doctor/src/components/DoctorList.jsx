// src/components/DoctorList.js
import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorList = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return <div style={{padding: '20px'}}>No doctors found matching your criteria.</div>;
  }

  return (
    <div className="doctor-list" style={{ flexGrow: 1, padding: '15px' }}>
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;