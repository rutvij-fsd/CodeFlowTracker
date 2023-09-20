import { memo } from "react";
import { Handle, Position } from "reactflow";

type CustomNodeData = {
  nodeNumber: number;
  file: string;
  context: string;
  codeBlock: string;
};
function CustomNode({ data }: { data: CustomNodeData }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-teal-50 border-2 border-stone-400">
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          {data.nodeNumber}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.file}</div>
          <div className="text-gray-500">{data.context}</div>
          <pre className="text-sm mt-2 bg-gray-200 p-2 rounded">
            <code>{data.codeBlock}</code>
          </pre>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}

export default memo(CustomNode);
