const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add pointer-events-none to stamp-mark
html = html.replace(
    '<div id="stamp-mark" class="absolute inset-0 flex items-center justify-center bg-transparent stamp-active z-10 select-none hidden">',
    '<div id="stamp-mark" class="absolute inset-0 flex items-center justify-center bg-transparent stamp-active z-10 select-none pointer-events-none hidden">'
);

// 2. Remove the google_forms_sheets tab button
html = html.replace(
    /<button onclick="changeTab\('google_forms_sheets'\)" id="tab-google_forms_sheets"[\s\S]*?<\/button>\n/,
    ''
);

// 3. Extract the google_forms_sheets section content
const sectionRegex = /<section id="page-google_forms_sheets" class="tab-page bg-white p-6 rounded-2xl border border-\[#E9E4DC\] shadow-md space-y-6 hidden animate-fade-in">([\s\S]*?)<\/section>/;
const match = html.match(sectionRegex);

if (match) {
    const innerContent = match[1];
    // Remove the original section entirely
    html = html.replace(sectionRegex, '');
    
    // Create a new container for it to inject inside admin-console-panel
    const newContainer = `\n            <!-- 이관된 구글 시트 & 설문지 연동 패널 -->\n            <div id="admin-google-sheets" class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6 mt-8">\n${innerContent}\n            </div>\n`;
    
    // Inject it at the end of admin-console-panel
    // Admin console panel ends with:
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </section>
    
    html = html.replace(
        /(<div id="admin-console-panel"[\s\S]*?)(<\/div>\s*<\/section>)/,
        `$1${newContainer}$2`
    );
}

fs.writeFileSync('index.html', html);

// Update main.js
let js = fs.readFileSync('main.js', 'utf8');
js = js.replace(/state\.currentTab === 'google_forms_sheets'/g, "state.currentTab === 'admin'");
js = js.replace(/state\.currentTab !== 'google_forms_sheets'/g, "state.currentTab !== 'admin'");
fs.writeFileSync('main.js', js);

console.log('Update complete');
