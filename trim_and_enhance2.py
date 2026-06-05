import re
import sys

file_path = "23 - Angular Architecture & First Application.md"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make it more aggressive in stripping non-essential parts
# Strip more comments from code
content = re.sub(r'// [^\n]+\n', '', content)
content = re.sub(r'<!-- [^\n]+ -->\n', '', content)

# Remove the large ASCII component tree diagram
content = re.sub(r'┌───────────────────────────────────────────────────────┐.*?└───────────────────────────────────────────────────────┘\n', '', content, flags=re.DOTALL)

# Remove the large ASCII architecture diagram
content = re.sub(r'┌─────────────────────────────────────────────────────────────┐.*?└─────────────────────────────────────────────────────────────┘\n', '', content, flags=re.DOTALL)

# Re-check length
while len(content.encode('utf-8')) > 40000:
    # remove all Section Recaps
    if "### Section Recap" in content:
        content = re.sub(r'### Section Recap.*?(---)', r'\1', content, count=1, flags=re.DOTALL)
    else:
        # Stop
        break

print(f"Final length: {len(content.encode('utf-8'))} bytes")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
