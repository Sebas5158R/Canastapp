---
name: angular-doctor
description: Scan Angular codebase for issues after every Angular change
---

# Angular Doctor Skill

After making ANY changes to Angular files (components, services, templates, etc.), 
automatically run:

```bash
npx -y angular-doctor@latest . --verbose --diff
