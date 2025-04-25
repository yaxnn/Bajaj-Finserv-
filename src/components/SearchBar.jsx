import { useState, useEffect, useRef } from 'react'

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    setInputValue(initialValue)
  }, [initialValue])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setShowSuggestions(true)
    setIsLoading(true)

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
            setIsLoading(false)
          })
          .catch(error => {
            console.error('Error fetching suggestions:', error)
            setSuggestions([])
            setIsLoading(false)
          })
      } else {
        setSuggestions([])
        setIsLoading(false)
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
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((doctor) => (
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
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No doctors found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar 