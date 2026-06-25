import re

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_topics = [
    "{id:107,subject:'Civil Procedure',rule:'Subject-Matter Jurisdiction – Federal Statutory Interpleader',trigger:'A stakeholder files an interpleader action in federal court under § 1335.',notes:'*The Correct Rule:* Under the federal interpleader statute (§ 1335), standard complete diversity is not required. Instead, jurisdiction is met as long as there is minimal diversity—meaning any two adverse claimants are citizens of different states. The citizenship of the stakeholder does not satisfy this if the actual claimants are from the same state. Furthermore, the amount in controversy requirement is only $500.\\n\\n*The Misconception:* Believing that statutory interpleader follows the same strict, complete diversity and $75,000 requirements as standard diversity jurisdiction under § 1332.\\n\\n*Why You Got It Wrong:* You selected that the value of the necklace did not exceed $75,000. However, statutory interpleader only requires an amount in controversy of $500 or more. The court properly granted the motion to dismiss because the only two adverse claimants were citizens of the same state, defeating minimal diversity.',commonVsModern:'',date:new Date().toISOString()}",
    "{id:108,subject:'Civil Procedure',rule:'Rule 11 Sanctions – Sua Sponte Monetary Sanctions',trigger:'A judge independently (sua sponte) decides to sanction an attorney for a frivolous filing.',notes:'*The Correct Rule:* A court may initiate Rule 11 sanction proceedings on its own initiative (sua sponte), but it must issue an order to show cause (OSC) first, giving the attorney notice and an opportunity to respond before imposing monetary sanctions.\\n\\n*The Misconception:* Believing a court can independently order an attorney or law firm to pay an opponent\\'s attorney\\'s fees under Rule 11 without any prior formal procedural warning.\\n\\n*Why You Got It Wrong:* You selected that an attorney may rely completely on a client\\'s factual assertions without any inquiry. An attorney must perform a reasonable inquiry. However, the court erred procedurally: a judge cannot hit an attorney with a surprise monetary penalty sua sponte without first issuing an order to show cause.',commonVsModern:'',date:new Date().toISOString()}",
    "{id:109,subject:'Torts',rule:'Defenses to Negligence – Traditional Contributory Negligence',trigger:'A plaintiff is partially at fault for their own injuries in a traditional common law jurisdiction.',notes:'*The Correct Rule:* In a traditional contributory negligence jurisdiction, if a plaintiff’s own failure to use reasonable care contributes to her injuries in any way (even 1%), her recovery is completely barred ($0%), regardless of how much more negligent the defendant was.\\n\\n*The Misconception:* Applying modern comparative fault rules (where a plaintiff\\'s recovery is merely reduced) when the prompt explicitly states that traditional common law rules apply.\\n\\n*Why You Got It Wrong:* You selected an answer that calculated a comparative fault offset. Because the jurisdiction strictly followed traditional contributory negligence and the jury found the woman 25% at fault for speeding, she is completely barred from recovering anything.',commonVsModern:'',date:new Date().toISOString()}",
    "{id:110,subject:'Torts',rule:'Defenses to Negligence – Pure Comparative Negligence',trigger:'A plaintiff is partially (or mostly) at fault for their own injuries in a \"pure comparative negligence\" jurisdiction.',notes:'*The Correct Rule:* In a pure comparative negligence jurisdiction (the default rule on the MBE unless stated otherwise), the plaintiff\\'s recovery is reduced by their percentage of fault. \\n\\n*Key Nuance:* Even if the plaintiff is 99% at fault, they can still recover 1% of their damages from the defendant. Recovery is NEVER completely barred by the plaintiff\\'s negligence.',commonVsModern:'Common Law: Contributory negligence completely barred recovery.\\nModern MBE Default: Pure Comparative Negligence applies. Plaintiff recovers (Total Damages - Plaintiff\\'s % of Fault).',date:new Date().toISOString()}",
    "{id:111,subject:'Torts',rule:'Defenses to Negligence – Partial (Modified) Comparative Negligence',trigger:'A plaintiff is partially at fault in a \"partial\" or \"modified\" comparative negligence jurisdiction.',notes:'*The Correct Rule:* In a partial/modified comparative fault jurisdiction, the plaintiff\\'s recovery is reduced by their percentage of fault, BUT their claim is completely barred if their fault reaches a certain threshold. \\n\\n*Two variations exist:*\\n1. \"Not as great as\" (49% Rule): Plaintiff is barred if they are 50% or more at fault.\\n2. \"No greater than\" (50% Rule): Plaintiff is barred if they are 51% or more at fault (meaning if it\\'s a 50/50 split, plaintiff can still recover 50%).',commonVsModern:'',date:new Date().toISOString()}",
    "{id:112,subject:'Torts',rule:'Defenses to Negligence – Assumption of Risk',trigger:'Plaintiff knowingly and voluntarily engages in a dangerous activity caused by the defendant.',notes:'*The Correct Rule:* A plaintiff who subjectively knows of a specific risk and voluntarily proceeds in the face of it assumes the risk. \\n\\n*Express Assumption:* A valid exculpatory waiver (signed contract) completely bars recovery.\\n*Implied Assumption:* Traditionally, this completely barred recovery. However, in most comparative fault jurisdictions, implied assumption of risk is merged into the comparative fault analysis and simply reduces the plaintiff\\'s recovery rather than acting as a complete bar.',commonVsModern:'Common Law: Implied assumption of risk completely barred recovery.\\nModern Law: Usually merged into comparative fault, reducing damages rather than barring them completely.',date:new Date().toISOString()}"
]

new_topics_str = ",\n            ".join(new_topics)

content = re.sub(
    r'(\{id:106,.*?\}).*?\];',
    lambda m: m.group(1) + ',\n            ' + new_topics_str + '\n        ];',
    content,
    flags=re.DOTALL
)

# Update topics count
content = content.replace('106 Topics', '112 Topics')
content = content.replace('topic.id <= 106', 'topic.id <= 112')

# Update navigation to ensure Constitutional Amendments is at the end
nav_html = """<nav>
                <a href="index.html" class="active">Topics</a>
                <a href="crimes.html" class="inactive">Crimes & Timelines</a>
                <a href="irac.html" class="inactive">IRAC Guide</a>
                <a href="amendments.html" class="inactive">Constitutional Amendments</a>
            </nav>"""
content = re.sub(r'<nav>.*?</nav>', nav_html, content, flags=re.DOTALL)

with open('/Users/rubenreneorozco/.gemini/antigravity/scratch/bar-exam-review/prototype.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added 6 new topics and fixed nav successfully!")
