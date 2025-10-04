#!/usr/bin/env python3
"""
Nexus Parser - Dependency Graph Generator
A command-line tool that analyzes JavaScript/TypeScript codebases and generates a dependency graph.
"""

import os
import json
import logging
import argparse
from typing import Dict, List, Set, Tuple
import tree_sitter_languages as tsl


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


def discover_path_config(root_dir: str) -> Dict[str, str]:
    """
    Discover path alias configuration from tsconfig.json or jsconfig.json.
    
    This implements Step 0: Configuration Discovery
    - Looks for tsconfig.json first, then jsconfig.json
    - Extracts baseUrl and paths configuration
    - Returns mapping of aliases to their base paths
    
    Args:
        root_dir: The root directory to search for config files
        
    Returns:
        Dictionary mapping alias prefixes to their resolved base paths
    """
    logger.info("Discovering path alias configuration...")
    
    config_files = ['tsconfig.json', 'jsconfig.json']
    path_aliases: Dict[str, str] = {}
    
    for config_file in config_files:
        config_path = os.path.join(root_dir, config_file)
        
        if os.path.exists(config_path):
            logger.info(f"Found configuration file: {config_file}")
            
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                
                # Extract compiler options
                compiler_options = config.get('compilerOptions', {})
                base_url = compiler_options.get('baseUrl', '.')
                paths = compiler_options.get('paths', {})
                
                # Convert relative baseUrl to absolute path
                if base_url:
                    base_path = os.path.normpath(os.path.join(root_dir, base_url))
                else:
                    base_path = root_dir
                
                # Process path mappings
                for alias_pattern, target_patterns in paths.items():
                    if target_patterns and len(target_patterns) > 0:
                        # Take the first target pattern (most common case)
                        target_pattern = target_patterns[0]
                        
                        # Remove trailing /* from both alias and target
                        alias_prefix = alias_pattern.rstrip('/*')
                        target_path = target_pattern.rstrip('/*')
                        
                        # Resolve target path relative to baseUrl
                        if target_path:
                            resolved_target = os.path.normpath(os.path.join(base_path, target_path))
                        else:
                            resolved_target = base_path
                        
                        path_aliases[alias_prefix] = resolved_target
                        logger.info(f"Path alias discovered: '{alias_prefix}' -> '{resolved_target}'")
                
                break  # Found config, stop looking
                
            except (json.JSONDecodeError, IOError) as e:
                logger.warning(f"Could not parse {config_file}: {e}")
                continue
    
    if not path_aliases:
        logger.info("No path aliases found. Proceeding with relative imports only.")
    else:
        logger.info(f"Loaded {len(path_aliases)} path alias mappings.")
    
    return path_aliases


def walk_files(root_dir: str) -> Tuple[List[str], Dict[str, str]]:
    """
    Recursively walk the directory and find all JavaScript/TypeScript files.
    
    This implements the First Pass:
    - Finds all .js, .jsx, .ts, .tsx files
    - Excludes specified directories (node_modules, .git, etc.)
    - Creates a lookup map for extension-less path resolution
    
    Args:
        root_dir: The root directory to start walking from
        
    Returns:
        A tuple containing:
        - List of absolute file paths to parse
        - Dictionary mapping extension-less paths to full file paths
    """
    # Directories to exclude from traversal
    EXCLUDED_DIRS = {'node_modules', '.git', 'dist', 'build', 'coverage', 'test', 'tests', '__tests__'}
    
    # Valid file extensions
    VALID_EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx'}
    
    # Extension priority for conflict resolution (.tsx has highest priority)
    EXTENSION_PRIORITY = {'.tsx': 0, '.ts': 1, '.jsx': 2, '.js': 3}
    
    file_paths: List[str] = []
    extensionless_map: Dict[str, str] = {}
    
    logger.info(f"Starting file scan in directory: {root_dir}")
    
    try:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            # Remove excluded directories from traversal (modify in-place)
            dirnames[:] = [d for d in dirnames if d not in EXCLUDED_DIRS]
            
            for filename in filenames:
                # Check if file has a valid extension
                _, ext = os.path.splitext(filename)
                if ext in VALID_EXTENSIONS:
                    full_path = os.path.join(dirpath, filename)
                    file_paths.append(full_path)
                    
                    # Create extension-less path for lookup map
                    extensionless_path = os.path.splitext(full_path)[0]
                    
                    # Handle conflicts: prioritize based on extension
                    if extensionless_path in extensionless_map:
                        existing_ext = os.path.splitext(extensionless_map[extensionless_path])[1]
                        if EXTENSION_PRIORITY.get(ext, 999) < EXTENSION_PRIORITY.get(existing_ext, 999):
                            extensionless_map[extensionless_path] = full_path
                            logger.warning(
                                f"Extension conflict at {extensionless_path}: "
                                f"Prioritizing {ext} over {existing_ext}"
                            )
                    else:
                        extensionless_map[extensionless_path] = full_path
    
    except PermissionError as e:
        logger.warning(f"Permission denied accessing directory: {e}")
    except Exception as e:
        logger.error(f"Unexpected error during file walk: {e}")
        raise
    
    logger.info(f"File scan complete. Found {len(file_paths)} files to parse.")
    return file_paths, extensionless_map


def parse_dependencies(file_paths: List[str], extensionless_map: Dict[str, str], root_dir: str, path_aliases: Dict[str, str]) -> Dict[str, List[str]]:
    """
    Parse each file and extract its local dependencies.
    
    This implements the Second Pass:
    - Parses files using Tree-sitter TypeScript grammar
    - Extracts import and re-export statements
    - Filters out type-only imports
    - Resolves relative paths and path aliases to actual files
    
    Args:
        file_paths: List of absolute file paths to parse
        extensionless_map: Map of extension-less paths to full paths
        root_dir: The root directory (for logging purposes)
        path_aliases: Map of path alias prefixes to their resolved base paths
        
    Returns:
        Dictionary mapping file paths to lists of their dependencies
    """
    logger.info("Beginning dependency parsing...")
    
    # Initialize Tree-sitter parser with TSX grammar (handles TypeScript and JSX)
    parser = tsl.get_parser('tsx')
    language = tsl.get_language('tsx')
    
    # Tree-sitter query to find import and export statements
    # Captures:
    # 1. import statements: import ... from 'path'
    # 2. re-export statements: export ... from 'path'
    # Note: We exclude type-only imports (import type)
    query_string = """
    (import_statement
      source: (string) @import_path)
    
    (export_statement
      source: (string) @export_path)
    """
    
    try:
        query = language.query(query_string)
    except Exception as e:
        logger.error(f"Failed to compile Tree-sitter query: {e}")
        raise
    
    dependency_map: Dict[str, List[str]] = {}
    files_with_errors = 0
    files_parsed = 0
    
    for file_path in file_paths:
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except (IOError, PermissionError, UnicodeDecodeError) as e:
            logger.warning(f"Could not read file {file_path}: {e}")
            files_with_errors += 1
            continue
        
        try:
            # Parse the file
            tree = parser.parse(bytes(content, 'utf8'))
            
            # Check for syntax errors
            if tree.root_node.has_error:
                logger.warning(f"Syntax error in file: {file_path}")
                files_with_errors += 1
                continue
            
            # Execute query to find imports and exports
            captures = query.captures(tree.root_node)
            
            local_dependencies: List[str] = []
            
            for node, capture_name in captures:
                # Extract the import/export path string (remove quotes)
                import_path = node.text.decode('utf8').strip('"\'')
                
                # Filter: Keep imports that are either relative or match known path aliases
                is_relative = import_path.startswith('./') or import_path.startswith('../')
                is_alias = any(import_path.startswith(alias) for alias in path_aliases.keys())
                
                if not (is_relative or is_alias):
                    continue
                
                # Check if this is a type-only import by examining parent nodes
                # Type-only imports have an "import" clause with a "type" keyword
                current_node = node.parent
                is_type_only = False
                
                while current_node:
                    if current_node.type == 'import_statement':
                        # Check if there's an import_clause with type keyword
                        for child in current_node.children:
                            if child.type == 'import_clause':
                                import_clause_text = child.text.decode('utf8')
                                if import_clause_text.strip().startswith('type '):
                                    is_type_only = True
                                    break
                        break
                    current_node = current_node.parent
                
                # Skip type-only imports
                if is_type_only:
                    continue
                
                # Resolve the import path to an absolute path
                if is_relative:
                    # Handle relative imports (./something or ../something)
                    file_dir = os.path.dirname(file_path)
                    resolved_path = os.path.normpath(os.path.join(file_dir, import_path))
                else:
                    # Handle path alias imports (@/something, ~/something, etc.)
                    resolved_path = None
                    for alias_prefix, alias_base_path in path_aliases.items():
                        if import_path.startswith(alias_prefix):
                            # Replace alias prefix with its base path
                            relative_part = import_path[len(alias_prefix):].lstrip('/')
                            if relative_part:
                                resolved_path = os.path.normpath(os.path.join(alias_base_path, relative_part))
                            else:
                                resolved_path = alias_base_path
                            break
                    
                    if resolved_path is None:
                        logger.warning(f"Could not resolve alias import in {file_path}: '{import_path}'")
                        continue
                
                # Look up the real file in the extensionless map
                if resolved_path in extensionless_map:
                    real_file_path = extensionless_map[resolved_path]
                    local_dependencies.append(real_file_path)
                else:
                    logger.warning(
                        f"Unresolved import in {file_path}: '{import_path}' "
                        f"(resolved to {resolved_path}, but file not found)"
                    )
            
            # Store dependencies for this file
            if local_dependencies or file_path not in dependency_map:
                dependency_map[file_path] = local_dependencies
            
            files_parsed += 1
            
        except Exception as e:
            logger.warning(f"Error parsing file {file_path}: {e}")
            files_with_errors += 1
            continue
    
    logger.info(
        f"Parsing complete. Successfully parsed {files_parsed} files. "
        f"Encountered errors in {files_with_errors} files."
    )
    
    return dependency_map


def build_graph_json(dependency_map: Dict[str, List[str]], root_dir: str) -> str:
    """
    Build the final JSON graph structure from the dependency map.
    
    Args:
        dependency_map: Map of file paths to their dependencies
        root_dir: Root directory to make paths relative to
        
    Returns:
        JSON string representing the graph
    """
    logger.info("Building graph JSON structure...")
    
    # Collect all unique file paths (both importers and imported files)
    all_files: Set[str] = set()
    
    for file_path, dependencies in dependency_map.items():
        all_files.add(file_path)
        all_files.update(dependencies)
    
    # Create nodes (convert absolute paths to relative paths)
    nodes = []
    for file_path in sorted(all_files):
        try:
            relative_path = os.path.relpath(file_path, root_dir)
            # Normalize path separators for consistency (use forward slashes)
            relative_path = relative_path.replace(os.sep, '/')
            nodes.append({"id": relative_path})
        except ValueError as e:
            logger.warning(f"Could not make path relative: {file_path} ({e})")
            continue
    
    # Create edges using a set to enforce uniqueness
    unique_edges: Set[Tuple[str, str]] = set()
    
    for source_path, dependencies in dependency_map.items():
        try:
            relative_source = os.path.relpath(source_path, root_dir).replace(os.sep, '/')
            
            for target_path in dependencies:
                try:
                    relative_target = os.path.relpath(target_path, root_dir).replace(os.sep, '/')
                    # Add as tuple to the set (automatically de-duplicates)
                    unique_edges.add((relative_source, relative_target))
                except ValueError as e:
                    logger.warning(f"Could not make path relative: {target_path} ({e})")
                    continue
        except ValueError as e:
            logger.warning(f"Could not make path relative: {source_path} ({e})")
            continue
    
    # Convert set of tuples back to list of edge objects
    edges = []
    for source, target in sorted(unique_edges):
        edges.append({
            "source": source,
            "target": target
        })
    
    # Build final graph structure
    graph = {
        "nodes": nodes,
        "edges": edges
    }
    
    logger.info(f"Graph built: {len(nodes)} nodes, {len(edges)} edges")
    
    return json.dumps(graph, indent=2)


def main():
    """Main entry point for the parser."""
    # Set up argument parser
    parser = argparse.ArgumentParser(
        description='Nexus Parser - Analyze code dependencies and generate a graph JSON file'
    )
    parser.add_argument(
        '--directory',
        required=True,
        type=str,
        help='Path to the source code directory to analyze'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='graph.json',
        help='Output path for the generated graph JSON file (default: graph.json)'
    )
    
    args = parser.parse_args()
    
    # Validate directory exists
    if not os.path.isdir(args.directory):
        logger.error(f"Directory does not exist: {args.directory}")
        return 1
    
    # Convert to absolute path for consistency
    root_dir = os.path.abspath(args.directory)
    output_path = args.output
    
    logger.info("=" * 60)
    logger.info("Nexus Parser - Dependency Graph Generator")
    logger.info("=" * 60)
    logger.info(f"Target directory: {root_dir}")
    logger.info(f"Output file: {output_path}")
    logger.info("=" * 60)
    
    try:
        # Step 0: Discover path alias configuration
        path_aliases = discover_path_config(root_dir)
        
        # First Pass: Walk files and build lookup map
        file_paths, extensionless_map = walk_files(root_dir)
        
        if not file_paths:
            logger.warning("No JavaScript/TypeScript files found in the specified directory.")
            return 1
        
        # Second Pass: Parse dependencies
        dependency_map = parse_dependencies(file_paths, extensionless_map, root_dir, path_aliases)
        
        # Build and output graph
        graph_json = build_graph_json(dependency_map, root_dir)
        
        # Write to output file
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(graph_json)
            logger.info(f"Successfully wrote graph to: {output_path}")
        except IOError as e:
            logger.error(f"Failed to write output file: {e}")
            return 1
        
        logger.info("=" * 60)
        logger.info("Parsing complete!")
        logger.info("=" * 60)
        
        return 0
        
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        return 1


if __name__ == "__main__":
    exit(main())
