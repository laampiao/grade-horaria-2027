function parseMeetings(subject) {
    const days = { Seg: 'Seg', Ter: 'Ter', Qua: 'Qua', Qui: 'Qui', Sex: 'Sex', Sab: 'Sáb', 'Sáb': 'Sáb' };
    const meetings = [];
    for (const entry of subject.horarios || []) {
        for (const part of entry.split('|')) {
            const [day, timeStr] = part.trim().split(/\s+/);
            const dia = days[day];
            if (!dia || !timeStr) continue;
            const [startTime, endTime] = timeStr.split('-');
            if (!startTime || !endTime) continue;
            const start = timeToMinutes(startTime);
            const end = timeToMinutes(endTime);
            if (end > start) meetings.push({ dia, timeStr, start, end });
        }
    }
    return meetings;
}

function intervalsOverlap(a, b) {
    return a.start < b.end && b.start < a.end;
}

function indexCatalog(semesters) {
    const byId = new Map(), byName = new Map(), period = new Map();
    const meetings = new Map(), neighbors = new Map(), groups = new Map();
    for (const semester of semesters) {
        for (const subject of semester.disciplinas || []) {
            if (!subject.nome || !subject.id || byId.has(subject.id) || byName.has(subject.nome)) {
                throw new Error('Cada disciplina precisa de nome e identificador únicos.');
            }
            byId.set(subject.id, subject);
            byName.set(subject.nome, subject);
            period.set(subject.id, parseInt(semester.semestre, 10) || 0);
            meetings.set(subject.id, parseMeetings(subject));
            neighbors.set(subject.id, new Set());
        }
    }
    for (const subject of byId.values()) {
        for (const id of subject.correquisitos || []) {
            if (!byId.has(id)) continue;
            neighbors.get(id).add(subject.id);
            neighbors.get(subject.id).add(id);
        }
    }
    for (const id of byId.keys()) {
        if (groups.has(id)) continue;
        const group = [], pending = [id];
        while (pending.length) {
            const next = pending.pop();
            if (groups.has(next)) continue;
            groups.set(next, group);
            group.push(byId.get(next));
            pending.push(...neighbors.get(next));
        }
    }
    return { byId, byName, period, groups, meetings };
}

function setCatalog(semesters) {
    const index = indexCatalog(semesters);
    subjectsData = semesters;
    catalog = index;
}

function getCorequisiteGroup(subject) { return catalog.groups.get(subject.id); }
function getMeetings(subject) { return catalog.meetings.get(subject.id); }

function groupRestriction(subject, profile, approved) {
    for (const member of getCorequisiteGroup(subject)) {
        if (approved.has(member.id)) continue;
        if (member.semOferta) return member.nome + ' está sem oferta.';
        const restriction = optativeProfileRestriction(member, profile);
        if (restriction) return restriction;
        const missing = (member.requisitos || []).filter(id => !approved.has(id));
        if (missing.length) {
            const names = missing.map(id => catalog.byId.get(id)?.nome || id);
            return member.nome + ' exige aprovação em ' + names.join(', ') + '.';
        }
        for (const id of member.correquisitos || []) {
            if (!approved.has(id) && !catalog.byId.has(id)) return 'Correquisito indisponível: ' + id;
        }
    }
    return '';
}
