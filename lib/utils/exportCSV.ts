/**
 * Converts an array of objects to a CSV string and triggers a download.
 * @param data     Array of flat objects (no nested objects; flatten before calling)
 * @param filename Desired file name (without .csv extension)
 */
export function downloadCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);

  const escape = (val: any): string => {
    if (val === null || val === undefined) return '';
    const str = String(val).replace(/"/g, '""');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str}"`
      : str;
  };

  const rows = [
    headers.join(','),
    ...data.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ];

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
