import re

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace filterJujuDok
old_filter = r'''    function filterJujuDok\(dok\) {.*?applyStateToDOM\(\);\n    }'''
new_filter = '''    window.filterJujuDok = function(dok) {
        state.selectedDokTab = dok;
        applyStateToDOM();
    }
    
    window.renderJujuPage = function() {
        applyStateToDOM();
    }'''
js = re.sub(old_filter, new_filter, js, flags=re.DOTALL)

# Add logic to applyStateToDOM
# Find where admin table logic ends
admin_table_logic = r'''        renderMasterGrid\(\); // 구글시트 격자판 갱신\n    }'''

juju_logic = '''
        // 8. 명예의 전당 (Juju Records) 갱신
        const jujuTabsContainer = document.getElementById('juju-tabs-container');
        const jujuHallContainer = document.getElementById('juju-hall-container');
        const jujuControlList = document.getElementById('juju-control-list');
        
        if (state.currentTab === 'juju_records') {
            let maxDok = 3;
            Object.values(state.juju).forEach(val => {
                if (val > maxDok) maxDok = val;
            });
            if (state.selectedDokTab > maxDok) state.selectedDokTab = maxDok;

            if (jujuTabsContainer) {
                jujuTabsContainer.innerHTML = '';
                for (let i = 1; i <= maxDok; i++) {
                    const btn = document.createElement('button');
                    btn.onclick = () => window.filterJujuDok(i);
                    btn.id = `juju-btn-${i}`;
                    const isSelected = state.selectedDokTab === i;
                    btn.className = isSelected 
                        ? "px-4 py-2 rounded-full border text-xs font-semibold bg-purple-100 border-purple-300 text-purple-800"
                        : "px-4 py-2 rounded-full border text-xs font-semibold bg-white border-stone-200 text-stone-600 hover:bg-stone-50";
                    btn.textContent = `🏅 ${i}독 완주자`;
                    jujuTabsContainer.appendChild(btn);
                }
            }

            if (jujuHallContainer) {
                const targetDok = state.selectedDokTab;
                const heroes = Object.keys(state.juju)
                    .filter(name => state.juju[name] >= targetDok)
                    .map(name => ({ name, count: state.juju[name] }));

                if (heroes.length === 0) {
                    jujuHallContainer.innerHTML = `<p class="text-center text-stone-400 text-sm py-4">아직 ${targetDok}독 완주자가 없습니다. 곧 탄생하길 기도합니다!</p>`;
                } else {
                    let html = '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">';
                    heroes.forEach(h => {
                        const m = state.members.find(member => member.name === h.name);
                        const group = m ? m.group : '수동 등록 성도';
                        html += `
                        <div class="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-stone-200 relative overflow-hidden">
                            <div class="absolute -top-2 -right-2 bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-1 rounded-bl-lg">${h.count}독</div>
                            <div class="w-12 h-12 bg-[#3D4F41]/10 rounded-full flex items-center justify-center text-2xl mb-2">🏅</div>
                            <h4 class="font-bold text-stone-800 text-sm">${h.name}</h4>
                            <p class="text-[10px] text-stone-500">${group}</p>
                        </div>`;
                    });
                    html += '</div>';
                    jujuHallContainer.innerHTML = html;
                }
            }

            if (jujuControlList) {
                jujuControlList.innerHTML = '';
                const searchQ = document.getElementById('juju-search')?.value.trim() || '';
                
                let targetList = [];
                if (state.jujuListView === 'active') {
                    targetList = state.members.map(m => m.name);
                } else {
                    const allNames = new set(state.members.map(m => m.name));
                    Object.keys(state.juju).forEach(k => allNames.add(k));
                    targetList = Array.from(allNames);
                }

                targetList = targetList.filter(n => n.includes(searchQ));

                targetList.forEach(name => {
                    const currentCount = state.juju[name] || 0;
                    const div = document.createElement('div');
                    div.className = "flex items-center justify-between p-2 bg-stone-50 rounded-lg border border-stone-200";
                    div.innerHTML = `
                        <span class="font-bold text-xs text-stone-700">${name}</span>
                        <div class="flex items-center space-x-2">
                            <button onclick="handleModifyJujuCount('${name}', -1)" class="w-6 h-6 rounded bg-stone-200 text-stone-600 font-bold hover:bg-stone-300">-</button>
                            <span class="text-xs font-black w-8 text-center">${currentCount}독</span>
                            <button onclick="handleModifyJujuCount('${name}', 1)" class="w-6 h-6 rounded bg-[#3D4F41] text-white font-bold hover:bg-[#2C3B30]">+</button>
                        </div>
                    `;
                    jujuControlList.appendChild(div);
                });
            }
        }

        renderMasterGrid(); // 구글시트 격자판 갱신
    }'''

# Note: small fix in Set capitalization
juju_logic = juju_logic.replace('new set(', 'new Set(')

js = re.sub(admin_table_logic, juju_logic, js)

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("JS update complete")
