import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import FilterPanel from '../components/FilterPanel'
import DoctorList from '../components/DoctorList'

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json'

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()
        setDoctors(data)
        setFilteredDoctors(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching doctors:', error)
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  useEffect(() => {
    const name = searchParams.get('name') || ''
    const consultationType = searchParams.get('consultationType') || ''
    const specialties = searchParams.get('specialties')?.split(',') || []
    const sortBy = searchParams.get('sortBy') || ''

    let filtered = [...doctors]


    if (name) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(name.toLowerCase())
      )
    }

 
    if (consultationType === 'Video Consult') {
      filtered = filtered.filter(doctor => doctor.video_consult)
    } else if (consultationType === 'In Clinic') {
      filtered = filtered.filter(doctor => doctor.in_clinic)
    }

  
    if (specialties.length > 0) {
      filtered = filtered.filter(doctor =>
        specialties.some(specialty => 
          doctor.specialities.some(s => s.name === specialty)
        )
      )
    }

  
    if (sortBy === 'fees') {
      filtered.sort((a, b) => {
        const feeA = parseInt(a.fees.replace('₹ ', ''))
        const feeB = parseInt(b.fees.replace('₹ ', ''))
        return feeA - feeB
      })
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = parseInt(a.experience)
        const expB = parseInt(b.experience)
        return expB - expA
      })
    }

    setFilteredDoctors(filtered)
  }, [doctors, searchParams])

  const handleSearch = (name) => {
    const params = new URLSearchParams(searchParams)
    if (name) {
      params.set('name', name)
    } else {
      params.delete('name')
    }
    setSearchParams(params)
  }

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams)
    
    if (type === 'consultationType') {
      if (value) {
        params.set('consultationType', value)
      } else {
        params.delete('consultationType')
      }
    } else if (type === 'specialties') {
      if (value.length > 0) {
        params.set('specialties', value.join(','))
      } else {
        params.delete('specialties')
      }
    } else if (type === 'sortBy') {
      if (value) {
        params.set('sortBy', value)
      } else {
        params.delete('sortBy')
      }
    }

    setSearchParams(params)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar 
        onSearch={handleSearch} 
        initialValue={searchParams.get('name') || ''}
      />
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <FilterPanel 
          onFilterChange={handleFilterChange}
          initialFilters={{
            consultationType: searchParams.get('consultationType') || '',
            specialties: searchParams.get('specialties')?.split(',') || [],
            sortBy: searchParams.get('sortBy') || ''
          }}
        />
        <DoctorList doctors={filteredDoctors} />
      </div>
    </div>
  )
}

export default DoctorListing 