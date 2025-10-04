# Prompt for Agentic LLM Developer: `parser.py`

## Your Task:
Your primary objective is to create a robust, **production-quality Python script named `parser.py`**. This script will function as a command-line tool that analyzes a specified local code repository, parses its structure using **Tree-sitter**, and outputs a **JSON file** representing its dependency graph.

## Core Philosophy:
As a developer, I need this tool to be **reliable, performant, and easy to debug**. It must handle common errors gracefully and provide **clear logging output**. Assume this script will be the core engine of a larger application, so code quality and best practices are non-negotiable.

---

## Detailed Requirements & Implementation Plan

### 1. Setup & Dependencies
Create a **`requirements.txt`** file.
It must contain the following libraries:
* `tree-sitter`
* `tree-sitter-languages` (This package simplifies grammar management)

The script should start by importing all necessary libraries (`os`, `json`, `argparse`, `logging`, and `tree_sitter_languages`).

---

### 2. Command-Line Interface (CLI)
Use Python's **`argparse`** library to create the CLI.
The script must accept one required argument:
* `--directory`: The path to the source code directory you want to analyze.

It must accept one optional argument:
* `--output`: The path where the output `graph.json` file will be saved. Default should be `./graph.json`.

---

### 3. Logging Configuration
Use the **`logging`** module. **Do not use `print()`** for status updates.
Configure a logger to output to the console.
Log messages should have a clear format, including timestamp and log level (e.g., `[2025-10-04 10:30:00] [INFO] Starting file scan...`).
Log the start and end of major processes (file walking, parsing, graph construction).

---

### 4. The **FileWalker**
This part of the script finds all relevant source files.

**Implementation:**
* Use **`os.walk()`** to recursively traverse the directory provided via the `--directory` argument.
* **File Extension Filtering:** Only process files with these extensions: `.js`, `.jsx`, `.ts`, `.tsx`.
* **Directory Exclusion:** You MUST ignore common non-source directories. Create an explicit exclusion list: `['node_modules', '.git', 'dist', 'build', 'coverage']`. If a directory's name is in this list, do not traverse it further.
* **Logging:** Log the total number of files found for parsing.
* **Error Handling:** Wrap file system operations in `try...except` blocks to handle potential `PermissionError`. Log a warning if a directory cannot be accessed, but do not crash.

---

### 5. The **Parser & Extractor**
This is the core of the tool.

**Implementation:**
* **Initialize Parser:** Use `tree_sitter_languages` to get the parsers for `javascript` and `typescript`.
* Iterate through each file found by the `FileWalker`.
* For each file:
    * Read the file's content. Handle potential **`IOError`** or encoding errors with a `try...except` block. Log the error and skip the file if it's unreadable.
    * Select the correct Tree-sitter grammar (e.g., use the TypeScript parser for `.ts` and `.tsx` files).
    * **Parse the Code:** Parse the file content into a syntax tree.
    * **Error Handling:** A file may contain syntax errors. The Tree-sitter parser handles this by creating an `ERROR` node. Check if the tree **`has_error()`**. If it does, log a warning with the filename and skip dependency extraction for that file. Do not let one broken file stop the entire process.
    * **Extract Imports:** Write a Tree-sitter query to find all **`import_statement`** nodes.
    * For each import statement, extract the path string (e.g., `'../components/Button'`).
    * **Filter Imports:** Implement logic to distinguish between **relative local imports** (must start with `./` or `../`) and package imports (e.g., `react`, `lodash`). **We only care about local imports.** Store these local import paths in a list associated with the current file path.

---

### 6. The **GraphBuilder**
This assembles the final JSON output.

**Implementation:**
* You will have a data structure (e.g., a dictionary) mapping each file path to a list of its local dependencies.
* **Node Creation:** Create a set of all file paths involved (both files that import and files that are imported) to get a unique list of nodes.
* **Edge Creation:** Iterate through your dependency data. For each `file_A` that imports `file_B`, create an edge object.
* **Path Normalization:** Use **`os.path.normpath`** and **`os.path.relpath`** to ensure all paths in the final JSON are consistent, clean, and relative to the input directory.
* **JSON Structure:** The final output must be a single JSON object with two keys:
    * `nodes`: An array of objects, where each object is `{"id": "path/to/file.js"}`.
    * `edges`: An array of objects, where each object is `{"source": "path/from/importer.js", "target": "path/to/imported.js"}`.
* Write the final object to the output file path using **`json.dump()`**. Handle potential `IOError`.

---

## How I Will Test Your Script

To verify your work, I will perform the following tests. Ensure your script can handle them.

### Simple Case:
I will create a small test directory:

```text
test_repo/
├── src/
│   ├── App.js           # imports ./components/Button.js
│   └── components/
│       └── Button.js    # imports 'react' (should be ignored)
└── node_modules/        # should be ignored


I will run: python parser.py --directory ./test_repo/src

I expect a graph.json showing one node for App.js, one for Button.js, and one edge from App.js to Button.js.

Error Case:
I will add a file src/components/Broken.js with invalid JavaScript syntax.
I will run the script again.
I expect the script to log a warning about Broken.js but still successfully complete and produce a correct graph for App.js and Button.js. It should not crash.

Circular Dependency Case:
I will make FileA.js import FileB.js, and FileB.js import FileA.js.
Your script should handle this without getting into an infinite loop. It should correctly identify both edges.