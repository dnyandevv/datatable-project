import { Button } from "primereact/button";
import { useState } from "react";

interface RowInputProps {
    onSelect: (n: number) => void;
}

export default function RowInput(
    { onSelect }: RowInputProps
) {
    const [n, setN] = useState<number | null>(null);
    function handleSetN() {
        setN(n);
        onSelect(n !== null ? n : 0);
    }
    return (
        <>
            <div className="overlay-div">
                <h1>Select Multiple Rows</h1>
                <p>Enter Number of rows to select across pages</p>
                <div className="overlay-div-selection">    
                    <input
                        className="row-input"
                        type="number" 
                        value={n !== null ? n : ""}
                        max={100} 
                        min={0} 
                        placeholder="eg.25 (Max 100)"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || (Number(val) <= 100 && Number(val) >= 0)) {
                                setN(val === "" ? null : Number(val));
                            }}
                        }
                    />
                   
                    <Button 
                        label="Select" 
                        onClick={handleSetN} 
                        disabled={n === null}
                        className="p-pagelink p-paginator-page p-highlight heightt" 
                    />
                </div>    
            </div>
        </>
    );
}