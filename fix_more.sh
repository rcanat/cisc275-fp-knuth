#!/bin/bash

# Remove unused React imports  
sed -i "s/^import React from 'react';$//" src/App.tsx
sed -i "s/^import React, { useState } from 'react';$/import { useState } from 'react';/" src/components/ComponentEditor.tsx
sed -i "s/^import React from 'react';$//" src/components/ExportPanel.tsx
sed -i "s/^import React from 'react';$//" src/components/LogicAnnotator.tsx
sed -i "s/^import React from 'react';$//" src/components/PageEditor.tsx
sed -i "s/^import React from 'react';$//" src/components/ProjectOverview.tsx
sed -i "s/^import React from 'react';$//" src/components/StateEditor.tsx

sed -i "s/^import React, { type CSSProperties } from 'react';$/import { type CSSProperties } from 'react';/" src/components/PagePreview.tsx

# Fix type imports
sed -i "s/import { PageComponent }/import type { PageComponent }/" src/components/ComponentEditor.tsx

echo "Done!"
