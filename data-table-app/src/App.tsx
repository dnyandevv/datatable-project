import './App.css'
import DtTable from './Components/DataTable.tsx';

function App() {

  // const [art, setArt] = useState<ArtData[]>([]);
  // const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [currentPage, setCurrentPage] = useState<number>(1);

  // useEffect(()=>{
  //   setLoading(true);
  //   fetch(`${API_URL}/artworks?page=${currentPage}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`)
  //   .then((response) => response.json())
  //   .then((json: apiData) => {
  //     setArt(json.data);
  //     setPagination(json.pagination);
  //     setLoading(false);
  //   }).catch((error) => {
  //     console.error('Error fetching data:', error);
  //   });
  // }, [currentPage]);

  // function handlePageChange(newPage: number) {
  //   setCurrentPage(newPage);
  // }

  // console.log(pagination);
  // console.log(art);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Data Table App</h1>
        </header>
        <main>
          <p>Welcome to the Data Table Application!</p>
        </main>
					{/* {pagination  &&
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
					} */}
          <DtTable />
      </div>
    </>
  )
}

export default App
