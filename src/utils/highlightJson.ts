export function highlightJson(json: string): string {
  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const escaped = escapeHtml(json);
  const pattern =
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g;

  return escaped.replace(pattern, (match) => {
    let cls = "number";
    if (match.startsWith("\"")) {
      cls = match.endsWith(":") ? "key" : "string";
    } else if (/true|false/.test(match)) {
      cls = "boolean";
    } else if (/null/.test(match)) {
      cls = "null";
    }
    return `<span class="${cls}">${match}</span>`;
  });
}
