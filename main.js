// 시스템 소스 다운로드 (관리자 전용)
    async function downloadSelfHTML() {
        try {
            let content = "";
            try {
                const res = await fetch(location.href);
                content = await res.text();
            } catch(err) {
                content = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
            }
            const blob = new Blob([content], { type: "text/html;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "index.html";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("index.html 파일 다운로드가 시작되었습니다.", "success");
        } catch(e) {
            alert("다운로드 오류가 발생했습니다: " + e.message);
        }
    }

    const BIBLE_RANGES = [
        '창세기 1~8장', '창세기 9~18장', '창세기 19~24장', '창세기 25~30장', '창세기 31~36장', '창세기 37~42장',
        '창세기 43~49장', '창세기 50장/출애굽기 1~6장', '출애굽기 7~13장', '출애굽기 14~20장', '출애굽기 21~28장', '출애굽기 29~35장',
        '출애굽기 36~40장/레위기 1~3장', '레위기 4~11장', '레위기 12~17장', '레위기 18~25장', '레위기 26~27장/민수기 1~3장', '민수기 4~8장',
        '민수기 9~15장', '민수기 16~21장', '민수기 22~28장', '민수기 29~35장', '민수기 36장/신명기 1~4장', '신명기 5~9장',
        '신명기 10~16장', '신명기 17~23장', '신명기 24~29장', '신명기 30~34장', '여호수아 1~8장', '여호수아 9~15장',
        '여호수아 16~22장', '여호수아 23~24장/사사기 1~4장', '사사기 5~9장', '사사기 10~16장', '사사기 17~21장/룻기 1장', '룻기 2~4장/사무엘상 1~4장',
        '사무엘상 5~12장', '사무엘상 13~17장', '사무엘상 18~24장', '사무엘상 25~30장', '사무엘상 31장/사무엘하 1~7장', '사무엘하 8~14장',
        '사무엘하 15~19장', '사무엘하 20~24장', '열왕기상 1~4장', '열왕기상 5~9장', '열왕기상 10~14장', '열왕기상 15~20장',
        '열왕기상 21~22장/열왕기하 1~4장', '열왕기하 5~9장', '열왕기하 10~15장', '열왕기하 16~20장', '열왕기하 21~25장/역대상 1~2장', '역대상 3~7장',
        '역대상 8~15장', '역대상 16~23장', '역대상 24~29장/역대하 1장', '역대하 2~9장', '역대하 10~18장', '역대하 19~25장',
        '역대하 26~32장', '역대하 33~36장/에스라 1~2장', '에스라 3~10장', '느헤미야 1~7장', '느헤미야 8~13장', '에스더 1~9장',
        '에스더 10장/개인 묵상/욥기 1~11장', '욥기 12~22장', '욥기 23~34장', '욥기 35~42장/시편 1~7편', '시편 8~22장', '시편 23~37장',
        '시편 38~50장', '시편 51~68장', '시편 69~78장', '시편 79~91장', '시편 92~106장', '시편 107~119장',
        '시편 120~141장', '시편 142~150장/잠언 1~4장', '잠언 5~12장', '잠언 13~20장', '잠언 21~29장', '잠언 30~31장/전도서 1~7장',
        '전도서 8~12장/아가 1~7장', '아가 8장/이사야 1~8장', '이사야 9~18장', '이사야 19~28장', '이사야 29~36장', '이사야 37~43장',
        '이사야 44~51장', '이사야 52~61장', '이사야 62~66장/예레미야 1~3장', '예레미야 4~9장', '예레미야 10~16장', '예레미야 17~23장',
        '예레미야 24~30장', '예레미야 31~36장', '예레미야 37~43장', '예레미야 44~50장', '예레미야 51장~52장/예레미야애가 1~2장', '예레미야애가 3~5장/에스겔 1~5장',
        '에스겔 6~14장', '에스겔 15~20장', '에스겔 21~27장', '에스겔 28~33장', '에스겔 34~40장', '에스겔 41~46장',
        '에스겔 47~48장/다니엘 1~4장', '다니엘 5~9장', '다니엘 10~12장/호세아 1~5장', '호세아 6~14장/요엘', '아모스 1~9장/오바댜', '요나/미가/나훔 1~2장',
        '나훔 3장/하박국/스바냐/학개', '스가랴 1~13장', '스가랴 14장/말라기/마태복음 1~5장', '마태복음 6~12장', '마태복음 13~19장', '마태복음 20~25장',
        '마태복음 26~28장/마가복음 1~3장', '마가복음 4~9장', '마가복음 10~15장', '마가복음 16장/누가복음 1~4장', '누가복음 5~9장', '누가복음 10~14장',
        '누가복음 15~21장', '누가복음 22장~24장/요한복음 1~3장', '요한복음 4~7장', '요한복음 8~12장', '요한복음 13~18장', '요한복음 19~21장/사도행전 1~4장',
        '사도행전 5~10장', '사도행전 11~17장', '사도행전 18~24장', '사도행전 25~28장/로마서 1~3장', '로마서 4~10장', '로마서 11~16장/고린도전서 1~2장',
        '고린도전서 3~11장', '고린도전서 12~16장/고린도후서 1~3장', '고린도후서 4~13장', '갈라디아서/에베소서 1~4장', '에베소서 5~6장/빌립보서/골로새서 1~3장', '골로새서 4장/데살로니가전서/후서/디모데전서 1~5장',
        '디모데전서 6장/후서/디도서/빌레몬서/히브리서 1~3장', '히브리서 4~12장', '히브리서 13장/야고보서/베드로전서', '베드로후서/요한일서/요한이서/요한삼서/유다서', '요한계시록 1~11장', '요한계시록 12~22장'
    ];

    const INITIAL_MOCK_USERS = [
        { id: 'u1', name: '김은혜', group: '사랑 1조', avatar: '🕊️' },
        { id: 'u2', name: '박사랑', group: '사랑 1조', avatar: '✨' }
    ];

    function generateBibleSchedule(startDateStr = '2026-07-06') {
        const start = new Date(startDateStr);
        const basePlan = [];
        let currentDayIndex = 1;
        let cursor = new Date(start);

        for (let w = 1; w <= 25; w++) {
            for (let d = 0; d < 6; d++) {
                while (cursor.getDay() === 0) cursor.setDate(cursor.getDate() + 1);
                const m = cursor.getMonth() + 1;
                const dayNum = cursor.getDate();
                const dateStr = `${m}/${dayNum}`;
                const rangeStr = BIBLE_RANGES[currentDayIndex - 1] || '성경 완독 도전';
                basePlan.push({ week: w, day: currentDayIndex, date: dateStr, range: rangeStr });
                currentDayIndex++;
                cursor.setDate(cursor.getDate() + 1);
            }
        }
        return basePlan;
    }

    const state = {
        currentTab: 'today',
        sheetSubTab: 'forms',
        campaignStartDate: '2026-07-06',
        members: [],
        progress: {},
        transcriptions: [],
        juju: {},
        currentUser: null,
        selectedDay: 1,
        selectedMemberIds: [],
        isAdminAuthenticated: false,
        selectedDokTab: 1,
        jujuListView: 'active',
        supabaseUrl: '',
        supabaseAnonKey: '',
        googleWebAppUrl: '',
        isSupabaseActive: false,
        formsSelectedDay: null
    };

    function getBibleSchedule() { return generateBibleSchedule(state.campaignStartDate); }
    function lsGet(key, fallback) { const item = localStorage.getItem(key); return item ? JSON.parse(item) : fallback; }
    function lsSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

    async function supabaseFetch(table, method = 'GET', body = null, queryParams = '') {
        if (!state.supabaseUrl || !state.supabaseAnonKey) return null;
        const headers = {
            'apikey': state.supabaseAnonKey,
            'Authorization': `Bearer ${state.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
        const url = `${state.supabaseUrl}/rest/v1/${table}${queryParams}`;
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        try {
            const res = await fetch(url, options);
            if (res.ok) return await res.json();
        } catch (e) { console.error("Supabase API 에러:", e); }
        return null;
    }

    let supabaseClient = null;
    function getSupabaseClient() {
        if (supabaseClient) return supabaseClient;
        if (state.supabaseUrl && state.supabaseAnonKey && window.supabase) {
            try {
                supabaseClient = window.supabase.createClient(state.supabaseUrl, state.supabaseAnonKey);
                return supabaseClient;
            } catch(e) {}
        }
        return null;
    }

    async function supabaseUploadStorage(bucket, path, base64Data) {
        if (!state.supabaseUrl || !state.supabaseAnonKey) return null;
        const headers = { 'apikey': state.supabaseAnonKey, 'Authorization': `Bearer ${state.supabaseAnonKey}`, 'Content-Type': 'image/jpeg' };
        const url = `${state.supabaseUrl}/storage/v1/object/${bucket}/${path}`;
        try {
            const binary = atob(base64Data.split(',')[1]);
            const array = [];
            for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
            const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
            const res = await fetch(url, { method: 'POST', headers, body: blob });
            if (res.ok) return `${state.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
        } catch (e) { console.error("Storage Error:", e); }
        return null;
    }

    async function sendToGoogleSheets(payload) {
        if (!state.googleWebAppUrl) return;
        try {
            await fetch(state.googleWebAppUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error('구글 시트 연동 에러:', e);
        }
    }

    // 진척도 동기화 헬퍼
    async function syncProgress(memberId, progressObj) {
        if (state.isSupabaseActive) {
            const client = getSupabaseClient();
            if (client) {
                await client.from('chunsan_progress').upsert([{
                    id: memberId,
                    completed_days: progressObj.completedDays,
                    notes: progressObj.notes,
                    updated_at: new Date().toISOString()
                }]);
            }
        }
    }

    async function initApp() {
        state.campaignStartDate = localStorage.getItem('bible_campaign_start_date') || '2026-07-06';
        state.supabaseUrl = 'https://xgkskkwpmukfjlcbgylv.supabase.co';
        state.supabaseAnonKey = 'sb_publishable_KTG9l2yhPQOD9r89n3GmwA_CNH5QQNk';
        state.googleWebAppUrl = localStorage.getItem('chunsan_google_web_app_url') || '';

        document.getElementById('admin-campaign-start-date').value = state.campaignStartDate;

        const today = new Date();
        const startCamp = new Date(state.campaignStartDate);
        const diffTime = Math.abs(today - startCamp);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 1 && diffDays <= 150) state.selectedDay = diffDays;

        if (state.supabaseUrl && state.supabaseAnonKey) {
            try {
                const client = getSupabaseClient();
                if (client) {
                    state.isSupabaseActive = true;
                    document.getElementById('db-status-badge').className = "text-xs bg-emerald-500 text-stone-900 px-2 py-0.5 rounded ml-2 font-black";
                    document.getElementById('db-status-badge').textContent = "🟢 Supabase 연동 중";

                    // 1. 멤버
                    const memberList = await supabaseFetch('chunsan_members');
                    if (memberList && memberList.length > 0) {
                        state.members = memberList;
                        lsSet('chunsan_members', state.members);
                    } else {
                        await supabaseFetch('chunsan_members', 'POST', INITIAL_MOCK_USERS);
                        state.members = INITIAL_MOCK_USERS;
                        lsSet('chunsan_members', state.members);
                    }

                    // 2. 프로그레스
                    const progressList = await supabaseFetch('chunsan_progress');
                    state.progress = {};
                    if (progressList && progressList.length > 0) {
                        progressList.forEach(item => {
                            state.progress[item.id] = {
                                completedDays: item.completed_days || [],
                                notes: item.notes || {}
                            };
                        });
                        lsSet('chunsan_progress', state.progress);
                    }

                    // 3. 누적독
                    const jujuList = await supabaseFetch('chunsan_juju');
                    state.juju = {};
                    if (jujuList && jujuList.length > 0) {
                        jujuList.forEach(item => { state.juju[item.name] = item.count; });
                        lsSet('chunsan_juju', state.juju);
                    }

                    // 4. 피드
                    const transList = await supabaseFetch('chunsan_transcriptions');
                    if (transList) {
                        state.transcriptions = transList.map(item => ({
                            id: item.id, memberId: item.member_id, memberName: item.member_name,
                            week: item.week, verse: item.verse, content: item.content,
                            imageUrl: item.image_url, createdAt: item.created_at, likes: item.likes || []
                        })).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                        lsSet('chunsan_transcriptions', state.transcriptions);
                    }

                    restoreActiveSession();
                    applyStateToDOM();
                    return; // 연결 완료시 로컬 복원 안함
                }
            } catch (err) { console.error("Supabase 로딩 에러:", err); }
        }

        // 로컬 대체 기동
        if (!localStorage.getItem('chunsan_members')) {
            localStorage.setItem('chunsan_members', JSON.stringify(INITIAL_MOCK_USERS));
        }
        state.members = lsGet('chunsan_members', INITIAL_MOCK_USERS);
        state.progress = lsGet('chunsan_progress', {});
        state.transcriptions = lsGet('chunsan_transcriptions', []);
        state.juju = lsGet('chunsan_juju', {});

        restoreActiveSession();
        applyStateToDOM();
    }

    function restoreActiveSession() {
        const savedActiveUserId = localStorage.getItem('chunsan_active_userid');
        if (savedActiveUserId) {
            const found = state.members.find(m => m.id === savedActiveUserId);
            if (found) state.currentUser = found;
        } else {
            if(state.members.length > 0){
                state.currentUser = state.members[0];
                localStorage.setItem('chunsan_active_userid', state.members[0].id);
            }
        }
    }

    function showToast(msg, type = 'info') {
        const toastEl = document.getElementById('toast-container');
        document.getElementById('toast-msg').textContent = msg;
        toastEl.classList.remove('translate-x-full');
        setTimeout(() => toastEl.classList.add('translate-x-full'), 2800);
    }

    function openModal(title, msg, onConfirm) {
        const modal = document.getElementById('custom-modal');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = msg;
        document.getElementById('modal-confirm-btn').onclick = () => {
            if (onConfirm) onConfirm();
            modal.classList.add('hidden');
        };
        document.getElementById('modal-cancel-btn').onclick = () => modal.classList.add('hidden');
        modal.classList.remove('hidden');
    }

    function changeTab(tabId) {
        state.currentTab = tabId;
        document.querySelectorAll('.tab-page').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('header nav button').forEach(el => {
            el.classList.remove('border-[#D4AF37]', 'text-white', 'bg-white/5');
            el.classList.add('border-transparent', 'text-stone-300');
        });
        const activeTabBtn = document.getElementById(`tab-${tabId}`);
        if (activeTabBtn) {
            activeTabBtn.classList.remove('border-transparent', 'text-stone-300');
            activeTabBtn.classList.add('border-[#D4AF37]', 'text-white', 'bg-white/5');
        }
        const activePage = document.getElementById(`page-${tabId}`);
        if (activePage) activePage.classList.remove('hidden');
        if (tabId === 'grace') initGraceCanvas();
        applyStateToDOM();
    }

    function changeSheetSubTab(subTabId) {
        state.sheetSubTab = subTabId;
        document.querySelectorAll('.sub-tab-page').forEach(el => el.classList.add('hidden'));
        
        // 버튼 스타일 초기화 수정
        const subTabButtons = [
            document.getElementById('subtab-forms'),
            document.getElementById('subtab-sheets'),
            document.getElementById('subtab-integration')
        ];
        
        subTabButtons.forEach(btn => {
            if(btn) {
                btn.classList.remove('bg-white', 'shadow', 'text-slate-800');
                btn.classList.add('text-slate-500');
            }
        });

        const activeSubBtn = document.getElementById(`subtab-${subTabId}`);
        if (activeSubBtn) {
            activeSubBtn.classList.add('bg-white', 'shadow', 'text-slate-800');
            activeSubBtn.classList.remove('text-slate-500');
        }

        const activeSubPage = document.getElementById(`sheet-subpage-${subTabId}`);
        if (activeSubPage) activeSubPage.classList.remove('hidden');
        
        applyStateToDOM();
    }

    function handleSelectLogin(userId) {
        const found = state.members.find(m => m.id === userId);
        if (found) {
            state.currentUser = found;
            localStorage.setItem('chunsan_active_userid', userId);
            showToast(`${found.name} 성도님 환영합니다.`, "success");
            applyStateToDOM();
        }
    }

    function adjustSelectedDay(amount) {
        let day = state.selectedDay + amount;
        if (day < 1) day = 1;
        if (day > 150) day = 150;
        state.selectedDay = day;
        applyStateToDOM();
    }

    async function toggleTodayStamp() {
        if (!state.currentUser) { showToast("이름을 로그인 한 뒤 눌러주세요.", "warning"); return; }
        const memberId = state.currentUser.id;
        const currentProgress = state.progress[memberId] || { completedDays: [], notes: {} };
        let updatedCompletedDays = [...currentProgress.completedDays].map(Number);
        const targetDay = Number(state.selectedDay);
        const index = updatedCompletedDays.indexOf(targetDay);
        
        let isNowCompleted = false;
        if (index > -1) {
            updatedCompletedDays.splice(index, 1);
        } else {
            updatedCompletedDays.push(targetDay);
            isNowCompleted = true;
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
        }

        const updatedUserProgress = { ...currentProgress, completedDays: updatedCompletedDays.sort((a,b) => a-b) };
        state.progress[memberId] = updatedUserProgress;
        lsSet('chunsan_progress', state.progress);

        syncProgress(memberId, updatedUserProgress);

        sendToGoogleSheets({
            action: 'progress', memberName: state.currentUser.name, group: state.currentUser.group, completedDays: updatedCompletedDays
        });

        if (isNowCompleted && updatedCompletedDays.length === 150) triggerCampaignCompletion(state.currentUser.name);

        if (isNowCompleted) showToast(`${getBibleSchedule()[state.selectedDay-1].range} 완독! 🕊️`, "success");
        else showToast("완독 취소 처리되었습니다.", "info");

        applyStateToDOM();
    }

    function triggerCampaignCompletion(memberName) {
        const currentRounds = state.juju[memberName] || 0;
        const nextRounds = currentRounds + 1;
        state.juju[memberName] = nextRounds;
        lsSet('chunsan_juju', state.juju);
        if (state.isSupabaseActive) supabaseFetch('chunsan_juju', 'POST', { name: memberName, count: nextRounds, updated_at: new Date().toISOString() });
        openModal('🎉 대완주 축하 🎉', `할렐루야! ${memberName} 성도님 ${nextRounds}독 달성!`, null);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }

    async function submitTodayGrace() {
        if (!state.currentUser) return showToast("로그인이 필요합니다.", "warning");
        const text = document.getElementById('today-grace-input').value.trim();
        if (!text) return showToast("내용을 입력해주세요.", "warning");

        const memberId = state.currentUser.id;
        const currentProgress = state.progress[memberId] || { completedDays: [], notes: {} };
        const updatedProgress = { ...currentProgress, notes: { ...currentProgress.notes, [state.selectedDay]: text } };
        state.progress[memberId] = updatedProgress;
        lsSet('chunsan_progress', state.progress);
        syncProgress(memberId, updatedProgress);

        const newPost = {
            id: `tr_auto_${Date.now()}`, memberId: memberId, memberName: state.currentUser.name,
            week: Math.ceil(state.selectedDay / 6), verse: `${getBibleSchedule()[state.selectedDay-1].range} 묵상`,
            content: text, imageUrl: '', createdAt: new Date().toISOString(), likes: []
        };
        state.transcriptions.unshift(newPost);
        lsSet('chunsan_transcriptions', state.transcriptions);

        if (state.isSupabaseActive) {
            await supabaseFetch('chunsan_transcriptions', 'POST', {
                id: newPost.id, member_id: newPost.memberId, member_name: newPost.memberName,
                week: newPost.week, verse: newPost.verse, content: newPost.content, image_url: '', likes: []
            });
        }
        sendToGoogleSheets({ action: 'transcription', memberName: state.currentUser.name, group: state.currentUser.group, verse: newPost.verse, content: newPost.content, imageUrl: '' });

        document.getElementById('today-grace-input').value = '';
        showToast("묵상이 등록되었습니다!", "success");
        applyStateToDOM();
    }

    // 캔버스 로직
    let canvas, ctx, isDrawing = false, penColor = '#222522';
    function initGraceCanvas() {
        canvas = document.getElementById('grace-drawing-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = penColor; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        canvas.onmousedown = (e) => startDraw(e.clientX, e.clientY);
        canvas.onmousemove = (e) => drawLine(e.clientX, e.clientY);
        canvas.onmouseup = stopDraw; canvas.onmouseleave = stopDraw;
        canvas.ontouchstart = (e) => { if (e.touches.length > 0) startDraw(e.touches[0].clientX, e.touches[0].clientY); };
        canvas.ontouchmove = (e) => { if (e.touches.length > 0) drawLine(e.touches[0].clientX, e.touches[0].clientY); };
        canvas.ontouchend = stopDraw;
    }
    function startDraw(clientX, clientY) { const rect = canvas.getBoundingClientRect(); ctx.beginPath(); ctx.moveTo(clientX - rect.left, clientY - rect.top); isDrawing = true; }
    function drawLine(clientX, clientY) { if (!isDrawing) return; const rect = canvas.getBoundingClientRect(); ctx.lineTo(clientX - rect.left, clientY - rect.top); ctx.stroke(); }
    function stopDraw() { isDrawing = false; }
    function setGracePenColor(color) { penColor = color; if (ctx) ctx.strokeStyle = color; }
    function resetGraceCanvas() { if (canvas) ctx.clearRect(0, 0, canvas.width, canvas.height); state.uploadedImageBase64 = ''; document.getElementById('canvas-image-preview-layer').classList.add('hidden'); }
    function clearGraceImage() { state.uploadedImageBase64 = ''; document.getElementById('canvas-image-preview-layer').classList.add('hidden'); }

    function handleGraceFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const tempCanvas = document.createElement('canvas');
                const scale = 400 / img.width;
                tempCanvas.width = 400; tempCanvas.height = img.height * scale;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
                const base64 = tempCanvas.toDataURL('image/jpeg', 0.85);
                state.uploadedImageBase64 = base64;
                document.getElementById('uploaded-image-preview').src = base64;
                document.getElementById('canvas-image-preview-layer').classList.remove('hidden');
                showToast("사진 스캔 완료!", "success");
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async function submitGraceTranscription() {
        if (!state.currentUser) return showToast("성도 선택 로그인이 선행되어야 합니다.", "warning");
        const verse = document.getElementById('grace-verse-select').value;
        if (!verse) return showToast("범위를 선택해주세요.", "warning");
        const text = document.getElementById('grace-text-content').value.trim();
        if (!text && !state.uploadedImageBase64) return showToast("소감을 작성하거나 사진을 등록하세요.", "warning");

        let finalImageUrl = '';
        if (state.isSupabaseActive && (state.uploadedImageBase64 || canvas)) {
            let srcData = state.uploadedImageBase64;
            if (!srcData && canvas) srcData = canvas.toDataURL('image/jpeg', 0.85);
            if (srcData) finalImageUrl = await supabaseUploadStorage('chunsan-photos', `public/grace_${state.currentUser.id}_${Date.now()}.jpg`, srcData) || '';
        } else {
            finalImageUrl = state.uploadedImageBase64 || (canvas ? canvas.toDataURL('image/jpeg', 0.8) : '');
        }

        const newPost = {
            id: `tr_${Date.now()}`, memberId: state.currentUser.id, memberName: state.currentUser.name,
            week: Math.ceil(state.selectedDay / 6), verse: verse, content: text,
            imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
            createdAt: new Date().toISOString(), likes: []
        };
        state.transcriptions.unshift(newPost);
        lsSet('chunsan_transcriptions', state.transcriptions);

        if (state.isSupabaseActive) {
            await supabaseFetch('chunsan_transcriptions', 'POST', {
                id: newPost.id, member_id: newPost.memberId, member_name: newPost.memberName,
                week: newPost.week, verse: newPost.verse, content: newPost.content, image_url: newPost.imageUrl, likes: []
            });
        }
        sendToGoogleSheets({ action: 'transcription', memberName: state.currentUser.name, group: state.currentUser.group, verse: newPost.verse, content: newPost.content, imageUrl: newPost.imageUrl });

        document.getElementById('grace-text-content').value = ''; resetGraceCanvas();
        showToast("필사가 업로드되었습니다!", "success");
        applyStateToDOM();
    }

    // 명예의전당
    window.filterJujuDok = function(dok) {
        state.selectedDokTab = dok;
        applyStateToDOM();
    }
    
    window.renderJujuPage = function() {
        applyStateToDOM();
    }
    function setJujuListViewMode(mode) {
        state.jujuListView = mode;
        const actBtn = document.getElementById('juju-view-active'); const allBtn = document.getElementById('juju-view-all');
        if (mode === 'active') { actBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3D4F41] text-white"; allBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-600"; }
        else { actBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 text-stone-600"; allBtn.className = "px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3D4F41] text-white"; }
        applyStateToDOM();
    }

    // 관리자 콘솔 연동 정보
    function authenticateAdmin() {
        const val = document.getElementById('admin-pass-input').value;
        if (val === '6603') {
            state.isAdminAuthenticated = true;
            document.getElementById('admin-login-panel').classList.add('hidden');
            document.getElementById('admin-console-panel').classList.remove('hidden');
            document.getElementById('admin-pass-input').value = '';
            
            document.getElementById('set-sb-url').value = state.supabaseUrl || '';
            document.getElementById('set-sb-key').value = state.supabaseAnonKey || '';
            document.getElementById('set-g-url').value = state.googleWebAppUrl || '';
            showToast("콘솔 인증 완료!", "success");
            applyStateToDOM();
        } else showToast("비번 오류", "warning");
    }

    function adminLogout() {
        state.isAdminAuthenticated = false;
        document.getElementById('admin-login-panel').classList.remove('hidden');
        document.getElementById('admin-console-panel').classList.add('hidden');
    }

    function saveCloudSettings() {
        const url = document.getElementById('set-sb-url').value.trim();
        const key = document.getElementById('set-sb-key').value.trim();
        const gUrl = document.getElementById('set-g-url').value.trim();
        state.supabaseUrl = url; state.supabaseAnonKey = key; state.googleWebAppUrl = gUrl;
        localStorage.setItem('chunsan_supabase_url', url);
        localStorage.setItem('chunsan_supabase_key', key);
        localStorage.setItem('chunsan_google_web_app_url', gUrl);
        showToast("연동 정보 저장 완료.", "success");
    }

    // 벌크 멤버 추가 (Supabase 직접 삽입)
    async function submitBulkMembers() {
        const namesText = document.getElementById('admin-names').value.trim();
        const group = document.getElementById('admin-group').value.trim() || '미지정 조';
        if (!namesText) return showToast("이름을 입력해주세요.", "warning");

        const newNames = namesText.split('\n').map(n => n.trim()).filter(n => n !== '');
        if (newNames.length === 0) return;

        const newMembersToAdd = [];
        newNames.forEach(name => {
            const newId = 'u_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const newMember = { id: newId, name: name, group: group, avatar: '👤' };
            state.members.push(newMember);
            newMembersToAdd.push(newMember);
        });

        lsSet('chunsan_members', state.members);

        if (state.isSupabaseActive) {
             const client = getSupabaseClient();
             for (let member of newMembersToAdd) await client.from('chunsan_members').insert([member]);
        }
        
        document.getElementById('admin-names').value = '';
        document.getElementById('admin-group').value = '';
        showToast(`${newNames.length}명의 성도가 추가되었습니다.`, "success");
        applyStateToDOM();
    }

    function saveCampaignStartDate(val) {
        if (!val) return;
        state.campaignStartDate = val;
        localStorage.setItem('bible_campaign_start_date', val);
        showToast("시작일 변경 완료", "success");
        applyStateToDOM();
    }

    // 명단 삭제 연동
    function toggleAllAdminCheckboxes(isChecked) {
        if (isChecked) state.selectedMemberIds = state.members.map(m => m.id);
        else state.selectedMemberIds = [];
        applyStateToDOM();
    }
    function handleToggleAdminCheckbox(memberId, isChecked) {
        if (isChecked) state.selectedMemberIds.push(memberId);
        else state.selectedMemberIds = state.selectedMemberIds.filter(id => id !== memberId);
        applyStateToDOM();
    }

    async function executeBulkDelete() {
        if (state.selectedMemberIds.length === 0) return;
        openModal('삭제 확인', `선택한 ${state.selectedMemberIds.length}명을 삭제하시겠습니까?`, async () => {
            const updated = state.members.filter(item => !state.selectedMemberIds.includes(item.id));
            state.members = updated;
            lsSet('chunsan_members', updated);

            if (state.isSupabaseActive) {
                const client = getSupabaseClient();
                for (let id of state.selectedMemberIds) {
                    await client.from('chunsan_members').delete().eq('id', id);
                }
            }

            state.selectedMemberIds = [];
            showToast("선택된 인원이 영구 삭제되었습니다.", "success");
            applyStateToDOM();
        });
    }

    async function excludeSingleMember(memberId, memberName) {
        openModal('명단 제외', `${memberName} 성도를 제외하시겠습니까?`, async () => {
            const updated = state.members.filter(item => item.id !== memberId);
            state.members = updated;
            lsSet('chunsan_members', updated);
            if (state.isSupabaseActive) {
                const client = getSupabaseClient();
                await client.from('chunsan_members').delete().eq('id', memberId);
            }
            showToast(`${memberName} 제외 완료`, "info");
            applyStateToDOM();
        });
    }

    // DOM 렌더링 엔진
    function getFilteredMembers() {
        const q = document.getElementById('dashboard-search')?.value.trim() || '';
        const f = document.getElementById('dashboard-filter-group')?.value || 'all';
        return state.members.filter(m => {
            const matchesQuery = m.name.includes(q) || m.group.includes(q);
            const matchesGroup = f === 'all' || m.group === f;
            return matchesQuery && matchesGroup;
        });
    }

    function getDailyAnalytics() {
        const pool = getFilteredMembers();
        const completed = [];
        const uncompleted = [];
        pool.forEach(m => {
            const completedDays = (state.progress[m.id]?.completedDays || []).map(Number);
            if (completedDays.includes(Number(state.selectedDay))) completed.push(m);
            else uncompleted.push(m);
        });
        return { completed, uncompleted, rate: pool.length > 0 ? Math.round((completed.length / pool.length) * 100) : 0 };
    }

    function applyStateToDOM() {
        const schedule = getBibleSchedule();
        const activeDayInfo = schedule[state.selectedDay - 1] || schedule[0];
        const dailyAnal = getDailyAnalytics();

        // 1. 통계판 갱신
        document.getElementById('stat-members-count').textContent = `${state.members.length}명`;
        document.getElementById('stat-today-done').textContent = `${dailyAnal.completed.length}명`;
        document.getElementById('stat-today-rate').textContent = `${dailyAnal.rate}%`;
        document.getElementById('stat-juju-count').textContent = `${Object.keys(state.juju).length}명`;

        // 2. 헤더 성도 이름 바인딩
        const loginSelect = document.getElementById('user-login-select');
        loginSelect.innerHTML = '<option value="" disabled>성도명을 검색해 선택해주세요</option>';
        state.members.forEach(m => {
            const opt = document.createElement('option'); opt.value = m.id; opt.textContent = `${m.name} (${m.group})`;
            loginSelect.appendChild(opt);
        });
        if (state.currentUser) {
            loginSelect.value = state.currentUser.id;
            document.getElementById('header-user-display').textContent = `${state.currentUser.name} (${state.currentUser.group})`;
            document.getElementById('header-user-avatar').textContent = state.currentUser.avatar || '🕊️';
        }

        // 3. 오늘의 통독
        document.getElementById('today-day-badge').textContent = `Day ${state.selectedDay}`;
        document.getElementById('today-date-text').textContent = activeDayInfo.date;
        document.getElementById('today-bible-range').textContent = activeDayInfo.range;
        document.getElementById('stamp-date').textContent = activeDayInfo.date;

        if (state.currentUser) {
            document.getElementById('stamp-target-user').className = "text-xs text-stone-400 mt-1";
            document.getElementById('stamp-target-user').innerHTML = `인증 대상자: <span class="font-bold text-[#3D4F41]">${state.currentUser.name}</span>`;
            
            const isCompletedToday = (state.progress[state.currentUser.id]?.completedDays || []).map(Number).includes(Number(state.selectedDay));
            if (isCompletedToday) {
                document.getElementById('stamp-mark').classList.remove('hidden');
                document.getElementById('stamp-trigger-btn').className = "w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-extrabold text-sm bg-rose-600 shadow-inner";
                document.getElementById('stamp-btn-text').textContent = "취소하기";
            } else {
                document.getElementById('stamp-mark').classList.add('hidden');
                document.getElementById('stamp-trigger-btn').className = "w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-extrabold text-sm bg-[#3D4F41] shadow-lg hover:scale-105";
                document.getElementById('stamp-btn-text').textContent = "완독 확인";
            }
        }

        // 4. 캘린더 바인딩
        const calendarContainer = document.getElementById('calendar-grid-container');
        if (state.currentTab === 'calendar' && calendarContainer) {
            calendarContainer.innerHTML = '';
            for (let w = 1; w <= 25; w++) {
                const weekDays = schedule.filter(d => d.week === w);
                const isCurrentWeek = Math.ceil(state.selectedDay / 6) === w;
                const weekDiv = document.createElement('div');
                weekDiv.className = `border rounded-xl ${isCurrentWeek ? 'border-[#D4AF37] bg-amber-50/10 shadow-sm' : 'border-stone-200'}`;
                
                let dayCardsHTML = '';
                weekDays.forEach(day => {
                    const isCompleted = state.currentUser && (state.progress[state.currentUser.id]?.completedDays || []).map(Number).includes(Number(day.day));
                    const isSelected = state.selectedDay === day.day;
                    dayCardsHTML += `
                        <div onclick="setSelectedDayFromCalendar(${day.day})" class="p-3 rounded-lg border text-center cursor-pointer ${isSelected ? 'border-2 border-[#3D4F41] bg-[#3D4F41]/5' : isCompleted ? 'border-emerald-200 bg-emerald-50/50' : 'border-stone-100 bg-white hover:border-stone-300'}">
                            <div class="flex justify-between text-[10px] text-stone-400 mb-1"><span>Day ${day.day}</span><span class="font-bold text-stone-600">${day.date}</span></div>
                            <div class="text-xs font-bold text-stone-800 line-clamp-2 h-8 flex items-center justify-center">${day.range}</div>
                            <div class="mt-2 flex justify-center">${isCompleted ? '<span class="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">완독</span>' : '<span class="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-400 rounded-full">대기</span>'}</div>
                        </div>`;
                });
                weekDiv.innerHTML = `<div class="p-3 font-bold text-sm flex justify-between ${isCurrentWeek ? 'bg-[#D4AF37]/10' : 'bg-stone-50'}"><span class="flex space-x-2"><span class="px-2 bg-stone-200 rounded text-[10px]">W${w}</span><span>${w}주차 통독</span></span></div><div class="grid grid-cols-1 md:grid-cols-6 gap-2 p-3">${dayCardsHTML}</div>`;
                calendarContainer.appendChild(weekDiv);
            }
        }

        // 5. 명단 현황판
        const dashboardGrid = document.getElementById('dashboard-member-grid');
        if (state.currentTab === 'dashboard' && dashboardGrid) {
            dashboardGrid.innerHTML = '';
            getFilteredMembers().forEach(member => {
                const completed = (state.progress[member.id]?.completedDays || []).map(Number);
                const rate = Math.round((completed.length / 150) * 100);
                const readToday = completed.includes(Number(state.selectedDay));
                const rounds = state.juju[member.name] || 0;

                const card = document.createElement('div');
                card.className = `p-4 rounded-xl border ${readToday ? 'border-emerald-200 bg-emerald-50/20' : 'border-stone-200 bg-white'}`;
                card.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-2.5">
                            <div class="text-3xl p-1.5 bg-stone-100 rounded-full">${member.avatar || '👤'}</div>
                            <div>
                                <h4 class="font-bold text-stone-800 text-sm flex items-center">
                                    ${member.name}
                                    ${readToday ? '<span class="ml-1.5 text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1 py-0.5 rounded">오늘 완독</span>' : ''}
                                </h4>
                                <p class="text-[10px] text-stone-400 font-medium">${member.group}</p>
                                ${rounds > 0 ? `<span class="inline-block mt-1 text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-full">🎖️ ${rounds}독 달성자</span>` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs font-black text-[#3D4F41]">${completed.length} / 150일</div>
                            <span class="text-[10px] text-stone-400">(${rate}%)</span>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div class="bg-[#3D4F41] h-1.5 rounded-full" style="width: ${rate}%"></div>
                        </div>
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-stone-100 flex justify-between text-xs">
                        <button onclick="handleSelectLogin('${member.id}')" class="text-stone-500 font-bold text-[11px]">선택하여 인증하기</button>
                        <span class="text-[10px] text-stone-400">최종: ${completed.length > 0 ? 'Day ' + completed[completed.length-1] : '미시작'}</span>
                    </div>
                `;
                dashboardGrid.appendChild(card);
            });
        }

        // 6. 명단 관리 테이블
        const adminTableBody = document.getElementById('admin-member-table-body');
        if (state.currentTab === 'admin' && state.isAdminAuthenticated && adminTableBody) {
            adminTableBody.innerHTML = '';
            state.members.forEach(m => {
                const completed = state.progress[m.id]?.completedDays || [];
                const rate = Math.round((completed.length / 150) * 100);
                const isChecked = state.selectedMemberIds.includes(m.id);

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="p-3 text-center border-b"><input type="checkbox" onchange="handleToggleAdminCheckbox('${m.id}', this.checked)" ${isChecked ? 'checked' : ''} class="rounded text-[#3D4F41] focus:ring-[#3D4F41] cursor-pointer"></td>
                    <td class="p-3 font-bold text-stone-800">${m.name}</td>
                    <td class="p-3 text-stone-500">${m.group}</td>
                    <td class="p-3 font-bold">${completed.length} 일</td>
                    <td class="p-3"><div class="flex items-center space-x-2"><div class="w-16 bg-stone-200 rounded-full h-1.5"><div class="bg-emerald-600 h-1.5" style="width: ${rate}%"></div></div><span>${rate}%</span></div></td>
                    <td class="p-3"><button onclick="excludeSingleMember('${m.id}', '${m.name}')" class="text-rose-600 font-bold">제외</button></td>
                `;
                adminTableBody.appendChild(tr);
            });

            const bulkBtn = document.getElementById('admin-bulk-delete-btn');
            if (state.selectedMemberIds.length > 0) {
                bulkBtn.classList.remove('hidden');
                bulkBtn.querySelector('span').textContent = `선택 삭제 (${state.selectedMemberIds.length}명)`;
            } else bulkBtn.classList.add('hidden');
        }

        // 7. 설문 취합 (Forms) 탭 갱신
        const formsDaySelect = document.getElementById('forms-day-select');
        if (state.currentTab === 'admin' && state.sheetSubTab === 'forms' && formsDaySelect) {
            if (!state.formsSelectedDay) state.formsSelectedDay = state.selectedDay;
            if (formsDaySelect.options.length === 0) {
                schedule.slice(0, 150).forEach(day => {
                    const opt = document.createElement('option');
                    opt.value = day.day;
                    opt.textContent = `Day ${day.day} (${day.date})`;
                    formsDaySelect.appendChild(opt);
                });
            }
            formsDaySelect.value = state.formsSelectedDay;

            const targetDay = parseInt(state.formsSelectedDay, 10);
            const formsCompleted = [];
            const formsUncompleted = [];
            state.members.forEach(m => {
                const completedDays = state.progress[m.id]?.completedDays || [];
                if (completedDays.includes(targetDay)) formsCompleted.push(m);
                else formsUncompleted.push(m);
            });
            const formsRate = state.members.length > 0 ? Math.round((formsCompleted.length / state.members.length) * 100) : 0;

            document.getElementById('forms-radial-percent').textContent = `${formsRate}%`;
            document.getElementById('forms-radial-progress').setAttribute('stroke-dasharray', `${formsRate}, 100`);
            document.getElementById('forms-stat-done').textContent = `${formsCompleted.length}명`;
            document.getElementById('forms-stat-undone').textContent = `${formsUncompleted.length}명`;

            const undoneList = document.getElementById('forms-undone-list');
            if (undoneList) {
                undoneList.innerHTML = '';
                formsUncompleted.forEach(m => {
                    const div = document.createElement('div');
                    div.className = "flex items-center justify-between p-1.5 bg-rose-50 border border-rose-100 rounded-md";
                    div.innerHTML = `<span class="font-bold text-rose-800">${m.name}</span><span class="text-[9px] text-rose-500">${m.group}</span>`;
                    undoneList.appendChild(div);
                });
            }

            const doneList = document.getElementById('forms-done-list');
            if (doneList) {
                doneList.innerHTML = '';
                formsCompleted.forEach(m => {
                    const div = document.createElement('div');
                    div.className = "flex items-center justify-between p-1.5 bg-emerald-50 border border-emerald-100 rounded-md text-xs";
                    div.innerHTML = `<span class="font-bold text-emerald-800">${m.name}</span><span class="text-[9px] text-emerald-600">${m.group}</span>`;
                    doneList.appendChild(div);
                });
            }
        }


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
                    const allNames = new Set(state.members.map(m => m.name));
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
    }

    // --- 복원된 기능 모음 ---

    window.handleFormsDayChange = function(val) {
        state.formsSelectedDay = val;
        applyStateToDOM();
    };

    window.copyKakaoInciteText = function() {
        const targetDay = parseInt(state.formsSelectedDay || state.selectedDay, 10);
        const formsUncompleted = [];
        state.members.forEach(m => {
            const completedDays = state.progress[m.id]?.completedDays || [];
            if (!completedDays.includes(targetDay)) formsUncompleted.push(m);
        });

        const names = formsUncompleted.map(m => m.name).join(', ');
        const scheduleInfo = getBibleSchedule()[targetDay - 1];
        
        const msg = `[천산 성경통독반 권면 알림]\n샬롬! 오늘(Day ${targetDay}, ${scheduleInfo.date})의 통독 범위는 [${scheduleInfo.range}] 입니다.\n아직 완료하지 않으신 성도님들께서는 은혜의 자리로 나아와 말씀을 읽고 스탬프를 꾹 눌러주세요! 🕊️\n\n미완독 성도: ${names}\n\n주님의 은혜가 가득하시길 기도합니다! 🙏`;

        const textarea = document.createElement('textarea');
        textarea.value = msg;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast("카카오톡 독려 메시지가 클립보드에 복사되었습니다.", "success");
        } catch (e) {
            showToast("복사 실패. 수동으로 복사해주세요.", "error");
        }
        document.body.removeChild(textarea);
    };

    function triggerDashboardFilter() { applyStateToDOM(); }
    window.setSelectedDayFromCalendar = function(day) { state.selectedDay = day; changeTab('today'); }
    
    function renderMasterGrid() {
        const headerTr = document.getElementById('grid-header-tr');
        const bodyContainer = document.getElementById('grid-body-container');
        if (!headerTr || !bodyContainer || state.currentTab !== 'admin') return;

        const schedule = getBibleSchedule();
        let headerHTML = `
            <th class="p-2 border-b border-r bg-stone-50 text-stone-700 font-bold text-center w-24 sticky left-0 z-30">이름</th>
            <th class="p-2 border-b border-r bg-stone-50 text-stone-500 font-bold text-center w-24 sticky left-24 z-30">소속 조</th>
            <th class="p-2 border-b border-r bg-stone-50 text-stone-700 font-bold text-center w-20 sticky left-48 z-30">완독일수</th>
        `;
        schedule.slice(0, 150).forEach(day => {
            headerHTML += `
                <th class="p-2 border-b border-r text-center w-16 text-stone-500 font-bold">
                    Day ${day.day}
                    <span class="block text-[8px] text-stone-400 font-normal">${day.date}</span>
                </th>
            `;
        });
        headerTr.innerHTML = headerHTML;

        const q = document.getElementById('grid-search')?.value.trim() || '';
        const f = document.getElementById('grid-group-filter')?.value || 'all';
        const pool = state.members.filter(m => {
            const matchesQuery = m.name.includes(q) || m.group.includes(q);
            const matchesGroup = f === 'all' || m.group === f;
            return matchesQuery && matchesGroup;
        });

        bodyContainer.innerHTML = '';
        pool.forEach(member => {
            const completed = state.progress[member.id]?.completedDays || [];
            const tr = document.createElement('tr');
            tr.className = "hover:bg-stone-50/50";
            
            let rowHTML = `
                <td class="p-2 border-r text-center font-bold text-stone-800 bg-white sticky left-0 z-10 w-24">${member.name}</td>
                <td class="p-2 border-r text-center text-stone-500 bg-white sticky left-24 z-10 w-24 truncate">${member.group}</td>
                <td class="p-2 border-r text-center font-black text-slate-800 bg-white sticky left-48 z-10 w-20">${completed.length} 일</td>
            `;

            schedule.slice(0, 150).forEach(day => {
                const isDone = completed.includes(day.day);
                rowHTML += `
                    <td onclick="handleToggleReadByAdmin('${member.id}', ${day.day})" class="p-2 border-r border-b text-center cursor-pointer transition-colors w-16 select-none ${isDone ? 'bg-emerald-500/80 hover:bg-emerald-600/90 text-white font-bold' : 'bg-white hover:bg-stone-100 text-stone-300'}">
                        ${isDone ? '완독' : '-'}
                    </td>
                `;
            });

            tr.innerHTML = rowHTML;
            bodyContainer.appendChild(tr);
        });
    }

    function handleDownloadCsv() {
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        let header = ["이름", "소속 조", "완독일수"];
        for(let i=1; i<=150; i++) header.push(`Day ${i}`);
        csvContent += header.join(",") + "\n";

        state.members.forEach(m => {
            let row = [m.name, m.group, (state.progress[m.id]?.completedDays || []).length];
            const completed = state.progress[m.id]?.completedDays || [];
            for(let i=1; i<=150; i++) {
                row.push(completed.includes(i) ? "완독" : "");
            }
            csvContent += row.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `성경통독_마스터시트_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("CSV 다운로드 완료", "success");
    }

    function copyAppsScriptToClipboard() {
        const pre = document.getElementById('apps-script-preview-code');
        if(!pre) return;
        const range = document.createRange();
        range.selectNode(pre);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        try {
            document.execCommand('copy');
            showToast("Apps Script 코드가 복사되었습니다! 📋", "success");
        } catch (e) {
            showToast("복사 실패. 수동으로 복사해주세요.", "warning");
        }
        window.getSelection().removeAllRanges();
    }

    function downloadAppsScriptFile() {
        const pre = document.getElementById('apps-script-preview-code');
        const gasCode = pre ? pre.innerText : "";
        if(!gasCode) return;
        const blob = new Blob([gasCode], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "code.gs";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("code.gs 파일 다운로드 완료. 📄", "success");
    }

    async function handleModifyJujuCount(name, amount) {
        if(!state.isAdminAuthenticated) return showToast("관리자 인증이 필요합니다.", "warning");
        let current = state.juju[name] || 0;
        let next = current + amount;
        if(next < 0) next = 0;
        state.juju[name] = next;
        lsSet('chunsan_juju', state.juju);
        if (state.isSupabaseActive) {
            await supabaseFetch('chunsan_juju', 'POST', { name: name, count: next, updated_at: new Date().toISOString() });
        }
        applyStateToDOM();
    }

    async function handleToggleReadByAdmin(memberId, day) {
        if(!state.isAdminAuthenticated) {
            showToast("수동 제어는 관리자 인증 후 가능합니다.", "warning");
            return;
        }
        const currentProgress = state.progress[memberId] || { completedDays: [], notes: {} };
        let updatedDays = [...currentProgress.completedDays].map(Number);
        const targetDay = Number(day);
        const idx = updatedDays.indexOf(targetDay);
        if(idx > -1) updatedDays.splice(idx, 1);
        else updatedDays.push(targetDay);
        
        updatedDays.sort((a,b)=>a-b);
        state.progress[memberId] = { ...currentProgress, completedDays: updatedDays };
        lsSet('chunsan_progress', state.progress);
        syncProgress(memberId, state.progress[memberId]);
        applyStateToDOM();
    }

    window.onload = function() { initApp(); }