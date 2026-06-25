import re
import glob

# Collect all files that might contain topic strings
files_to_scan = ['prototype.html'] + glob.glob('*.py')
all_topics_strings = []

for file in files_to_scan:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Find all topics matching {id:...}
            found = re.findall(r"\{id:\s*\d+,\s*subject:.*?\}", content, flags=re.DOTALL)
            all_topics_strings.extend(found)
    except Exception as e:
        print(f"Error reading {file}: {e}")

unique_topics = {}
for t in all_topics_strings:
    match = re.search(r"id:\s*(\d+)", t)
    if match:
        topic_id = int(match.group(1))
        # Keep the latest occurrence
        unique_topics[topic_id] = t

sorted_topics = [unique_topics[k] for k in sorted(unique_topics.keys())]

ts_content = """import { Topic } from "@/types";

export const initialData: Topic[] = [
"""
for t in sorted_topics:
    ts_content += "  " + t + ",\n"

ts_content += "];\n"

with open('src/data/mockTopics.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully extracted {len(sorted_topics)} unique topics from all files.")
