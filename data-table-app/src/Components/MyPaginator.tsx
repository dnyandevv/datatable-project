import type { PaginationInfo } from "../types";

type MyPaginatorProps = {
  paginationInfo: PaginationInfo;
  pageChange: (newPage: number) => void;
};


export default function MyPaginator({paginationInfo, pageChange} : MyPaginatorProps) {
    const {total, limit, offset, total_pages, current_page} = paginationInfo;

    const start = offset + 1;
    const end = Math.min(offset + limit, total);

    const maxlimit = 5;
    const from = Math.max(1,current_page - 2);
    const to = Math.min(from + maxlimit - 1, total_pages);

    return (
        <div className="p-paginator">
            <div className="page-info">{`Showing ${start} to ${end} of ${paginationInfo.total} entries`}</div>
            <div>
                <button className="p-paginator-next"
                    disabled={current_page === 1}
                    onClick={() => pageChange(current_page - 1)}
                >
                    Previous
                </button>
                {
                    Array.from({length: to - from + 1}).map((_, i) => {
                        const p = from + i;
                        return (
                            <button className={p === current_page ? " p-pagelink p-paginator-page p-highlight" : "p-pagelink"}
                                key={p}
                                onClick={() => pageChange(p)}
                            >
                                {p}
                            </button>
                        );
                    })
                }
                <button className="p-paginator-prev"
                    disabled={current_page === total_pages}
                    onClick={() => pageChange(current_page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}