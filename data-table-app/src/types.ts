type PaginationInfo = {
  total: number;
  limit: number ;
  offset: number;
  total_pages: number;
  current_page: number;
  next_url: string;
}
export type { PaginationInfo };

type ArtData = {
  selected_status: boolean | undefined;
  id : number ;
  title: string ;
  place_of_origin: string ;
  artist_display: string ;
  inscriptions: string | null ;
  date_start: number ;
  date_end: number ;
};

export type { ArtData };

type apiData = {
  pagination: PaginationInfo ;
  data:ArtData[] ;
} ;

export type { apiData };

type ColDef = {
    fileds: keyof ArtData ;
    header: string ;
    body?: (data: ArtData) => React.ReactNode ;
}

export type { ColDef };
