import { useState, useEffect, useRef } from 'react'

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setShowSuggestions(true)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        fetch(`https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json`)
          .then(response => response.json())
          .then(data => {
            const matches = data
              .filter(doctor => 
                doctor.name.toLowerCase().includes(value.toLowerCase())
              )
              .slice(0, 3)
            setSuggestions(matches)
          })
          .catch(error => {
            console.error('Error fetching suggestions:', error)
            setSuggestions([])
          })
      } else {
        setSuggestions([])
      }
    }, 300)
  }

  const handleSuggestionClick = (doctor) => {
    setInputValue(doctor.name)
    setShowSuggestions(false)
    onSearch(doctor.name)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false)
      onSearch(inputValue)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          data-testid="autocomplete-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for doctors..."
          className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((doctor) => (
            <div
              key={doctor.id}
              data-testid="suggestion-item"
              onClick={() => handleSuggestionClick(doctor)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center space-x-3 transition-colors duration-200"
            >
              <img 
                src={doctor.photo} 
                alt={doctor.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
              />
              <div>
                <div className="font-medium text-gray-800">{doctor.name}</div>
                <div className="text-sm text-blue-600">
                  {doctor.specialities.map(s => s.name).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar 