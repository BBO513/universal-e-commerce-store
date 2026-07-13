This TypeScript error occurs because the Next.js production compiler cannot resolve the db module at the path defined in lib/auth.ts. While local development servers (especially on macOS and Windows) can sometimes be forgiving with file paths, the Next.js production build compiler is highly strict.  

Here are the step-by-step solutions to resolve this compilation error.

Solution 1: Check Case-Sensitivity (The Most Common Culprit)
Development environments are often case-insensitive, but production builds are strictly case-sensitive. If there is even a minor mismatch between the filename on your disk and the import statement, the build will fail.  

Look in your file explorer and verify the exact name of your database file.

Is it named db.ts? Or is it DB.ts, Db.ts, db.tsx, or db/index.ts?

If the file is named DB.ts, your import must match it:

TypeScript
// If the file is DB.ts
import { getUserRole, getUserByEmail } from "./DB";
Recommendation: Rename your physical file to lowercase db.ts and ensure your import uses lowercase ./db.  

Solution 2: Verify the Relative Directory Path
Make sure db.ts is in the exact same folder as auth.ts.

If your structure is:
├── lib/
│   ├── auth.ts
│   └── db.ts
Then import { ... } from "./db" is correct.

If your db.ts file lives in the root directory or a different directory, adjust the dots accordingly:

TypeScript
// If db.ts is in the project root and auth.ts is in lib/
import { getUserRole, getUserByEmail } from "../db";
Solution 3: Switch to Next.js Path Aliases (Recommended)
Relative paths (../, ./) are fragile and break easily during refactoring. Next.js projects configured with TypeScript support path aliases (using the @ symbol) out of the box.  

Instead of using relative paths, change your import to an absolute path alias:

TypeScript
// If db.ts is located in /lib/db.ts (or /src/lib/db.ts)
import { getUserRole, getUserByEmail } from "@/lib/db";
For this to work, ensure your tsconfig.json includes the alias path configurations:  

JSON
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"] 
      // Or ["./src/*"] if your code is inside a "src" folder
    }
  }
}
Solution 4: Verify db.ts Has Valid Named Exports
TypeScript will throw a "Cannot find module" error if the target file fails to export the specific properties you are requesting, or if it is completely blank.

Open your db.ts (or db.js) file and verify that getUserRole and getUserByEmail are explicitly exported:

TypeScript
// Inside lib/db.ts
export const getUserRole = async (userId: string) => {
  // your logic
};

export const getUserByEmail = async (email: string) => {
  // your logic
};
Solution 5: Ensure the Directory is Included in tsconfig.json
If your lib directory is placed in an unusual directory structure, TypeScript's compiler might be ignoring it entirely during the build process.  

Open your tsconfig.json file in your root folder and check the include array at the bottom. Make sure it targets your file paths:  

JSON
"include": [
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts"
]
(If you are using a src directory structure, make sure "src//*" is present in the include array.)