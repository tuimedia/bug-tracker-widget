import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

const STORAGE_KEY = 'bug-tracker-widget'
const PAGE_LIMIT = 10
const ALL_STATUSES = ['open', 'in_progress', 'resolved', 'closed']
const STATUS_LABELS = { open: 'Open', in_progress: 'In progress', resolved: 'Resolved', closed: 'Closed' }

function detectBrowser() {
  const ua = navigator.userAgent
  const browsers = [
    [/Edg\/(\d+)/, 'Edge'],
    [/OPR\/(\d+)/, 'Opera'],
    [/Chrome\/(\d+)/, 'Chrome'],
    [/Firefox\/(\d+)/, 'Firefox'],
    [/Safari\/(\d+)/, 'Safari'],
  ]
  for (const [re, name] of browsers) {
    const m = ua.match(re)
    if (m) return `${name} ${m[1]}`
  }
  return ''
}

function loadPersisted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function savePersisted(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

class BugTrackerWidget extends LitElement {
  static properties = {
    // Public attributes
    reporterEmail:        {},
    reporterName:         {},
    statusFilter:         {},
    // Internal state
    _menuOpen:            { state: true },
    _view:                { state: true },
    // Form
    _title:               { state: true },
    _stepsToReproduce:    { state: true },
    _expectedBehaviour:   { state: true },
    _actualBehaviour:     { state: true },
    _submittedUrl:        { state: true },
    _browser:             { state: true },
    _attachedFiles:       { state: true },
    _formStatus:          { state: true },
    _formError:           { state: true },
    // Issues list
    _tickets:             { state: true },
    _ticketsStatus:       { state: true },
    _ticketsPage:         { state: true },
    _ticketsTotal:        { state: true },
    _activeStatuses:      { state: true },
    // Issue detail
    _selectedTicket:      { state: true },
    _selectedTicketStatus:{ state: true },
    _showTechDetails:     { state: true },
    // UI
    _isDragging:          { state: true },
    _isOpen:              { state: true },
  }

  constructor() {
    super()
    const p = loadPersisted()
    this.reporterEmail = ''
    this.reporterName = ''
    this.statusFilter = ''
    this._activeStatuses = []
    this._menuOpen = false
    this._view = 'form'
    this._title = p.title || ''
    this._stepsToReproduce = p.stepsToReproduce || ''
    this._expectedBehaviour = p.expectedBehaviour || ''
    this._actualBehaviour = p.actualBehaviour || ''
    this._submittedUrl = p.submittedUrl || ''
    this._browser = p.browser || ''
    this._attachedFiles = []
    this._formStatus = 'idle'
    this._formError = ''
    this._tickets = []
    this._ticketsStatus = 'idle'
    this._ticketsPage = 1
    this._ticketsTotal = 0
    this._selectedTicket = null
    this._selectedTicketStatus = 'idle'
    this._showTechDetails = false
    this._isDragging = false
    this._isOpen = false
  }

  _persist() {
    savePersisted({
      title: this._title,
      stepsToReproduce: this._stepsToReproduce,
      expectedBehaviour: this._expectedBehaviour,
      actualBehaviour: this._actualBehaviour,
      submittedUrl: this._submittedUrl,
      browser: this._browser,
    })
  }

  _openForm() {
    this._submittedUrl = window.location.href
    if (!this._browser) this._browser = detectBrowser()
    this._persist()
    this._view = 'form'
    this._menuOpen = false
    this._isOpen = true
  }

  async _openIssues() {
    this._view = 'issues'
    this._menuOpen = false
    this._isOpen = true
    // Seed active statuses from attribute on first open; don't reset on re-open
    if (this._activeStatuses.length === 0) {
      this._activeStatuses = this._parseStatusFilter()
    }
    await this._fetchTickets()
  }

  _parseStatusFilter() {
    if (!this.statusFilter) return []
    return this.statusFilter
      .split(',')
      .map(s => s.trim())
      .filter(s => ALL_STATUSES.includes(s))
  }

  _toggleStatus(status) {
    this._activeStatuses = this._activeStatuses.includes(status)
      ? this._activeStatuses.filter(s => s !== status)
      : [...this._activeStatuses, status]
    this._ticketsPage = 1
    this._fetchTickets()
  }

  _statusFilterParams() {
    if (!this._activeStatuses.length) return ''
    return this._activeStatuses.map(s => `status[]=${encodeURIComponent(s)}`).join('&')
  }

  async _fetchTickets() {
    this._ticketsStatus = 'loading'
    try {
      const statusParams = this._statusFilterParams()
      const url = `/api/feedback/public/tickets/mine?reporterEmail=${encodeURIComponent(this.reporterEmail)}&page=${this._ticketsPage}&limit=${PAGE_LIMIT}${statusParams ? `&${statusParams}` : ''}`
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error()
      const json = await res.json()
      this._tickets = json.data ?? json
      this._ticketsTotal = json.total ?? this._tickets.length
      this._ticketsStatus = 'idle'
    } catch {
      this._ticketsStatus = 'error'
    }
  }

  async _goToPage(page) {
    this._ticketsPage = page
    await this._fetchTickets()
  }

  async _selectTicket(id) {
    this._selectedTicket = null
    this._selectedTicketStatus = 'loading'
    this._showTechDetails = false
    this._view = 'issue-detail'
    try {
      const res = await fetch(`/api/feedback/public/tickets/mine/${id}`, { credentials: 'include' })
      if (!res.ok) throw new Error()
      this._selectedTicket = await res.json()
      this._selectedTicketStatus = 'idle'
    } catch {
      this._selectedTicketStatus = 'error'
    }
  }

  _resetForm() {
    this._title = ''
    this._stepsToReproduce = ''
    this._expectedBehaviour = ''
    this._actualBehaviour = ''
    this._submittedUrl = ''
    this._browser = ''
    this._attachedFiles = []
    this._formError = ''
    this._persist()
  }

  async _submit(e) {
    e.preventDefault()
    this._formStatus = 'submitting'
    this._formError = ''
    try {
      const attachmentS3Keys = await Promise.all(
        this._attachedFiles.map(async (file) => {
          const presignRes = await fetch('/api/feedback/public/attachments/presign', {
            method: 'POST',
            credentials: 'include',
            redirect: 'error',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name, contentType: file.type }),
          }).catch(() => { throw new Error('Session expired — please refresh the page and try again.') })
          if (!presignRes.ok) throw new Error('Failed to get upload URL')
          const { url, s3Key } = await presignRes.json()
          const uploadRes = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file.data,
          })
          if (!uploadRes.ok) throw new Error('Screenshot upload failed')
          return s3Key
        }),
      )

      let sentryEventId
      if (window.Sentry?.captureMessage) {
        sentryEventId = window.Sentry.captureMessage(this._title, {
          level: 'info',
          tags: { source: 'bug-tracker-widget' },
          extra: { submittedUrl: this._submittedUrl },
        })
      }

      const payload = {
        title: this._title,
        stepsToReproduce: this._stepsToReproduce,
        ...(this._expectedBehaviour ? { expectedBehaviour: this._expectedBehaviour } : {}),
        ...(this._actualBehaviour ? { actualBehaviour: this._actualBehaviour } : {}),
        submittedUrl: this._submittedUrl,
        reporterEmail: this.reporterEmail || null,
        reporterName: this.reporterName || null,
        browser: this._browser || undefined,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent,
        ...(sentryEventId ? { sentryEventId } : {}),
        ...(attachmentS3Keys.length ? { attachmentS3Keys } : {}),
      }

      const res = await fetch('/api/feedback/public/tickets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || `Unexpected error (${res.status})`)
      }

      this._resetForm()
      this._formStatus = 'success'
    } catch (err) {
      this._formStatus = 'error'
      this._formError = err.message || 'Something went wrong. Please try again.'
    }
  }

  _handleFileSelect(files) {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      const reader = new FileReader()
      reader.onload = (e) => {
        this._attachedFiles = [...this._attachedFiles, { name: file.name, type: file.type, data: file, preview: e.target.result }]
      }
      reader.readAsDataURL(file)
    }
  }

  _removeAttachment(index) {
    this._attachedFiles = this._attachedFiles.filter((_, i) => i !== index)
  }

  get _openTicketCount() {
    return this._tickets.filter(t => t.status === 'open').length
  }

  get _ticketsPageCount() {
    return Math.ceil(this._ticketsTotal / PAGE_LIMIT) || 1
  }

  // ── Icons ────────────────────────────────────────────────────

  get _iconMessage() {
    return html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M12 8v4"/><path d="M12 16h.01"/>
    </svg>`
  }

  get _iconCheck() {
    return html`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>`
  }

  // ── Render ───────────────────────────────────────────────────

  render() {
    return html`
      ${!this._isOpen ? this._renderLauncher() : html``}
      ${this._isOpen ? this._renderPopup() : html``}
    `
  }

  _renderLauncher() {
    return html`
      <div class="launcher">
        ${this._menuOpen ? html`
          <div class="menu" role="menu">
            <button class="menu-item" role="menuitem" @click=${this._openForm}>
              ${this._iconMessage}
              Report an issue
            </button>
            <button class="menu-item" role="menuitem" @click=${this._openIssues}>
              ${this._iconCheck}
              My issues
              ${this._openTicketCount > 0 ? html`<span class="menu-badge">${this._openTicketCount}</span>` : ''}
            </button>
          </div>
        ` : ''}
        <button
          class="trigger"
          @click=${() => { this._menuOpen = !this._menuOpen }}
          aria-expanded=${this._menuOpen}
          aria-label="Issue tracker menu"
        >
          ${this._iconMessage}
          <span>Report issue</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" class=${classMap({ 'chevron': true, 'chevron--up': this._menuOpen })}>
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      </div>
    `
  }

  _renderPopup() {
    return html`
      <div class="popup" role="dialog" aria-label="Report an issue">
        ${this._renderHeader()}
        ${this._view === 'issues' ? this._renderIssues() : ''}
        ${this._view === 'issue-detail' ? this._renderIssueDetail() : ''}
        ${this._view === 'form' && this._formStatus === 'success' ? this._renderSuccess() : ''}
        ${this._view === 'form' && this._formStatus !== 'success' ? this._renderForm() : ''}
      </div>
    `
  }

  _renderHeader() {
    const title = this._view === 'issues'
      ? 'My issues'
      : this._view === 'issue-detail'
        ? (this._selectedTicket?.title ?? 'Issue')
        : 'Report an issue'

    return html`
      <div class="header">
        <div class="header-left">
          ${this._view === 'issue-detail' ? html`
            <button class="back-btn" @click=${() => { this._view = 'issues' }} aria-label="Back to issues">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <path d="M19 12H5m7-7-7 7 7 7"/>
              </svg>
            </button>
          ` : html`
            <span class="header-icon">${this._iconMessage}</span>
          `}
          <span class="header-title">${title}</span>
        </div>
        <button class="minimise-btn" @click=${() => { this._isOpen = false }} aria-label="Minimise">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <path d="M5 12h14"/>
          </svg>
        </button>
      </div>
    `
  }

  _renderSuccess() {
    return html`
      <div class="success">
        <div class="success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <p class="success-title">Report submitted</p>
        <p class="success-body">Thanks — we'll look into it.</p>
        <button class="btn-primary" style="margin-top:1.5rem" @click=${() => { this._formStatus = 'idle'; this._isOpen = false }}>Done</button>
      </div>
    `
  }

  _renderForm() {
    return html`
      <form class="form" @submit=${this._submit} novalidate>
        <div class="form-body">
          <div class="field">
            <label class="field-label" for="bt-url">Page URL <span class="field-required" aria-hidden="true">*</span></label>
            <input id="bt-url" class="field-input field-input--mono" type="url" .value=${this._submittedUrl}
              @input=${e => { this._submittedUrl = e.target.value; this._persist() }}
              placeholder="https://…" required autocomplete="off" />
            <p class="field-hint">Auto-filled from your current page — edit if different.</p>
          </div>

          <div class="field">
            <label class="field-label" for="bt-title">Title <span class="field-required" aria-hidden="true">*</span></label>
            <input id="bt-title" class="field-input" type="text" .value=${this._title}
              @input=${e => { this._title = e.target.value; this._persist() }}
              placeholder="Brief description of the problem" maxlength="500" required autocomplete="off" />
          </div>

          <div class="form-cols">
            <div class="form-col">
              <div class="field">
                <label class="field-label" for="bt-expected">What did you expect to happen? <span class="field-required" aria-hidden="true">*</span></label>
                <textarea id="bt-expected" class="field-input field-textarea" .value=${this._expectedBehaviour}
                  @input=${e => { this._expectedBehaviour = e.target.value; this._persist() }}
                  placeholder="Describe what you thought would happen…" rows="4" required></textarea>
              </div>
              <div class="field">
                <label class="field-label" for="bt-actual">What actually happened? <span class="field-required" aria-hidden="true">*</span></label>
                <textarea id="bt-actual" class="field-input field-textarea" .value=${this._actualBehaviour}
                  @input=${e => { this._actualBehaviour = e.target.value; this._persist() }}
                  placeholder="Describe what you saw instead…" rows="4" required></textarea>
              </div>
            </div>
            <div class="form-col">
              <div class="field field--stretch">
                <label class="field-label" for="bt-steps">Steps to reproduce <span class="field-required" aria-hidden="true">*</span></label>
                <textarea id="bt-steps" class="field-input field-textarea field-textarea--stretch" .value=${this._stepsToReproduce}
                  @input=${e => { this._stepsToReproduce = e.target.value; this._persist() }}
                  placeholder="1. Go to…&#10;2. Click…&#10;3. Notice that…" rows="10" required></textarea>
              </div>
            </div>
          </div>

          <div class="field">
            <span class="field-label">Screenshots <span class="field-optional">optional</span></span>
            ${this._attachedFiles.length ? html`
              <div class="attachment-grid">
                ${this._attachedFiles.map((file, i) => html`
                  <div class="attachment-item">
                    <img src=${file.preview} alt=${file.name} class="attachment-thumb" />
                    <button type="button" class="attachment-remove" @click=${() => this._removeAttachment(i)} aria-label="Remove ${file.name}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                `)}
              </div>
            ` : ''}
            <div
              class=${classMap({ 'drop-zone': true, 'drop-zone--active': this._isDragging })}
              @click=${() => this.shadowRoot.getElementById('bt-file').click()}
              @dragover=${e => { e.preventDefault(); this._isDragging = true }}
              @dragleave=${() => { this._isDragging = false }}
              @drop=${e => { e.preventDefault(); this._isDragging = false; this._handleFileSelect(e.dataTransfer.files) }}
              role="button" tabindex="0"
              @keydown=${e => (e.key === 'Enter' || e.key === ' ') && this.shadowRoot.getElementById('bt-file').click()}
              aria-label="Upload screenshots"
            >
              <input id="bt-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" class="sr-only" multiple
                @change=${e => { this._handleFileSelect(e.target.files); e.target.value = '' }} tabindex="-1" />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="drop-icon" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <p class="drop-label"><span class="drop-link">Choose files</span> or drag them here</p>
              <p class="drop-hint">PNG, JPG, WebP or GIF</p>
            </div>
          </div>

          ${this._formStatus === 'error' ? html`
            <div class="error-banner" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              ${this._formError}
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <button type="button" class="btn-secondary" @click=${() => { this._isOpen = false }}>Cancel</button>
          <button type="submit" class="btn-primary" ?disabled=${this._formStatus === 'submitting'}>
            ${this._formStatus === 'submitting' ? html`<span class="spinner" aria-hidden="true"></span>` : ''}
            ${this._formStatus === 'submitting' ? 'Submitting…' : 'Submit report'}
          </button>
        </div>
      </form>
    `
  }

  _renderStatusFilters() {
    return html`
      <div class="status-filters">
        ${ALL_STATUSES.map(s => html`
          <label class=${classMap({ 'status-chip': true, [`status-chip--${s}`]: true, 'status-chip--active': this._activeStatuses.includes(s) })}>
            <input type="checkbox" class="sr-only"
              .checked=${this._activeStatuses.includes(s)}
              @change=${() => this._toggleStatus(s)} />
            ${STATUS_LABELS[s]}
          </label>
        `)}
      </div>
    `
  }

  _renderIssues() {
    return html`
      <div class="issues">
        ${this._renderStatusFilters()}
        ${this._ticketsStatus === 'loading' ? html`
          <div class="issues-empty"><span class="spinner spinner--dark" aria-hidden="true"></span> Loading…</div>
        ` : this._ticketsStatus === 'error' ? html`
          <div class="issues-empty">Failed to load issues.</div>
        ` : this._tickets.length ? html`
          <div class="issues-list">
            ${this._tickets.map(ticket => html`
              <div class="issue-row" role="button" tabindex="0"
                @click=${() => this._selectTicket(ticket.id)}
                @keydown=${e => e.key === 'Enter' && this._selectTicket(ticket.id)}
              >
                <div class="issue-row-main">
                  <span class="issue-title">${ticket.title}</span>
                  <span class="issue-date">${new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <span class="status-badge status-badge--${ticket.status}">${ticket.status.replace('_', ' ')}</span>
                </div>
              </div>
            `)}
          </div>
          ${this._ticketsPageCount > 1 ? html`
            <div class="pagination">
              <button class="page-btn" ?disabled=${this._ticketsPage === 1} @click=${() => this._goToPage(this._ticketsPage - 1)}>←</button>
              <span class="page-label">${this._ticketsPage} / ${this._ticketsPageCount}</span>
              <button class="page-btn" ?disabled=${this._ticketsPage >= this._ticketsPageCount} @click=${() => this._goToPage(this._ticketsPage + 1)}>→</button>
            </div>
          ` : ''}
        ` : html`
          <div class="issues-empty">No issues.</div>
        `}
        <div class="footer">
          <button type="button" class="btn-secondary" @click=${this._openForm}>+ Report an issue</button>
          <button type="button" class="btn-secondary" @click=${() => { this._isOpen = false }}>Close</button>
        </div>
      </div>
    `
  }

  _renderIssueDetail() {
    const t = this._selectedTicket
    const attachmentUrl = url => `/api/feedback${url.replace(/^\/api/, '')}`

    return html`
      <div class="issues">
        ${this._selectedTicketStatus === 'loading' ? html`
          <div class="issues-empty"><span class="spinner spinner--dark" aria-hidden="true"></span> Loading…</div>
        ` : this._selectedTicketStatus === 'error' ? html`
          <div class="issues-empty">Failed to load issue.</div>
        ` : t ? html`
          <div class="detail-body">
            <div class="detail-meta">
              <span class="status-badge status-badge--${t.status}">${t.status.replace('_', ' ')}</span>
              ${t.environment ? html`<span class="detail-env">${t.environment}</span>` : ''}
              <span class="detail-date" style="margin-left:auto">${new Date(t.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            ${t.submittedUrl ? html`
              <div class="detail-field">
                <span class="detail-label">Page</span>
                <span class="detail-value detail-value--mono">${t.submittedUrl}</span>
              </div>
            ` : ''}
            <div class="detail-cols">
              ${t.expectedBehaviour ? html`
                <div class="detail-field">
                  <span class="detail-label">Expected</span>
                  <span class="detail-value detail-value--pre">${t.expectedBehaviour}</span>
                </div>
              ` : ''}
              ${t.actualBehaviour ? html`
                <div class="detail-field">
                  <span class="detail-label">Actual</span>
                  <span class="detail-value detail-value--pre">${t.actualBehaviour}</span>
                </div>
              ` : ''}
            </div>
            ${t.stepsToReproduce ? html`
              <div class="detail-field">
                <span class="detail-label">Steps to reproduce</span>
                <span class="detail-value detail-value--pre">${t.stepsToReproduce}</span>
              </div>
            ` : ''}
            ${t.attachments?.length ? html`
              <div class="detail-field">
                <span class="detail-label">Screenshots</span>
                <div class="detail-attachments">
                  ${t.attachments.map(att => html`
                    <a href=${attachmentUrl(att.url)} target="_blank" rel="noopener">
                      <img src=${attachmentUrl(att.url)} alt=${att.filename} class="detail-thumb" />
                    </a>
                  `)}
                </div>
              </div>
            ` : ''}
            ${t.browser || t.viewport || t.userAgent ? html`
              <div class="detail-field">
                <button class="tech-toggle" @click=${() => { this._showTechDetails = !this._showTechDetails }}>
                  ${this._showTechDetails ? 'Hide' : 'Show'} technical details
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" class=${classMap({ chevron: true, 'chevron--up': this._showTechDetails })}>
                    <path d="M18 15l-6-6-6 6"/>
                  </svg>
                </button>
                ${this._showTechDetails ? html`
                  <div class="detail-cols" style="margin-top:8px">
                    ${t.browser ? html`<div class="detail-field"><span class="detail-label">Browser</span><span class="detail-value">${t.browser}</span></div>` : ''}
                    ${t.viewport ? html`<div class="detail-field"><span class="detail-label">Viewport</span><span class="detail-value">${t.viewport}</span></div>` : ''}
                    ${t.userAgent ? html`<div class="detail-field" style="grid-column:1/-1"><span class="detail-label">User agent</span><span class="detail-value detail-value--mono" style="font-size:11px;word-break:break-all">${t.userAgent}</span></div>` : ''}
                  </div>
                ` : ''}
              </div>
            ` : ''}
            ${t.ghIssueUrl ? html`
              <div class="detail-field">
                <a href=${t.ghIssueUrl} target="_blank" rel="noopener" class="gh-link">View GitHub issue ↗</a>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `
  }

  // ── Styles ───────────────────────────────────────────────────

  static styles = css`
    :host { font-family: system-ui, -apple-system, sans-serif; }

    /* ── Launcher ── */
    .launcher { position: fixed; bottom: 1rem; right: 1rem; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
    .menu { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); min-width: 200px; }
    .menu-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 11px 14px; background: none; border: none; color: #374151; font-family: inherit; font-size: 13.5px; text-align: left; cursor: pointer; transition: background 0.12s; }
    .menu-item:hover { background: #f9fafb; }
    .menu-item + .menu-item { border-top: 1px solid #f3f4f6; }
    .menu-badge { margin-left: auto; background: #ef4444; color: #fff; font-size: 11px; font-weight: 600; padding: 1px 6px; border-radius: 100px; line-height: 1.6; }
    .trigger { display: flex; align-items: center; gap: 6px; padding: 8px 14px 8px 10px; background: #fff; color: #111; border: 1px solid rgba(0,0,0,0.12); border-radius: 100px; font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.15s, box-shadow 0.15s, background 0.15s; }
    .trigger:hover { background: #f9fafb; transform: translateY(-1px); box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .trigger:active { transform: translateY(0); }
.chevron { transition: transform 0.2s; }
    .chevron--up { transform: rotate(180deg); }

    /* ── Popup ── */
    .popup { position: fixed; bottom: 1rem; right: 1rem; z-index: 9999; width: calc(100vw - 2rem); max-width: 640px; max-height: calc(100vh - 2rem); background: #fff; color: #111; display: flex; flex-direction: column; border-radius: 14px; box-shadow: 0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06); overflow: hidden; }

    /* ── Header ── */
    .header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0; }
    .header-left { display: flex; align-items: center; gap: 9px; }
    .header-icon { color: #9ca3af; flex-shrink: 0; display: flex; }
    .header-title { font-size: 14px; font-weight: 600; color: #111; letter-spacing: 0.01em; }
    .back-btn, .minimise-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; border-radius: 6px; background: transparent; color: #9ca3af; cursor: pointer; transition: background 0.12s, color 0.12s; }
    .back-btn:hover, .minimise-btn:hover { background: #f3f4f6; color: #111; }

    /* ── Form ── */
    .form { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .form-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 18px; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
    .form-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-col { display: flex; flex-direction: column; gap: 14px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field--stretch { flex: 1; display: flex; flex-direction: column; }
    .field-label { font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 4px; }
    .field-required { color: #ef4444; }
    .field-optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: #9ca3af; font-size: 11px; }
    .field-hint { font-size: 11.5px; color: #6b7280; line-height: 1.5; margin: 0; }
    .field-input { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 9px 12px; font-family: inherit; font-size: 14px; color: #111; outline: none; transition: border-color 0.15s, background 0.15s; width: 100%; box-sizing: border-box; }
    .field-input::placeholder { color: #d1d5db; }
    .field-input:focus { border-color: #6b7280; background: #fff; }
    .field-input--mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12.5px; }
    .field-textarea { resize: vertical; line-height: 1.6; min-height: 120px; }
    .field-textarea--stretch { flex: 1; resize: none; }

    /* ── Drop zone ── */
    .drop-zone { border: 1px dashed #d1d5db; border-radius: 8px; padding: 20px 16px; text-align: center; cursor: pointer; background: #f9fafb; transition: border-color 0.15s, background 0.15s; }
    .drop-zone:hover, .drop-zone--active { border-color: #6b7280; background: #f3f4f6; }
    .drop-icon { color: #d1d5db; margin: 0 auto 8px; display: block; }
    .drop-label { font-size: 13px; color: #6b7280; margin: 0 0 3px; }
    .drop-link { color: #374151; text-decoration: underline; text-underline-offset: 2px; }
    .drop-hint { font-size: 11.5px; color: #9ca3af; margin: 0; }

    /* ── Attachments ── */
    .attachment-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
    .attachment-item { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
    .attachment-thumb { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; }
    .attachment-remove { position: absolute; top: -6px; right: -6px; display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border: none; border-radius: 50%; background: #ef4444; color: #fff; cursor: pointer; padding: 0; transition: background 0.12s; }
    .attachment-remove:hover { background: #dc2626; }

    /* ── Error ── */
    .error-banner { display: flex; align-items: flex-start; gap: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #b91c1c; line-height: 1.5; }

    /* ── Footer ── */
    .footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid #f3f4f6; flex-shrink: 0; background: #fff; }
    .btn-secondary { padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: transparent; font-family: inherit; font-size: 13.5px; color: #6b7280; cursor: pointer; transition: border-color 0.12s, color 0.12s, background 0.12s; }
    .btn-secondary:hover { border-color: #9ca3af; color: #374151; background: #f9fafb; }
    .btn-primary { display: flex; align-items: center; gap: 8px; padding: 8px 20px; border: none; border-radius: 8px; background: #111; font-family: inherit; font-size: 13.5px; font-weight: 600; color: #fff; cursor: pointer; transition: opacity 0.12s, transform 0.12s; }
    .btn-primary:hover:not(:disabled) { opacity: 0.85; }
    .btn-primary:active:not(:disabled) { transform: scale(0.98); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Spinner ── */
    .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; flex-shrink: 0; }
    .spinner--dark { border-color: #e5e7eb; border-top-color: #6b7280; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Success ── */
    .success { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
    .success-icon { width: 52px; height: 52px; border-radius: 50%; background: #f0fdf4; border: 1px solid #bbf7d0; display: flex; align-items: center; justify-content: center; color: #16a34a; margin-bottom: 1.25rem; }
    .success-title { font-size: 16px; font-weight: 600; color: #111; margin: 0 0 0.5rem; }
    .success-body { font-size: 14px; color: #6b7280; margin: 0; }

    /* ── Status filter chips ── */
    .status-filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 20px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0; }
    .status-chip { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px; font-size: 11.5px; font-weight: 500; cursor: pointer; border: 1px solid #e5e7eb; background: #f9fafb; color: #9ca3af; transition: all 0.12s; user-select: none; }
    .status-chip:hover { border-color: #d1d5db; color: #6b7280; }
    .status-chip--open.status-chip--active { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
    .status-chip--in_progress.status-chip--active { background: #fffbeb; color: #d97706; border-color: #fde68a; }
    .status-chip--resolved.status-chip--active { background: #eff6ff; color: #3b82f6; border-color: #bfdbfe; }
    .status-chip--closed.status-chip--active { background: #f3f4f6; color: #6b7280; border-color: #d1d5db; }

    /* ── Issues list ── */
    .issues { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
    .issues-list { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
    .issues-empty { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; color: #9ca3af; font-size: 13.5px; padding: 2rem; text-align: center; }
    .issue-row { display: flex; align-items: center; padding: 12px 20px; border-bottom: 1px solid #f3f4f6; font-size: 13.5px; cursor: pointer; transition: background 0.1s; }
    .issue-row:hover { background: #f9fafb; }
    .issue-row:first-child { margin-top: 8px; }
    .issue-row-main { display: flex; align-items: center; gap: 8px; width: 100%; }
    .issue-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #111; }
    .issue-date { flex-shrink: 0; font-size: 11.5px; color: #9ca3af; }

    /* ── Status badges ── */
    .status-badge { flex-shrink: 0; font-size: 11px; font-weight: 600; text-transform: capitalize; padding: 2px 8px; border-radius: 100px; letter-spacing: 0.03em; }
    .status-badge--open { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    .status-badge--closed { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
    .status-badge--in_progress { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }

    /* ── Pagination ── */
    .pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 10px; border-top: 1px solid #f3f4f6; flex-shrink: 0; }
    .page-btn { background: none; border: 1px solid #e5e7eb; border-radius: 6px; color: #6b7280; font-family: inherit; font-size: 13px; width: 28px; height: 28px; cursor: pointer; transition: background 0.12s, color 0.12s; }
    .page-btn:hover:not(:disabled) { background: #f3f4f6; color: #111; }
    .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .page-label { font-size: 12.5px; color: #9ca3af; min-width: 40px; text-align: center; }

    /* ── Issue detail ── */
    .detail-body { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent; }
    .detail-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .detail-date { font-size: 12px; color: #9ca3af; }
    .detail-env { font-size: 11px; font-weight: 600; text-transform: capitalize; padding: 2px 8px; border-radius: 100px; background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; }
    .detail-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .detail-field { display: flex; flex-direction: column; gap: 5px; }
    .detail-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; }
    .detail-value { font-size: 13.5px; color: #374151; line-height: 1.5; }
    .detail-value--mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; word-break: break-all; }
    .detail-value--pre { white-space: pre-wrap; }
    .detail-attachments { display: flex; flex-wrap: wrap; gap: 8px; }
    .detail-thumb { width: 80px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; transition: opacity 0.12s; }
    .detail-thumb:hover { opacity: 0.8; }
    .gh-link { font-size: 13px; color: #6b7280; text-decoration: none; border-bottom: 1px solid #e5e7eb; padding-bottom: 1px; transition: color 0.12s; }
    .gh-link:hover { color: #111; }
    .tech-toggle { background: none; border: none; padding: 0; color: #9ca3af; font-family: inherit; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: color 0.12s; }
    .tech-toggle:hover { color: #6b7280; }

    /* ── Misc ── */
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  `
}

customElements.define('bug-tracker-widget', BugTrackerWidget)
