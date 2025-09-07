document.addEventListener('DOMContentLoaded', () => {
    const certificateForm = document.getElementById('certificate-form');
    const certificateOutput = document.getElementById('certificate-output');
    const certificateDisplay = document.getElementById('certificate-display');
    const certName = document.getElementById('cert-name');
    const certCourse = document.getElementById('cert-course');
    const certDate = document.getElementById('cert-date');
    const certQrCodeDisplay = document.getElementById('cert-qr-code-display');
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
    const verifiedCertEmail = document.getElementById('verified-cert-email');
    const verifiedCertPhoneNumber = document.getElementById('verified-cert-phone-number');
    const verifiedCertificateIdDisplay = document.getElementById('verified-certificate-id-display');
    const verifiedCertQrCodeDisplay = document.getElementById('verified-cert-qr-code-display');

    // No longer using local storage for allCertificates
    // let allCertificates = JSON.parse(localStorage.getItem('allCertificates')) || {};

    // Add blur event listeners for validation
    const formInputs = certificateForm.querySelectorAll('input');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (!input.checkValidity()) {
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });
    });

    // Function to generate a unique certificate ID
    function generateUniqueId(courseName, completionDate, rollNumber) {
        const formattedCourse = courseName.replace(/\s/g, '_').toUpperCase();
        const formattedDate = completionDate.replace(/-/g, ''); // YYYYMMDD
        return `ACDC_CERT_${formattedCourse}_${formattedDate}_${rollNumber}`;
    }

    // Function to load a single certificate into the form for editing
    async function loadCertificateIntoForm(certificateId) {
        try {
            const response = await fetch(`/api/certificates/${certificateId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const certToEdit = await response.json();

            document.getElementById('trainee-name').value = certToEdit.name || '';
            document.getElementById('email').value = certToEdit.email || '';
            document.getElementById('phone-number').value = certToEdit.phoneNumber || '';
            document.getElementById('course-name').value = certToEdit.course || '';
            document.getElementById('completion-date').value = certToEdit.completionDate || ''; // Note: property name change
            document.getElementById('roll-number').value = certToEdit.rollNumber || '';

            // Store the ID of the certificate being edited
            certificateForm.dataset.editingId = certificateId;

            // Scroll to the form section
            document.getElementById('generate-certificate').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error loading certificate for edit:', error);
            alert('Failed to load certificate for editing.');
        }
    }

    // Function to render all certificates
    async function renderAllCertificates() {
        const allCertificatesContainer = document.getElementById('all-certificates-container');
        if (!allCertificatesContainer) return;

        allCertificatesContainer.innerHTML = ''; // Clear previous content

        try {
            const response = await fetch('/api/certificates');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const certificates = await response.json();

            if (certificates.length === 0) {
                allCertificatesContainer.innerHTML = '<p>No certificates generated yet.</p>';
                return;
            }

            // Group certificates by course for display
            const certificatesByCourse = certificates.reduce((acc, cert) => {
                if (!acc[cert.course]) {
                    acc[cert.course] = [];
                }
                acc[cert.course].push(cert);
                return acc;
            }, {});

            for (const course in certificatesByCourse) {
                const courseDiv = document.createElement('div');
                courseDiv.classList.add('course-section');
                courseDiv.innerHTML = `<h4>${course} Certificates</h4>`;

                certificatesByCourse[course].forEach(cert => {
                    const certDiv = document.createElement('div');
                    certDiv.classList.add('certificate-item');
                    certDiv.innerHTML = `
                        <p><strong>ID:</strong> ${cert.id}</p>
                        <p><strong>Name:</strong> ${cert.name}</p>
                        <p><strong>Email:</strong> ${cert.email}</p>
                        <p><strong>Phone:</strong> ${cert.phoneNumber}</p>
                        <p><strong>Date:</strong> ${cert.completionDate}</p>
                        <button class="edit-cert" data-id="${cert.id}">Edit</button>
                        <button class="delete-cert" data-id="${cert.id}">Delete</button>
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
                    loadCertificateIntoForm(certIdToEdit);
                });
            });

            document.querySelectorAll('.delete-cert').forEach(button => {
                button.addEventListener('click', (e) => {
                    const certIdToDelete = e.target.dataset.id;
                    deleteCertificate(certIdToDelete);
                });
            });

        } catch (error) {
            console.error('Error rendering all certificates:', error);
            allCertificatesContainer.innerHTML = '<p>Failed to load certificates.</p>';
        }
    }

    certificateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const traineeName = document.getElementById('trainee-name').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const courseName = document.getElementById('course-name').value;
        const completionDate = document.getElementById('completion-date').value;
        const rollNumber = document.getElementById('roll-number').value;

        // Basic form validation
        if (!certificateForm.checkValidity()) {
            formInputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.classList.add('invalid');
                }
            });
            return; // Prevent form submission if invalid
        }

        const certificateId = generateUniqueId(courseName, completionDate, rollNumber);

        const certificateData = {
            id: certificateId,
            name: traineeName,
            email: email,
            phoneNumber: phoneNumber,
            course: courseName,
            completionDate: completionDate, // Adjusted to match backend model
            rollNumber: rollNumber
        };

        const editingId = certificateForm.dataset.editingId;
        let method = 'POST';
        let url = '/api/certificates';

        if (editingId) {
            method = 'PUT';
            url = `/api/certificates/${editingId}`;
            // When updating, we use the original ID, not a newly generated one potentially based on altered fields
            certificateData.id = editingId; 
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(certificateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Certificate operation successful:', result);
            alert(`Certificate ${editingId ? 'updated' : 'generated'} successfully!`);

            // Update the displayed certificate
            certName.textContent = certificateData.name;
            certCourse.textContent = certificateData.course;
            certDate.textContent = certificateData.completionDate;
            certificateIdDisplay.textContent = certificateData.id;
            certEmail.textContent = certificateData.email;
            certPhoneNumber.textContent = certificateData.phoneNumber;
            certificateOutput.style.display = 'block';

            certQrCodeDisplay.innerHTML = '';
            new QRCode(certQrCodeDisplay, {
                text: `https://training-center-k6bhf8duu-umesh-jhas-projects.vercel.app/verify/${certificateData.id}`, // IMPORTANT: Replace with your actual Vercel domain
                width: 128,
                height: 128
            });

            renderAllCertificates();
            certificateForm.reset(); // Clear form after submission
            delete certificateForm.dataset.editingId; // Clear editing state

        } catch (error) {
            console.error('Error during certificate operation:', error);
            alert(`Failed to ${editingId ? 'update' : 'generate'} certificate: ${error.message}`);
        }
    });

    downloadCertButton.addEventListener('click', () => {
        setTimeout(() => {
            html2canvas(certificateDisplay).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `certificate_${certName.textContent}.png`;
                link.click();
            });
        }, 500);
    });

    // Function to delete a certificate
    async function deleteCertificate(id) {
        if (confirm('Are you sure you want to delete this certificate?')) {
            try {
                const response = await fetch(`/api/certificates/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
                }

                console.log(`Certificate ${id} deleted successfully.`);
                alert('Certificate deleted successfully!');
                renderAllCertificates(); // Re-render the list

                // If the deleted certificate was the one currently displayed, clear the display
                if (certificateIdDisplay.textContent === id) {
                    certificateOutput.style.display = 'none';
                    certificateForm.reset();
                    delete certificateForm.dataset.editingId;
                }

            } catch (error) {
                console.error('Error deleting certificate:', error);
                alert(`Failed to delete certificate: ${error.message}`);
            }
        }
    }

    // Verify Certificate functionality
    verifyCertButton.addEventListener('click', async () => {
        const inputId = certificateIdInput.value;
        if (!inputId) {
            verificationMessage.textContent = 'Please enter a Certificate ID.';
            verificationResult.style.display = 'block';
            document.getElementById('verified-certificate-display').style.display = 'none';
            verifiedCertQrCodeDisplay.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(`/api/certificates/${inputId}`);
            if (!response.ok) {
                if (response.status === 404) {
                    verificationMessage.textContent = 'Certificate not found or invalid.';
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                const foundCertificate = await response.json();
                verifiedCertName.textContent = foundCertificate.name;
                verifiedCertCourse.textContent = foundCertificate.course;
                verifiedCertDate.textContent = foundCertificate.completionDate; // Note: property name change
                verifiedCertEmail.textContent = foundCertificate.email;
                verifiedCertPhoneNumber.textContent = foundCertificate.phoneNumber;
                verifiedCertificateIdDisplay.textContent = foundCertificate.id;
                verificationMessage.textContent = 'Certificate is valid and verified.';
                document.getElementById('verified-certificate-display').style.display = 'block';
                
                verifiedCertQrCodeDisplay.innerHTML = '';
                new QRCode(verifiedCertQrCodeDisplay, {
                    text: `https://training-center-k6bhf8duu-umesh-jhas-projects.vercel.app/verify/${foundCertificate.id}`, // IMPORTANT: Replace with your actual Vercel domain
                    width: 128,
                    height: 128
                });
            }
        } catch (error) {
            console.error('Error verifying certificate:', error);
            verificationMessage.textContent = `Error during verification: ${error.message}`;
            document.getElementById('verified-certificate-display').style.display = 'none';
            verifiedCertQrCodeDisplay.innerHTML = '';
        }
        verificationResult.style.display = 'block';
    });

    // Initial render of all certificates on page load
    renderAllCertificates();
});
