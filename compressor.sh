#!/bin/bash

# Code Compressor Script
# Recursively scans and minifies files in the game folder
# Creates a compressed archive that preserves folder structure

set -e  # Exit on error

# Configuration
SOURCE_DIR="game"
TEMP_DIR="game_minified_temp"
OUTPUT_DIR="compressed"
ARCHIVE_NAME="game_compressed.tar.gz"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Code Compressor ===${NC}"
echo -e "${BLUE}Starting compression process...${NC}\n"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${YELLOW}Error: Source directory '$SOURCE_DIR' not found!${NC}"
    exit 1
fi

# Clean up any previous temporary directory
if [ -d "$TEMP_DIR" ]; then
    echo -e "${YELLOW}Cleaning up previous temporary directory...${NC}"
    rm -rf "$TEMP_DIR"
fi

# Create temporary directory
echo -e "${GREEN}Creating temporary directory...${NC}"
mkdir -p "$TEMP_DIR"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to minify HTML
minify_html() {
    local input_file="$1"
    local output_file="$2"

    # Remove comments, extra whitespace, newlines
    sed -e 's/<!--.*-->//g' "$input_file" | \
    tr '\n' ' ' | \
    sed -e 's/  */ /g' \
        -e 's/> </></g' \
        -e 's/^[[:space:]]*//' \
        -e 's/[[:space:]]*$//' > "$output_file"
}

# Function to minify CSS
minify_css() {
    local input_file="$1"
    local output_file="$2"

    # Remove comments, extra whitespace, newlines
    sed -e 's|/\*.*\*/||g' "$input_file" | \
    tr '\n' ' ' | \
    sed -e 's/  */ /g' \
        -e 's/ *{ */{/g' \
        -e 's/ *} */}/g' \
        -e 's/ *: */:/g' \
        -e 's/ *; */;/g' \
        -e 's/ *, */,/g' \
        -e 's/^[[:space:]]*//' \
        -e 's/[[:space:]]*$//' > "$output_file"
}

# Function to minify JavaScript
minify_js() {
    local input_file="$1"
    local output_file="$2"

    # Remove single-line comments, multi-line comments, extra whitespace
    sed -e 's|//.*$||g' "$input_file" | \
    tr '\n' ' ' | \
    sed -e 's/  */ /g' \
        -e 's/ *{ */{/g' \
        -e 's/ *} */}/g' \
        -e 's/ *( */(/g' \
        -e 's/ *) */)/g' \
        -e 's/ *; */;/g' \
        -e 's/ *, */,/g' \
        -e 's/ *= */=/g' \
        -e 's/ *+ */+/g' \
        -e 's/ *- */-/g' \
        -e 's/ *\* */\*/g' \
        -e 's|/ */|/|g' \
        -e 's/^[[:space:]]*//' \
        -e 's/[[:space:]]*$//' > "$output_file"
}

# Function to minify JSON
minify_json() {
    local input_file="$1"
    local output_file="$2"

    # Remove extra whitespace and newlines
    tr -d '\n\r' < "$input_file" | \
    sed -e 's/  */ /g' \
        -e 's/ *{ */{/g' \
        -e 's/ *} */}/g' \
        -e 's/ *\[ */[/g' \
        -e 's/ *\] */]/g' \
        -e 's/ *: */:/g' \
        -e 's/ *, */,/g' \
        -e 's/^[[:space:]]*//' \
        -e 's/[[:space:]]*$//' > "$output_file"
}

# Function to copy and optionally minify files
process_file() {
    local src_file="$1"
    local rel_path="${src_file#$SOURCE_DIR/}"
    local dest_file="$TEMP_DIR/$rel_path"
    local dest_dir=$(dirname "$dest_file")

    # Create destination directory if it doesn't exist
    mkdir -p "$dest_dir"

    # Get file extension
    local extension="${src_file##*.}"
    local filename=$(basename "$src_file")

    echo -e "  Processing: ${BLUE}$rel_path${NC}"

    # Process based on file type
    case "$extension" in
        html|htm)
            minify_html "$src_file" "$dest_file"
            ;;
        css)
            minify_css "$src_file" "$dest_file"
            ;;
        js)
            minify_js "$src_file" "$dest_file"
            ;;
        json)
            minify_json "$src_file" "$dest_file"
            ;;
        # For other files (images, fonts, etc.), just copy them
        *)
            cp "$src_file" "$dest_file"
            ;;
    esac
}

# Count total files
total_files=$(find "$SOURCE_DIR" -type f | wc -l | tr -d ' ')
echo -e "${GREEN}Found $total_files file(s) to process${NC}\n"

# Process all files recursively
file_count=0
while IFS= read -r -d '' file; do
    ((file_count++))
    process_file "$file"
done < <(find "$SOURCE_DIR" -type f -print0)

echo -e "\n${GREEN}Minification complete! Processed $file_count file(s)${NC}\n"

# Calculate original size
original_size=$(du -sh "$SOURCE_DIR" | cut -f1)
temp_size=$(du -sh "$TEMP_DIR" | cut -f1)

echo -e "${BLUE}Creating compressed archive...${NC}"

# Create tarball from temporary directory
# We want to preserve the 'game' folder name in the archive
cd "$TEMP_DIR"
tar -czf "../$OUTPUT_DIR/$ARCHIVE_NAME" .
cd ..

# Calculate compressed size
compressed_size=$(du -sh "$OUTPUT_DIR/$ARCHIVE_NAME" | cut -f1)

echo -e "${GREEN}Compression complete!${NC}\n"

# Display statistics
echo -e "${BLUE}=== Compression Statistics ===${NC}"
echo -e "Original size:    ${YELLOW}$original_size${NC}"
echo -e "Minified size:    ${YELLOW}$temp_size${NC}"
echo -e "Compressed size:  ${YELLOW}$compressed_size${NC}"
echo -e "Archive location: ${GREEN}$OUTPUT_DIR/$ARCHIVE_NAME${NC}\n"

# Clean up temporary directory
echo -e "${BLUE}Cleaning up temporary files...${NC}"
rm -rf "$TEMP_DIR"

echo -e "${GREEN}Done!${NC}\n"

# Show extraction instructions
echo -e "${BLUE}=== Extraction Instructions ===${NC}"
echo -e "To extract and run the game:"
echo -e "  ${YELLOW}mkdir game && cd game${NC}"
echo -e "  ${YELLOW}tar -xzf ../$OUTPUT_DIR/$ARCHIVE_NAME${NC}"
echo -e "  ${YELLOW}python3 -m http.server${NC}"
echo -e "\nThen open ${GREEN}http://localhost:8000/index.html${NC} in your browser\n"


