#!/usr/bin/env bash
# Validate content frontmatter after Write/Edit operations on src/content/ files.
# Reads tool_input JSON from stdin, checks required frontmatter fields per collection.
# Exit 0 = valid (or not a content file), Exit 2 = missing required field.

set -euo pipefail

# Read the tool input from stdin
INPUT=$(cat)

# Extract file_path from the JSON input
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*: *"//;s/"$//')

# If no file_path found, exit silently
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only validate files under src/content/
if [[ "$FILE_PATH" != *"src/content/"* ]]; then
  exit 0
fi

# Check the file exists
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Determine collection from directory name
COLLECTION=""
if [[ "$FILE_PATH" == *"src/content/blog/"* ]]; then
  COLLECTION="blog"
elif [[ "$FILE_PATH" == *"src/content/gallery/"* ]]; then
  COLLECTION="gallery"
elif [[ "$FILE_PATH" == *"src/content/testimonials/"* ]]; then
  COLLECTION="testimonials"
elif [[ "$FILE_PATH" == *"src/content/promoted/"* ]]; then
  COLLECTION="promoted"
else
  # Unknown collection — skip validation
  exit 0
fi

# Extract frontmatter (between first pair of --- lines)
FRONTMATTER=$(sed -n '/^---$/,/^---$/p' "$FILE_PATH" | sed '1d;$d')

if [ -z "$FRONTMATTER" ]; then
  echo "Error: No frontmatter found in $FILE_PATH" >&2
  echo "Content files require YAML frontmatter between --- fences." >&2
  exit 2
fi

# Function to check if a field exists in frontmatter
check_field() {
  local field="$1"
  if ! echo "$FRONTMATTER" | grep -q "^${field}:"; then
    echo "Error: Missing required field '${field}' in ${COLLECTION} file: $FILE_PATH" >&2
    echo "The ${COLLECTION} collection requires: ${REQUIRED_FIELDS}" >&2
    exit 2
  fi
}

# Define required fields per collection and validate
case "$COLLECTION" in
  blog)
    REQUIRED_FIELDS="title, description, author, publishedAt"
    check_field "title"
    check_field "description"
    check_field "author"
    check_field "publishedAt"
    ;;
  gallery)
    REQUIRED_FIELDS="title, description, image, category, publishedAt"
    check_field "title"
    check_field "description"
    check_field "image"
    check_field "category"
    check_field "publishedAt"
    ;;
  testimonials)
    REQUIRED_FIELDS="author, role, publishedAt"
    check_field "author"
    check_field "role"
    check_field "publishedAt"
    ;;
  promoted)
    REQUIRED_FIELDS="title, description, image, link, linkText, order, publishedAt"
    check_field "title"
    check_field "description"
    check_field "image"
    check_field "link"
    check_field "linkText"
    check_field "order"
    check_field "publishedAt"
    ;;
esac

# All checks passed
exit 0
