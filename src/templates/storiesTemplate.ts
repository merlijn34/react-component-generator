export function storiesTemplate(
  componentName: string,
  verboseComments: boolean
) { return `import React, { FC } from "react"
import ${componentName} from "@components/${componentName}"
  
export default {
  title: "General/${componentName}"
}
  
export const ${componentName.toLowerCase()}: FC = () => {
  return <div style={{ padding: 40 }}>
      <${componentName} />
  </div>
}`.trimLeft();
}
