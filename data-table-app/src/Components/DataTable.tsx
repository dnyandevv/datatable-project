import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from 'react';
import type { apiData, ColDef, PaginationInfo,  } from '../types';
import MyPaginator from './MyPaginator';
import type { ArtData } from '../types';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Checkbox } from 'primereact/checkbox';
import RowInput from './RowInput';

const API_URL = import.meta.env.VITE_API_URL;

const content : ColDef  [] = [
  { field: 'id', header: 'ID' },
  { field: 'title', header: 'Title' },
  { field: 'place_of_origin', header: 'Place of Origin' },
  { field: 'artist_display', header: 'Artist Display' },
  { field: 'inscriptions', header: 'Inscription', body: (data: ArtData ) => data.inscriptions ?? 'NULL' },
  { field: 'date_start', header: 'Date Start' },
  { field: 'date_end', header: 'Date End' },
];

export default function DtTable() {
		const op = useRef<OverlayPanel>(null);	
    const [art, setArt] = useState<ArtData[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

		const [selectionTarget, setSelectionTarget] = useState<number>(0);
		const [manualSelectedIds, setManualSelectedIds] = useState<Set<number>>(new Set());
		const [manualDeselectedIds, setManualDeselectedIds] = useState<Set<number>>(new Set());
		const [selectionStart, setSelectionStart] = useState<number>(0);
		const totalRows = selectionTarget - manualDeselectedIds.size + manualSelectedIds.size;


    useEffect(()=>{
    fetch(`${API_URL}/artworks?page=${currentPage}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`)
    .then((response) => response.json())
    .then((json: apiData) => {
				const status = json.data;
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
		console.log(pagination)

	
	
		function onSelectAllChange(checked: boolean) {
			const newSelected = new Set(manualSelectedIds);
			const newDeselected = new Set(manualDeselectedIds);

			art.forEach((item, index) => {
				const mainIndex = (pagination?.offset ?? 0) + index;
				const isInsideBulkRange = mainIndex <= (selectionStart + selectionTarget) && mainIndex >= selectionStart;

				if (checked) {
					if (!isInsideBulkRange) {
						newSelected.add(item.id);
					}
					newDeselected.delete(item.id);
				} else {
					if (isInsideBulkRange) {
						newDeselected.add(item.id);
					}
					newSelected.delete(item.id);
				}
  		});
			setManualSelectedIds(newSelected);
			setManualDeselectedIds(newDeselected);
		}

		
	
	function handleBulkSelect(n : number) {
		const currentOffset = pagination ? pagination.offset : 0;
		setSelectionStart(currentOffset);
		setSelectionTarget(n);
		setManualDeselectedIds(new Set());
		setManualSelectedIds(new Set());
		op.current?.hide();
	}



	function isRowSelected( rowData: ArtData, index: number):  boolean {
		if (manualSelectedIds.has(rowData.id)) return true;
		if (manualDeselectedIds.has(rowData.id)) return false;

		if(pagination ) {
			const mainIndex = pagination.offset + index;
			const upperBound = selectionStart + selectionTarget;
			const isInBulk = selectionStart <= mainIndex && mainIndex < upperBound;
			// console.log("bulk range:", selectionStart, selectionStart + selectionTarget);
			if (isInBulk) return true;
		}

		return false
	}

	function onRowSelect(rowData: ArtData, index: number) {
		const isSelected = isRowSelected(rowData, index);
		const mainIndex = pagination ? pagination.offset + index : index;
		const upperBound = selectionStart + selectionTarget;
		const isInBulk = selectionStart <= mainIndex && mainIndex < upperBound;
		// console.log("bulk range:", selectionStart, selectionStart + selectionTarget);

		if (isSelected){
			if (isInBulk) {
				setManualDeselectedIds((prev) => new Set(prev).add(rowData.id));
			} else {
				setManualSelectedIds((prev) => {
					const newSet = new Set(prev);
					newSet.delete(rowData.id);
					return newSet;
				});
			}
		}else{
			if(isInBulk) {
				setManualDeselectedIds((prev) => {
					const newSet = new Set(prev);
					newSet.delete(rowData.id);
					return newSet;
				});
			} else {
				setManualSelectedIds((prev) => new Set(prev).add(rowData.id));
			}
		}
	}

		const selectionKey = `${selectionTarget}-${manualSelectedIds.size}-${manualDeselectedIds.size}`;

    return (
        <>
						<p>Rows: {totalRows}</p>
            {pagination  &&
                <>{loading ? <p>Loading data...</p> :
                  <>
                    <DataTable
											key={selectionKey}
                      value={art} 
											dataKey="id"
                      stripedRows 
                      lazy
                      tableStyle={{ minWidth: '50rem' }}		
											loading={loading}
                    >
                      <Column 
												headerStyle={{ width: '3rem' }}
												header={
													<div className='column-checkbox-header'>
														<Checkbox 
															checked={art.length > 0 && art.every((row, i) => isRowSelected(row, i))}
															onChange={(e) => {
																onSelectAllChange(e.checked ?? false);
															}}
														/>
														<i className="pi pi-chevron-down dropdown-icon"
															onClick={(e) => op.current?.toggle(e)}
														></i>
													</div>
												}
												body={(rowData, options) => (
													<Checkbox 
														checked={isRowSelected(rowData, options.rowIndex)}
														onChange={() => {
															onRowSelect(rowData, options.rowIndex);
														}}
													/>
												)}
											></Column>
                      {content.map((coldef) => (
                        <Column key={coldef.field} field={coldef.field} header={coldef.header} body={coldef.body}></Column>
                      ))}
                    </DataTable>
                    <MyPaginator paginationInfo={pagination} pageChange={handlePageChange}/>
										<OverlayPanel ref={op}>
											<RowInput onSelect={handleBulkSelect} />
										</OverlayPanel>
                  </>
                  }
                </>
            }
        </>
    )
}