const MOCK_SPECIALTIES = [
    "Dentist",
    "Gynaecologist and Obstetrician",
    "General Physician",
    "Homeopath",
    "Orthopaedic",
    "Dermatologist",
    "Ayurveda",
    "Dietitian/Nutritionist",
    "Paediatrician",
    "Audiologist",
    "Ophthalmologist",
    "Diabetologist",
    "ENT"
];

const Filters = ({
  sortBy,
  onSortChange,
  selectedSpecialties,
  onSpecialtyChange,
  selectedMode,
  onModeChange,
  onClearFilters
}) => {

  const handleSpecialtyCheckbox = (event) => {
    const { value, checked } = event.target;
    const currentSpecialties = new Set(selectedSpecialties);
    if (checked) {
      currentSpecialties.add(value);
    } else {
      currentSpecialties.delete(value);
    }
    onSpecialtyChange(Array.from(currentSpecialties));
  };

  return (
    <div className="filters-container" style={{ padding: '15px', borderRight: '1px solid #eee', minWidth: '220px' /* Slightly wider */ }}>
      <h4>Sort By</h4>
      <div style={{ marginBottom: '15px' }}>
        <div>
          <label>
            <input
              type="radio"
              name="sort"
              value=""
              checked={sortBy === ''}
              onChange={(e) => onSortChange(e.target.value)}
            /> Relevance (Default)
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="sort"
              value="fees_asc" // Assuming API uses 'fees_asc' for sorting by parsed fee
              checked={sortBy === 'fees_asc'}
              onChange={(e) => onSortChange(e.target.value)}
            /> Fees - Low to High
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="sort"
              value="experience_desc" // Assuming API uses 'experience_desc' for sorting by parsed experience
              checked={sortBy === 'experience_desc'}
              onChange={(e) => onSortChange(e.target.value)}
            /> Experience - High to Low
          </label>
        </div>
         {/* Add other sort options */}
      </div>

      <h4>Filters <button onClick={onClearFilters} style={{float: 'right', background:'none', border:'none', color:'blue', cursor:'pointer', fontSize: '0.9em'}}>Clear All</button></h4>
      <hr style={{clear: 'both'}}/>

      <h5>Specialties</h5>
       <div style={{ marginBottom: '15px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #f0f0f0', padding: '5px' }}>
         {MOCK_SPECIALTIES.map(spec => (
             <div key={spec}>
                <label style={{ display: 'block', padding: '2px 0'}}>
                    <input
                        type="checkbox"
                        value={spec}
                        checked={selectedSpecialties.includes(spec)}
                        onChange={handleSpecialtyCheckbox}
                        style={{ marginRight: '5px' }}
                    /> {spec}
                </label>
             </div>
         ))}
       </div>


      <h5>Mode of consultation</h5>
      <div style={{ marginBottom: '15px' }}>
        <div>
          <label>
            <input
              type="radio"
              name="mode"
              value="" // All modes
              checked={selectedMode === ''}
              onChange={(e) => onModeChange(e.target.value)}
            /> All
          </label>
        </div>
         <div>
          <label>
            <input
              type="radio"
              name="mode"
              value="video" // API value for video consultation
              checked={selectedMode === 'video'}
              onChange={(e) => onModeChange(e.target.value)}
            /> Video Consultation
          </label>
        </div>
         <div>
          <label>
            <input
              type="radio"
              name="mode"
              value="clinic" // API value for in-clinic consultation
              checked={selectedMode === 'clinic'}
              onChange={(e) => onModeChange(e.target.value)}
            /> In-Clinic Consultation
          </label>
        </div>
      </div>

    </div>
  );
};

export default Filters;