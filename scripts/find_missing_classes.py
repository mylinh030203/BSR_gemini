import re

with open('docs/design/prototype/assets/app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()
with open('docs/design/prototype/assets/styles.css', 'r', encoding='utf-8') as f:
    css_text = f.read()

classes = set(re.findall(r'class=[\"\']([^\"\']+)[\"\']', app_text))
all_classes = set()
for c in classes:
    # ignore dynamic templates like ${...}
    cleaned = re.sub(r'\$\{[^\}]+\}', '', c)
    for sub in cleaned.split():
        if sub.strip():
            all_classes.add(sub.strip())

missing = []
for c in sorted(all_classes):
    if '.' + c not in css_text:
        missing.append(c)

print('Total classes in app.js:', len(all_classes))
print('Missing classes count:', len(missing))
print('Missing classes:', missing)
