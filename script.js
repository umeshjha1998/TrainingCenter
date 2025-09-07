document.addEventListener('DOMContentLoaded', () => {
    const certificateForm = document.getElementById('certificate-form');
    const certificateOutput = document.getElementById('certificate-output');
    const certificateDisplay = document.getElementById('certificate-display');
    const certName = document.getElementById('cert-name');
    const certCourse = document.getElementById('cert-course');
    const certDate = document.getElementById('cert-date');
    const qrCodeContainer = document.getElementById('qr-code-container'); // This is the temporary QR container
    const certQrCodeDisplay = document.getElementById('cert-qr-code-display'); // This is the QR container inside certificate-display
    const downloadCertButton = document.getElementById('download-cert');
    const certificateIdDisplay = document.getElementById('certificate-id-display');
    const certEmail = document.getElementById('cert-email');
    const certPhoneNumber = document.getElementById('cert-phone-number');

    const certificateIdInput = document.getElementById('certificate-id-input');
    const verifyCertButton = document.getElementById('verify-cert-button');
    const verificationResult = document.getElementById('verification-result');
    const verifiedCertName = document.getElementById('verified-cert-name');
    const verifiedCertCourse = document.getElementById('verified-cert-course');
    const verifiedCertDate = document.getElementById('verified-cert-date');
    const verificationMessage = document.getElementById('verification-message');
    const verifiedCertRollNumber = document.getElementById('verified-cert-roll-number');
    const verifiedCertEmail = document.getElementById('verified-cert-email');
    const verifiedCertPhoneNumber = document.getElementById('verified-cert-phone-number');
    const verifiedCertificateIdDisplay = document.getElementById('verified-certificate-id-display');
    const verifiedCertQrCodeDisplay = document.getElementById('verified-cert-qr-code-display');

    let generatedCertificateData = {};
    let allCertificates = JSON.parse(localStorage.getItem('allCertificates')) || {};

    // Add blur event listeners for validation
    const formInputs = certificateForm.querySelectorAll('input');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.checkValidity()) {
                input.classList.add('invalid');
                // You could add a more specific error message here if needed
            } else {
                input.classList.remove('invalid');
            }
        });
    });

    // Load certificate data from localStorage on page load
    const storedCertData = localStorage.getItem('generatedCertificateData');
    if (storedCertData) {
        generatedCertificateData = JSON.parse(storedCertData);
        certName.textContent = generatedCertificateData.name;
        certCourse.textContent = generatedCertificateData.course;
        certDate.textContent = generatedCertificateData.date;
        certificateIdDisplay.textContent = generatedCertificateData.id;
        certEmail.textContent = generatedCertificateData.email;
        certPhoneNumber.textContent = generatedCertificateData.phoneNumber;
        certificateOutput.style.display = 'block';

        // Regenerate QR code for display
        certQrCodeDisplay.innerHTML = '';
        new QRCode(certQrCodeDisplay, {
            text: `https://acdc-training-center.com/verify/${generatedCertificateData.id}`, // Redirect to verification page with certificate ID
            width: 128,
            height: 128
        });
    }

    certificateForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const traineeName = document.getElementById('trainee-name').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const courseName = document.getElementById('course-name').value;
        const completionDate = document.getElementById('completion-date').value;
        const rollNumber = document.getElementById('roll-number').value;

        // Basic form validation
        if (!certificateForm.checkValidity()) {
            // alert('Please fill in all required fields correctly.'); // Removed alert
            // Trigger blur on all fields to show validation messages
            formInputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.classList.add('invalid');
                }
            });
            e.preventDefault(); // Prevent form submission if invalid
            return;
        }

        certName.textContent = traineeName;
        certCourse.textContent = courseName;
        certDate.textContent = completionDate;
        certEmail.textContent = email;
        certPhoneNumber.textContent = phoneNumber;

        // Generate a unique certificate ID with the new format
        const certificateId = generateUniqueId(courseName, completionDate, rollNumber);
        certificateIdDisplay.textContent = certificateId;

        generatedCertificateData = {
            id: certificateId,
            name: traineeName,
            email: email,
            phoneNumber: phoneNumber,
            course: courseName,
            date: completionDate,
            rollNumber: rollNumber
        };

        // Store generated data in localStorage
        localStorage.setItem('generatedCertificateData', JSON.stringify(generatedCertificateData));

        // Store all certificates course-wise
        if (!allCertificates[courseName]) {
            allCertificates[courseName] = [];
        }
        // Check if certificate with same ID already exists (for update operation)
        const existingCertIndex = allCertificates[courseName].findIndex(cert => cert.id === certificateId);
        if (existingCertIndex > -1) {
            allCertificates[courseName][existingCertIndex] = generatedCertificateData;
        } else {
            allCertificates[courseName].push(generatedCertificateData);
        }
        localStorage.setItem('allCertificates', JSON.stringify(allCertificates));

        certificateOutput.style.display = 'block';

        // Clear previous QR code and generate new one directly into certQrCodeDisplay
        certQrCodeDisplay.innerHTML = '';
        new QRCode(certQrCodeDisplay, {
            text: `https://acdc-training-center.com/verify/${certificateId}`, // Redirect to verification page with certificate ID
            width: 128,
            height: 128
        });

        renderAllCertificates();
        certificateForm.reset(); // Clear form after submission
    });

    downloadCertButton.addEventListener('click', () => {
        // Add a small delay to ensure QR code is fully rendered before capturing
        setTimeout(() => {
            html2canvas(certificateDisplay).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `certificate_${generatedCertificateData.name}.png`;
                link.click();
            });
        }, 500); // Increased delay to 500ms
    });

    verifyCertButton.addEventListener('click', () => {
        const inputId = certificateIdInput.value;
        let foundCertificate = null;

        for (const course in allCertificates) {
            const certsInCourse = allCertificates[course];
            foundCertificate = certsInCourse.find(cert => cert.id === inputId);
            if (foundCertificate) {
                break;
            }
        }

        if (foundCertificate) {
            verifiedCertName.textContent = foundCertificate.name;
            verifiedCertCourse.textContent = foundCertificate.course;
            verifiedCertDate.textContent = foundCertificate.date;
            verifiedCertEmail.textContent = foundCertificate.email;
            verifiedCertPhoneNumber.textContent = foundCertificate.phoneNumber;
            verifiedCertificateIdDisplay.textContent = foundCertificate.id;
            verificationMessage.textContent = 'Certificate is valid and verified.';
            verificationResult.style.display = 'block';
            document.getElementById('verified-certificate-display').style.display = 'block';
            
            // Generate QR code for verified certificate
            verifiedCertQrCodeDisplay.innerHTML = '';
            new QRCode(verifiedCertQrCodeDisplay, {
                text: `https://acdc-training-center.com/verify/${foundCertificate.id}`, // Redirect to verification page with certificate ID
                width: 128,
                height: 128
            });
        } else {
            verificationMessage.textContent = 'Certificate not found or invalid.';
            verificationResult.style.display = 'block';
            verifiedCertName.textContent = '';
            verifiedCertCourse.textContent = '';
            verifiedCertDate.textContent = '';
            verifiedCertEmail.textContent = '';
            verifiedCertPhoneNumber.textContent = '';
            verifiedCertificateIdDisplay.textContent = '';
            document.getElementById('verified-certificate-display').style.display = 'none';
            verifiedCertQrCodeDisplay.innerHTML = ''; // Clear QR code if certificate not found
        }
    });

    function generateUniqueId(courseName, completionDate, rollNumber) {
        const formattedCourse = courseName.replace(/\s/g, '_').toUpperCase();
        const formattedDate = completionDate.replace(/-/g, ''); // YYYYMMDD
        return `ACDC_CERT_${formattedCourse}_${formattedDate}_${rollNumber}`;
    }

    // Function to render all certificates course-wise
    function renderAllCertificates() {
        const allCertificatesContainer = document.getElementById('all-certificates-container');
        if (!allCertificatesContainer) return;

        allCertificatesContainer.innerHTML = ''; // Clear previous content

        for (const course in allCertificates) {
            const courseDiv = document.createElement('div');
            courseDiv.classList.add('course-section');
            courseDiv.innerHTML = `<h4>${course} Certificates</h4>`;

            allCertificates[course].forEach(cert => {
                const certDiv = document.createElement('div');
                certDiv.classList.add('certificate-item');
                certDiv.innerHTML = `
                    <p><strong>ID:</strong> ${cert.id}</p>
                    <p><strong>Name:</strong> ${cert.name}</p>
                    <p><strong>Email:</strong> ${cert.email}</p>
                    <p><strong>Phone:</strong> ${cert.phoneNumber}</p>
                    <p><strong>Date:</strong> ${cert.date}</p>
                    <button class="edit-cert" data-id="${cert.id}" data-course="${cert.course}">Edit</button>
                    <button class="delete-cert" data-id="${cert.id}" data-course="${cert.course}">Delete</button>
                    <hr>
                `;
                courseDiv.appendChild(certDiv);
            });
            allCertificatesContainer.appendChild(courseDiv);
        }

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-cert').forEach(button => {
            button.addEventListener('click', (e) => {
                const certIdToEdit = e.target.dataset.id;
                const certCourseToEdit = e.target.dataset.course;
                editCertificate(certIdToEdit, certCourseToEdit);
            });
        });

        document.querySelectorAll('.delete-cert').forEach(button => {
            button.addEventListener('click', (e) => {
                const certIdToDelete = e.target.dataset.id;
                const certCourseToDelete = e.target.dataset.course;
                deleteCertificate(certIdToDelete, certCourseToDelete);
            });
        });
    }

    // Function to edit a certificate
    function editCertificate(id, course) {
        const certToEdit = allCertificates[course].find(cert => cert.id === id);
        if (certToEdit) {
            document.getElementById('trainee-name').value = certToEdit.name;
            document.getElementById('email').value = certToEdit.email;
            document.getElementById('phone-number').value = certToEdit.phoneNumber;
            document.getElementById('course-name').value = certToEdit.course;
            document.getElementById('completion-date').value = certToEdit.date;
            document.getElementById('roll-number').value = certToEdit.rollNumber;
            // The form submission will handle the update based on the ID
        }
    }

    // Function to delete a certificate
    function deleteCertificate(id, course) {
        if (confirm('Are you sure you want to delete this certificate?')) {
            allCertificates[course] = allCertificates[course].filter(cert => cert.id !== id);
            if (allCertificates[course].length === 0) {
                delete allCertificates[course];
            }
            localStorage.setItem('allCertificates', JSON.stringify(allCertificates));
            // If the deleted certificate was the one currently displayed, clear the display
            if (generatedCertificateData.id === id) {
                generatedCertificateData = {};
                localStorage.removeItem('generatedCertificateData');
                certificateOutput.style.display = 'none';
            }
            renderAllCertificates();
        }
    }

    // Initial render of all certificates on page load
    renderAllCertificates();
});