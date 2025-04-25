// src/App.js
import React, { useState, useMemo } from 'react'; // Import useMemo
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

import AutocompleteSearchBar from './components/AutocompleteSearchBar';
import Filters from './components/Filters';
import DoctorList from './components/DoctorList';
import LoadingSpinner from './components/LoadingSpinner';
import fetchAllDoctors from './services/doctorService';

const queryClient = new QueryClient();

const parseExperience = (expString) => {
    if (!expString) return 0;
    const match = expString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

const parseFees = (feeString) => {
    if (!feeString) return Infinity; // Sort missing fees last for asc sort
    return parseInt(feeString.replace('₹', '').trim(), 10) || Infinity;
};


function DoctorSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedMode, setSelectedMode] = useState('');

  const { data: allDoctors = [], isLoading: isLoadingAllDoctors, error: errorAllDoctors } = useQuery({
      queryKey: ['doctors'],
      queryFn: ({ signal }) => fetchAllDoctors(signal),
  });

  const uniqueSpecialties = useMemo(() => {
    if (!allDoctors || allDoctors.length === 0) return [];
    const specialtiesSet = new Set();
    allDoctors.forEach(doctor => {
      doctor.specialities?.forEach(spec => {
        if (spec.name) specialtiesSet.add(spec.name);
      });
    });
    return Array.from(specialtiesSet).sort();
  }, [allDoctors]);

  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = [...allDoctors];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (selectedSpecialties.length > 0) {
      const specialtiesSet = new Set(selectedSpecialties);
      filtered = filtered.filter(doc =>
        doc.specialities?.some(spec => specialtiesSet.has(spec.name))
      );
    }

    if (selectedMode === 'video') {
      filtered = filtered.filter(doc => doc.video_consult === true);
    } else if (selectedMode === 'clinic') {
      filtered = filtered.filter(doc => doc.in_clinic === true);
    }

    if (sortBy === 'fees_asc') {
      filtered.sort((a, b) => parseFees(a.fees) - parseFees(b.fees));
    } else if (sortBy === 'experience_desc') {
      filtered.sort((a, b) => parseExperience(b.experience) - parseExperience(a.experience));
    }

    return filtered;
  }, [allDoctors, searchTerm, selectedSpecialties, selectedMode, sortBy]); // Recalculate when data or filters change

  const handleClearFilters = () => {
      setSearchTerm('');
      setSortBy('');
      setSelectedSpecialties([]);
      setSelectedMode('');
  };

  return (
    <div className="app-container">
      <AutocompleteSearchBar
        initialSearchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        allDoctors={allDoctors} // Pass the full list
      />
      <div style={{ display: 'flex' }}>
        <Filters
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedSpecialties={selectedSpecialties}
          onSpecialtyChange={setSelectedSpecialties}
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          onClearFilters={handleClearFilters}
          availableSpecialties={uniqueSpecialties} // Pass derived list
          // No loading state needed for specialties here as it's derived
        />
        <main style={{ flexGrow: 1, position: 'relative' }}>
          {isLoadingAllDoctors && <LoadingSpinner />}
          {errorAllDoctors && <div style={{ color: 'red', padding: '20px' }}>Error loading doctors: {errorAllDoctors.message}</div>}
          {!isLoadingAllDoctors && !errorAllDoctors && <DoctorList doctors={filteredAndSortedDoctors} />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DoctorSearchPage />
    </QueryClientProvider>
  );
}

export default App;