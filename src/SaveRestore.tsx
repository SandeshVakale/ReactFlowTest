import React, { useState, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    addEdge,
    Elements,
    Edge,
    Connection, Handle, Position,
} from 'react-flow-renderer';
import './App.css'
import localforage from 'localforage';

localforage.config({
    name: 'react-flow-docs',
    storeName: 'flows',
});

const flowKey = 'example-flow';
const customNodeStyles = {
    margin: 0,
    padding: 0,
    backgroundColor: 'white',
    color: 'black'
};
const getNodeId = () => `randomnode_${+new Date()}`;
const CustomNodeComponent = ({data} : { data: any }) => {
    return (
        <div style={customNodeStyles}>
            <div className={'node_div_main'}>
                {data.title}</div>
            <div className={'node_div_sub'}>
                <Handle
                    type="source"
                    position={Position.Left}
                    id="a"
                    style={{ top: '50%', background: '#555' }}
            />{data.lable1}</div>
            <div className={'node_div_sub'}>
                <Handle
                    type="source"
                    position={Position.Left}
                    id="b"
                    style={{ top: '80%', background: '#555' }}
            />
            {data.lable2}</div>
        </div>
    );
}
const initialElements = [
    { id: '1', className: 'react-flow__node-default', data: { label: <CustomNodeComponent data={{ title: 'Front Vision', lable1: 'Frames(1)', lable2: '30 Hz' }} /> }, position: { x: 100, y: 100 } },
    { id: '2', className: 'react-flow__node-default', data: { label: <CustomNodeComponent data={{ title: 'Pedistrian ROI', lable1: 'Frames(1)', lable2: '30 Hz' }} /> }, position: { x: 100, y: 200 } },
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
];

const SaveRestore = () => {
    const [rfInstance, setRfInstance] = useState<any>(null);
    const [elements, setElements] = useState<Elements>(initialElements);
    const onElementsRemove = (elementsToRemove: Elements) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params: Edge | Connection) => setElements((els) => addEdge(params, els));
    // const { transform } = useZoomPanHelper();
    const onSave = useCallback(() => {
        if (rfInstance) {
            // @ts-ignore
            const flow = rfInstance.toObject();
            localforage.setItem(flowKey, flow);
        }
    }, [rfInstance]);
    const onRestore = useCallback(() => {
        console.log('onRestore pressed')
        const restoreFlow = async () => {
            const flow = await localforage.getItem(flowKey);
            if (flow) {
                // @ts-ignore
                //const [x = 0, y = 0] = flow.position;
                // @ts-ignore
                setElements(initialElements);
                // @ts-ignore
                // transform({ x, y, zoom: flow.zoom || 0 });
            }
        };
        restoreFlow();
    }, [setElements]);
    const onAdd = useCallback(() => {
        console.log('onAdd pressed')
        const newNode = {
            id: getNodeId(),
            className: 'react-flow__node-default',
            data: { label: <CustomNodeComponent data={{ title: 'Added Node', lable1: 'added frames', lable2: 'x Hz' }} />},
            position: {
                x: 50,
                y: 70,
            },
        };
        setElements((els) => els.concat(newNode));
    }, [setElements]);

    return (
        <ReactFlowProvider>
            <div style={{ height: 1000 }}>
                <div >
                    <button onClick={onRestore}>restore</button>
                    <button onClick={onAdd}>add node</button>
                </div>
            <ReactFlow
                nodeTypes={{ special: CustomNodeComponent }}
                elements={elements}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                // connectionLineComponent=
                onLoad={setRfInstance}
            >
            </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
};
export default SaveRestore;