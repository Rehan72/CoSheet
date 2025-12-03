// Test CSV field mapping
const csvData = `id,Name,Email,Role,Phone,Department,Status,Address,Country,State
"John Doe",john@example.com,admin,+1234567890,IT,active,"123 Main St",us,California
"Jane Smith",jane@example.com,manager,+1987654321,HR,active,"456 Oak Ave",uk,London`;

function parseCSVLine(line) {
  const values = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // Add the last value
  values.push(currentValue.trim());

  // Ensure we have all expected fields (pad with empty strings if needed)
  while (values.length < 9) {
    values.push('');
  }

  return values;
}

const lines = csvData.split('\n');
const adminLines = lines.slice(1).filter(line => line.trim() !== '');

console.log('Parsing CSV lines:');
adminLines.forEach((line, index) => {
  console.log(`Line ${index + 1}:`, line);
  const values = parseCSVLine(line);
  console.log('Parsed values:', values);

  const admin = {
    name: values[0]?.trim() || "",
    email: values[1]?.trim() || "",
    role: values[2]?.trim() || "admin",
    phone: values[3]?.trim() || "",
    department: values[4]?.trim() || "",
    status: values[5]?.trim() || "active",
    address: values[6]?.trim() || "",
    country: values[7]?.trim() || "",
    state: values[8]?.trim() || "",
    profileImage: null
  };

  console.log('Mapped admin:', admin);
  console.log('---');
});