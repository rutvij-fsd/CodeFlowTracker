import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { fetchRepoFiles } from './utils';
import { Occurrence } from './types';
import * as babelTypes from '@babel/types';

const AST_PARSE_OPTIONS: {
    sourceType: "module" | "script" | "unambiguous";
    plugins: ("jsx" | "typescript")[];
} = {
    sourceType: "module",
    plugins: ["jsx", "typescript"]
};
  

function determineIdentifierContext(path: any, searchString: string): string {
    let context = '';
    if (path.parentPath.isJSXAttribute()) {
        context = "JSX Attribute";
    }
    
    else if (
        path.parentPath.isCallExpression() && 
        path.parentPath.node.callee.type === 'Identifier' && 
        ["useState", "useEffect", "useMemo", "useCallback", "useRef", "useContext"].includes(path.parentPath.node.callee.name)
    ) {
        context = "Hook Declaration";
    }
    
    else if (path.parentPath.isJSXOpeningElement()) {
        context = "JSX Element";
    }

    else if (path.parentPath.isImportSpecifier() || path.parentPath.isImportDefaultSpecifier()) {
        context = "Import Statement";
    }
 
   else if (path.parentPath.isFunctionDeclaration() || path.parentPath.isFunctionExpression() || path.parentPath.isArrowFunctionExpression()) {
        const functionNode = path.parentPath.node;

        
        if (functionNode.params.some((param: { type: string; name: string; }) => param.type === "Identifier" && param.name === searchString)) {
            context = "Function Parameter";
        }
      
        else if (path.parentPath.isFunctionDeclaration()) {
            const functionDeclarationNode = path.parentPath.node as babelTypes.FunctionDeclaration;
            if (functionDeclarationNode.id && functionDeclarationNode.id.type === "Identifier" && functionDeclarationNode.id.name === searchString) {
                context = "Function Declaration";
            }
        }
        
    }
    
    else if (path.findParent((p: { isReturnStatement: () => any; }) => p.isReturnStatement())) {
        context = 'Return Statement';
    }
   
    else if (path.parentPath.isCallExpression()) {
        context = 'Function Call';
    }
    
    else if (path.parentPath.isVariableDeclarator()) {
        context = 'Variable Declaration';
    } 
    
    else if (path.parentPath.isObjectProperty()) {
        context = 'Object Property';
    } 
   
    else if (path.parentPath.isArrayExpression()) {
        context = 'Array Element';
    }
    else if (
        path.parentPath.isBinaryExpression() &&
        ["===", "!==", "==", "!=", "<", ">", "<=", ">="].includes(
          path.parentPath.node.operator
        ) &&
        (path.parentPath.parentPath.isConditionalExpression() ||
          path.parentPath.parentPath.isIfStatement())
      ) {
        context = "Equality or Comparison Check";
      }
    return context;
}

export async function analyzeFile(filePath: string, searchString: string): Promise<Occurrence[]> {
    const fileContentOrItems = await fetchRepoFiles(filePath);

    if (typeof fileContentOrItems !== 'string') {
        console.error(`Expected file content but received a list of items for path: ${filePath}`);
        return [];
    }

    const ast = parse(fileContentOrItems, AST_PARSE_OPTIONS);
    let occurrences: Occurrence[] = [];

    traverse(ast, {
        Identifier(path) {
            if (path.node.name === searchString) {
                let functionName = "Global/Outside Function";
                let parentFunction = path.findParent((p) => p.isFunctionDeclaration() || p.isArrowFunctionExpression() || p.isFunctionExpression());
                
                if (parentFunction && parentFunction.node.type === 'FunctionDeclaration' && parentFunction.node.id) {
                    functionName = parentFunction.node.id.name;
                }

                let codeBlock = "";
                let enclosingStatement = path.findParent((p) => p.isStatement());  
                if (enclosingStatement) {
                    const startLine = enclosingStatement.node.loc?.start.line ?? 0;
                    const endLine = enclosingStatement.node.loc?.end.line ?? 0;
                    if (startLine && endLine) {
                        codeBlock = fileContentOrItems.split('\n').slice(startLine - 1, endLine).join('\n');
                    }
                }

                let declaration = path.findParent((p) => p.isFunctionDeclaration() || p.isImportDeclaration() || p.isVariableDeclaration());
                let context = determineIdentifierContext(path, searchString);

                if (declaration) {
                    const startLine = declaration.node.loc?.start.line ?? 0;
                    const endLine = declaration.node.loc?.end.line ?? 0;
                    let declarationCode = fileContentOrItems.split('\n').slice(startLine - 1, endLine).join('\n');
                    occurrences.push({
                        type: path.type,
                        location: path.node.loc ?? { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } }, // Default value if loc is null or undefined
                        file: filePath,
                        function: functionName,
                        codeBlock: codeBlock,
                        declaration: declarationCode,
                        context: context
                    });      
                }
            }
        }
    });
    return occurrences;
}
