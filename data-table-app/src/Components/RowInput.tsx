import { useState } from "react";

interface RowInputProps {
    onSelect: () => void;
}

export default function RowInput(
    { onSelect }: RowInputProps
) {
    const [n, setN] = useState<number | null>(null);
    function handleSetN(){
        setN(n);
        onSelect();
    }
    return (
        <>
            <div className="overlay-div">
                <p>Select Multiple Rows</p>
                <input
                    className="row-input"
                    type="number" 
                    value={n !== null ? n : ""}
                    max={100} 
                    min={0} 
                    placeholder="Enter N values(Max 100)"
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || (Number(val) <= 100 && Number(val) >= 0)) {
                            setN(val === "" ? null : Number(val));
                        }}
                    }
                />
                <button onClick={handleSetN}>
                    Select
                </button>
            </div>
        </>
    );
}