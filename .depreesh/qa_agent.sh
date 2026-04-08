#!/bin/bash

# VHS Horror Puzzle Collection - QA Agent
# Seasoned QA testing automation script
# Run from vhs_horror_puzzles/ directory

# PATH is configured by /etc/profile.d/devtools.sh
# Tools (Bun, Node, Python) are available from Windows PATH

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

# Arrays to store issues
declare -a FAILED_TESTS_LIST
declare -a WARNING_LIST

# Functions
log_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}[$TOTAL_TESTS]${NC} Testing: $1"
}

log_pass() {
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✓ PASS${NC}: $1"
    echo ""
}

log_fail() {
    FAILED_TESTS=$((FAILED_TESTS + 1))
    FAILED_TESTS_LIST+=("$1")
    echo -e "${RED}✗ FAIL${NC}: $1"
    echo ""
}

log_warn() {
    WARNINGS=$((WARNINGS + 1))
    WARNING_LIST+=("$1")
    echo -e "${YELLOW}⚠ WARNING${NC}: $1"
    echo ""
}

log_section() {
    echo -e "\n${BLUE}══════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}══════════════════════════════════════════${NC}\n"
}

# Header
clear
echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║  VHS HORROR PUZZLE COLLECTION - QA AGENT  ║"
echo "║     Seasoned Quality Assurance Testing       ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================================================
# SECTION 1: File Structure Validation
# ============================================================================
log_section "1. FILE STRUCTURE VALIDATION"

log_test "Checking project root directory exists"
if [ -d "." ]; then
    log_pass "Project root directory exists"
else
    log_fail "Project root directory not found"
fi

log_test "Checking required directories exist"
required_dirs=("css" "css/games" "js" "js/systems" "js/games" "data" "assets" "assets/characters")
all_dirs_exist=true
for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        log_fail "Required directory missing: $dir"
        all_dirs_exist=false
    fi
done
if [ "$all_dirs_exist" = true ]; then
    log_pass "All required directories exist"
fi

log_test "Checking required HTML files exist"
if [ -f "index.html" ]; then
    log_pass "index.html exists"
else
    log_fail "index.html not found"
fi

log_test "Checking required CSS files exist"
required_css=("css/main.css" "css/vhs-effects.css" "css/difficulty.css" "css/games/connections.css")
all_css_exist=true
for css in "${required_css[@]}"; do
    if [ ! -f "$css" ]; then
        log_fail "Required CSS missing: $css"
        all_css_exist=false
    fi
done
if [ "$all_css_exist" = true ]; then
    log_pass "All required CSS files exist"
fi

log_test "Checking required JavaScript files exist"
required_js=("js/main.js" "js/vhs-effects.js" "js/systems/puzzle-loader.js" "js/systems/tape-quality.js" "js/games/connections.js")
all_js_exist=true
for js in "${required_js[@]}"; do
    if [ ! -f "$js" ]; then
        log_fail "Required JavaScript missing: $js"
        all_js_exist=false
    fi
done
if [ "$all_js_exist" = true ]; then
    log_pass "All required JavaScript files exist"
fi

log_test "Checking data files exist"
required_data=("data/puzzles.json" "data/stories.json" "data/progress.json")
all_data_exist=true
for data in "${required_data[@]}"; do
    if [ ! -f "$data" ]; then
        log_fail "Required data file missing: $data"
        all_data_exist=false
    fi
done
if [ "$all_data_exist" = true ]; then
    log_pass "All required data files exist"
fi

log_test "Checking character assets exist"
character_files=("assets/characters/detective.svg" "assets/characters/reporter.svg" "assets/characters/archivist.svg" "assets/characters/survivor.svg")
all_chars_exist=true
for char in "${character_files[@]}"; do
    if [ ! -f "$char" ]; then
        log_fail "Character asset missing: $char"
        all_chars_exist=false
    fi
done
if [ "$all_chars_exist" = true ]; then
    log_pass "All character assets exist"
fi

# ============================================================================
# SECTION 2: HTML Validation
# ============================================================================
log_section "2. HTML VALIDATION"

log_test "Checking index.html is valid HTML"
if grep -q "<!DOCTYPE html>" index.html && \
   grep -q "<html" index.html && \
   grep -q "</html>" index.html && \
   grep -q "<head>" index.html && \
   grep -q "<body>" index.html; then
    log_pass "index.html has valid HTML structure"
else
    log_fail "index.html has invalid HTML structure"
fi

log_test "Checking all CSS files are linked in HTML"
css_linked=true
for css in "css/main.css" "css/vhs-effects.css" "css/difficulty.css" "css/games/connections.css"; do
    if ! grep -q "$css" index.html; then
        log_fail "CSS not linked in HTML: $css"
        css_linked=false
    fi
done
if [ "$css_linked" = true ]; then
    log_pass "All CSS files are properly linked"
fi

log_test "Checking all JS files are linked in HTML"
js_linked=true
for js in "js/systems/puzzle-loader.js" "js/systems/tape-quality.js" "js/vhs-effects.js" "js/games/connections.js" "js/main.js"; do
    if ! grep -q "$js" index.html; then
        log_fail "JS not linked in HTML: $js"
        js_linked=false
    fi
done
if [ "$js_linked" = true ]; then
    log_pass "All JS files are properly linked in correct order"
fi

log_test "Checking for required HTML elements"
required_elements=("vhs-overlay" "main-container" "tape-selection" "story-mode" "game-mode")
all_elements_exist=true
for element in "${required_elements[@]}"; do
    if ! grep -q "id=\"$element\"" index.html; then
        log_fail "Required HTML element missing: #$element"
        all_elements_exist=false
    fi
done
if [ "$all_elements_exist" = true ]; then
    log_pass "All required HTML elements present"
fi

# ============================================================================
# SECTION 3: CSS Validation
# ============================================================================
log_section "3. CSS VALIDATION"

log_test "Checking main.css has required structure"
if grep -q ":root" css/main.css && \
   grep -q "body" css/main.css && \
   grep -q ".screen" css/main.css; then
    log_pass "main.css has required CSS structure"
else
    log_fail "main.css missing required CSS structure"
fi

log_test "Checking VHS effects are defined"
if grep -q ".glitch-text" css/vhs-effects.css && \
   grep -q "@keyframes glitch" css/vhs-effects.css && \
   grep -q "#vhs-overlay" css/vhs-effects.css; then
    log_pass "VHS effects are properly defined"
else
    log_fail "VHS effects are missing or incomplete"
fi

log_test "Checking Connections game CSS is defined"
if grep -q ".connections-container" css/games/connections.css && \
   grep -q ".word-tile" css/games/connections.css && \
   grep -q ".group-row" css/games/connections.css; then
    log_pass "Connections game CSS is properly defined"
else
    log_fail "Connections game CSS is missing required classes"
fi

log_test "Checking for tape quality classes"
if grep -q ".tape-quality-100" css/vhs-effects.css && \
   grep -q ".tape-quality-0" css/vhs-effects.css; then
    log_pass "Tape quality classes are defined"
else
    log_fail "Tape quality classes are missing"
fi

# ============================================================================
# SECTION 4: JavaScript Validation
# ============================================================================
log_section "4. JAVASCRIPT VALIDATION"

log_test "Checking main.js has required classes/functions"
if grep -q "document.addEventListener" js/main.js && \
   grep -q "async function initializeGame" js/main.js && \
   grep -q "function showScreen" js/main.js; then
    log_pass "main.js has required structure"
else
    log_fail "main.js is missing required functions"
fi

log_test "Checking puzzle-loader.js is properly structured"
if grep -q "class PuzzleLoader" js/systems/puzzle-loader.js && \
   grep -q "getPuzzle" js/systems/puzzle-loader.js && \
   grep -q "getRandomPuzzle" js/systems/puzzle-loader.js; then
    log_pass "puzzle-loader.js is properly structured"
else
    log_fail "puzzle-loader.js is missing required methods"
fi

log_test "Checking tape-quality.js is properly structured"
if grep -q "class TapeQualitySystem" js/systems/tape-quality.js && \
   grep -q "decreaseQuality" js/systems/tape-quality.js && \
   grep -q "useRewind" js/systems/tape-quality.js; then
    log_pass "tape-quality.js is properly structured"
else
    log_fail "tape-quality.js is missing required methods"
fi

log_test "Checking VHS effects are properly implemented"
if grep -q "class VHSEffects" js/vhs-effects.js && \
   grep -q "shake()" js/vhs-effects.js && \
   grep -q "jumpscare()" js/vhs-effects.js; then
    log_pass "VHS effects are properly implemented"
else
    log_fail "VHS effects are missing required methods"
fi

log_test "Checking Connections game is properly structured"
if grep -q "class ConnectionsGame" js/games/connections.js && \
   grep -q "render()" js/games/connections.js && \
   grep -q "submitGuess()" js/games/connections.js; then
    log_pass "Connections game is properly structured"
else
    log_fail "Connections game is missing required methods"
fi

log_test "Checking for syntax errors in JavaScript files"
js_syntax_error=false
for js_file in js/main.js js/vhs-effects.js js/systems/*.js js/games/*.js; do
    if [ -f "$js_file" ]; then
        if node -c "$js_file" 2>/dev/null; then
            :
        else
            log_fail "Syntax error in $js_file"
            js_syntax_error=true
        fi
    fi
done
if [ "$js_syntax_error" = false ]; then
    log_pass "All JavaScript files have valid syntax"
fi

# ============================================================================
# SECTION 5: JSON Validation
# ============================================================================
log_section "5. JSON VALIDATION"

log_test "Validating puzzles.json structure"
if python -c "import json; json.load(open('data/puzzles.json'))" 2>/dev/null; then
    log_pass "puzzles.json is valid JSON"
else
    log_fail "puzzles.json has invalid JSON syntax"
fi

log_test "Checking puzzles.json has required game types"
if python -c "import json; data=json.load(open('data/puzzles.json')); assert 'connections' in data; assert len(data['connections']) > 0" 2>/dev/null; then
    log_pass "puzzles.json contains Connections puzzles"
else
    log_fail "puzzles.json missing Connections puzzles or data"
fi

log_test "Validating stories.json structure"
if python -c "import json; json.load(open('data/stories.json'))" 2>/dev/null; then
    log_pass "stories.json is valid JSON"
else
    log_fail "stories.json has invalid JSON syntax"
fi

log_test "Checking stories.json has required structure"
if python -c "import json; data=json.load(open('data/stories.json')); assert 'campaigns' in data; assert len(data['campaigns']) > 0" 2>/dev/null; then
    log_pass "stories.json contains campaign data"
else
    log_fail "stories.json missing campaign data"
fi

log_test "Checking progress.json is valid JSON"
if python -c "import json; json.load(open('data/progress.json'))" 2>/dev/null; then
    log_pass "progress.json is valid JSON"
else
    log_fail "progress.json has invalid JSON syntax"
fi

# ============================================================================
# SECTION 6: Puzzle Data Integrity
# ============================================================================
log_section "6. PUZZLE DATA INTEGRITY"

log_test "Checking each Connections puzzle has required fields"
puzzles_valid=true
puzzle_count=$(python -c "import json; data=json.load(open('data/puzzles.json')); print(len(data.get('connections', [])))")
if [ "$puzzle_count" -gt 0 ]; then
    log_pass "Found $puzzle_count Connections puzzles"
    
    # Check each puzzle
    for i in $(seq 0 $((puzzle_count - 1))); do
        if ! python -c "
import json, sys
data=json.load(open('data/puzzles.json'))
puzzle=data['connections'][$i]
assert 'id' in puzzle, 'Missing id'
assert 'difficulty' in puzzle, 'Missing difficulty'
assert 'groups' in puzzle, 'Missing groups'
assert len(puzzle['groups']) == 4, 'Must have 4 groups'
for group in puzzle['groups']:
    assert 'category' in group, 'Missing category'
    assert 'words' in group, 'Missing words'
    assert len(group['words']) == 4, 'Must have 4 words per group'
    for word in group['words']:
        assert len(word) >= 4, 'Word too short'
        assert word.isupper(), 'Word must be uppercase'
" 2>/dev/null; then
            log_fail "Puzzle #$i has invalid structure or data"
            puzzles_valid=false
        fi
    done
else
    log_fail "No Connections puzzles found in puzzles.json"
fi

log_test "Checking for duplicate puzzle IDs"
if python -c "
import json
data=json.load(open('data/puzzles.json'))
ids = [p['id'] for p in data['connections']]
assert len(ids) == len(set(ids)), 'Duplicate puzzle IDs found'
" 2>/dev/null; then
    log_pass "No duplicate puzzle IDs found"
else
    log_fail "Duplicate puzzle IDs detected"
fi

log_test "Checking for duplicate words within puzzles"
if python -c "
import json
data=json.load(open('data/puzzles.json'))
for puzzle in data['connections']:
    all_words = []
    for group in puzzle['groups']:
        all_words.extend(group['words'])
    assert len(all_words) == len(set(all_words)), f'Duplicate words in puzzle {puzzle[\"id\"]}'
" 2>/dev/null; then
    log_pass "No duplicate words found within puzzles"
else
    log_fail "Duplicate words detected within one or more puzzles"
fi

# ============================================================================
# SECTION 7: Story Data Integrity
# ============================================================================
log_section "7. STORY DATA INTEGRITY"

log_test "Checking each story has required fields"
stories_valid=true
story_count=$(python -c "import json; data=json.load(open('data/stories.json')); print(len(data.get('campaigns', [])))")
if [ "$story_count" -gt 0 ]; then
    log_pass "Found $story_count story campaigns"
    
    for i in $(seq 0 $((story_count - 1))); do
        if ! python -c "
import json, sys
data=json.load(open('data/stories.json'))
story=data['campaigns'][$i]
assert 'id' in story, 'Missing story id'
assert 'title' in story, 'Missing story title'
assert 'premise' in story, 'Missing story premise'
assert 'characters' in story, 'Missing characters'
assert 'scenes' in story, 'Missing scenes'
assert len(story['scenes']) > 0, 'No scenes in story'
for scene in story['scenes']:
    assert 'sceneId' in scene, 'Missing sceneId'
    assert 'gameType' in scene, 'Missing gameType'
    assert 'puzzleId' in scene, 'Missing puzzleId'
    assert 'narrative' in scene, 'Missing narrative'
    assert 'before' in scene['narrative'], 'Missing before narrative'
    assert 'after' in scene['narrative'], 'Missing after narrative'
" 2>/dev/null; then
            log_fail "Story #$i has invalid structure or data"
            stories_valid=false
        fi
    done
else
    log_fail "No story campaigns found in stories.json"
fi

log_test "Checking if story puzzle references exist"
ref_errors=0
for i in $(seq 0 $((story_count - 1))); do
    if ! python -c "
import json
puzzles=json.load(open('data/puzzles.json'))
stories=json.load(open('data/stories.json'))
story=stories['campaigns'][$i]
for scene in story['scenes']:
    game_type=scene['gameType']
    puzzle_id=scene['puzzleId']
    if game_type == 'connections':
        puzzle_found = any(p['id'] == puzzle_id for p in puzzles['connections'])
        assert puzzle_found, f'Puzzle {puzzle_id} not found in puzzles.json'
" 2>/dev/null; then
        ref_errors=$((ref_errors + 1))
    fi
done
if [ "$ref_errors" -eq 0 ]; then
    log_pass "All story puzzle references are valid"
else
    log_fail "$ref_errors invalid puzzle reference(s) found in stories"
fi

# ============================================================================
# SECTION 8: File Size & Performance
# ============================================================================
log_section "8. FILE SIZE & PERFORMANCE"

log_test "Checking HTML file size"
html_size=$(stat -c%s index.html 2>/dev/null || stat -f%z index.html 2>/dev/null)
if [ "$html_size" -lt 100000 ]; then
    log_pass "HTML file size is reasonable ($html_size bytes)"
else
    log_warn "HTML file is large ($html_size bytes) - consider optimization"
fi

log_test "Checking CSS file sizes"
css_large=false
for css_file in css/*.css css/games/*.css; do
    if [ -f "$css_file" ]; then
        size=$(stat -c%s "$css_file" 2>/dev/null || stat -f%z "$css_file" 2>/dev/null)
        if [ "$size" -gt 50000 ]; then
            log_warn "CSS file is large: $css_file ($size bytes)"
            css_large=true
        fi
    fi
done
if [ "$css_large" = false ]; then
    log_pass "All CSS files are reasonably sized"
fi

log_test "Checking JavaScript file sizes"
js_large=false
for js_file in js/*.js js/systems/*.js js/games/*.js; do
    if [ -f "$js_file" ]; then
        size=$(stat -c%s "$js_file" 2>/dev/null || stat -f%z "$js_file" 2>/dev/null)
        if [ "$size" -gt 100000 ]; then
            log_warn "JS file is large: $js_file ($size bytes)"
            js_large=true
        fi
    fi
done
if [ "$js_large" = false ]; then
    log_pass "All JavaScript files are reasonably sized"
fi

# ============================================================================
# SECTION 9: Content Quality
# ============================================================================
log_section "9. CONTENT QUALITY"

log_test "Checking README exists"
if [ -f "README.md" ]; then
    log_pass "README.md exists"
else
    log_fail "README.md not found"
fi

log_test "Checking README has essential sections"
if grep -q "## How to Add More Puzzles" README.md && \
   grep -q "## Adding Connections Puzzles" README.md; then
    log_pass "README has puzzle editing instructions"
else
    log_fail "README missing puzzle editing instructions"
fi

log_test "Checking for TODO/FIXME comments"
todo_count=$(grep -r "TODO\|FIXME" --include="*.js" --include="*.html" --include="*.css" . 2>/dev/null | wc -l)
if [ "$todo_count" -eq 0 ]; then
    log_pass "No TODO/FIXME comments found"
else
    log_warn "Found $todo_count TODO/FIXME comments"
fi

# ============================================================================
# FINAL REPORT
# ============================================================================
log_section "FINAL REPORT"

echo -e "${BLUE}══════════════════════════════════════════${NC}"
echo -e "TOTAL TESTS:     $TOTAL_TESTS"
echo -e "${GREEN}PASSED:         $PASSED_TESTS${NC}"
if [ "$FAILED_TESTS" -gt 0 ]; then
    echo -e "${RED}FAILED:         $FAILED_TESTS${NC}"
else
    echo -e "FAILED:         $FAILED_TESTS"
fi
if [ "$WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}WARNINGS:       $WARNINGS${NC}"
else
    echo -e "WARNINGS:       $WARNINGS"
fi
echo -e "${BLUE}══════════════════════════════════════════${NC}\n"

# Calculate pass rate
pass_rate=0
if [ "$TOTAL_TESTS" -gt 0 ]; then
    pass_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
fi

if [ "$FAILED_TESTS" -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    echo -e "${GREEN}Pass Rate: $pass_rate%${NC}"
    exit 0
else
    echo -e "${RED}⚠️  TESTS FAILED ⚠️${NC}"
    echo -e "${RED}Pass Rate: $pass_rate%${NC}\n"
    
    echo -e "${RED}Failed Tests:${NC}"
    for test in "${FAILED_TESTS_LIST[@]}"; do
        echo -e "${RED}  • $test${NC}"
    done
    
    if [ "$WARNINGS" -gt 0 ]; then
        echo -e "\n${YELLOW}Warnings:${NC}"
        for warning in "${WARNING_LIST[@]}"; do
            echo -e "${YELLOW}  • $warning${NC}"
        done
    fi
    
    exit 1
fi
