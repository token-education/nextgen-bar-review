import re

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Add button
content = re.sub(r'<button class="btn btn-add" id="add-btn">\+ Add Topic</button>', '', content)

# Remove "Added Today" stat
content = re.sub(r'<div class="stat">\s*<span class="stat-number" id="today-count">0</span>\s*<span>Added Today</span>\s*</div>', '', content)

# Replace sort-select with filter-select and sort-select
controls_search = r'<select id="sort-select">\s*<option value="subject">Sort by Subject</option>\s*</select>'
controls_replace = """<select id="filter-select">
                <option value="all">All Subjects</option>
                <option value="Constitutional Law – Commerce & Federal Power">Constitutional Law – Commerce & Federal Power</option>
                <option value="Constitutional Law – Individual Rights">Constitutional Law – Individual Rights</option>
                <option value="Constitutional Law – Justiciability">Constitutional Law – Justiciability</option>
                <option value="Constitutional Law – Criminal Procedure">Constitutional Law – Criminal Procedure</option>
                <option value="Civil Procedure">Civil Procedure</option>
                <option value="Contracts">Contracts</option>
                <option value="Torts">Torts</option>
                <option value="Real Property">Real Property</option>
                <option value="Evidence">Evidence</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Business Entities">Business Entities</option>
                <option value="Other">Other</option>
            </select>"""
content = re.sub(controls_search, controls_replace, content)

# Remove modal HTML completely
content = re.sub(r'<div class="modal" id="add-modal">.*?</form>\s*</div>\s*</div>', '', content, flags=re.DOTALL)

# Update JS variables and event listeners
js_vars_search = r"let currentSort = 'subject';.*?const todayCount = document\.getElementById\('today-count'\);"
js_vars_replace = """let currentFilter = 'all';

        const searchInput = document.getElementById('search-input');
        const filterSelect = document.getElementById('filter-select');
        const topicsContainer = document.getElementById('topics-container');
        const totalCount = document.getElementById('total-count');"""
content = re.sub(js_vars_search, js_vars_replace, content, flags=re.DOTALL)

js_events_search = r"searchInput\.addEventListener\('input', filterAndRender\);.*?addModal\.addEventListener\('click', \(e\) => \{ if \(e\.target === addModal\) addModal\.classList\.remove\('open'\); \}\);"
js_events_replace = """searchInput.addEventListener('input', filterAndRender);
        filterSelect.addEventListener('change', (e) => { currentFilter = e.target.value; filterAndRender(); });"""
content = re.sub(js_events_search, js_events_replace, content, flags=re.DOTALL)

# Update filterAndRender
filter_func_search = r"filteredTopics = allTopics\.filter\(topic => topic\.rule.*?topic\.subject\.toLowerCase\(\)\.includes\(query\)\);"
filter_func_replace = """filteredTopics = allTopics.filter(topic => {
                const matchesSearch = topic.rule.toLowerCase().includes(query) || topic.trigger.toLowerCase().includes(query) || topic.notes.toLowerCase().includes(query) || topic.subject.toLowerCase().includes(query);
                const matchesFilter = currentFilter === 'all' || topic.subject === currentFilter;
                return matchesSearch && matchesFilter;
            });"""
content = re.sub(filter_func_search, filter_func_replace, content, flags=re.DOTALL)

# Update render function to remove 'currentSort' reference since we are always sorting by subject conceptually now, or just leave currentSort logic as default true
render_search = r"if \(currentSort === 'subject' && topic\.subject !== currentSubject\)"
render_replace = r"if (topic.subject !== currentSubject)"
content = content.replace(render_search, render_replace)

# Update updateStats
update_stats_search = r"function updateStats\(\) \{.*?\}"
update_stats_replace = """function updateStats() {
            totalCount.textContent = filteredTopics.length === allTopics.length ? allTopics.length : `${filteredTopics.length} of ${allTopics.length}`;
        }"""
content = re.sub(update_stats_search, update_stats_replace, content, flags=re.DOTALL)

# Remove handleAddTopic
handle_add_search = r"function handleAddTopic\(e\) \{.*?\}\n"
content = re.sub(handle_add_search, '', content, flags=re.DOTALL)

# Remove modal CSS
content = re.sub(r'\.modal \{ display: none;.*?\.empty-state \{', '.empty-state {', content, flags=re.DOTALL)
# Remove add button CSS
content = re.sub(r'\.btn-add \{ background: var\(--accent\); color: white; \}\s*\.btn-add:hover \{ background: #c0392b; \}', '', content)

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated prototype.html successfully")
