import React, { useState } from 'react'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import SearchBar from '../../COMPONENTS/SearchBar/SearchBar'
import ResltTable from '../../COMPONENTS/ResultTable/ResltTable'

const Results = () => {

  const [results, setResults] = useState(JSON.parse(localStorage.getItem("results")) || [])
  const [currentPage, setCureentPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")

  const resultSearch = (e) => {
    setSearchValue(e.target.value)
    setCureentPage(1)
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <Navbar insideResult={true} />

        <main className="col-md-9 col-lg-10 p-4 pt-md-5">
          {/* result search*/}
          <SearchBar insideResults={true} search={resultSearch} results={results} />

          {/* result table  */}
          <ResltTable searchValue={searchValue} results={results} setResults={setResults} currentPage={currentPage} setCureentPage={setCureentPage} />
        </main>
      </div></div>
  )
}

export default Results