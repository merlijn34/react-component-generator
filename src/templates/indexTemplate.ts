export function indexTemplate(componentName: string) {
   return `import React, { type FC } from "react"
import type { ${componentName}Props } from "./types"
import { } from "./styles"

const ${componentName}: FC<${componentName}Props> = ({

}) => {
    return <div />
}

export default ${componentName}
`;
}