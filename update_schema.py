import re

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the render function to support commonVsModern
render_search = r'card\.innerHTML = `<div class="topic-header">.*?</div>`;'
render_replace = """const distinctionHtml = topic.commonVsModern ? `<div class="content-row"><div class="content-label">Common Law vs. Modern Law / Scenarios</div><div class="content-text">${topic.commonVsModern}</div></div>` : '';
                card.innerHTML = `<div class="topic-header"><div class="topic-title">${topic.rule}<span class="expand-icon">▼</span></div><div class="topic-date">${dateStr}</div></div><div class="topic-content"><div class="content-row"><div class="content-label">Trigger Facts</div><div class="content-text">${topic.trigger}</div></div><div class="content-row"><div class="content-label">What You Need to Know</div><div class="content-text">${topic.notes}</div></div>${distinctionHtml}</div>`;"""
content = re.sub(render_search, render_replace, content, flags=re.DOTALL)

# 2. Update the mapping logic so it merges commonVsModern from initialData
map_search = r'return \{ \.\.\.topic, rule: updatedTopic\.rule, trigger: updatedTopic\.trigger, notes: updatedTopic\.notes \};'
map_replace = r'return { ...topic, rule: updatedTopic.rule, trigger: updatedTopic.trigger, notes: updatedTopic.notes, commonVsModern: updatedTopic.commonVsModern };'
content = content.replace(map_search, map_replace)

# 3. Add the field to the prompt / search logic
search_func = r'const matchesSearch = topic\.rule\.toLowerCase\(\)\.includes\(query\) \|\| topic\.trigger\.toLowerCase\(\)\.includes\(query\) \|\| topic\.notes\.toLowerCase\(\)\.includes\(query\) \|\| topic\.subject\.toLowerCase\(\)\.includes\(query\);'
search_func_replace = r"const matchesSearch = topic.rule.toLowerCase().includes(query) || topic.trigger.toLowerCase().includes(query) || topic.notes.toLowerCase().includes(query) || topic.subject.toLowerCase().includes(query) || (topic.commonVsModern && topic.commonVsModern.toLowerCase().includes(query));"
content = content.replace(search_func, search_func_replace)

# 4. Inject commonVsModern into some specific topics for examples
# Topic 63: Modern Landowner Duty of Care
topic63_search = r"({id:63,subject:'Torts',rule:'Modern Landowner Duty of Care'.*?date:new Date\(\)\.toISOString\(\)})"
topic63_replace = lambda m: m.group(1).replace("date:new", "commonVsModern:'Common Law: Categorized entrants rigidly (Invitee, Licensee, Trespasser) and duty depended entirely on status. \\nModern Law: Abolishes distinctions for lawful entrants (Invitee/Licensee) and applies a universal reasonable-care standard. \\nScenarios: If a question mentions a specific jurisdiction type (e.g., \\'in a jurisdiction following traditional rules\\'), use the categories. If it asks under the modern trend or UBE default trend, apply reasonable care to all lawful guests.',date:new")
content = re.sub(topic63_search, topic63_replace, content)

# Topic 66: Formation and Quantity Term under UCC
topic66_search = r"({id:66,subject:'Contracts',rule:'Formation and Quantity Term under UCC'.*?date:new Date\(\)\.toISOString\(\)})"
topic66_replace = lambda m: m.group(1).replace("date:new", "commonVsModern:'Common Law: Required all essential terms (price, subject, quantity, time) to be specified. No gap fillers.\\nModern Law (UCC Article 2): Extremely flexible. Only quantity is strictly required. The court will gap-fill price and delivery.\\nScenarios: If the contract is for services (Common Law), a missing price means the contract might fail for indefiniteness. If it is for goods (UCC), a missing price is perfectly fine and gap-filled as a reasonable price at delivery.',date:new")
content = re.sub(topic66_search, topic66_replace, content)

# Topic 40: Affirmative Defenses - Burden of Proof
topic40_search = r"({id:40,subject:'Criminal Law',rule:'Affirmative Defenses – Burden of Proof'.*?date:new Date\(\)\.toISOString\(\)})"
topic40_replace = lambda m: m.group(1).replace("date:new", "commonVsModern:'Common Law / Traditional Rule: The prosecution had to disprove affirmative defenses (like insanity) beyond a reasonable doubt.\\nModern Law: States can constitutionally shift the burden of persuasion to the defendant for affirmative defenses (usually by a preponderance of the evidence or clear and convincing evidence).\\nScenarios: Look for questions asking about the constitutionality of a statute shifting the burden of an affirmative defense to the defendant. It is constitutional.',date:new")
content = re.sub(topic40_search, topic40_replace, content)

# Update the rest of the topics to just have commonVsModern: '' so the property exists
def add_empty_field(m):
    text = m.group(1)
    if "commonVsModern" not in text:
        return text.replace("date:new Date", "commonVsModern:'',date:new Date")
    return text

content = re.sub(r"(\{id:\d+,.*?\})", add_empty_field, content)

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated prototype.html with commonVsModern field successfully")
