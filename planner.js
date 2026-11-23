const subjectCapsByWeeklyMinutes = new Map([[600, 4], [900, 6], [1200, 8]]);

function suggestSchedule(profile, target, limit) {
    if (target === 1) {
        const subjects = firstPeriodSubjects();
        const minutes = subjects.flatMap(getMeetings).reduce((sum, slot) => sum + slot.end - slot.start, 0);
        return { subjects, minutes };
    }
    const approved = new Set(profile.history.approved);
    const failed = new Set(profile.history.failed);
    const current = [], overdue = [], electives = [], future = [];
    const maxSubjects = subjectCapsByWeeklyMinutes.get(limit);
    for (const subject of catalog.byId.values()) {
        if (approved.has(subject.id)) continue;
        const period = catalog.period.get(subject.id);
        if (subject.optativa || !period) electives.push(subject);
        else if (period === target) current.push(subject);
        else if (period < target) overdue.push(subject);
        else future.push(subject);
    }
    for (const queue of [overdue, current]) {
        queue.sort((a, b) => Number(failed.has(b.id)) - Number(failed.has(a.id)) ||
            catalog.period.get(a.id) - catalog.period.get(b.id));
    }
    const priorities = [];
    for (let i = 0; i < Math.max(current.length, overdue.length); i++) {
        if (overdue[i]) priorities.push(overdue[i]);
        if (current[i]) priorities.push(current[i]);
    }
    const result = [], occupied = [], visited = new Set();
    let minutes = 0;
    for (const subject of [...priorities, ...electives, ...future]) {
        const group = getCorequisiteGroup(subject);
        if (visited.has(group)) continue;
        visited.add(group);
        const pending = group.filter(s => !approved.has(s.id));
        if (result.length + pending.length > maxSubjects || groupRestriction(subject, profile, approved)) continue;
        if (pending.some(s => !getMeetings(s).length)) continue;
        const slots = pending.flatMap(getMeetings);
        const duration = slots.reduce((sum, slot) => sum + slot.end - slot.start, 0);
        if (minutes + duration > limit) continue;
        const booked = [...occupied];
        let conflict = false;
        for (const slot of slots) {
            if (booked.some(other => slot.dia === other.dia && intervalsOverlap(slot, other))) {
                conflict = true;
                break;
            }
            booked.push(slot);
        }
        if (conflict) continue;
        result.push(...pending);
        occupied.push(...slots);
        minutes += duration;
    }
    return { subjects: result, minutes };
}

const planner = document.getElementById('planner');
const periodField = document.getElementById('period');
const loadField = document.getElementById('load');
const applyPlan = document.getElementById('apply-plan');
let proposal;

function refreshProposal() {
    const target = Number(periodField.value);
    const profile = getActiveProfile();
    loadField.disabled = target === 1;
    document.getElementById('planner-description').textContent = target === 1
        ? 'O 1º período tem grade fixa. Ao aplicar, as disciplinas ficam bloqueadas para edição. Você pode mudar de perfil em Editar Perfil Atual.'
        : 'A proposta usa seu histórico e os horários disponíveis. Ao aplicar, ela substitui a seleção deste perfil.';
    proposal = suggestSchedule(profile, target, Number(loadField.value));
    const { subjects, minutes } = proposal;
    const summary = document.getElementById('plan-summary');
    summary.textContent = subjects.length
        ? subjects.length + ' matéria(s) · ' + formatWeeklyHours(minutes) + ' de aula por semana'
        : 'Nenhuma combinação disponível para este histórico e esta carga.';
    applyPlan.disabled = !subjects.length;
    const list = document.getElementById('plan-list');
    list.replaceChildren();
    for (const subject of subjects) {
        const item = document.createElement('li');
        item.textContent = subject.nome;
        const info = document.createElement('small');
        const period = catalog.period.get(subject.id);
        const labels = [];
        if (period) labels.push(period + 'º período');
        if (subject.optativa) labels.push('Optativa');
        else if (!period) labels.push('Fora da sequência regular');
        else if (period < target) labels.push('Pendente');
        else if (period > target) labels.push('Adiantamento');
        if (subject.ofertaSujeitaAAlteracao) labels.push('Oferta sujeita a alteração');
        info.textContent = [...labels, ...getMeetings(subject).map(m => m.dia + ' ' + m.timeStr)].join(' · ');
        item.append(info);
        list.append(item);
    }
}

document.getElementById('suggest').onclick = () => {
    const profile = getActiveProfile();
    if (isFixedSchedule(profile)) return;
    const approved = new Set(profile.history.approved);
    const periods = [...new Set(catalog.period.values())].filter(Boolean).sort((a,b) => a-b);
    if (!periods.length) periods.push(1);
    const next = periods.find(p => p > 1 && [...catalog.byId.values()].some(s =>
        catalog.period.get(s.id) === p && !s.optativa && !s.semOferta && !approved.has(s.id)));
    periodField.replaceChildren(...periods.map(p => new Option(p + 'º período', p)));
    periodField.value = periods.includes(profile.planPeriod) ? profile.planPeriod : next || periods.at(-1);
    loadField.value = profile.planLimit || 900;
    refreshProposal();
    planner.showModal();
};
periodField.onchange = loadField.onchange = refreshProposal;
document.getElementById('cancel-plan').onclick = () => planner.close();
applyPlan.onclick = () => {
    const profile = getActiveProfile();
    if (isFixedSchedule(profile) || !proposal?.subjects.length) return;
    profile.planPeriod = Number(periodField.value);
    profile.planLimit = Number(loadField.value);
    profile.selected = proposal.subjects.map(s => s.nome);
    saveAppState();
    if (isFixedSchedule(profile)) renderSubjectsList();
    else syncSelection(new Set(profile.selected));
    updateSchedule();
    planner.close();
};
