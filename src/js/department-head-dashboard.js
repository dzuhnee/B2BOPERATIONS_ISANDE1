/**
 * Shared proposal-review controller used by the four department-head pages.
 *
 * Role-specific entry files call B2BDepartmentHead.initialize() with a fixed
 * department. This keeps each URL explicit while avoiding four copies of the
 * same proposal filtering, modal, and decision workflow.
 *
 * Optional persistence (used by Legal Head; other departments are unchanged):
 *   roleConfig.persistent = true   decisions require roleConfig.backend
 *   roleConfig.backend = {
 *     saveDecision(decision) -> Promise<{message?}>  write a decision
 *     describeError(error)   -> string               user-facing error text
 *     saveSettings(button)   -> Promise              persist the Settings section
 *     afterRender(section, pageContentElement)       e.g. restore saved settings
 *   }
 * The backend may be attached after initialize(); call the returned refresh()
 * when persisted data changes.
 */
window.B2BDepartmentHead = (() => {
    const VALID_DEPARTMENTS = ['Operations', 'Legal', 'Finance', 'Engineering'];
    const CHECKLIST_OPTIONS = ['Satisfied', 'Needs Clarification', 'Incomplete', 'Not Applicable'];
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));

    function initialize(roleConfig) {
        const data = window.departmentHeadData;
        const department = typeof roleConfig === 'string'
            ? roleConfig
            : roleConfig.department;

        if (!VALID_DEPARTMENTS.includes(department)) {
            throw new Error(`Unsupported department-head dashboard: ${department}`);
        }

        const user = typeof roleConfig === 'string'
            ? data.users[department]
            : roleConfig.user;
        const profile = typeof roleConfig === 'string'
            ? data.profiles[department]
            : roleConfig.profile;
        const roleRequirements = typeof roleConfig === 'string'
            ? data.requirements[department]
            : roleConfig.requirements;
        const bundledProposals = data.proposals.map(proposal => structuredClone(proposal));

        let activeSection = 'overview';
        let selectedProposal = null;
        let pendingDecision = null;
        let uploadedDocuments = new Map();

        data.proposals.forEach(proposal => {
            proposal.stage = proposal.stage.replace(/ Review$/, '');
        });

        setRoleIdentity();
        bindPageEvents();
        B2B.bindModal('proposalModal');
        B2B.bindModal('confirmModal');
        B2B.initShell({ onNavigate: renderSection });
        renderSection('overview');

        const controller = {
            /** Re-renders the current section, except Settings (it may hold unsaved input). */
            refresh() {
                if (activeSection !== 'settings') renderSection(activeSection);
            },
            /** Replaces bundled records with the latest Firestore applications. */
            setApplications(applications) {
                const byId = new Map(applications.map(application => [application.id, application]));
                const merged = bundledProposals.map(proposal => {
                    const application = byId.get(proposal.id);
                    if (!application) return proposal;
                    return {
                        ...proposal,
                        ...application,
                        strengths:application.departmentProposal?.strengths || proposal.strengths || application.strengths,
                        risks:application.departmentProposal?.risks || proposal.risks || application.risks,
                        recommendations:application.departmentProposal?.recommendations || proposal.recommendations || application.recommendations,
                        documents:application.departmentProposal?.documents || proposal.documents || application.documents,
                        history:application.departmentProposal?.history || proposal.history || application.history,
                        opening:application.openingDate || proposal.opening || application.opening
                    };
                });
                const knownIds = new Set(bundledProposals.map(proposal => proposal.id));
                applications.forEach(application => {
                    if (!knownIds.has(application.id)) merged.push(application);
                });
                data.proposals.splice(0, data.proposals.length, ...merged);
                this.refresh();
            }
        };
        window.departmentHeadController = controller;
        return controller;

        function setRoleIdentity() {
            document.title = `${department} Head Dashboard | Bee-to-Bee Operations`;
            document.body.dataset.department = department.toLowerCase();
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userInitials').textContent = user.initials;
            document.getElementById('userRole').textContent = `${department} Head`;
            document.getElementById('proposalCount').textContent = profile.metrics[0][3];
            document.getElementById('attentionCount').textContent = profile.metrics[4][3];
            document.getElementById('proposalNavLabel').textContent =
                department === 'Operations' ? 'Assigned Proposals' : 'Assigned Reviews';
        }

        function getStats() {
            return profile.metrics.map(([label, icon, tone, value, caption]) => ({
                label,
                icon,
                tone,
                value,
                caption
            }));
        }

        function renderStatCards() {
            return `
                <div class="stats-grid five">
                    ${getStats().map(stat => `
                        <article class="stat-card">
                            <div class="stat-icon ${stat.tone}">
                                <i data-lucide="${stat.icon}"></i>
                            </div>
                            <div>
                                <span>${stat.label}</span>
                                <strong>${stat.value}</strong>
                                <small>${stat.caption}</small>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;
        }

        function renderIntro() {
            return `
                <div class="welcome-row">
                    <div>
                        <p class="eyebrow">${profile.eyebrow}</p>
                        <h1>${profile.title}</h1>
                        <p>${profile.subtitle}</p>
                    </div>
                    <div class="date-control">
                        <i data-lucide="calendar-days"></i>
                        <span>July 21, 2026</span>
                    </div>
                </div>
            `;
        }

        function renderProposalTable() {
            const locations = [...new Set(data.proposals.map(proposal => proposal.location))];

            return `
                <section class="panel">
                    <div class="panel-heading">
                        <div>
                            <h2>${department === 'Operations'
                                ? 'Assigned Site Proposals'
                                : `Assigned ${department} Reviews`}</h2>
                            <p>Review viability, supporting evidence, and ${department.toLowerCase()} requirements</p>
                        </div>
                    </div>

                    <div class="filter-bar">
                        <div class="filter-control has-icon">
                            <i data-lucide="search"></i>
                            <input id="tableSearch" type="search"
                                aria-label="Search assigned proposals"
                                placeholder="Search ID, site, submitter...">
                        </div>
                        <div class="filter-control">
                            <select id="statusFilter" aria-label="Filter status">
                                <option value="">All statuses</option>
                                ${[
                                    'Pending Review',
                                    'Under Review',
                                    'Revision Requested',
                                    'Approved',
                                    'Rejected',
                                    'Overdue'
                                ].map(status => `<option>${status}</option>`).join('')}
                            </select>
                        </div>
                        <div class="filter-control">
                            <select id="locationFilter" aria-label="Filter location">
                                <option value="">All locations</option>
                                ${locations.map(location => `<option>${location}</option>`).join('')}
                            </select>
                        </div>
                        <div class="filter-control">
                            <select id="sortFilter" aria-label="Sort proposals">
                                <option value="submitted-desc">Newest submitted</option>
                                <option value="deadline-asc">Earliest deadline</option>
                            </select>
                        </div>
                    </div>

                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Proposal</th>
                                    <th>Location</th>
                                    <th>Submitted By</th>
                                    <th>Viability</th>
                                    <th>Department Status</th>
                                    <th>Submitted</th>
                                    <th>Deadline</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="proposalRows"></tbody>
                        </table>
                    </div>

                    <div class="empty-state" id="proposalEmpty">
                        <strong>No proposals match these filters</strong>
                        <p>Try changing the search or selected filters.</p>
                    </div>
                </section>
            `;
        }

        function renderProposalRows() {
            const body = document.getElementById('proposalRows');
            if (!body) return;

            const proposals = [...data.proposals];
            const sort = document.getElementById('sortFilter')?.value;

            if (sort === 'deadline-asc') {
                proposals.sort((a, b) => a.deadline.localeCompare(b.deadline));
            } else {
                proposals.sort((a, b) => b.submitted.localeCompare(a.submitted));
            }

            body.innerHTML = proposals.map(proposal => `
                <tr
                    data-id="${proposal.id}"
                    data-search="${proposal.id} ${proposal.site} ${proposal.location} ${proposal.submittedBy} ${proposal.status}"
                    data-status="${proposal.status}"
                    data-location="${proposal.location}"
                >
                    <td><strong>${proposal.site}</strong><span>${proposal.id}</span></td>
                    <td>${proposal.location}</td>
                    <td>${proposal.submittedBy}</td>
                    <td><strong>${proposal.score}%</strong><span>${proposal.classification}</span></td>
                    <td>${B2B.badge(proposal.status)}</td>
                    <td>${proposal.submitted}</td>
                    <td>${proposal.deadline}</td>
                    <td>
                        <button class="review-btn proposal-review" data-id="${proposal.id}">
                            ${getReviewButtonLabel(proposal.status)}
                        </button>
                    </td>
                </tr>
            `).join('');

            applyFilters();
        }

        function getReviewButtonLabel(status) {
            if (status === 'Under Review') return 'Continue Review';
            if (status === 'Approved' || status === 'Rejected') return 'View Decision';
            return 'Review Proposal';
        }

        function getEffectiveStage(proposal) {
            if (proposal.id === 'PROP-2026-014' && department !== 'Operations') {
                return department;
            }
            return proposal.stage;
        }

        function applyFilters() {
            const query = document.getElementById('tableSearch')?.value
                || document.getElementById('globalSearch').value;
            const status = document.getElementById('statusFilter')?.value || '';
            const location = document.getElementById('locationFilter')?.value || '';
            let visibleRows = 0;

            document.querySelectorAll('#proposalRows tr').forEach(row => {
                const matches = (!query
                    || row.dataset.search.toLowerCase().includes(query.toLowerCase()))
                    && (!status || row.dataset.status === status)
                    && (!location || row.dataset.location === location);

                row.hidden = !matches;
                if (matches) visibleRows += 1;
            });

            document.getElementById('proposalEmpty')?.classList.toggle('visible', !visibleRows);
        }

        function getAttentionIcon() {
            return {
                Legal: 'scale',
                Finance: 'wallet-cards',
                Engineering: 'ruler',
                Operations: 'clipboard-check'
            }[department];
        }

        function renderAttentionItems() {
            return `
                <section class="panel focus-panel">
                    <div class="panel-heading">
                        <div>
                            <h2>${profile.focusTitle}</h2>
                            <p>${profile.focusSubtitle}</p>
                        </div>
                        <span class="focus-count">${profile.focus.length} open items</span>
                    </div>

                    <div class="attention-grid focus-grid">
                        ${profile.focus.map(([site, description, status, tone]) => {
                            const proposal = data.proposals.find(item => item.site === site);
                            return `
                                <article class="attention-card ${tone}">
                                    <div class="focus-card-top">
                                        <i data-lucide="${getAttentionIcon()}"></i>
                                        ${B2B.badge(status)}
                                    </div>
                                    <h3>${site}</h3>
                                    <p>${description}</p>
                                    <button class="review-btn proposal-review" data-id="${proposal?.id || ''}">
                                        Open review <i data-lucide="arrow-up-right"></i>
                                    </button>
                                </article>
                            `;
                        }).join('')}
                    </div>
                </section>
            `;
        }

        function renderApprovalProgress() {
            return `
                ${renderIntro()}
                <section class="panel">
                    <div class="panel-heading">
                        <div>
                            <h2>Cross-Department Approval Progress</h2>
                            <p>Current stage for every assigned proposal</p>
                        </div>
                    </div>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Proposal</th>
                                    ${data.progress.map(stage => `<th>${stage}</th>`).join('')}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.proposals.map(proposal => `
                                    <tr>
                                        <td><strong>${proposal.site}</strong><span>${proposal.id}</span></td>
                                        ${data.progress.map((stage, index) => {
                                            const currentIndex = data.progress.indexOf(getEffectiveStage(proposal));
                                            const status = index < currentIndex
                                                ? 'Completed'
                                                : stage === getEffectiveStage(proposal) ? proposal.status : 'Pending';
                                            return `<td>${B2B.badge(status)}</td>`;
                                        }).join('')}
                                        <td>
                                            <button class="review-btn proposal-review" data-id="${proposal.id}">View</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            `;
        }

        function renderSettings() {
            return `
                ${renderIntro()}
                <div class="settings-grid">
                    <section class="panel">
                        <div class="panel-heading">
                            <div>
                                <h2>Profile Information</h2>
                                <p>Displayed in ${department.toLowerCase()} review records</p>
                            </div>
                        </div>
                        <div class="settings-form">
                            <label>Full Name</label>
                            <input value="${user.name}">
                            <label>Role</label>
                            <input value="${department} Head" disabled>
                            <label>Email</label>
                            <input value="${user.email}">
                            <button class="primary-btn compact save-settings">Save Changes</button>
                        </div>
                    </section>
                    <section class="panel">
                        <div class="panel-heading">
                            <div>
                                <h2>Review Notifications</h2>
                                <p>Choose the updates shown for this department</p>
                            </div>
                        </div>
                        <div class="settings-form toggles">
                            <label><input type="checkbox" checked> New proposal assignments</label>
                            <label><input type="checkbox" checked> Review deadline reminders</label>
                            <label><input type="checkbox" checked> Revision responses</label>
                            <label><input type="checkbox"> Daily approval summary</label>
                            <button class="primary-btn compact save-settings">Update Preferences</button>
                        </div>
                    </section>
                </div>
            `;
        }

        function renderSection(section) {
            activeSection = section;
            let html = '';

            if (section === 'overview' || section === 'proposals') {
                html = `
                    ${renderIntro()}
                    ${section === 'overview' ? `
                        <div class="alert-banner">
                            <div class="alert-icon"><i data-lucide="triangle-alert"></i></div>
                            <div>
                                <strong>${profile.focus.length} ${department.toLowerCase()} items require attention</strong>
                                <span>${profile.focusSubtitle}</span>
                            </div>
                            <button data-section-jump="attention">
                                Review now <i data-lucide="arrow-right"></i>
                            </button>
                        </div>
                        ${renderStatCards()}
                    ` : ''}
                    ${renderProposalTable()}
                    ${section === 'overview' ? `<div style="height:22px"></div>${renderAttentionItems()}` : ''}
                `;
            } else if (section === 'progress') {
                html = renderApprovalProgress();
            } else if (section === 'attention') {
                html = `${renderIntro()}${renderAttentionItems()}`;
            } else {
                html = renderSettings();
            }

            document.getElementById('pageContent').innerHTML = html;
            if (document.getElementById('proposalRows')) renderProposalRows();
            roleConfig.backend?.afterRender?.(section, document.getElementById('pageContent'));
            B2B.icon();
        }

        function openProposal(proposalId) {
            selectedProposal = data.proposals.find(proposal => proposal.id === proposalId);
            if (!selectedProposal) return;

            document.getElementById('proposalId').textContent = selectedProposal.id;
            document.getElementById('proposalTitle').textContent = selectedProposal.site;
            document.getElementById('proposalHeaderMeta').innerHTML = `
                ${B2B.badge(selectedProposal.status)}
                <span style="font-size:10px;color:#777;margin-left:7px">
                    ${selectedProposal.location} • Review deadline ${selectedProposal.deadline}
                </span>
            `;

            document.getElementById('proposalDetail').innerHTML = renderProposalDetail();
            B2B.openModal('proposalModal');
            B2B.icon();
            loadUploadedDocuments(selectedProposal.id);
        }

        /** Lists files Business Development uploaded for this proposal (js/site-documents.js). */
        async function loadUploadedDocuments(proposalId) {
            const container = document.getElementById('uploadedDocuments');
            if (!container) return;
            const store = window.siteDocuments;
            if (!store) {
                container.innerHTML = '<p class="uploaded-documents-note">Uploaded documents are unavailable on this page.</p>';
                return;
            }

            container.innerHTML = '<p class="uploaded-documents-note">Loading uploaded documents…</p>';
            try {
                const documents = await store.listSiteDocuments(proposalId);
                if (selectedProposal?.id !== proposalId) return; // another proposal was opened meanwhile
                uploadedDocuments = new Map(documents.map(item => [item.id, item]));
                container.innerHTML = documents.length
                    ? documents.map(item => `
                        <div class="document-row">
                            <i data-lucide="${item.type === 'application/pdf' ? 'file-text' : 'file-image'}"></i>
                            <div>
                                <strong>${escapeHtml(item.name)}</strong>
                                <small>${escapeHtml(item.category || 'Document')} • ${escapeHtml(formatBytes(item.size))} • Uploaded by ${escapeHtml(item.uploadedByName || item.uploadedBy)}</small>
                            </div>
                            ${B2B.badge('Uploaded')}
                            <button class="document-action" data-document-id="${escapeHtml(item.id)}" aria-label="Open ${escapeHtml(item.name)}">
                                <i data-lucide="eye"></i>
                            </button>
                        </div>
                    `).join('')
                    : '<p class="uploaded-documents-note">No files were uploaded with this proposal.</p>';
                B2B.icon();
            } catch (error) {
                console.error('Could not load uploaded documents:', error);
                container.innerHTML = '<p class="uploaded-documents-note">Could not load uploaded documents. Check your connection and reopen the proposal.</p>';
            }
        }

        async function openUploadedDocument(button) {
            const item = uploadedDocuments.get(button.dataset.documentId);
            if (!item || !window.siteDocuments) return;
            button.disabled = true;
            try {
                await window.siteDocuments.openSiteDocument(item);
            } catch (error) {
                console.error('Could not open document:', error);
                B2B.toast(error.code ? 'Could not open the document. Please try again.' : error.message);
            } finally {
                button.disabled = false;
            }
        }

        /** Opens the proposal's site photo full size in a new tab. */
        async function openSitePhoto() {
            const image = selectedProposal?.image;
            if (!image) return;
            if (!image.startsWith('data:')) {
                window.open(image, '_blank', 'noopener');
                return;
            }
            // Browsers block opening data: URLs directly, so convert to a blob URL.
            const tab = window.open('', '_blank');
            try {
                const blob = await (await fetch(image)).blob();
                const url = URL.createObjectURL(blob);
                if (tab) tab.location.href = url;
                else Object.assign(document.createElement('a'), { href: url, download: `${selectedProposal.site} site photo.jpg` }).click();
                setTimeout(() => URL.revokeObjectURL(url), 60000);
            } catch (error) {
                tab?.close();
                console.error('Could not open the site photo:', error);
                B2B.toast('Could not open the site photo.');
            }
        }

        function formatBytes(bytes) {
            const size = Number(bytes) || 0;
            if (size < 1024) return `${size} B`;
            if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
            return `${(size / 1048576).toFixed(1)} MB`;
        }

        function renderProposalDetail() {
            const requirements = roleRequirements;
            const savedChecklist = selectedProposal.checklists?.[department] || {};
            const currentStage = data.progress.indexOf(getEffectiveStage(selectedProposal));

            return `
                <div class="detail-grid">
                    <div>
                        <section class="detail-section">
                            <h3>Proposal Overview</h3>
                            <div class="detail-section-body info-grid">
                                <div class="info-item full"><span>Address</span><strong>${selectedProposal.address}</strong></div>
                                <div class="info-item"><span>Proposed Opening</span><strong>${selectedProposal.opening}</strong></div>
                                <div class="info-item"><span>Business Development Officer</span><strong>${selectedProposal.submittedBy}</strong></div>
                                <div class="info-item"><span>Viability Score</span><strong class="score-large">${selectedProposal.score}%</strong></div>
                                <div class="info-item"><span>Classification</span><strong>${selectedProposal.classification}</strong></div>
                                <div class="info-item full"><span>Strengths</span><strong>${selectedProposal.strengths}</strong></div>
                                <div class="info-item full"><span>Risks</span><strong>${selectedProposal.risks}</strong></div>
                                <div class="info-item full"><span>Recommendations</span><strong>${selectedProposal.recommendations}</strong></div>
                            </div>
                        </section>

                        <section class="detail-section">
                            <h3>${department} Requirements Checklist</h3>
                            <div class="detail-section-body checklist">
                                ${requirements.map((requirement, index) => {
                                    const chosen = savedChecklist[requirement]
                                        || (index === 2 ? 'Needs Clarification' : 'Satisfied');
                                    return `
                                    <div class="check-row">
                                        <strong style="flex:1">${requirement}</strong>
                                        <select aria-label="${requirement} status" data-requirement="${requirement}">
                                            ${CHECKLIST_OPTIONS.map(option => `
                                                <option ${option === chosen ? 'selected' : ''}>${option}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                                `;
                                }).join('')}
                            </div>
                        </section>

                        <section class="detail-section decision-box">
                            <h3>Approval Decision</h3>
                            <div class="detail-section-body">
                                <label for="decisionRemarks">Remarks</label>
                                <textarea id="decisionRemarks"
                                    placeholder="Record your decision rationale or requested changes..."></textarea>
                                <p id="decisionError" style="font-size:10px;color:var(--red);min-height:15px"></p>
                                <div class="decision-actions">
                                    <button class="approve-btn decision" data-decision="Approved">Approve</button>
                                    <button class="revision-btn decision" data-decision="Revision Requested">Request Revision</button>
                                    <button class="reject-btn decision" data-decision="Rejected">Reject</button>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div>
                        <section class="detail-section">
                            <h3>Supporting Documents</h3>
                            <div class="detail-section-body document-list">
                                ${selectedProposal.image ? `
                                    <div class="document-row">
                                        <img class="document-thumb" src="${escapeHtml(selectedProposal.image)}"
                                            alt="${escapeHtml(selectedProposal.site)} site photo">
                                        <div>
                                            <strong>Site Photo</strong>
                                            <small>Image • Submitted with the proposal</small>
                                        </div>
                                        ${B2B.badge('Uploaded')}
                                        <button class="document-action" data-site-photo="true" aria-label="View site photo">
                                            <i data-lucide="eye"></i>
                                        </button>
                                    </div>
                                ` : ''}
                                ${selectedProposal.documents.map(document => `
                                    <div class="document-row">
                                        <i data-lucide="file-text"></i>
                                        <div>
                                            <strong>${document[0]}</strong>
                                            <small>${document[1]} • Uploaded ${document[2]}</small>
                                        </div>
                                        ${B2B.badge(document[3])}
                                        <button class="document-action" aria-label="View ${document[0]}">
                                            <i data-lucide="eye"></i>
                                        </button>
                                    </div>
                                `).join('')}
                                <div class="uploaded-documents" id="uploadedDocuments"></div>
                            </div>
                        </section>

                        <section class="detail-section">
                            <h3>Approval Progress</h3>
                            <div class="detail-section-body progress-list">
                                ${data.progress.map((stage, index) => {
                                    const status = index < currentStage
                                        ? 'Completed'
                                        : index === currentStage ? selectedProposal.status : 'Pending';
                                    const icon = status === 'Completed' ? 'check' : 'circle';
                                    const tone = status === 'Completed'
                                        ? 'complete'
                                        : /Rejected|Overdue/.test(status) ? 'danger' : '';
                                    return `
                                        <div class="progress-row">
                                            <span class="progress-icon ${tone}"><i data-lucide="${icon}"></i></span>
                                            <div><strong>${stage}</strong><small>${status}</small></div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </section>

                        <section class="detail-section">
                            <h3>Previous Comments & Approval History</h3>
                            <div class="detail-section-body history-list">
                                ${selectedProposal.history.map(history => `
                                    <div class="history-row">
                                        <span class="history-marker"><i data-lucide="message-square"></i></span>
                                        <div>
                                            <strong>${escapeHtml(history[0])} — ${escapeHtml(history[1])}</strong>
                                            <p>${escapeHtml(history[3])}</p>
                                            <small>${escapeHtml(history[2])} • ${escapeHtml(history[4])}</small>
                                        </div>
                                        ${B2B.badge(escapeHtml(history[2]))}
                                    </div>
                                `).join('')}
                            </div>
                        </section>
                    </div>
                </div>
            `;
        }

        function beginDecision(decision) {
            const remarks = document.getElementById('decisionRemarks').value.trim();

            if (decision !== 'Approved' && !remarks) {
                document.getElementById('decisionError').textContent =
                    'Remarks are required for rejection or revision requests.';
                return;
            }

            const checklist = {};
            document.querySelectorAll('#proposalDetail select[data-requirement]').forEach(select => {
                checklist[select.dataset.requirement] = select.value;
            });

            pendingDecision = {
                status: decision,
                remarks: remarks || 'Approved with no additional remarks.',
                checklist
            };

            document.getElementById('confirmTitle').textContent = `Confirm ${decision}?`;
            document.getElementById('confirmMessage').textContent =
                `This will record your ${department} department decision for `
                + `${selectedProposal.site} and add it to the approval history.`;
            B2B.openModal('confirmModal');
        }

        async function saveDecisionToBackend() {
            const backend = roleConfig.backend;
            if (!backend) {
                B2B.toast('Still connecting to Firebase. Try again in a moment.');
                return;
            }

            const button = document.getElementById('confirmDecision');
            const label = button.textContent;
            button.disabled = true;
            button.textContent = 'Saving…';
            let result;
            try {
                result = await backend.saveDecision({
                    proposal: selectedProposal,
                    department,
                    requirements: roleRequirements,
                    ...pendingDecision
                });
            } catch (error) {
                console.error('Could not save the department decision:', error);
                B2B.toast(backend.describeError?.(error) || 'Could not save the decision. Please try again.');
                return; // keep both modals open so the reviewer can retry
            } finally {
                button.disabled = false;
                button.textContent = label;
            }

            B2B.closeModal('confirmModal');
            B2B.closeModal('proposalModal');
            B2B.toast(result?.message || `Proposal ${pendingDecision.status.toLowerCase()} successfully.`);
            pendingDecision = null;
            // The backend's live listener calls refresh() with the saved state.
        }

        function saveDecision() {
            if (!selectedProposal || !pendingDecision) return;
            if (roleConfig.persistent) {
                saveDecisionToBackend();
                return;
            }

            selectedProposal.status = pendingDecision.status;
            if (selectedProposal.id === 'PROP-2026-014'
                && department === 'Operations'
                && pendingDecision.status === 'Approved') {
                selectedProposal.stage = 'Final Approval';
            }
            selectedProposal.history.push([
                department,
                user.name,
                pendingDecision.status,
                pendingDecision.remarks,
                'Jul 21, 2026, 11:30 AM'
            ]);

            B2B.closeModal('confirmModal');
            B2B.closeModal('proposalModal');
            renderSection(activeSection);
            B2B.toast(`Proposal ${pendingDecision.status.toLowerCase()} successfully.`);
            pendingDecision = null;
        }

        function bindPageEvents() {
            document.addEventListener('click', event => {
                const reviewButton = event.target.closest('.proposal-review');
                if (reviewButton) openProposal(reviewButton.dataset.id);

                const sectionJump = event.target.closest('[data-section-jump]');
                if (sectionJump) {
                    document.querySelector(
                        `.nav-item[data-section="${sectionJump.dataset.sectionJump}"]`
                    )?.click();
                }

                const decisionButton = event.target.closest('.decision');
                if (decisionButton) beginDecision(decisionButton.dataset.decision);

                const documentButton = event.target.closest('.document-action');
                if (documentButton?.dataset.sitePhoto) {
                    openSitePhoto();
                } else if (documentButton?.dataset.documentId) {
                    openUploadedDocument(documentButton);
                } else if (documentButton) {
                    B2B.toast('This is a sample document; no file is attached. Uploaded files are listed below it.');
                }

                const settingsButton = event.target.closest('.save-settings');
                if (settingsButton) {
                    if (roleConfig.backend?.saveSettings) roleConfig.backend.saveSettings(settingsButton);
                    else B2B.toast('Profile settings saved.');
                }
            });

            document.addEventListener('input', event => {
                if (event.target.matches('#tableSearch, #statusFilter, #locationFilter')) {
                    applyFilters();
                }
            });

            document.addEventListener('change', event => {
                if (event.target.id === 'sortFilter') renderProposalRows();
            });

            document.getElementById('globalSearch').addEventListener('input', applyFilters);
            document.getElementById('confirmDecision').addEventListener('click', saveDecision);
        }
    }

    return { initialize };
})();
