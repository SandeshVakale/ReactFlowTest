import React, {MouseEvent, useState} from "react";
import './App.css'

import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Edge,
  Elements,
  FlowElement,
  Handle,
  Node,
  OnLoadParams,
  Position,
  removeElements
} from "react-flow-renderer";

const onNodeDragStop = (event: MouseEvent, node: Node) =>
    console.log("drag stop", node);
const onElementClick = (event: MouseEvent, element: FlowElement) =>
    console.log("click", element);
const onLoad = (reactFlowInstance: OnLoadParams) => {
    console.log(reactFlowInstance);
    reactFlowInstance.fitView();
};
const customNodeStyles = {
  margin: 0,
  padding: 0,
  backgroundColor: 'white',
  color: 'black'
};

const CustomNodeComponent = ({data} : { data: any }) => {
  return (
      <div style={customNodeStyles}>
        <div className={'node_div_main'}>{data.title}</div>
        <div className={'node_div_sub'}>{data.lable1}</div>
        <div className={'node_div_sub'}>{data.lable2}</div>
          <Handle
              type="target"
              position={Position.Left}
              style={{ background: '#555' }}
              onConnect={(params) => console.log('handle onConnect', params)}
          />
          <input
              className="nodrag"
              type="color"
              onChange={data.onChange}
              defaultValue={data.color}
          />
          <Handle
              type="source"
              position={Position.Left}
              id="a"
              style={{ top: 10, background: '#555' }}
          />
          <Handle
              type="source"
              position={Position.Left}
              id="b"
              style={{ bottom: 10, top: 'auto', background: '#555' }}
          />
      </div>
  );
}
const initialElements = [
  {
    id: "1",
    className: 'react-flow__node-default',
    data: { label: <CustomNodeComponent data={{ title: 'Front Vision', lable1: 'Frames(1)', lable2: '30 Hz' }} /> },
    position: { x: 50, y: 90 }
  },
  { id: "2", data: { label: <CustomNodeComponent data={{ title: 'Pedistrian ROI', lable1: 'Frames(1)', lable2: null }} /> }, position: { x: 50, y: 330 } },
  { id: "3", data: { label: <CustomNodeComponent data={{ title: 'Front Frames', lable1: '(1)', lable2: null }} /> }, position: { x: 350, y: 0 } },
  { id: "4", data: { label: <CustomNodeComponent data={{ title: 'Display', lable1: 'Front Frames', lable2: '30 Hz' }} /> }, position: { x: 500, y: 200 } },
  { id: "5", data: { label: "Node 5" },
    source: '1',
    target: '4' },
  { id: "6", data: { label: "Node 6" },
    source: '2',
    target: '4' },
  { id: "7", data: { label: "Node 7" },
    source: '1',
    target: '3' }
];

const App = () => {
  const [elements, setElements] = useState<Elements>(initialElements);
  const onElementsRemove = (elementsToRemove: Elements) =>
      setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params: Edge | Connection) =>
      setElements((els) => addEdge(params, els));

  return (
      <div style={{ height: 1000 }}>
      <ReactFlow
          nodeTypes={{ special: CustomNodeComponent }}
          elements={elements}
          onLoad={onLoad}
          onElementClick={onElementClick}
          onElementsRemove={onElementsRemove}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
      >
        <Background />
      </ReactFlow>
      </div>
  );
};

export default App;