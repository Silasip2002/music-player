// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const DEBOUNCE_DELAY = 2000; // 2 seconds delay
const MIN_SEARCH_LENGTH = 3; // Minimum 3 characters to search

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const trimmedQuery = query.trim();
    // Don't set up timer if query is too short or same as last search
    if (trimmedQuery.length < MIN_SEARCH_LENGTH || trimmedQuery === lastSearchedQuery) {
      return;
    }

    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
      setLastSearchedQuery(trimmedQuery);
      onSearch(trimmedQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
      setIsTyping(true);
    };
  }, [query, lastSearchedQuery, onSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear last search if input becomes too short
    if (value.trim().length < MIN_SEARCH_LENGTH) {
      setLastSearchedQuery('');
    }
  };

  return (
    <div className="search-container">
      <h1>Search</h1>
      <div className="search-bar">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={`Search songs, album, artist (min ${MIN_SEARCH_LENGTH} characters)...`}
            className="search-input"
            autoFocus
          />
          {isTyping && query.trim().length >= MIN_SEARCH_LENGTH ? (
            <span className="typing-indicator">Typing...</span>
          ) : query.length > 0 && query.trim().length < MIN_SEARCH_LENGTH ? (
            <span className="typing-indicator">{`Type ${MIN_SEARCH_LENGTH - query.trim().length} more...`}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;