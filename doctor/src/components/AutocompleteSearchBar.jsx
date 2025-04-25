import React, { useState, useEffect, useRef, useCallback } from 'react';

const AutocompleteSearchBar = ({
  initialSearchTerm = '',
  onSearchChange,
  allDoctors = []
}) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (inputValue.length >= 2) {
      const lowerQuery = inputValue.toLowerCase();
      const filteredSuggestions = allDoctors
        .filter(doctor => doctor.name.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
        .map(doctor => ({
          id: doctor.id, 
          name: doctor.name, 
          photo: doctor.photo || "",
          specialty: doctor.specialty 
        }));

      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, allDoctors]);

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
    onSearchChange(newValue);
    setActiveIndex(-1);
  };

  const handleSelectSuggestion = (suggestionName) => {
    setInputValue(suggestionName);
    setShowSuggestions(false);
    onSearchChange(suggestionName);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (event.key === 'Enter') { setShowSuggestions(false); }
      return;
    }
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

  const handleSubmit = (event) => {
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
          onFocus={() => inputValue.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
        />
        {showSuggestions && (
          <ul id="suggestions-list" role="listbox" style={{
            position: 'absolute', top: '100%', left: '20px', right: '20px', backgroundColor: 'white', border: '1px solid #ccc',
            listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto', zIndex: 1000, boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            {suggestions.length === 0 && inputValue.length >= 2 && (
              <li style={{ padding: '8px 12px', color: '#888' }}>No matches found</li>
            )}
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.id} role="option" aria-selected={index === activeIndex} onClick={() => handleSelectSuggestion(suggestion.name)} onMouseEnter={() => setActiveIndex(index)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: index === activeIndex ? '#f0f0f0' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={suggestion.photo} alt={suggestion.name} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{suggestion.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{suggestion.specialty}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default AutocompleteSearchBar;
