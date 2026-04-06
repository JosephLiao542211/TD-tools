const ConfluenceService = require('../services/confluence/ConfluenceService');

/**
 * ConfluenceController
 *
 * PAT is read from process.env.ATLASSIAN_PAT — never sent from the client.
 * The server calls the Confluence REST API directly.
 *
 * POST /api/confluence/fill   { url, context }
 * POST /api/confluence/preview { url }
 */
class ConfluenceController {
  constructor({ claudeClient, logger }) {
    this.confluenceService = new ConfluenceService();
    this.claudeClient = claudeClient;
    this.logger = logger;
  }

  async fill(req, res) {
    console.log('[Confluence] fill() called');
    try {
      const { url, context = '' } = req.body;
      const pat = process.env.ATLASSIAN_PAT;

      console.log('[Confluence] URL:', url);
      console.log('[Confluence] PAT present:', !!pat);
      console.log('[Confluence] Context length:', context.length);

      if (!url) {
        return res.status(400).json({ error: true, message: 'url is required.' });
      }
      if (!pat) {
        return res.status(500).json({ error: true, message: 'ATLASSIAN_PAT is not set on the server.' });
      }

      // Step 1: fetch from Confluence
      console.log('[Confluence] Step 1: Fetching page from Confluence API...');
      const page = await this.confluenceService.fetchPage(url, pat);
      console.log('[Confluence] Step 1 complete. Title:', page.title, '| HTML length:', page.storageHtml.length);

      // Step 2: parse
      console.log('[Confluence] Step 2: Parsing storage HTML...');
      const parsed = this.confluenceService.parseStorageFormat(page.storageHtml);
      const pageSummary = this.confluenceService.buildPageSummary(page.title, parsed);
      console.log('[Confluence] Step 2 complete. Tasks:', parsed.tasks.length, 'Sections:', parsed.sections.length);

      // Step 3: Claude
      console.log('[Confluence] Step 3: Sending to Claude...');
      const systemPrompt = `You are an expert TD Bank fraud operations analyst helping complete a handover support ticket checklist.
Given a Confluence page summary and optional extra context, you must:
1. Identify every checklist/task item on the page.
2. For each incomplete item, provide a concise, professional completion — as if you are the analyst who worked this ticket.
3. For items that require specific data you don't have, write a clear placeholder like "[REQUIRED: describe what info is needed]".
4. Return the full checklist with every item answered, using markdown checkboxes.
5. After the checklist, add a brief "Summary" section (3-5 sentences) describing what was done.

Keep responses factual, concise, and in the voice of a TD fraud analyst.`;

      const userMessage = `Here is the Confluence handover page:\n\n${pageSummary}${context ? `\n\nAdditional context from analyst:\n${context}` : ''}

Please complete every checklist item and return the filled checklist followed by a brief summary.`;

      console.log('[Confluence] Claude prompt length:', userMessage.length, 'chars');
      const response = await this.claudeClient.createMessage(
        [{ role: 'user', content: userMessage }],
        { system: systemPrompt, maxTokens: 4096 }
      );
      const filledReport = response.content?.[0]?.text || '';
      console.log('[Confluence] Step 3 complete. Response length:', filledReport.length);

      res.json({ title: page.title, tasks: parsed.tasks, sections: parsed.sections.map(s => s.heading), filledReport });
    } catch (error) {
      console.error('[Confluence] ERROR in fill():', error.message);
      if (error.cause) console.error('[Confluence] Cause:', error.cause?.message || error.cause);
      this.logger.error('ConfluenceController.fill error', { error: error.message });
      res.status(500).json({ error: true, message: this._friendlyError(error) });
    }
  }

  async preview(req, res) {
    const params = req.method === 'POST' ? req.body : req.query;
    console.log('[Confluence] preview() called via', req.method);
    try {
      const { url } = params;
      const pat = process.env.ATLASSIAN_PAT;

      if (!url) return res.status(400).json({ error: true, message: 'url is required.' });
      if (!pat) return res.status(500).json({ error: true, message: 'ATLASSIAN_PAT is not set on the server.' });

      console.log('[Confluence] Fetching page for preview:', url);
      const page = await this.confluenceService.fetchPage(url, pat);
      const parsed = this.confluenceService.parseStorageFormat(page.storageHtml);
      const summary = this.confluenceService.buildPageSummary(page.title, parsed);
      console.log('[Confluence] Preview done. Tasks:', parsed.tasks.length, 'Sections:', parsed.sections.length);

      res.json({ title: page.title, tasks: parsed.tasks, sections: parsed.sections, summary });
    } catch (error) {
      console.error('[Confluence] ERROR in preview():', error.message);
      if (error.cause) console.error('[Confluence] Cause:', error.cause?.message || error.cause);
      this.logger.error('ConfluenceController.preview error', { error: error.message });
      res.status(500).json({ error: true, message: this._friendlyError(error) });
    }
  }

  _friendlyError(error) {
    if (error.cause?.code === 'ENOTFOUND') {
      return `Cannot reach ${error.cause.hostname} — server cannot resolve this hostname. If this is an internal TD URL, the server must be on the TD network/VPN.`;
    }
    if (error.message.includes('fetch failed')) {
      return `Network error: ${error.cause?.message || 'unable to connect to Confluence'}`;
    }
    return error.message;
  }
}

module.exports = ConfluenceController;
