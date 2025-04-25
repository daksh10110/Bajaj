// src/components/DoctorCard.js
import React from 'react';
// import '../styles/DoctorCard.css'; // Optional CSS

// Helper function to safely get the primary specialty name
const getPrimarySpecialty = (specialities) => {
  if (specialities && specialities.length > 0 && specialities[0].name) {
    return specialities[0].name;
  }
  return 'N/A'; // Fallback if no specialty is found
};

// Helper function to format location
const formatLocation = (address) => {
    if (!address) return 'N/A';
    const parts = [];
    if (address.locality) parts.push(address.locality);
    if (address.city) parts.push(address.city);
    return parts.join(', ') || 'N/A';
}

const DoctorCard = ({ doctor }) => {
  const handleBookAppointment = () => {
    // Implement booking logic or navigation
    alert(`Booking appointment with ${doctor.name}`);
    // Example: history.push(`/book/${doctor.id}`);
  };

  if (!doctor) return null; // Handle case where doctor data might be missing

  const specialty = getPrimarySpecialty(doctor.specialities);
  const location = formatLocation(doctor.clinic?.address); // Use safe navigation

  // Handle potentially "null" string in photo URL
  const photoUrl = doctor.photo && doctor.photo !== "null"
    ? doctor.photo
    : 'https://via.placeholder.com/80';

  return (
    <div className="doctor-card" style={{ display: 'flex', border: '1px solid #eee', borderRadius: '8px', padding: '15px', marginBottom: '15px', justifyContent: 'space-between', alignItems: 'flex-start' /* Align items top */ }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={photoUrl}
          alt={`Dr. ${doctor.name}`}
          style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' /* Ensure image covers */ }}
          onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/80'}} // Fallback if image fails to load
        />
        <div>
          <h3 style={{ margin: '0 0 5px 0' }}>{doctor.name || 'N/A'}</h3>
          <p style={{ margin: '0 0 3px 0', color: '#555' }}>{specialty}</p>
          {/* Optional: Display introduction if needed */}
          {/* <p style={{ margin: '0 0 3px 0', color: '#777', fontSize: '0.9em' }}>{doctor.doctor_introduction?.substring(0, 100)}{doctor.doctor_introduction?.length > 100 ? '...' : ''}</p> */}
          <p style={{ margin: '0 0 3px 0', color: '#777', fontSize: '0.9em' }}>{doctor.experience || 'N/A experience'}</p>
          <p style={{ margin: '0 0 3px 0', color: '#777', fontSize: '0.9em' }}>{doctor.clinic?.name || 'Clinic name N/A'}</p>
          <p style={{ margin: '0', color: '#777', fontSize: '0.9em' }}>📍 {location}</p>
           {/* Optional: Display languages */}
           {doctor.languages && doctor.languages.length > 0 && (
             <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: '0.8em' }}>
               Speaks: {doctor.languages.join(', ')}
             </p>
           )}
           {/* Optional: Display consultation modes */}
           <div style={{ margin: '5px 0 0 0', fontSize: '0.8em', color: '#666' }}>
              {doctor.video_consult && <span style={{ marginRight: '10px' }}>✓ Video Consult</span>}
              {doctor.in_clinic && <span>✓ In-Clinic</span>}
           </div>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '15px' /* Add space */ }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1em' }}>
          {doctor.fees || 'N/A'} {/* Display fees string directly */}
        </div>
        <button
            onClick={handleBookAppointment}
            style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid blue', color: 'blue', borderRadius: '4px', whiteSpace: 'nowrap' }}
            >
            Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;