import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "reactflow";
import "reactflow/dist/base.css";
import { useCallback, useContext, useEffect } from "react";
import CustomNode from "./CustomNode";
import { UserContext, UserContextType } from "../contexts/userContexts";

const nodeTypes = {
  custom: CustomNode,
};

type ConnectionParams = Connection;

function NodeGraph() {
  const { astDataState } = useContext(UserContext) as UserContextType;
  const [astData] = astDataState;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const onConnect = useCallback(
    (params: ConnectionParams) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const generateGraphData = async () => {
    const graphObj = astData;

    let currentYPosition = 0;
    const verticalSpacing = 100; // Minimum spacing between nodes

    const nodesData = Object.keys(graphObj._nodes).map((key, index) => {
      const node = graphObj._nodes[key];
      const estimatedHeight = node.codeBlock.split("\n").length * 20 + 100; // Estimate height based on lines of code
      const position = { x: 250, y: currentYPosition };
      currentYPosition += estimatedHeight + verticalSpacing;
      return {
        id: key,
        type: "custom",
        data: {
          label: `${node.file} + ${node.context}`,
          nodeNumber: index + 1,
          codeBlock: node.codeBlock,
          ...node,
        },
        position,
      };
    });

    const edgesData = Object.keys(graphObj._edgeObjs).map((key) => {
      const edge = graphObj._edgeObjs[key];
      return {
        id: `${edge.v}-${edge.w}`,
        source: edge.v,
        target: edge.w,
        label: graphObj._edgeLabels[key].label,
      };
    });

    // Adjust x-position for nodes with the same source
    const sourceMap = new Map();
    edgesData.forEach((edge) => {
      if (sourceMap.has(edge.source)) {
        sourceMap.get(edge.source).push(edge.target);
      } else {
        sourceMap.set(edge.source, [edge.target]);
      }
    });

    sourceMap.forEach((targets: string[]) => {
      if (targets.length > 1) {
        targets.forEach((target: string, index) => {
          const node = nodesData.find((n) => n.id === target);
          if (node) {
            node.position.x += index * 200; // Adjust x-position for each target node
          }
        });
      }
    });

    setNodes(nodesData);
    setEdges(edgesData);
  };

  useEffect(() => {
    generateGraphData();
  }, [astData]);

  return (
    <div className="h-screen bg-teal-100 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default NodeGraph;
