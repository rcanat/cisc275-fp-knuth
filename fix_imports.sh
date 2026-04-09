#!/bin/bash
# Fix React imports and type imports

# Remove unused React imports
sed -i "s/import React from 'react';$//" src/components/ExportPanel.tsx
sed -i "s/import React from 'react';$//" src/components/LogicAnnotator.tsx  
sed -i "s/import React from 'react';$//" src/components/PageEditor.tsx
sed -i "s/import React from 'react';$//" src/components/ProjectOverview.tsx
sed -i "s/import React from 'react';$//" src/components/StateEditor.tsx

# Fix type imports in components
sed -i "s/import { IfAnnotation, ForAnnotation }/import type { IfAnnotation, ForAnnotation }/" src/components/LogicAnnotator.tsx
sed -i "s/import { PageComponent, ComponentType }/import type { PageComponent, ComponentType }/" src/components/PageEditor.tsx
sed -i "s/import { Node, Edge, addEdge, Connection,/import ReactFlow, { addEdge,/" src/components/PageGraph.tsx
sed -i "s/import { Page as PageType, Route }/import type { Page as PageType, Route, Node, Edge, Connection }/" src/components/PageGraph.tsx
sed -i "s/import { Page }/import type { Page }/" src/components/PagePreview.tsx
sed -i "s/import { StateAttribute, SecondaryDataclass }/import type { StateAttribute, SecondaryDataclass }/" src/components/StateEditor.tsx

# Fix type imports in context
sed -i "s/, ReactNode }/, type ReactNode }/" src/context/ProjectContext.tsx
sed -i "s/import { AppState, Action }/import type { AppState, Action }/" src/context/ProjectContext.tsx

# Fix type imports in data
sed -i "s/import { Project }/import type { Project }/" src/data/demoProjects.ts

# Fix type imports in utils
sed -i "s/import { Project, Page as PageType, PageComponent }/import type { Project, Page as PageType, PageComponent }/" src/utils/docxGenerator.ts
sed -i "s/import { Project, Page, PageComponent, SecondaryDataclass }/import type { Project, Page, PageComponent, SecondaryDataclass }/" src/utils/pythonGenerator.ts
sed -i "s/import { Project }/import type { Project }/" src/utils/storage.ts

# Fix test imports
sed -i "s/import { Project }/import type { Project }/" tests/pythonGenerator.spec.ts

echo "Done!"
