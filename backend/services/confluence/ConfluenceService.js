/**
 * ConfluenceService
 *
 * Fetches Confluence pages via the REST API and parses storage-format HTML
 * to extract checklist/task items and structured content.
 *
 * Works in two modes:
 *   1. With PAT: calls the Confluence REST API directly
 *   2. Without PAT: accepts raw storage-format HTML pasted by the user
 */
class ConfluenceService {
  /**
   * Extract the base URL and page ID from a Confluence page URL.
   * Handles both /pages/{id}/... and /display/{spaceKey}/... patterns.
   */
  parsePageUrl(url) {
    try {
      const parsed = new URL(url);
      const baseUrl = `${parsed.protocol}//${parsed.hostname}`;

      // Pattern: /spaces/{space}/pages/{pageId}/...  OR  /pages/{pageId}/...
      const pageMatch = parsed.pathname.match(/\/pages\/(\d+)/);
      if (pageMatch) {
        return { baseUrl, pageId: pageMatch[1] };
      }

      throw new Error('Could not extract page ID from URL. Expected /pages/{id}/ in path.');
    } catch (err) {
      if (err.message.includes('Could not extract')) throw err;
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  /**
   * Fetch a Confluence page's storage-format body via the REST API.
   * Requires a valid PAT (Personal Access Token).
   */
  async fetchPage(url, pat) {
    const { baseUrl, pageId } = this.parsePageUrl(url);
    const apiUrl = `${baseUrl}/rest/api/content/${pageId}?expand=body.storage,title,version`;

    console.log('[ConfluenceService] fetchPage() baseUrl:', baseUrl);
    console.log('[ConfluenceService] fetchPage() pageId:', pageId);
    console.log('[ConfluenceService] fetchPage() apiUrl:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('[ConfluenceService] fetchPage() HTTP status:', response.status, response.statusText);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('[ConfluenceService] fetchPage() error body:', text.slice(0, 500));
      throw new Error(
        `Confluence API error ${response.status}: ${response.statusText}. ${text.slice(0, 200)}`
      );
    }


    const data = await response.json();
    console.log('[ConfluenceService] fetchPage() page title:', data.title);
    console.log('[ConfluenceService] fetchPage() storage HTML length:', data.body?.storage?.value?.length || 0);

    return {
      title: data.title,
      pageId,
      storageHtml: data.body?.storage?.value || '',
      version: data.version?.number,
      url,
    };
  }

  /**
   * Parse Confluence storage-format HTML and extract structured content:
   * - Page sections (headings + body text)
   * - Task/checklist items (ac:task-list and ac:task macros)
   */
  parseStorageFormat(storageHtml) {
    console.log('[ConfluenceService] parseStorageFormat() input length:', storageHtml.length);
    const sections = [];
    const tasks = [];

    // ── Extract task list items ──────────────────────────────────────────────
    // Confluence storage format: <ac:task-list><ac:task>...<ac:task-body>TEXT</ac:task-body>...<ac:task-status>incomplete|complete</ac:task-status>...</ac:task></ac:task-list>
    const taskListRegex = /<ac:task-list>([\s\S]*?)<\/ac:task-list>/gi;
    let taskListMatch;
    while ((taskListMatch = taskListRegex.exec(storageHtml)) !== null) {
      const listContent = taskListMatch[1];
      const taskRegex = /<ac:task>([\s\S]*?)<\/ac:task>/gi;
      let taskMatch;
      while ((taskMatch = taskRegex.exec(listContent)) !== null) {
        const taskContent = taskMatch[1];
        const idMatch = taskContent.match(/<ac:task-id>(\d+)<\/ac:task-id>/i);
        const statusMatch = taskContent.match(/<ac:task-status>(.*?)<\/ac:task-status>/i);
        const bodyMatch = taskContent.match(/<ac:task-body>([\s\S]*?)<\/ac:task-body>/i);
        tasks.push({
          id: idMatch ? idMatch[1] : null,
          status: statusMatch ? statusMatch[1].trim() : 'incomplete',
          body: bodyMatch ? this._stripTags(bodyMatch[1]).trim() : '',
        });
      }
    }

    // ── Extract sections by heading ──────────────────────────────────────────
    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    const headings = [];
    let hMatch;
    while ((hMatch = headingRegex.exec(storageHtml)) !== null) {
      headings.push({
        level: parseInt(hMatch[1], 10),
        text: this._stripTags(hMatch[2]).trim(),
        offset: hMatch.index,
      });
    }

    for (let i = 0; i < headings.length; i++) {
      const start = headings[i].offset;
      const end = i + 1 < headings.length ? headings[i + 1].offset : storageHtml.length;
      const sectionHtml = storageHtml.slice(start, end);
      sections.push({
        level: headings[i].level,
        heading: headings[i].text,
        text: this._stripTags(sectionHtml).replace(/\s+/g, ' ').trim(),
      });
    }

    // If no headings found, treat the whole body as one section
    if (sections.length === 0) {
      sections.push({
        level: 0,
        heading: 'Content',
        text: this._stripTags(storageHtml).replace(/\s+/g, ' ').trim(),
      });
    }

    console.log('[ConfluenceService] parseStorageFormat() found', tasks.length, 'tasks and', sections.length, 'sections');
    return { sections, tasks };
  }

  /** Strip XML/HTML tags from a string */
  _stripTags(html) {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  /**
   * Build a structured text summary of the page suitable for feeding to Claude.
   */
  buildPageSummary(title, parsed) {
    const lines = [`# ${title || 'Confluence Page'}`, ''];

    if (parsed.tasks.length > 0) {
      lines.push('## Checklist Items');
      for (const task of parsed.tasks) {
        const checkmark = task.status === 'complete' ? '[x]' : '[ ]';
        lines.push(`- ${checkmark} ${task.body}`);
      }
      lines.push('');
    }

    if (parsed.sections.length > 0) {
      lines.push('## Page Sections');
      for (const section of parsed.sections) {
        const prefix = '#'.repeat(Math.max(section.level + 1, 2));
        lines.push(`${prefix} ${section.heading}`);
        if (section.text) lines.push(section.text.slice(0, 500)); // cap per section
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}

module.exports = ConfluenceService;
