const parseCsv = (content) => {
  const lines = content
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return [];
  }

  const headers = lines[0].split(',').map((cell) => cell.trim());
  const rows = lines.slice(1).map((line) => {
    const columns = line.split(',').map((cell) => cell.trim());
    const record = {};
    headers.forEach((header, index) => {
      record[header] = columns[index] || '';
    });
    return record;
  });

  return rows;
};

module.exports = {
  parseCsv,
};
