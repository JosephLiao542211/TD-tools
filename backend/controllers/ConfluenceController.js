const ConfluenceService = require('../services/confluence/ConfluenceService');

/**
 * ConfluenceController
 *
 * PAT is read from process.env.ATLASSIAN_PAT — never sent from the client.
 *
 * POST /api/confluence/fill
 *   Body (JSON):
 *     url         {string}  - Confluence page URL (required unless rawHtml provided)
 *     rawHtml     {string}  - Raw storage-format HTML (fallback when no PAT in env)
 *     context     {string}  - Extra context to help Claude fill the checklist
 *     title       {string}  - Page title override (used with rawHtml)
 *
 * GET /api/confluence/preview
 *   Query params: url, rawHtml, title
 *   Parses and returns structure — no Claude call (good for debugging).
 */
class ConfluenceController {
  constructor({ claudeClient, logger }) {
    this.confluenceService = new ConfluenceService();
    this.claudeClient = claudeClient;
    this.logger = logger;
  }

  async fill(req, res) {
    console.log('[Confluence] fill() called');
    console.log('[Confluence] Request body keys:', Object.keys(req.body));

    try {
      const { url, rawHtml, context = '', title: titleOverride } = req.body;
      const pat = process.env.ATLASSIAN_PAT;

      console.log('[Confluence] URL:', url || '(none)');
      console.log('[Confluence] PAT present:', !!pat);
      console.log('[Confluence] rawHtml provided:', !!rawHtml);
      console.log('[Confluence] Extra context length:', context.length);

      if (!url && !rawHtml) {
        return res.status(400).json({ error: true, message: 'Provide either a Confluence page URL or rawHtml.' });
      }

      let storageHtml = '';
      let title = titleOverride || 'Handover Checklist';

      // ── Step 1: obtain the page HTML ──────────────────────────────────────
      if (pat && url) {
        console.log('[Confluence] Step 1: Fetching page from Confluence API...');
        const page = await this.confluenceService.fetchPage(url, pat);
        storageHtml = page.storageHtml;
        title = page.title || title;
        console.log('[Confluence] Step 1 complete. Title:', title, '| HTML length:', storageHtml.length);
      } else if (rawHtml) {
        console.log('[Confluence] Step 1: Using provided rawHtml (length:', rawHtml.length, ')');
        storageHtml = rawHtml;
        title = titleOverride || 'Handover Checklist';
      } else {
        console.warn('[Confluence] Step 1 failed: no PAT in env and no rawHtml provided');
        return res.status(400).json({
          error: true,
          message: 'ATLASSIAN_PAT is not set and no rawHtml was provided. Set the env var or paste the page HTML.',
        });
      }

      // ── Step 2: parse the storage HTML ────────────────────────────────────
      console.log('[Confluence] Step 2: Parsing storage-format HTML...');
      const parsed = this.confluenceService.parseStorageFormat(storageHtml);
      const pageSummary = this.confluenceService.buildPageSummary(title, parsed);

      console.log('[Confluence] Step 2 complete.');
      console.log('[Confluence]   Tasks found:', parsed.tasks.length);
      console.log('[Confluence]   Sections found:', parsed.sections.length);
      console.log('[Confluence]   Page summary length:', pageSummary.length);
      if (parsed.tasks.length > 0) {
        console.log('[Confluence]   First task:', parsed.tasks[0]);
      }

      // ── Step 3: ask Claude to fill the checklist ──────────────────────────
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

      console.log('[Confluence] Claude prompt length (chars):', userMessage.length);

      const response = await this.claudeClient.createMessage(
        [{ role: 'user', content: userMessage }],
        { system: systemPrompt, maxTokens: 4096 }
      );

      const filledReport = response.content?.[0]?.text || '';

      console.log('[Confluence] Step 3 complete. Claude response length:', filledReport.length);
      console.log('[Confluence] Done. Sending response to client.');

      res.json({
        title,
        tasks: parsed.tasks,
        sections: parsed.sections.map((s) => s.heading),
        filledReport,
      });
    } catch (error) {
      console.error('[Confluence] ERROR in fill():', error.message);
      if (error.cause) console.error('[Confluence] Underlying cause:', error.cause);
      console.error('[Confluence] Stack:', error.stack);
      this.logger.error('ConfluenceController.fill error', { error: error.message });

      const msg = error.message.includes('fetch failed')
        ? `Network error reaching Confluence. Cause: ${error.cause?.message || error.cause || 'unknown'}. Are you on VPN? Is a proxy required?`
        : error.message;

      res.status(500).json({ error: true, message: msg });
    }
  }

  /**
   * GET /api/confluence/preview
   * Just fetches and parses the page — no Claude call.
   * Useful for debugging / confirming the parser sees the right content.
   */
  async preview(req, res) {
    console.log('[Confluence] preview() called. Query:', req.query);

    try {
      const { url, rawHtml, title: titleOverride } = req.query;
      const pat = process.env.ATLASSIAN_PAT;

      console.log('[Confluence] PAT present:', !!pat);

      if (!url && !rawHtml) {
        return res.status(400).json({ error: true, message: 'Provide url or rawHtml query param.' });
      }

      let storageHtml = rawHtml || '';
      let title = titleOverride || 'Preview';

      if (pat && url) {
        console.log('[Confluence] Fetching page for preview...');
        const page = await this.confluenceService.fetchPage(url, pat);
        storageHtml = page.storageHtml;
        title = page.title || title;
        console.log('[Confluence] Fetched. Title:', title, '| HTML length:', storageHtml.length);
      }

      console.log('[Confluence] Parsing HTML...');
      const parsed = this.confluenceService.parseStorageFormat(storageHtml);
      const summary = this.confluenceService.buildPageSummary(title, parsed);

      console.log('[Confluence] Preview parsed. Tasks:', parsed.tasks.length, 'Sections:', parsed.sections.length);

      res.json({ title, tasks: parsed.tasks, sections: parsed.sections, summary });
    } catch (error) {
      console.error('[Confluence] ERROR in preview():', error.message);
      if (error.cause) console.error('[Confluence] Underlying cause:', error.cause);
      this.logger.error('ConfluenceController.preview error', { error: error.message });

      // Give the frontend a more actionable message
      const msg = error.message.includes('fetch failed')
        ? `Network error reaching Confluence. Cause: ${error.cause?.message || error.cause || 'unknown'}. Are you on VPN? Is a proxy required?`
        : error.message;

      res.status(500).json({ error: true, message: msg });
    }
  }
}

module.exports = ConfluenceController;
