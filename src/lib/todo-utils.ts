export type TodoMarker = {
  raw: string;
  detail: string;
  display: string;
};

const TODO_MARKER_REGEX = /\[TODO(?::?\s*([^\]]*))?\]|\bTODO\b/g;

export function stripMarkdownText(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseTodoMarker(raw: string, detail = ''): TodoMarker {
  const cleanDetail = detail.trim();
  return {
    raw,
    detail: cleanDetail || 'TODO',
    display: cleanDetail ? `TO DO: ${cleanDetail}` : 'TO DO',
  };
}

export function replaceTodoMarkers(
  value: string,
  replacer: (marker: TodoMarker) => string
): string {
  return value.replace(TODO_MARKER_REGEX, (raw, detail = '') => replacer(parseTodoMarker(raw, detail)));
}

export function hasTodoMarker(value: string): boolean {
  TODO_MARKER_REGEX.lastIndex = 0;
  return TODO_MARKER_REGEX.test(value);
}

export function linkifyTodosInMarkdown(
  markdown: string,
  getHref: (marker: TodoMarker, sectionTitle: string) => string,
  fallbackSectionTitle: string
): string {
  let currentSectionTitle = fallbackSectionTitle;

  return markdown
    .split('\n')
    .map((line) => {
      const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
      const sectionTitleForLine = headingMatch
        ? stripMarkdownText(headingMatch[1]) || currentSectionTitle
        : currentSectionTitle;

      const nextLine = replaceTodoMarkers(line, (marker) => {
        const href = getHref(marker, sectionTitleForLine);
        return `[${marker.display}](${href})`;
      });

      if (headingMatch) {
        currentSectionTitle = sectionTitleForLine;
      }

      return nextLine;
    })
    .join('\n');
}

