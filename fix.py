import os

filepath = '33 - C# Basics — Syntax, Types & Control Structures.md'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("## 1. What is .NET?\n\n### What is .NET?\n\n", "## 1. What is .NET?\n\n")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"File fixed. New size: {os.path.getsize(filepath)} bytes")
