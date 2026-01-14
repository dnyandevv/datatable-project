import { useEffect, useState } from 'react';
import './App.css'

import type { PaginationInfo } from './types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MyPaginator from './Components/MyPaginator';

const API_URL = import.meta.env.VITE_API_URL;

type ArtData = {
  id : number ;
  title: string ;
  place_of_origin: string ;
  artist_display: string ;
  inscriptions: string | null ;
  date_start: number ;
  date_end: number ;
}

type apiData = {
  pagination: PaginationInfo ;
  data:ArtData[] ;
} ;

type ColDef = {
    fileds: keyof ArtData ;
    header: string ;
    body?: (data: ArtData) => React.ReactNode ;
  }
  
const content : ColDef  [] = [
  { fileds: 'id', header: 'ID' },
  { fileds: 'title', header: 'Title' },
  { fileds: 'place_of_origin', header: 'Place of Origin' },
  { fileds: 'artist_display', header: 'Artist Display' },
  { fileds: 'inscriptions', header: 'Inscription', body: (data: ArtData ) => data.inscriptions ?? 'NULL' },
  { fileds: 'date_start', header: 'Date Start' },
  { fileds: 'date_end', header: 'Date End' },
];

function App() {

  const [art, setArt] = useState<ArtData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(()=>{
    setLoading(true);
    fetch(`${API_URL}/artworks?page=${currentPage}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`)
    .then((response) => response.json())
    .then((json: apiData) => {
      setArt(json.data);
      setPagination(json.pagination);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [currentPage]);

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  console.log(pagination);
  console.log(art);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Data Table App</h1>
        </header>
        <main>
          <p>Welcome to the Data Table Application!</p>
        </main>
					{pagination  &&
						<>{loading ? <p>Loading data...</p> :
              <>
                <DataTable 
                  value={art} 
                  stripedRows 
                  lazy
                  tableStyle={{ minWidth: '50rem' }}							
                >
                  <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                  {content.map((coldef) => (
                    <Column key={coldef.fileds} field={coldef.fileds} header={coldef.header} body={coldef.body}></Column>
                  ))}
                </DataTable>
                <MyPaginator paginationInfo={pagination} pageChange={handlePageChange}/>
              </>
              }
						</>
					}
      </div>
    </>
  )
}

export default App
