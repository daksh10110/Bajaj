// src/components/AutocompleteSearchBar.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Removed useQuery import

// Accept the list of all doctors (or just names/ids) as a prop
const AutocompleteSearchBar = ({
  initialSearchTerm = '',
  onSearchChange,
  allDoctors = [] // Receive the full list for local filtering
}) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  // --- Local Suggestion Filtering ---
  useEffect(() => {
    if (inputValue.length >= 2) {
      const lowerQuery = inputValue.toLowerCase();
      const filteredSuggestions = allDoctors
        .filter(doctor => doctor.name.toLowerCase().includes(lowerQuery))
        .slice(0, 3) // Limit to top 3 matches
        .map(doctor => ({ id: doctor.id, name: doctor.name })); // Map to expected format

      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, allDoctors]); // Re-filter when input or the doctor list changes

  // --- Event Handlers (Mostly Similar) ---
  const handleClickOutside = useCallback((event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onSearchChange(newValue); // Update search term in App immediately
    setActiveIndex(-1);
    // Suggestion update is handled by the useEffect above
  };

  const handleSelectSuggestion = (suggestionName) => {
    setInputValue(suggestionName);
    setShowSuggestions(false);
    onSearchChange(suggestionName); // Ensure App gets the selected name
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
     if (!showSuggestions || suggestions.length === 0) {
         if (event.key === 'Enter') { setShowSuggestions(false); } // Hide on enter even if no suggestions
         return;
     };
    // ArrowDown, ArrowUp, Enter, Escape logic remains the same as before
     switch (event.key) {
      case 'ArrowDown': event.preventDefault(); setActiveIndex((prevIndex) => (prevIndex + 1) % suggestions.length); break;
      case 'ArrowUp': event.preventDefault(); setActiveIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length); break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) { handleSelectSuggestion(suggestions[activeIndex].name); }
        else { setShowSuggestions(false); }
        break;
      case 'Escape': setShowSuggestions(false); setActiveIndex(-1); break;
      default: break;
    }
  };

 const handleSubmit = (event) => { /* ... same form submission handling (optional now) ... */
      event.preventDefault();
      setShowSuggestions(false);
 };

  return (
    <div ref={containerRef} style={{ position: 'relative', padding: '10px 20px', borderBottom: '1px solid #eee', backgroundColor: 'blue' }}>
       <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Doctors by Name (local)..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)} // Show on focus only if suggestions exist
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
        />
        {/* Suggestions Rendering - uses local 'suggestions' state */}
        {showSuggestions && (
          <ul id="suggestions-list" role="listbox" style={/* ... styles ... */ { position: 'absolute', top: '100%', left: '20px', right: '20px', backgroundColor: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            {/* No loading state needed for local suggestions */}
            {suggestions.length === 0 && inputValue.length >= 2 && (
              <li style={{ padding: '8px 12px', color: '#888' }}>No matches found</li>
            )}
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.id} role="option" aria-selected={index === activeIndex} onClick={() => handleSelectSuggestion(suggestion.name)} onMouseEnter={() => setActiveIndex(index)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: index === activeIndex ? '#f0f0f0' : 'transparent' }}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default AutocompleteSearchBar;