---
nav:
  title: Components
  path: /components
---

Install dependencies,

```bash
$ npm i h-formula-editor
```

## 公式库

```tsx
import React, { useState, useMemo } from 'react';
import {
  setupLanguage,
  Editor,
  languageID
} from 'todolangeditor';

export default () => {
  setupLanguage();
  return (
    <Editor language={languageID}></Editor>
  );
};
```
