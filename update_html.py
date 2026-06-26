import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the static buttons with dynamic container
static_buttons = r'''<div class="flex gap-2 flex-wrap pb-2">
            <button onclick="filterJujuDok\(1\)" id="juju-btn-1".*?</button>
            <button onclick="filterJujuDok\(2\)" id="juju-btn-2".*?</button>
            <button onclick="filterJujuDok\(3\)" id="juju-btn-3".*?</button>
        </div>'''

dynamic_container = '''<div id="juju-tabs-container" class="flex gap-2 flex-wrap pb-2">
            <!-- 동적 바인딩 -->
        </div>'''

html = re.sub(static_buttons, dynamic_container, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML update complete")
