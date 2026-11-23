// ==========================================
// DADOS GERAIS
// ==========================================
const GRID_START_HOUR = 7;
const GRID_END_HOUR = 23;
const PIXELS_PER_HOUR = 60;
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

let subjectsData = defaultSubjectsData;

let appState = {
    profiles: [], 
    activeProfileId: null,
    darkMode: false,
    groupMode: false // Novo estado para modo grupo
};

let catalog = indexCatalog(subjectsData);

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadAppState();
    const semOferta = new Set(defaultSubjectsData.flatMap(sem =>
        sem.disciplinas.filter(d => d.semOferta).map(d => d.nome)
    ));
    for (const perfil of appState.profiles) {
        perfil.selected = isFixedSchedule(perfil)
            ? firstPeriodSubjects().map(subject => subject.nome)
            : perfil.selected.filter(nome => !semOferta.has(nome));
    }
    if (appState.profiles.length) saveAppState();

    // Sincroniza Checkboxes
    document.getElementById('dark-mode-toggle').checked = appState.darkMode;
    document.getElementById('group-mode-toggle').checked = appState.groupMode;
    if(appState.darkMode) document.body.classList.add('dark-mode');

    initCalendarGrid();
    renderTabs();

    if (appState.profiles.length === 0) {
        createNewProfile("Você");
    } else {
        renderSubjectsList();
        updateSchedule();
    }
});

// ==========================================
// GERENCIAMENTO DE PERFIS E ABAS
// ==========================================

function createNewProfile(name) {
    const newId = Date.now();
    const newProfile = {
        id: newId,
        name: name,
        history: { approved: [], failed: [] },
        selected: []
    };
    appState.profiles.push(newProfile);
    switchProfile(newId);
    openProfileModal(true); 
}

function switchProfile(profileId) {
    appState.activeProfileId = profileId;
    saveAppState();
    renderTabs();
    renderSubjectsList();
    updateSchedule();
}

function deleteProfile(profileId) {
    // Abre o Modal de Confirmação em vez do confirm() nativo
    openConfirmModal("Tem certeza que deseja remover este amigo?", () => {
        const indexToRemove = appState.profiles.findIndex(p => p.id === profileId);
        const isActive = (profileId === appState.activeProfileId);

        // Remove o perfil
        appState.profiles = appState.profiles.filter(p => p.id !== profileId);

        // Se não sobrou nenhum, cria um padrão
        if(appState.profiles.length === 0) {
            createNewProfile("Você");
        } else {
            // Se deletou o ativo, muda para o anterior (ou o primeiro)
            if(isActive) {
                const newIndex = Math.max(0, indexToRemove - 1);
                switchProfile(appState.profiles[newIndex].id);
            } else {
                // Se deletou outro, só atualiza as abas e salva
                saveAppState();
                renderTabs();
                // Se estiver no modo grupo, precisa redesenhar a grade pois um perfil sumiu
                if(appState.groupMode) updateSchedule();
            }
        }
    });
}

function renderTabs() {
    const container = document.getElementById('tabs-container');
    container.innerHTML = '';

    appState.profiles.forEach(profile => {
        // Estrutura mudada para div.tab-wrapper para evitar conflitos de clique
        const wrapper = document.createElement('div');
        wrapper.className = `tab-wrapper ${profile.id === appState.activeProfileId ? 'active' : ''}`;

        // Parte do Nome (Seleciona)
        const nameDiv = document.createElement('div');
        nameDiv.className = 'tab-name';
        nameDiv.textContent = `👤 ${profile.name}`;
        nameDiv.onclick = () => switchProfile(profile.id);
        wrapper.appendChild(nameDiv);

        // Parte do Fechar (Deleta)
        if (appState.profiles.length > 1) {
            const closeDiv = document.createElement('div');
            closeDiv.className = 'tab-close';
            closeDiv.textContent = '✕';
            closeDiv.onclick = (e) => {
                e.stopPropagation(); // Garante que não selecione a aba ao fechar
                deleteProfile(profile.id);
            };
            wrapper.appendChild(closeDiv);
        }

        container.appendChild(wrapper);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'add-tab-btn';
    addBtn.innerHTML = '➕ Amigo';
    addBtn.onclick = () => showAddFriendModal();
    container.appendChild(addBtn);
}

function getActiveProfile() {
    return appState.profiles.find(p => p.id === appState.activeProfileId) || appState.profiles[0];
}

// ==========================================
// SISTEMA DE CONFIRMAÇÃO (Novo Modal)
// ==========================================
let pendingConfirmAction = null;

function openConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirm-modal');
    const text = document.getElementById('confirm-text');
    const btnYes = document.getElementById('confirm-yes-btn');

    text.textContent = message;
    pendingConfirmAction = onConfirm;

    modal.classList.add('active');

    btnYes.onclick = () => {
        if(pendingConfirmAction) pendingConfirmAction();
        closeConfirmModal();
    };
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').classList.remove('active');
    pendingConfirmAction = null;
}

// ==========================================
// MODAIS E SETUP
// ==========================================

function showAddFriendModal() {
    const modal = document.getElementById('welcome-modal');
    modal.classList.add('active');
    document.getElementById('modal-step-0').style.display = 'block';
    document.getElementById('modal-step-1').style.display = 'none';
    document.getElementById('modal-step-2').style.display = 'none';
    setTimeout(() => document.getElementById('new-friend-name').focus(), 100);
}

function confirmFriendName() {
    const input = document.getElementById('new-friend-name');
    const name = input.value.trim();
    if(name) {
        input.value = '';
        createNewProfile(name);
    }
}

function openProfileModal(isNew = false) {
    const profile = getActiveProfile();
    document.getElementById('modal-user-name').textContent = profile.name;
    const modal = document.getElementById('welcome-modal');
    modal.classList.add('active');
    document.getElementById('modal-step-0').style.display = 'none';
    document.getElementById('modal-step-1').style.display = 'block';
    document.getElementById('modal-step-2').style.display = 'none';
}

function editCurrentProfile() { openProfileModal(); }
function closeProfileModal() { document.getElementById('welcome-modal').classList.remove('active'); }

function selectProfileType(type) {
    const profile = getActiveProfile();
    if (type === 'calouro') {
        profile.type = type;
        profile.history = { approved: [], failed: [] };
        profile.planPeriod = 1;
        profile.selected = firstPeriodSubjects().map(subject => subject.nome);
        saveAppState();
        renderSubjectsList();
        updateSchedule();
        closeProfileModal();
        alert(`Perfil de ${profile.name} configurado como Calouro!`);
    } else if (type === 'veterano') {
        document.getElementById('modal-step-1').style.display = 'none';
        document.getElementById('modal-step-2').style.display = 'block';
        renderHistoryPanel();
    }
}

function renderHistoryPanel() {
    const container = document.getElementById('history-container');
    container.innerHTML = '';
    const profile = getActiveProfile();
    const approvedSet = new Set(profile.history.approved);
    const failedSet = new Set(profile.history.failed);

    subjectsData.forEach(sem => {
        const groupTitle = document.createElement('h4');
        groupTitle.textContent = sem.semestre;
        groupTitle.style.marginTop = '15px';
        groupTitle.style.borderBottom = '1px solid var(--border-color)';
        container.appendChild(groupTitle);
        const grid = document.createElement('div');
        grid.className = 'history-grid';
        if(sem.disciplinas) {
            sem.disciplinas.forEach(subj => {
                const item = document.createElement('div');
                item.className = 'history-item';
                if (approvedSet.has(subj.id)) {
                    item.classList.add('status-approved');
                    item.innerHTML = `<span>${subj.nome}</span> <span class="status-icon">✅</span>`;
                } else if (failedSet.has(subj.id)) {
                    item.classList.add('status-failed');
                    item.innerHTML = `<span>${subj.nome}</span> <span class="status-icon">🔴</span>`;
                } else {
                    item.classList.add('status-none');
                    item.innerHTML = `<span>${subj.nome}</span> <span class="status-icon">⚪</span>`;
                }
                item.onclick = () => toggleHistoryStatus(subj.id, item, subj.nome, profile);
                grid.appendChild(item);
            });
        }
        container.appendChild(grid);
    });
}

function toggleHistoryStatus(id, element, name, profile) {
    const approvedSet = new Set(profile.history.approved);
    const failedSet = new Set(profile.history.failed);
    element.classList.remove('status-none', 'status-approved', 'status-failed');
    if (approvedSet.has(id)) {
        approvedSet.delete(id); failedSet.add(id);
        element.classList.add('status-failed');
        element.innerHTML = `<span>${name}</span> <span class="status-icon">🔴</span>`;
    } else if (failedSet.has(id)) {
        failedSet.delete(id);
        element.classList.add('status-none');
        element.innerHTML = `<span>${name}</span> <span class="status-icon">⚪</span>`;
    } else {
        approvedSet.add(id);
        element.classList.add('status-approved');
        element.innerHTML = `<span>${name}</span> <span class="status-icon">✅</span>`;
    }
    profile.history.approved = Array.from(approvedSet);
    profile.history.failed = Array.from(failedSet);
}

function finishVeteranSetup() {
    const profile = getActiveProfile();
    profile.type = 'veterano';
    if (profile.planPeriod === 1) delete profile.planPeriod;
    profile.selected = [];
    saveAppState();
    renderSubjectsList();
    updateSchedule();
    closeProfileModal();
}

// ==========================================
// SISTEMA (DARK MODE & PERSISTÊNCIA)
// ==========================================

function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    if(appState.darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
    saveAppState();
    updateSchedule(); // Recalcula cores dos blocos
}

function toggleGroupMode() {
    appState.groupMode = !appState.groupMode;
    saveAppState();
    updateSchedule(); // Re-renderiza a grade (com ou sem todos os amigos)
}

function saveAppState() {
    localStorage.setItem('gradeOrganizer_v2', JSON.stringify(appState));
}

function loadAppState() {
    const saved = localStorage.getItem('gradeOrganizer_v2');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState = parsed;
        } catch(e) { console.log("Erro ao carregar estado."); }
    }
}

function resetAllData() {
    openConfirmModal("ATENÇÃO: Isso apagará TODOS os perfis e dados salvos.", () => {
        localStorage.removeItem('gradeOrganizer_v2');
        location.reload();
    });
}

// ==========================================
// RENDERIZAÇÃO DA GRADE 
// ==========================================

const rowsByName = new Map();
function syncSelection(selected) {
    for (const [name, row] of rowsByName) {
        const checked = selected.has(name) && !row.classList.contains('locked');
        row.classList.toggle('selected', checked);
        row.querySelector('input').checked = checked;
    }
    for (const group of document.querySelectorAll('.semester-group')) {
        const badge = group.querySelector('.semester-count');
        const count = group.querySelectorAll('.selected').length;
        badge.hidden = !count;
        badge.textContent = count;
    }
}

function isFixedSchedule(profile) {
    return profile?.type === 'calouro' || profile?.planPeriod === 1;
}

function firstPeriodSubjects() {
    return [...catalog.byId.values()].filter(subject =>
        catalog.period.get(subject.id) === 1 && !subject.optativa && !subject.semOferta);
}

function formatWeeklyHours(minutes) {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    if (!hours) return remaining ? remaining + ' min' : '0 h';
    return hours + ' h' + (remaining ? ' ' + remaining + ' min' : '');
}

function renderSubjectsList() {
    rowsByName.clear();
    const container = document.getElementById('subjects-list');
    container.innerHTML = '';

    // Sempre mostra a lista do perfil ATIVO para controle
    const profile = getActiveProfile();
    const fixed = isFixedSchedule(profile);
    document.getElementById('suggest').disabled = fixed;
    document.getElementById('file-import-control').hidden = fixed;
    document.getElementById('paste-import-control').hidden = fixed;
    if (fixed) document.getElementById('paste-area-container').style.display = 'none';
    document.getElementById('fixed-schedule-notice').hidden = !fixed;
    const approvedSet = new Set(profile.history.approved);
    const failedSet = new Set(profile.history.failed);
    const selectedSet = new Set(profile.selected);

    subjectsData.forEach(sem => {
        const visibleSubjects = sem.disciplinas ? sem.disciplinas.filter(subj => (fixed || !approvedSet.has(subj.id)) && !subj.semOferta) : [];

        const group = document.createElement('div');
        group.className = 'semester-group';

        const title = document.createElement('div');
        title.className = 'semester-title';
        let selectedCount = 0;
        visibleSubjects.forEach(d => {
            if (selectedSet.has(d.nome) && !optativeProfileRestriction(d, profile)) selectedCount++;
        });

        const countBadge = `<span class="semester-count" ${selectedCount ? "" : "hidden"} style="font-size:0.8em; background:var(--primary-color); color:white; padding:2px 8px; border-radius:12px;">${selectedCount}</span>`;
        title.innerHTML = `<span>${sem.semestre}</span> ${countBadge}`;
        title.onclick = () => {
            const content = group.querySelector('.semester-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        };
        group.appendChild(title);

        const content = document.createElement('div');
        content.className = 'semester-content';

        if (visibleSubjects.length > 0) {
            visibleSubjects.forEach(subj => {
                const item = document.createElement('div');
                item.className = 'subject-item';
                rowsByName.set(subj.nome, item); 

                const lockTitle = fixed ? 'Grade fixa do 1º período' : groupRestriction(subj, profile, approvedSet);
                const optativeRestriction = optativeProfileRestriction(subj, profile);
                const isLocked = Boolean(lockTitle);
                if (isLocked) {
                    item.classList.add('locked');
                    item.title = lockTitle;
                }
                if (selectedSet.has(subj.nome) && (fixed || !isLocked)) item.classList.add('selected');
                if (!isLocked && failedSet.has(subj.id)) item.classList.add('reprovado-flag');

                const reqIcon = isLocked ? `<span class="locked-badge">🔒</span>` : '';
                const alertIcon = failedSet.has(subj.id) ? `<span class="alert-badge">REFAZER!</span>` : '';
                const civilBadge = subj.civilNight ? `<span class="civil-badge" title="Esta matéria também é oferecida à noite no curso de Engenharia Civil. Em caso de choque de horário aqui, verifique a possibilidade de cursá-la por lá.">🌙 Também na Eng. Civil (noite)</span>` : '';
                let coreqBadge = '';
                if (subj.correquisitos && subj.correquisitos.length > 0 && !isLocked) {
                    const coreqNames = subj.correquisitos.map(cid => catalog.byId.get(cid)?.nome || cid).join(', ');
                    coreqBadge = `<span class="coreq-badge" title="Selecionar esta matéria seleciona automaticamente: ${coreqNames}">🔗 Correquisito</span>`;
                }

                const optativeDetails = subj.optativa
                    ? ['Optativa', subj.ofertaSujeitaAAlteracao ? 'Oferta sujeita a alteração' : '', optativeRestriction]
                        .filter(Boolean).join(' · ')
                    : '';

                item.innerHTML = `
                    <div class="checkbox-wrapper">
                        <input type="checkbox" ${selectedSet.has(subj.nome) && !optativeRestriction ? 'checked' : ''} ${isLocked ? 'disabled' : ''}>
                    </div>
                    <div>
                        <div class="subject-name">${reqIcon}${subj.nome}${alertIcon}</div>
                        <div class="subject-details">${subj.professor}${optativeDetails ? ' · ' + optativeDetails : ''}${civilBadge}${coreqBadge}</div>
                    </div>
                `;

                item.querySelector('input').setAttribute('aria-label', subj.nome);
                if (!isLocked) {
                    item.onclick = (e) => toggleSubject(subj);
                    item.querySelector('input').onclick = (e) => {
                        e.stopPropagation();
                        if (toggleSubject(subj) === false) e.preventDefault();
                    };
                } else { item.style.cursor = 'not-allowed'; }

                content.appendChild(item);
            });
        } else {
            const empty = document.createElement('div');
            empty.style.padding = "10px";
            empty.style.color = "var(--text-secondary)";
            empty.style.fontStyle = "italic";
            empty.textContent = "Semestre concluído! 🎉";
            content.appendChild(empty);
        }
        group.appendChild(content);
        container.appendChild(group);
    });
}

function optativeProfileRestriction(subject, profile) {
    if (!subject.optativa || profile.type === 'veterano') return '';
    return profile.type === 'calouro'
        ? 'Disponível a partir do 2º período'
        : 'Escolha Calouro ou Veterano em Editar Perfil Atual';
}

function toggleSubject(subject) {
    const profile = getActiveProfile();
    if (isFixedSchedule(profile)) return false;
    const approvedSet = new Set(profile.history.approved);
    const selectedSet = new Set(profile.selected);
    const group = getCorequisiteGroup(subject);
    const turningOn = !selectedSet.has(subject.nome);

    if (turningOn) {
        if (groupRestriction(subject, profile, approvedSet)) return false;
        for (const member of group) {
            if (!approvedSet.has(member.id)) selectedSet.add(member.nome);
        }
    } else {
        for (const member of group) selectedSet.delete(member.nome);
    }

    profile.selected = Array.from(selectedSet);
    saveAppState();
    syncSelection(selectedSet);
    updateSchedule(); 
}

// ==========================================
// LÓGICA DE GRADE E CONFLITOS (MODO GRUPO)
// ==========================================
function updateSchedule() {
    document.querySelectorAll('.event-block').forEach(el => el.remove());
    document.querySelectorAll('.subject-item.conflict').forEach(el => el.classList.remove('conflict'));

    const dayEvents = { Seg:[], Ter:[], Qua:[], Qui:[], Sex:[], Sáb:[] };
    let weeklyMinutes = 0;
    const activeProfile = getActiveProfile();
    const startOfDayMin = GRID_START_HOUR * 60;
    const conflictDetails = new Set();
    const globalConflicts = new Set(); // Conflitos do usuário ativo (para pintar lista lateral)

    // Definição de Perfis a Renderizar
    let profilesToRender = [];
    if (appState.groupMode) {
        profilesToRender = appState.profiles; // Todos
    } else {
        profilesToRender = [activeProfile]; // Só o ativo
    }

    // Coleta dados de todos os perfis relevantes
    profilesToRender.forEach((profile, profileIndex) => {
        const fixed = isFixedSchedule(profile);
        const approvedSet = new Set(fixed ? [] : profile.history.approved);
        const isOwnerActive = profile === activeProfile;
        // Cor fixa baseada no índice do perfil para diferenciar no modo grupo
        const userColor = getUserColor(profileIndex); 

        const selected = fixed ? firstPeriodSubjects().map(subject => subject.nome) : profile.selected;
        selected.forEach(name => {
                const subj = catalog.byName.get(name);
                if (!subj || subj.semOferta || approvedSet.has(subj.id) || optativeProfileRestriction(subj, profile)) return;
                const eventColor = appState.groupMode ? userColor : stringToColor(subj.nome);
                for (const meeting of getMeetings(subj)) {
                    if (isOwnerActive) weeklyMinutes += meeting.end - meeting.start;
                    dayEvents[meeting.dia].push({
                        subj,
                        start: meeting.start,
                        end: meeting.end,
                        top: (meeting.start - startOfDayMin) * PIXELS_PER_MINUTE + 40,
                        height: (meeting.end - meeting.start) * PIXELS_PER_MINUTE,
                        timeStr: meeting.timeStr,
                        ownerName: profile.name, ownerId: profile.id,
                        color: eventColor,
                        isOwnerActive
                    });
                }
        });
    });

    // Detectar Conflitos (Agora considera eventos de TODOS no modo grupo)
    Object.keys(dayEvents).forEach(dia => {
        const events = dayEvents[dia];
        for (let i = 0; i < events.length; i++) {
            for (let j = i + 1; j < events.length; j++) {
                const A = events[i];
                const B = events[j];

                // Sobreposição de horários
                if (intervalsOverlap(A, B)) {
                    // Se for o MESMO dono = Conflito real (Erro)
                    if(A.ownerId === B.ownerId) {
                        if (A.isOwnerActive) conflictDetails.add(dia + " · " + A.subj.nome + " (" + A.timeStr + ") e " + B.subj.nome + " (" + B.timeStr + ")");
                        A.isConflict = true;
                        B.isConflict = true;
                        if(A.isOwnerActive) globalConflicts.add(A.subj.nome);
                        if(B.isOwnerActive) globalConflicts.add(B.subj.nome);
                    } 
                    // Se donos diferentes = Apenas sobreposição visual (Encontro)
                    else {
                        A.isOverlap = true;
                        B.isOverlap = true;
                    }
                }
            }
        }
    });

    // Renderizar
    Object.keys(dayEvents).forEach(dia => {
        const col = document.getElementById(`col-${dia}`);
        if(!col) return;

        dayEvents[dia].forEach(ev => {
            const block = document.createElement('div');
            block.className = 'event-block';
            if (ev.isConflict) block.classList.add('conflict');

            block.style.top = `${ev.top}px`;
            block.style.height = `${ev.height}px`;

            // Estilização baseada no dono
            if (!ev.isConflict) {
                block.style.backgroundColor = ev.color.bg;
                block.style.borderLeftColor = ev.color.border;
                block.style.color = ev.color.text;

                // No modo grupo, adiciona transparência se houver sobreposição
                if(appState.groupMode) {
                    block.style.opacity = "0.85";
                    // Se for sobreposição, ajusta largura pra ver ambos
                    if(ev.isOverlap) {
                        block.style.width = "70%";
                        block.style.zIndex = "10";
                        block.style.left = (ev.ownerName.length % 2 === 0) ? "5px" : "25%"; // hack simples de visualização
                    }
                }
            }

            const salaDoDia = ev.subj.salasPorDia?.[dia] || ev.subj.sala;
            const sala = salaDoDia && salaDoDia !== 'N/A' ? salaDoDia : null;

            // Mostra nome do dono se estiver em modo grupo
            const ownerBadge = appState.groupMode ? `<div class="event-owner">${ev.ownerName}</div>` : '';

            block.innerHTML = `
                ${ownerBadge}
                <div class="event-title">${ev.subj.nome}</div>
                <div class="event-info">${ev.timeStr}</div>
                ${sala ? `<div class="event-room">📍 ${sala}</div>` : ''}
            `;
            col.appendChild(block);
        });
    });

    const weeklyHours = document.getElementById('weekly-hours');
    const weeklyLabel = (appState.groupMode ? activeProfile.name + ' · ' : '') + formatWeeklyHours(weeklyMinutes) + ' por semana';
    if (weeklyHours.textContent !== weeklyLabel) weeklyHours.textContent = weeklyLabel;

    const alertBox = document.getElementById('conflict-alert');
    alertBox.style.display = conflictDetails.size ? 'block' : 'none';
    alertBox.textContent = conflictDetails.size ? '⚠ Conflito de horário — ' + [...conflictDetails].join(' • ') : '';
    for (const name of globalConflicts) rowsByName.get(name)?.classList.add('conflict');
}

// ==========================================
// HELPERS E CORES
// ==========================================
function initCalendarGrid() {
    const timeCol = document.getElementById('time-labels');
    timeCol.innerHTML = '';
    for (let h = GRID_START_HOUR; h <= GRID_END_HOUR; h++) {
        const div = document.createElement('div');
        div.className = 'time-label';
        div.innerHTML = `<span>${h.toString().padStart(2, '0')}:00</span>`;
        timeCol.appendChild(div);
    }
    const daysGrid = document.getElementById('days-grid');
    daysGrid.innerHTML = '';
    ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(dayShort => {
        const col = document.createElement('div');
        col.className = 'day-column';
        col.id = `col-${dayShort}`;
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = dayShort;
        col.appendChild(header);
        for (let h = GRID_START_HOUR; h < GRID_END_HOUR; h++) {
            const line = document.createElement('div');
            line.className = 'grid-line';
            col.appendChild(line);
        }
        daysGrid.appendChild(col);
    });
}

// Gera cores distintas para cada usuário do grupo (MODO DARK/LIGHT)
function getUserColor(index) {
    // Paleta de Usuários (Azul, Verde, Roxo, Laranja, Rosa)
    const hues = [217, 142, 271, 28, 330];
    const h = hues[index % hues.length];

    if (appState.darkMode) {
         return { 
            bg: `hsla(${h}, 70%, 30%, 0.8)`, 
            border: `hsl(${h}, 70%, 60%)`, 
            text: `hsl(${h}, 90%, 95%)` 
        };
    } else {
         return { 
            bg: `hsla(${h}, 90%, 90%, 0.9)`, 
            border: `hsl(${h}, 70%, 45%)`, 
            text: `hsl(${h}, 90%, 20%)` 
        };
    }
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
    const h = Math.abs(hash) % 360;

    if (appState.darkMode) {
        // Modo Escuro: Cores mais escuras e saturadas para o fundo, texto claro
        return { 
            bg: `hsla(${h}, 60%, 25%, 0.8)`, 
            border: `hsl(${h}, 60%, 50%)`, 
            text: `hsl(${h}, 80%, 90%)` 
        };
    } else {
        // Modo Claro: Cores pastéis claras
        return { 
            bg: `hsla(${h}, 85%, 90%, 0.9)`, 
            border: `hsl(${h}, 70%, 40%)`, 
            text: `hsl(${h}, 80%, 25%)` 
        };
    }
}

function togglePasteArea() { const el = document.getElementById('paste-area-container'); el.style.display = el.style.display === 'block' ? 'none' : 'block'; }

function refreshSelectionsAfterImport() {
    getActiveProfile().selected = [];
    for (const profile of appState.profiles) {
        if (isFixedSchedule(profile)) profile.selected = firstPeriodSubjects().map(subject => subject.nome);
    }
}

function processPastedJSON() {
    if (isFixedSchedule(getActiveProfile())) return;
    const val = document.getElementById('paste-textarea').value;
    try {
        const parsed = JSON.parse(val);
        setCatalog(Array.isArray(parsed) ? parsed : [...subjectsData, parsed]);
        refreshSelectionsAfterImport();
        renderSubjectsList();
        updateSchedule();
        alert('Dados importados!'); togglePasteArea();
    } catch (e) { alert('Erro no JSON'); }
}

document.getElementById('jsonInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file || isFixedSchedule(getActiveProfile())) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        if (isFixedSchedule(getActiveProfile())) return;
        try {
            setCatalog(JSON.parse(e.target.result));
            refreshSelectionsAfterImport();
            renderSubjectsList();
            updateSchedule();
            alert('Arquivo carregado com sucesso!');
        } catch(err) { console.error(err); alert('Erro ao ler arquivo'); }
    };
    reader.readAsText(file);
});
