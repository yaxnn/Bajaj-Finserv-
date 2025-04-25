import React, { useState, useEffect } from 'react'

const FilterPanel = ({ onFilterChange, initialFilters }) => {
  const [consultationType, setConsultationType] = useState(initialFilters.consultationType)
  const [selectedSpecialties, setSelectedSpecialties] = useState(initialFilters.specialties)
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)
  const [specialties, setSpecialties] = useState([])

  useEffect(() => {
    fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json')
      .then(response => response.json())
      .then(data => {
        const uniqueSpecialties = [...new Set(
          data.flatMap(doctor => 
            doctor.specialities.map(s => s.name)
          )
        )].sort()
        setSpecialties(uniqueSpecialties)
      })
      .catch(error => {
        console.error('Error fetching specialties:', error)
      })
  }, [])

  const handleConsultationTypeChange = (type) => {
    setConsultationType(type)
    onFilterChange('consultationType', type)
  }

  const handleSpecialtyChange = (specialty) => {
    const newSelectedSpecialties = selectedSpecialties.includes(specialty)
      ? selectedSpecialties.filter(s => s !== specialty)
      : [...selectedSpecialties, specialty]
    
    setSelectedSpecialties(newSelectedSpecialties)
    onFilterChange('specialties', newSelectedSpecialties)
  }

  const handleSortChange = (sortType) => {
    setSortBy(sortType)
    onFilterChange('sortBy', sortType)
  }

  return (
    <div className="w-full md:w-64 space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 data-testid="filter-header-moc" className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          Consultation Mode
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              data-testid="filter-video-consult"
              checked={consultationType === 'Video Consult'}
              onChange={() => handleConsultationTypeChange('Video Consult')}
              className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Video Consult</span>
          </label>
          <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              data-testid="filter-in-clinic"
              checked={consultationType === 'In Clinic'}
              onChange={() => handleConsultationTypeChange('In Clinic')}
              className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">In Clinic</span>
          </label>
          <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              checked={consultationType === 'All'}
              onChange={() => handleConsultationTypeChange('All')}
              className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">All</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 data-testid="filter-header-speciality" className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Speciality
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {specialties.map((specialty) => (
            <label key={specialty} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
              <input
                type="checkbox"
                data-testid={`filter-specialty-${specialty.replace('/', '-')}`}
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
                className="form-checkbox text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 data-testid="filter-header-sort" className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
          </svg>
          Sort By
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              data-testid="sort-fees"
              checked={sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Fees (Low to High)</span>
          </label>
          <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
            <input
              type="radio"
              data-testid="sort-experience"
              checked={sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              className="form-radio text-blue-500 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">Experience (High to Low)</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel 