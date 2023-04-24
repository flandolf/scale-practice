import re

def minify_tsx(code):
    """
    A simple function to minify tsx code by removing whitespace and comments.
    """
    # Remove comments
    code = re.sub(r'/\*[\s\S]*?\*/', '', code)
    code = re.sub(r'//.*', '', code)

    # Remove whitespace
    code = re.sub(r'\n\s*', '', code)
    code = re.sub(r'\s+', ' ', code)

    return code

with open('src/App.tsx', 'r') as f:
    code = f.read()

minified_code = minify_tsx(code)

with open('src/App.tsx', 'w') as f:
    f.write(minified_code)
