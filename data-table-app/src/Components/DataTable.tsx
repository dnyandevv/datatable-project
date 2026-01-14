import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from 'react';
import type { apiData, ColDef, PaginationInfo,  } from '../types';
import MyPaginator from './MyPaginator';
import type { ArtData } from '../types';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Checkbox } from 'primereact/checkbox';

const API_URL = import.meta.env.VITE_API_URL;

const content : ColDef  [] = [
  { fileds: 'id', header: 'ID' },
  { fileds: 'title', header: 'Title' },
  { fileds: 'place_of_origin', header: 'Place of Origin' },
  { fileds: 'artist_display', header: 'Artist Display' },
  { fileds: 'inscriptions', header: 'Inscription', body: (data: ArtData ) => data.inscriptions ?? 'NULL' },
  { fileds: 'date_start', header: 'Date Start' },
  { fileds: 'date_end', header: 'Date End' },
];

export default function DtTable() {

    const [art, setArt] = useState<ArtData[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);


    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

		const op = useRef<OverlayPanel>(null);		

    useEffect(()=>{
    // setLoading(true);
    fetch(`${API_URL}/artworks?page=${currentPage}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`)
    .then((response) => response.json())
    .then((json: apiData) => {
				const status = json.data.map((item) => ({
					...item,
					selected_status: true
				}))
        setArt(status);
        setPagination(json.pagination);
        setLoading(false);
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
    }, [currentPage]);

    function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
    }

		const selectedRows = art.filter(row => row.selected_status);

		console.log(art);

		function onSelectionChange(e: { value: ArtData[] }) {
			const selectedItems = e.value;
			const updatedArt = art.map(item => ({
				...item,
				selected_status: selectedItems.some((selected: ArtData) => selected.id === item.id)
			}));
			setArt(updatedArt);
		}

		function onSelectAllChange(checked: boolean) {
			const updatedArt = art.map(item => ({
				...item,
				selected_status: checked
			}));
			setArt(updatedArt);
		}

    return (
        <>
            {pagination  &&
                <>{loading ? <p>Loading data...</p> :
                  <>
                    <DataTable
                      value={art} 
											dataKey="id"
                      stripedRows 
                      lazy
                      tableStyle={{ minWidth: '50rem' }}							
                    >
                      <Column 
												headerStyle={{ width: '3rem' }}
												header={
													<div className='column-checkbox-header'>
														<Checkbox 
															checked={selectedRows.length === art.length && art.length > 0}
															onChange={(e) => {
																onSelectAllChange(e.checked ?? false);
															}}
														/>
														<i className="pi pi-chevron-down"
															style={{
																cursor: 'pointer',
																fontSize: '0.8rem',
																color: '#6c757d'
															}}
															onClick={(e) => op.current?.toggle(e)}
														></i>
													</div>
												}
												body={(rowData) => (
													<Checkbox 
														checked={rowData.selected_status}
														onChange={(e) => {
															onSelectionChange(rowData);
														}}
													/>
												)}
											></Column>
                      {content.map((coldef) => (
                        <Column key={coldef.fileds} field={coldef.fileds} header={coldef.header} body={coldef.body}></Column>
                      ))}
                    </DataTable>




                    <MyPaginator paginationInfo={pagination} pageChange={handlePageChange}/>
										<OverlayPanel ref={op}>
											<div>
												<p>Select Multiple Rows</p>
												<input
													type="number"
												/>
												<button onClick={() => op.current?.hide()}>
													Select
												</button>
											</div>
										</OverlayPanel>
                  </>
                  }
                </>
            }
        </>
    )
}