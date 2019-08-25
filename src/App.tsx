import React from 'react';
import Graph from './Graph';
import './App.css';

interface WindowDimensions {
    width: number;
    height: number;
}

const App: React.FC<WindowDimensions> = (props: WindowDimensions) => {
    return (
        <>
            <Graph
                width={props.width}
                height={props.height}
            />
        </>
    );
};

export default App;
