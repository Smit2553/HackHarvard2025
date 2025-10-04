# GitHub Copilot Instructions for Nexus Parser

## 1. High-Level Project Context

You are my **AI pair programmer**. We are building a standalone **command-line tool (CLI) in Python named `parser.py`**.

**The Goal:** This tool's single purpose is to analyze a local codebase directory, understand its file dependency structure, and output a **`graph.json`** file. This JSON file will then be used by a separate React frontend application for visualization.

**Crucial Distinction:** This script is the "engine," not the "car." It does all the heavy, offline processing. It has no UI. It is a pure data processing pipeline.

---

## 2. Core Principles & Best Practices (You MUST follow these)

### a. Logging is Paramount
* **NEVER use `print()`**. You MUST use Python's built-in **`logging`** module for all output.
* Configure a logger at the start of the script to print to the console with a clear format: `[TIMESTAMP] [LOG_LEVEL] MESSAGE`.
* Log the start and end of major operations (e.g., "Starting file scan," "Found 500 files," "Beginning parsing," "Writing output to graph.json").

### b. Robust Error Handling is Non-Negotiable
* This script must be **fault-tolerant**. It should never crash because of one bad file.
* Use **`try...except`** blocks for all file I/O operations (`open()`, `read()`) to catch `IOError`, `PermissionError`, or encoding issues. If a file cannot be read, log a **`WARNING`** and skip it.
* The Tree-sitter parser is robust to syntax errors. You MUST check if a parsed tree **`has_error()`** and log a **`WARNING`** with the filename if it does. Skip dependency extraction for that file but continue with the rest.

### c. Code Quality and Modularity
* Write clean, readable, and well-commented Python code.
* Use **`functions`** to encapsulate logic. Do not write one long script. I want to see distinct functions for `walk_files`, `parse_dependencies`, and `build_graph_json`.
* Use Python **`type hints`** for all function signatures and key variables. This is mandatory.
* The main execution logic should be inside a **`if __name__ == "__main__":`** block.

### d. Dependencies
* All required libraries must be listed in a **`requirements.txt`** file.
* The core libraries we will use are **`tree-sitter`** and **`tree-sitter-languages`**.
* The CLI will be built using **`argparse`**.

---

## 3. Detailed Implementation Plan: `parser.py`

When I ask you to generate code, follow this plan step-by-step.

### Step 1: Boilerplate and Setup
* Import necessary libraries: `os`, `json`, `logging`, `argparse`, and `tree_sitter_languages`.
* Set up the basic logging configuration.

### Step 2: Command-Line Interface
* Use **`argparse`** to define the CLI arguments.
    * **Required Argument:** `--directory` (type: `str`): The path to the source code directory to analyze.
    * **Optional Argument:** `--output` (type: `str`, default: `graph.json`): The file path for the JSON output.

### Step 3: File Walker Function
Define a function: `def walk_files(root_dir: str) -> list[str]:`
* It takes the root directory path as input.
* It must recursively find all files ending in **`.js`, `.jsx`, `.ts`, or `.tsx`**.
* It MUST explicitly ignore and not traverse these directories: **`['node_modules', '.git', 'dist', 'build', 'coverage', 'test', 'tests', '__tests__']`**.
* It should return a flat list of absolute file paths to be parsed.

### Step 4: Parser & Extractor Function
Define a function: `def parse_dependencies(file_paths: list[str]) -> dict[str, list[str]]:`
* It takes the list of file paths as input.
* Inside the function:
    * Initialize the Tree-sitter parser using `tree_sitter_languages` for `javascript` and `typescript`.
    * Create an empty dictionary, `dependency_map = {}`, to store the results.
    * Loop through each `file_path`.
        * Read the file's content (with error handling).
        * Parse the content into a syntax tree (with error handling for syntax errors).
        * Run a Tree-sitter query to find all **`import_statement`** nodes.
        * For each import found, extract the path string.
        * **Crucially, filter these paths.** **Only keep relative local imports** (strings that start with **`./`** or **`../`**). Ignore all others (e.g., `'react'`, `'lodash'`).
        * Store the results in the `dependency_map`, where the key is the current `file_path` and the value is a list of its resolved local dependency paths.
* It should return the completed `dependency_map`.

### Step 5: Graph Builder Function
Define a function: `def build_graph_json(dependency_map: dict[str, list[str]], root_dir: str) -> str:`
* It takes the `dependency_map` and the original `root_dir` as input.
* Inside the function:
    * Create two lists: `nodes = []` and `edges = []`.
    * Create a set of all unique file paths from the keys and values in the `dependency_map` to form the nodes.
    * Iterate through the `dependency_map`. For each *importer -> dependency* relationship:
        * Create an `edge` object.
        * **Path Normalization:** All file paths in the final JSON MUST be **relative** to the `root_dir`. Use **`os.path.relpath()`** for this.
    * **Format the JSON:** The final structure MUST be:

```json
{
  "nodes": [
    { "id": "src/App.js" }
  ],
  "edges": [
    { "source": "src/App.js", "target": "src/components/Button.js" }
  ]
}
It should return the final data as a JSON-formatted string.

By following these instructions, you will help me build a high-quality, robust, and maintainable parsing tool. Let's begin with Step 1.