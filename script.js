/**
 * AC & DC Technical Institute - Core Logic
 */

const COURSES = [
    "NORMAL CELLING FAN",
    "HIGH-SPEED CELLING FAN",
    "TABLE FAN & STAND FAN",
    "COOLER",
    "DOMESTIC MOTORS",
    "AGRICULTUR MOTORS",
    "DOMESTIC MIXER GRINDER",
    "GEYSER",
    "SINGLE DOOR REFRIGERATOR",
    "DOUBLE DOOR REFRIGERATOR",
    "DEEP REFRIGERATOR",
    "INVERTER REFRIGERATOR",
    "FULL SERVICE AND GAS CHARGING"
];

const STORAGE_KEY = 'acdc_certs_v1';

// --- Data & Storage Service ---
const StorageService = {
    getAll: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },
    save: (cert) => {
        const certs = StorageService.getAll();
        const existingIndex = certs.findIndex(c => c.certificate_id === cert.certificate_id);
        if (existingIndex >= 0) {
            certs[existingIndex] = cert;
        } else {
            certs.push(cert);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(certs));
    },
    delete: (id) => {
        const certs = StorageService.getAll();
        const newCerts = certs.filter(c => c.certificate_id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newCerts));
    },
    get: (id) => {
        const certs = StorageService.getAll();
        return certs.find(c => c.certificate_id === id);
    }
};

// --- URL & Encoding Service ---
const EncodingService = {
    // Minify object to array to save space: [id, name, course, date, duration, subjects]
    // Subject: [name, max, secured]
    minify: (data) => {
        if (!data) return null;
        const subjects = data.subjects.map(s => [s.subject, s.maximum_marks, s.marks_secured]);
        return [
            data.certificate_id,
            data.name,
            data.course_name,
            data.date_of_completion,
            data.duration_of_course,
            subjects
        ];
    },
    // Expand array back to object
    expand: (arr) => {
        if (!arr || !Array.isArray(arr)) return null;
        return {
            certificate_id: arr[0],
            name: arr[1],
            course_name: arr[2],
            date_of_completion: arr[3],
            duration_of_course: arr[4],
            subjects: arr[5].map(s => ({ subject: s[0], maximum_marks: s[1], marks_secured: s[2] }))
        };
    },
    // Encode object to Base64 string safe for URL
    encode: (data) => {
        // We now encode the minified array instead of the full object
        const minified = EncodingService.minify(data);
        const json = JSON.stringify(minified);
        return btoa(encodeURIComponent(json));
    },
    // Decode Base64 string to object
    decode: (str) => {
        try {
            const json = decodeURIComponent(atob(str));
            const parsed = JSON.parse(json);
            // Check if it's the old object format or new array format
            if (Array.isArray(parsed)) {
                return EncodingService.expand(parsed);
            }
            return parsed; // Backward compatibility for previously printed certs
        } catch (e) {
            console.error("Decoding failed", e);
            return null;
        }
    },
    getVerificationUrl: (certData) => {
        // Get configured base URL or default to current origin
        let baseUrl = localStorage.getItem('acdc_base_url');

        // Logic:
        // 1. If baseUrl is explicitly set by user, USE IT.
        // 2. If NO baseUrl is set:
        //    a. If we are on file:// protocol, return relative path 'view.html' so it works locally by default.
        //    b. If we are on http/https, use window.location.origin

        if (!baseUrl) {
            if (window.location.protocol === 'file:') {
                // Return purely relative path for local file system compatibility
                baseUrl = ".";
            } else {
                baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
            }
        }

        // Ensure no trailing slash for consistency
        baseUrl = baseUrl.replace(/\/$/, '');

        // If it's just ".", we don't want "./" if we can help it, but "./view.html" is fine

        const encoded = EncodingService.encode(certData);
        return `${baseUrl}/view.html?data=${encoded}`;
    }
};

// Make StorageService global for index.html verification
window.StorageService = StorageService;
window.EncodingService = EncodingService; // Expose for use in index.html

// --- Settings Logic ---
function saveBaseUrl() {
    const inp = document.getElementById('baseUrlInput');
    if (inp) {
        let url = inp.value.trim();
        // Remove trailing slash if present
        if (url.endsWith('/')) url = url.slice(0, -1);

        if (url) {
            localStorage.setItem('acdc_base_url', url);
            alert('Domain URL Saved! Future certificates will use this domain for QR codes.');
        } else {
            localStorage.removeItem('acdc_base_url');
            alert('Domain URL Cleared. Reverting to local path.');
        }
    }
}

// Populate Settings on Load
document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('baseUrlInput');
    if (inp) {
        inp.value = localStorage.getItem('acdc_base_url') || '';
    }
});

// --- Utils ---
function generateId() {
    return 'CERT-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// --- App Controller (Admin) ---
// Only runs if we are on index.html (implied by presence of form)
document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('createForm');
    const tableBody = document.getElementById('certTableBody');
    const courseSelect = document.getElementById('courseName');

    if (createForm) {
        initAdmin(createForm, tableBody, courseSelect);
    } else {
        // We might be on view.html
        initView();
    }
});

function initAdmin(form, tableBody, courseSelect) {
    // Populate Courses
    COURSES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        courseSelect.appendChild(opt);
    });

    // Subject Form Logic
    const addSubjectBtn = document.getElementById('addSubjectBtn');
    const subjectsContainer = document.getElementById('subjectsContainer');

    addSubjectBtn.addEventListener('click', () => {
        addSubjectRow(subjectsContainer);
    });

    // Add one default subject row
    addSubjectRow(subjectsContainer);

    // Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        // Collect Subjects
        const subjects = [];
        const subjectInputs = document.querySelectorAll('.subject-entry');
        subjectInputs.forEach(div => {
            const name = div.querySelector('.sub-name').value;
            const max = div.querySelector('.sub-max').value;
            const secured = div.querySelector('.sub-sec').value;
            if (name) {
                subjects.push({ subject: name, maximum_marks: max, marks_secured: secured });
            }
        });

        const certData = {
            certificate_id: document.getElementById('certIdHidden').value || generateId(),
            name: formData.get('name'),
            course_name: formData.get('course_name'),
            date_of_completion: formData.get('date_of_completion'),
            duration_of_course: formData.get('duration_of_course'),
            subjects: subjects
        };

        StorageService.save(certData);
        form.reset();
        document.getElementById('certIdHidden').value = ''; // clear hidden ID
        subjectsContainer.innerHTML = ''; // clear subjects
        addSubjectRow(subjectsContainer); // add fresh row

        // Switch to list tab
        switchTab('generated');
        renderTable(tableBody);

        alert('Certificate Saved Successfully!');
    });

    // Initial Table Render
    renderTable(tableBody);

    // Tab Switching
    window.switchTab = (tabName) => {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active-tab', 'bg-blue-600', 'text-white'));

        document.getElementById(tabName + 'Tab').classList.remove('hidden');
        const btn = document.getElementById('btn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
        if (btn) btn.classList.add('active-tab', 'bg-blue-600', 'text-white');

        if (tabName === 'generated') {
            renderTable(tableBody);
        }
    };
}

function addSubjectRow(container, data = null) {
    const div = document.createElement('div');
    div.className = 'subject-entry grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 border rounded bg-gray-50';
    div.innerHTML = `
        <input type="text" class="sub-name p-2 border rounded" placeholder="Subject Name" value="${data ? data.subject : ''}" required>
        <input type="number" class="sub-max p-2 border rounded" placeholder="Max Marks" value="${data ? data.maximum_marks : '100'}" required>
        <input type="number" class="sub-sec p-2 border rounded" placeholder="Marks Secured" value="${data ? data.marks_secured : ''}" required>
        <button type="button" class="text-red-500 hover:text-red-700" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(div);
}

function renderTable(tbody) {
    const certs = StorageService.getAll();
    tbody.innerHTML = '';

    if (certs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">No certificates generated yet.</td></tr>';
        return;
    }

    certs.forEach(cert => {
        const tr = document.createElement('tr');
        tr.className = 'border-b hover:bg-gray-50';
        tr.innerHTML = `
            <td class="p-3">${cert.certificate_id}</td>
            <td class="p-3 font-medium">${cert.name}</td>
            <td class="p-3">${cert.course_name}</td>
            <td class="p-3">${formatDate(cert.date_of_completion)}</td>
            <td class="p-3">
                <button onclick="viewCert('${cert.certificate_id}')" class="text-blue-600 hover:underline mr-2">View</button>
                <button onclick="editCert('${cert.certificate_id}')" class="text-green-600 hover:underline mr-2">Edit</button>
                <button onclick="deleteCert('${cert.certificate_id}')" class="text-red-600 hover:underline">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function deleteCert(id) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        StorageService.delete(id);
        renderTable(document.getElementById('certTableBody'));
    }
}

function editCert(id) {
    const cert = StorageService.get(id);
    if (!cert) return;

    // Switch to create tab
    switchTab('create');

    // Fill form
    document.getElementById('certIdHidden').value = cert.certificate_id;
    document.querySelector('[name="name"]').value = cert.name;
    document.querySelector('[name="course_name"]').value = cert.course_name;
    document.querySelector('[name="date_of_completion"]').value = cert.date_of_completion;
    document.querySelector('[name="duration_of_course"]').value = cert.duration_of_course;

    // Fill subjects
    const subjectContainer = document.getElementById('subjectsContainer');
    subjectContainer.innerHTML = '';
    cert.subjects.forEach(sub => addSubjectRow(subjectContainer, sub));
}

function viewCert(id) {
    const cert = StorageService.get(id);
    if (!cert) return;
    const url = EncodingService.getVerificationUrl(cert);
    window.open(url, '_blank');
}


// --- View Controller (View Logic) ---
function initView() {
    const params = new URLSearchParams(window.location.search);
    const dataStr = params.get('data');
    const contentDiv = document.getElementById('certificateContent');
    const errorDiv = document.getElementById('errorContent');

    if (!dataStr) {
        showError("Certificate not found. No data provided.");
        return;
    }

    const data = EncodingService.decode(dataStr);
    if (!data) {
        showError("Certificate not found. Invalid data.");
        return;
    }

    // Populate Data
    document.getElementById('vName').textContent = data.name;
    document.getElementById('vCourse').textContent = data.course_name;
    document.getElementById('vDate').textContent = formatDate(data.date_of_completion);
    document.getElementById('vDuration').textContent = data.duration_of_course;
    document.getElementById('vID').textContent = data.certificate_id;

    // Link Text
    const linkSpan = document.getElementById('qrLinkText');
    if (linkSpan) {
        // Display a clean URL
        const url = window.location.href.split('?')[0];
        linkSpan.textContent = url + '...';
    }

    // Subjects
    const tBody = document.getElementById('vMarkTable');
    if (tBody) {
        tBody.innerHTML = '';
        data.subjects.forEach((sub, idx) => {
            const tr = document.createElement('tr');
            // Alternate row styling handled by CSS or utility
            tr.className = idx % 2 === 0 ? 'bg-white' : 'bg-blue-50';
            tr.innerHTML = `
                <td class="p-3 border-b border-gray-100">${sub.subject}</td>
                <td class="p-3 border-b border-gray-100 font-mono text-gray-600">${sub.maximum_marks}</td>
                <td class="p-3 border-b border-gray-100 font-bold text-blue-900">${sub.marks_secured}</td>
            `;
            tBody.appendChild(tr);
        });
    }

    // Generate QR
    const qrContainer = document.getElementById('qrCodeContainer');
    // The Verification URL is simply the current URL
    const verifyUrl = window.location.href;

    // Clear previous if any
    qrContainer.innerHTML = '';

    new QRCode(qrContainer, {
        text: verifyUrl,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M // Lower correction level (M or L) makes the code less dense
    });

    // Show Content
    contentDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
}

function showError(msg) {
    const contentDiv = document.getElementById('certificateContent');
    const errorDiv = document.getElementById('errorContent');
    const errorMsg = document.getElementById('errorMessage');

    if (contentDiv) contentDiv.classList.add('hidden');
    if (errorDiv) errorDiv.classList.remove('hidden');
    if (errorMsg) errorMsg.textContent = msg;
}

function handleDownload() {
    if (confirm("Download Certificate as PDF?")) {
        window.print();
        setTimeout(() => {
            alert("Download initiated.");
        }, 1000);
    }
}
