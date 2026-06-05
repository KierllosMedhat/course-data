import re
import os

filepath = '33 - C# Basics — Syntax, Types & Control Structures.md'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Plain-English Explanation
content = re.sub(
    r'### Plain-English Explanation.*?### The Three Core Components',
    '### What is .NET?\n\n**.NET** is a free, open-source, cross-platform developer platform that runs C# code.\n- **C#**: The programming language.\n- **.NET**: The runtime and library ecosystem that executes C# cross-platform.\n\n### The Three Core Components',
    content, flags=re.DOTALL
)

# 2. ASCII Art
content = re.sub(
    r'```\n┌───.*?```\n\n\| Component',
    '| Component',
    content, flags=re.DOTALL
)

# 3. Billion Dollar Mistake
content = re.sub(
    r'### The "Billion-Dollar Mistake".*?### Nullable Value Types',
    '### Nullable Value Types',
    content, flags=re.DOTALL
)

# 4. Critical Difference
content = re.sub(
    r'### The Critical Difference.*?### Value Types',
    '### The Critical Difference\n\n- **Value type**: Acts like a photocopy. Copying gives an independent clone.\n- **Reference type**: Acts like a shared Google Doc link. Copying shares the reference; changes affect all users.\n\n### Value Types',
    content, flags=re.DOTALL
)

# 5. Why Strings Are Important
content = re.sub(
    r'### Why Strings Are Important.*?### 6\.1 String Interpolation',
    '### 6.1 String Interpolation',
    content, flags=re.DOTALL
)

# 6. Primary Constructor Analogy
content = re.sub(
    r'### What is a Primary Constructor\?.*?```csharp',
    '### What is a Primary Constructor?\n\nNormally, to create a class and store constructor parameters, you define fields, a constructor, and assign parameters. Primary constructors collapse this into a single concise declaration.\n\n```csharp',
    content, flags=re.DOTALL
)

# 7. StringBuilder
content = re.sub(
    r'### 6\.5 `StringBuilder` — For Building Strings in Loops.*?```csharp',
    '### 6.5 `StringBuilder` — For Building Strings in Loops\n\nSince strings are immutable, concatenation in loops creates many temporary objects, severely degrading performance. `StringBuilder` provides an efficient, mutable string buffer:\n\n```csharp',
    content, flags=re.DOTALL
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"File truncated. New size: {os.path.getsize(filepath)} bytes")
