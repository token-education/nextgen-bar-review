import re
import os

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert to 93 topics
content = re.sub(r'\{id:94,subject:\'Constitutional Amendments\'.*?\];', '];', content, flags=re.DOTALL)
content = content.replace('113 Topics', '93 Topics')
content = content.replace('topic.id <= 113', 'topic.id <= 93')

# Clean up SUBJECTS and filter-select
content = content.replace(', \'Constitutional Amendments\'', '')
content = re.sub(r'<option value="Constitutional Amendments">Constitutional Amendments</option>\n\s*', '', content)

# Clean up the nav
nav_html = """<nav>
                <a href="index.html" class="active">Topics</a>
                <a href="amendments.html" class="inactive">Constitutional Amendments</a>
                <a href="crimes.html" class="inactive">Crimes & Timelines</a>
                <a href="irac.html" class="inactive">IRAC Guide</a>
            </nav>"""
content = re.sub(r'<nav>.*?</nav>', nav_html, content, flags=re.DOTALL)

# Add cleanup script to remove > 93 ids from localStorage if they exist
cleanup_script = """
        // Clean up any leaked amendment topics from previous version
        allTopics = allTopics.filter(t => t.id <= 93);
        saveData(allTopics);
"""
content = content.replace('saveData(allTopics); // Force save to persist the enhanced notes', 'saveData(allTopics); // Force save to persist the enhanced notes\n' + cleanup_script)

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Restored prototype.html to 93 topics")

