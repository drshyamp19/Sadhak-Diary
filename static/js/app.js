/**
 * Sadhak Diary - Enhanced App Logic
 * Features:
 * 1. 100% Pure Isolated Languages (Marathi, Hindi, English - no mixed brackets!)
 * 2. Live Selfie Camera Capture (WebRTC + Mobile Camera Fallback)
 * 3. Photo Upload with Live Avatar Preview
 * 4. Birthday & Diksha Anniversary Tracker + WhatsApp Greetings
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current language state (defaults to 'mr')
  let currentLang = localStorage.getItem('sadhak_lang') || 'mr';

  // Form & Buttons
  const form = document.getElementById('sadhakForm');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const submitSpinner = document.getElementById('submitSpinner');
  const submitIcon = document.getElementById('submitIcon');
  const submitBtnText = document.getElementById('submitBtnText');
  const successBanner = document.getElementById('successBanner');
  const successTitle = document.getElementById('successTitle');
  const successMessage = document.getElementById('successMessage');
  const successMeta = document.getElementById('successMeta');
  const bannerNewEntryBtn = document.getElementById('bannerNewEntryBtn');

  // Stats Counters
  const statCompletedCount = document.getElementById('statCompletedCount');
  const statAspiringCount = document.getElementById('statAspiringCount');
  const statNoneCount = document.getElementById('statNoneCount');

  // Language Selector Buttons
  const langBtns = document.querySelectorAll('.lang-btn');

  // Photo & Camera Elements
  const openCameraBtn = document.getElementById('openCameraBtn');
  const choosePhotoBtn = document.getElementById('choosePhotoBtn');
  const photoFileInput = document.getElementById('photoFileInput');
  const cameraMobileDirectInput = document.getElementById('cameraMobileDirectInput');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const avatarImage = document.getElementById('avatarImage');
  const avatarPlaceholderIcon = document.getElementById('avatarPlaceholderIcon');
  const photoUrlInput = document.getElementById('photoUrlInput');

  // Camera Modal Elements
  const cameraModal = document.getElementById('cameraModal');
  const closeCameraBtn = document.getElementById('closeCameraBtn');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraCapturedPreview = document.getElementById('cameraCapturedPreview');
  const cameraViewport = document.getElementById('cameraViewport');
  const shutterBtn = document.getElementById('shutterBtn');
  const switchCameraBtn = document.getElementById('switchCameraBtn');
  const cameraShutterRow = document.getElementById('cameraShutterRow');
  const cameraConfirmRow = document.getElementById('cameraConfirmRow');
  const retakePhotoBtn = document.getElementById('retakePhotoBtn');
  const confirmPhotoBtn = document.getElementById('confirmPhotoBtn');
  const cameraCanvas = document.getElementById('cameraCanvas');

  // Camera State
  let cameraStream = null;
  let currentFacingMode = 'user'; // 'user' (front) or 'environment' (back)
  let capturedDataUrl = null;

  // Personal Inputs
  const fullNameInput = document.getElementById('fullName');
  const dobInput = document.getElementById('dob');
  const mobileInput = document.getElementById('mobile');

  // Address Inputs
  const houseBuildingWardInput = document.getElementById('houseBuildingWard');
  const streetAreaLandmarkInput = document.getElementById('streetAreaLandmark');
  const stateSelect = document.getElementById('stateSelect');
  const districtSelect = document.getElementById('districtSelect');
  const tehsilSelect = document.getElementById('tehsilSelect');
  const pincodeInput = document.getElementById('pincode');

  // Status Radios & Dynamic Sections
  const statusRadios = document.querySelectorAll('input[name="diksha_status"]');
  const sectionStatusCompleted = document.getElementById('sectionStatusCompleted');
  const sectionStatusAspiring = document.getElementById('sectionStatusAspiring');
  const sectionStatusNone = document.getElementById('sectionStatusNone');

  // Section 1 (Completed)
  const dikshaDateInput = document.getElementById('dikshaDate');
  const dikshaTypeSelect = document.getElementById('dikshaTypeSelect');
  const otherDikshaTypeWrapper = document.getElementById('otherDikshaTypeWrapper');
  const dikshaTypeOtherInput = document.getElementById('dikshaTypeOther');
  const dikshaGuruSelect = document.getElementById('dikshaGuruSelect');
  const otherGuruWrapper = document.getElementById('otherGuruWrapper');
  const dikshaGuruOtherInput = document.getElementById('dikshaGuruOther');

  // Section 2 (Aspiring)
  const aspiringDikshaTypeSelect = document.getElementById('aspiringDikshaTypeSelect');
  const otherAspiringTypeWrapper = document.getElementById('otherAspiringTypeWrapper');
  const aspiringTypeOther = document.getElementById('aspiringTypeOther');
  const aspiringGuruSelect = document.getElementById('aspiringGuruSelect');
  const aspiringDateInput = document.getElementById('aspiringDateInput');
  const aspiringNotesInput = document.getElementById('aspiringNotesInput');

  // Section 3 (None)
  const generalInterestSelect = document.getElementById('generalInterestSelect');
  const generalNotesInput = document.getElementById('generalNotesInput');

  // Directory Modal
  const openRecordsBtn = document.getElementById('openRecordsBtn');
  const closeRecordsBtn = document.getElementById('closeRecordsBtn');
  const recordsModal = document.getElementById('recordsModal');
  const recordsTableBody = document.getElementById('recordsTableBody');
  const recordSearchInput = document.getElementById('recordSearchInput');
  const filterTabBtns = document.querySelectorAll('.filter-tab-btn');
  const tableHeaderRow = document.getElementById('tableHeaderRow');

  // Tracker Modal
  const openTrackerBtn = document.getElementById('openTrackerBtn');
  const closeTrackerBtn = document.getElementById('closeTrackerBtn');
  const trackerModal = document.getElementById('trackerModal');
  const btnTabDikshaAnniversary = document.getElementById('btnTabDikshaAnniversary');
  const btnTabBirthday = document.getElementById('btnTabBirthday');
  const dikshaAnniversariesView = document.getElementById('dikshaAnniversariesView');
  const birthdaysView = document.getElementById('birthdaysView');
  const dikshaAnniversariesGrid = document.getElementById('dikshaAnniversariesGrid');
  const birthdaysGrid = document.getElementById('birthdaysGrid');

  // Today constraints
  const todayIso = new Date().toISOString().split('T')[0];
  dobInput.max = todayIso;
  dikshaDateInput.max = todayIso;

  // --------------------------------------------------------------------------
  // 1. 100% Pure Language Switcher (No mixed brackets)
  // --------------------------------------------------------------------------
  function applyLanguage(lang) {
    if (!TRANSLATIONS || !TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('sadhak_lang', lang);
    document.documentElement.lang = lang;

    const t = TRANSLATIONS[lang];

    // Update active button
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // Update Placeholders
    if (fullNameInput) fullNameInput.placeholder = t.fullNamePlaceholder || '';
    if (mobileInput) mobileInput.placeholder = t.mobilePlaceholder || '';
    if (houseBuildingWardInput) houseBuildingWardInput.placeholder = t.housePlaceholder || '';
    if (streetAreaLandmarkInput) streetAreaLandmarkInput.placeholder = t.streetPlaceholder || '';
    if (pincodeInput) pincodeInput.placeholder = t.pincodePlaceholder || '';
    if (recordSearchInput) recordSearchInput.placeholder = t.searchPlaceholder || '';
    if (dikshaTypeOtherInput) dikshaTypeOtherInput.placeholder = t.dikshaTypeOtherPlaceholder || '';
    if (dikshaGuruOtherInput) dikshaGuruOtherInput.placeholder = t.dikshaGuruOtherPlaceholder || '';
    if (aspiringNotesInput) aspiringNotesInput.placeholder = t.aspiringNotesPlaceholder || '';
    if (generalNotesInput) generalNotesInput.placeholder = t.generalNotesPlaceholder || '';

    // Populate Guru Dropdowns in pure script
    populateGuruDropdowns(lang);

    // Update Directory Table Headers
    if (tableHeaderRow) {
      if (lang === 'mr') {
        tableHeaderRow.innerHTML = `<th>क्र.</th><th>साधकाचे नाव</th><th>मोबाईल</th><th>स्थान</th><th>दीक्षा स्थिती</th><th>तपशील</th><th>गुरू / संदर्भ</th>`;
      } else if (lang === 'hi') {
        tableHeaderRow.innerHTML = `<th>क्र.</th><th>साधक का नाम</th><th>मोबाइल</th><th>स्थान</th><th>दीक्षा स्थिति</th><th>विवरण</th><th>गुरु / संदर्भ</th>`;
      } else {
        tableHeaderRow.innerHTML = `<th>ID</th><th>Sadhak Name</th><th>Mobile</th><th>Location</th><th>Status</th><th>Details</th><th>Guru / Lineage</th>`;
      }
    }
  }

  function populateGuruDropdowns(lang) {
    const t = TRANSLATIONS[lang];
    const prevGuruVal = dikshaGuruSelect.value;
    const prevAspGuruVal = aspiringGuruSelect.value;

    // Completed Guru Select
    dikshaGuruSelect.innerHTML = `<option value="">${t.dikshaGuruSelectPlaceholder}</option>`;
    if (GURU_OPTIONS && GURU_OPTIONS[lang]) {
      GURU_OPTIONS[lang].forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        dikshaGuruSelect.appendChild(opt);
      });
    }

    // Aspiring Guru Select
    aspiringGuruSelect.innerHTML = '';
    if (ASPIRING_GURU_OPTIONS && ASPIRING_GURU_OPTIONS[lang]) {
      ASPIRING_GURU_OPTIONS[lang].forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        aspiringGuruSelect.appendChild(opt);
      });
    }

    if (prevGuruVal) dikshaGuruSelect.value = prevGuruVal;
    if (prevAspGuruVal) aspiringGuruSelect.value = prevAspGuruVal;
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.dataset.lang);
    });
  });

  // --------------------------------------------------------------------------
  // 2. Live Selfie Camera Modal & WebRTC
  // --------------------------------------------------------------------------
  openCameraBtn.addEventListener('click', () => {
    cameraModal.classList.add('active');
    startCameraStream();
  });

  closeCameraBtn.addEventListener('click', () => {
    stopCameraStream();
    cameraModal.classList.remove('active');
  });

  cameraModal.addEventListener('click', (e) => {
    if (e.target === cameraModal) {
      stopCameraStream();
      cameraModal.classList.remove('active');
    }
  });

  async function startCameraStream() {
    stopCameraStream();
    resetCameraShutterUI();

    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showCameraError(t.cameraErrorText || 'कॅमेरा सुरू होऊ शकला नाही. कृपया गॅलरीतून फोटो निवडा.');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      };

      cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      cameraVideo.srcObject = cameraStream;
      await cameraVideo.play();

      cameraVideo.style.display = 'block';
      cameraCapturedPreview.style.display = 'none';

      // Remove error fallback if previously shown
      const errElem = document.getElementById('cameraErrorFallback');
      if (errElem) errElem.remove();

      // Mirror video only for front/selfie camera
      if (currentFacingMode === 'user') {
        cameraVideo.style.transform = 'scaleX(-1)';
      } else {
        cameraVideo.style.transform = 'scaleX(1)';
      }
    } catch (err) {
      console.warn('getUserMedia error:', err);
      showCameraError(t.cameraErrorText || 'कॅमेरा उपलब्ध नाही किंवा परवानगी मिळालेली नाही. कृपया फाईल किंवा गॅलरीतून फोटो निवडा.');
    }
  }

  function showCameraError(msg) {
    cameraVideo.style.display = 'none';
    cameraCapturedPreview.style.display = 'none';

    let errElem = document.getElementById('cameraErrorFallback');
    if (!errElem) {
      errElem = document.createElement('div');
      errElem.id = 'cameraErrorFallback';
      errElem.style.cssText = 'color:#f8fafc;padding:1.5rem;text-align:center;font-size:0.875rem;line-height:1.5;display:flex;flex-direction:column;align-items:center;gap:1rem;';
      cameraViewport.appendChild(errElem);
    }
    
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    errElem.innerHTML = `
      <span style="font-size:2.5rem;">📷</span>
      <span>${escapeHtml(msg)}</span>
      <button type="button" class="btn btn-primary" id="fallbackPickFileBtn" style="padding:0.45rem 1rem;font-size:0.8rem;">
        📁 ${t.photoUploadBtn}
      </button>
    `;

    document.getElementById('fallbackPickFileBtn').addEventListener('click', () => {
      cameraModal.classList.remove('active');
      photoFileInput.click();
    });
  }

  function stopCameraStream() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
  }

  // Switch between front (selfie) and back camera
  switchCameraBtn.addEventListener('click', () => {
    currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    startCameraStream();
  });

  // Take Snapshot
  shutterBtn.addEventListener('click', () => {
    if (!cameraStream) return;

    // Flash visual effect
    cameraViewport.classList.add('camera-flash');
    setTimeout(() => cameraViewport.classList.remove('camera-flash'), 300);

    const videoWidth = cameraVideo.videoWidth || 640;
    const videoHeight = cameraVideo.videoHeight || 640;
    const cropSize = Math.min(videoWidth, videoHeight);

    cameraCanvas.width = 480;
    cameraCanvas.height = 480;
    const ctx = cameraCanvas.getContext('2d');

    const startX = (videoWidth - cropSize) / 2;
    const startY = (videoHeight - cropSize) / 2;

    if (currentFacingMode === 'user') {
      // Mirror canvas drawing to match front selfie mirror
      ctx.translate(480, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(cameraVideo, startX, startY, cropSize, cropSize, 0, 0, 480, 480);

    capturedDataUrl = cameraCanvas.toDataURL('image/jpeg', 0.9);
    cameraCapturedPreview.src = capturedDataUrl;
    cameraCapturedPreview.style.display = 'block';
    cameraVideo.style.display = 'none';

    // Show Retake / Confirm buttons
    cameraShutterRow.style.display = 'none';
    cameraConfirmRow.style.display = 'flex';
  });

  // Retake Photo
  retakePhotoBtn.addEventListener('click', () => {
    resetCameraShutterUI();
    cameraVideo.style.display = 'block';
    cameraCapturedPreview.style.display = 'none';
  });

  function resetCameraShutterUI() {
    cameraShutterRow.style.display = 'flex';
    cameraConfirmRow.style.display = 'none';
  }

  // Confirm and Use Captured Selfie
  confirmPhotoBtn.addEventListener('click', async () => {
    if (!capturedDataUrl) return;

    avatarImage.src = capturedDataUrl;
    avatarImage.style.display = 'block';
    avatarPlaceholderIcon.style.display = 'none';
    removePhotoBtn.style.display = 'inline-flex';
    photoUrlInput.value = capturedDataUrl;

    stopCameraStream();
    cameraModal.classList.remove('active');

    // Convert dataURL to Blob and upload to server
    try {
      const blob = await (await fetch(capturedDataUrl)).blob();
      const formData = new FormData();
      formData.append('photo', blob, 'selfie.jpg');

      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.photo_url) {
        photoUrlInput.value = data.photo_url;
      }
    } catch (e) {
      console.warn('Server photo upload error, keeping base64:', e);
    }
  });

  // Mobile Native Camera Fallback
  cameraMobileDirectInput.addEventListener('change', (e) => {
    handlePhotoFileSelect(e.target.files[0]);
  });

  // --------------------------------------------------------------------------
  // 3. Gallery / File Upload
  // --------------------------------------------------------------------------
  choosePhotoBtn.addEventListener('click', () => {
    photoFileInput.click();
  });

  photoFileInput.addEventListener('change', (e) => {
    handlePhotoFileSelect(e.target.files[0]);
  });

  async function handlePhotoFileSelect(file) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(currentLang === 'en' ? 'Photo size exceeds 5MB limit.' : 'फोटोची साईज ५MB पेक्षा जास्त असू नये.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      avatarImage.src = event.target.result;
      avatarImage.style.display = 'block';
      avatarPlaceholderIcon.style.display = 'none';
      removePhotoBtn.style.display = 'inline-flex';
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.photo_url) {
        photoUrlInput.value = data.photo_url;
      }
    } catch (err) {
      console.warn('Server upload fallback base64:', err);
      photoUrlInput.value = avatarImage.src;
    }
  }

  removePhotoBtn.addEventListener('click', () => {
    photoFileInput.value = '';
    cameraMobileDirectInput.value = '';
    photoUrlInput.value = '';
    avatarImage.src = '';
    avatarImage.style.display = 'none';
    avatarPlaceholderIcon.style.display = 'inline-block';
    removePhotoBtn.style.display = 'none';
  });

  // --------------------------------------------------------------------------
  // 4. Status Switcher (Completed / Aspiring / None)
  // --------------------------------------------------------------------------
  function getSelectedStatus() {
    const checked = document.querySelector('input[name="diksha_status"]:checked');
    return checked ? checked.value : 'दीक्षा झालेली आहे';
  }

  function handleStatusChange() {
    const status = getSelectedStatus();

    document.querySelectorAll('.status-option-label').forEach(lbl => {
      const radio = lbl.querySelector('input[type="radio"]');
      if (radio && radio.checked) {
        lbl.classList.add('is-selected');
      } else {
        lbl.classList.remove('is-selected');
      }
    });

    sectionStatusCompleted.classList.remove('active');
    sectionStatusAspiring.classList.remove('active');
    sectionStatusNone.classList.remove('active');

    dikshaDateInput.required = false;
    dikshaTypeSelect.required = false;
    dikshaGuruSelect.required = false;

    if (status === 'दीक्षा झालेली आहे') {
      sectionStatusCompleted.classList.add('active');
      dikshaDateInput.required = true;
      dikshaTypeSelect.required = true;
      dikshaGuruSelect.required = true;
    } else if (status === 'दीक्षा घेणार / इच्छुक') {
      sectionStatusAspiring.classList.add('active');
    } else if (status === 'दीक्षा झालेली नाही') {
      sectionStatusNone.classList.add('active');
    }
  }

  statusRadios.forEach(radio => {
    radio.addEventListener('change', handleStatusChange);
  });

  // --------------------------------------------------------------------------
  // 5. Cascading Location Dropdowns
  // --------------------------------------------------------------------------
  function initLocationDropdowns() {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    stateSelect.innerHTML = `<option value="">${t.stateSelectPlaceholder}</option>`;
    if (typeof INDIAN_LOCATIONS !== 'undefined') {
      Object.keys(INDIAN_LOCATIONS).sort().forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    }
  }

  stateSelect.addEventListener('change', () => {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    const selectedState = stateSelect.value;
    districtSelect.innerHTML = '';
    tehsilSelect.innerHTML = `<option value="">${t.tehsilSelectPlaceholder}</option>`;
    tehsilSelect.disabled = true;

    if (!selectedState || !INDIAN_LOCATIONS[selectedState]) {
      districtSelect.innerHTML = `<option value="">${t.districtSelectPlaceholder}</option>`;
      districtSelect.disabled = true;
      return;
    }

    districtSelect.disabled = false;
    districtSelect.innerHTML = `<option value="">${t.districtSelectActive}</option>`;
    Object.keys(INDIAN_LOCATIONS[selectedState]).sort().forEach(district => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });

    clearError('group-state');
  });

  districtSelect.addEventListener('change', () => {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    const selectedState = stateSelect.value;
    const selectedDistrict = districtSelect.value;
    tehsilSelect.innerHTML = '';

    if (!selectedDistrict || !INDIAN_LOCATIONS[selectedState] || !INDIAN_LOCATIONS[selectedState][selectedDistrict]) {
      tehsilSelect.innerHTML = `<option value="">${t.tehsilSelectPlaceholder}</option>`;
      tehsilSelect.disabled = true;
      return;
    }

    tehsilSelect.disabled = false;
    tehsilSelect.innerHTML = `<option value="">${t.tehsilSelectActive}</option>`;
    INDIAN_LOCATIONS[selectedState][selectedDistrict].forEach(tehsil => {
      const option = document.createElement('option');
      option.value = tehsil;
      option.textContent = tehsil;
      tehsilSelect.appendChild(option);
    });

    clearError('group-district');
  });

  tehsilSelect.addEventListener('change', () => {
    if (tehsilSelect.value) clearError('group-tehsil');
  });

  // --------------------------------------------------------------------------
  // 6. Conditional 'Other' Fields
  // --------------------------------------------------------------------------
  dikshaTypeSelect.addEventListener('change', () => {
    const val = dikshaTypeSelect.value;
    if (val === 'इतर' || val === 'Other' || val === 'अन्य') {
      otherDikshaTypeWrapper.classList.add('is-active');
      dikshaTypeOtherInput.required = true;
      dikshaTypeOtherInput.focus();
    } else {
      otherDikshaTypeWrapper.classList.remove('is-active');
      dikshaTypeOtherInput.required = false;
      dikshaTypeOtherInput.value = '';
    }
    if (val) clearError('group-dikshaType');
  });

  dikshaGuruSelect.addEventListener('change', () => {
    const val = dikshaGuruSelect.value;
    if (val === 'इतर' || val === 'Other' || val === 'अन्य') {
      otherGuruWrapper.classList.add('is-active');
      dikshaGuruOtherInput.required = true;
      dikshaGuruOtherInput.focus();
    } else {
      otherGuruWrapper.classList.remove('is-active');
      dikshaGuruOtherInput.required = false;
      dikshaGuruOtherInput.value = '';
    }
    if (val) clearError('group-dikshaGuru');
  });

  aspiringDikshaTypeSelect.addEventListener('change', () => {
    const val = aspiringDikshaTypeSelect.value;
    if (val === 'इतर' || val === 'Other' || val === 'अन्य') {
      otherAspiringTypeWrapper.classList.add('is-active');
      aspiringTypeOther.focus();
    } else {
      otherAspiringTypeWrapper.classList.remove('is-active');
      aspiringTypeOther.value = '';
    }
  });

  // Input Formatting & Validation Helpers
  mobileInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (e.target.value.length === 10) clearError('group-mobile');
  });

  pincodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    if (e.target.value.length === 6) clearError('group-pincode');
  });

  [fullNameInput, dobInput, houseBuildingWardInput, streetAreaLandmarkInput, dikshaDateInput].forEach(elem => {
    elem.addEventListener('input', () => {
      const group = elem.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  function setError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.add('has-error');
  }

  function clearError(groupId) {
    const group = document.getElementById(groupId);
    if (group) group.classList.remove('has-error');
  }

  // --------------------------------------------------------------------------
  // 7. Form Validation & Submission
  // --------------------------------------------------------------------------
  function validateForm() {
    let isValid = true;
    let firstErrorElem = null;

    function markError(groupId, elem) {
      setError(groupId);
      isValid = false;
      if (!firstErrorElem && elem) firstErrorElem = elem;
    }

    if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 3) {
      markError('group-fullName', fullNameInput);
    } else {
      clearError('group-fullName');
    }

    if (!dobInput.value) {
      markError('group-dob', dobInput);
    } else {
      clearError('group-dob');
    }

    const cleanMobile = mobileInput.value.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      markError('group-mobile', mobileInput);
    } else {
      clearError('group-mobile');
    }

    if (!houseBuildingWardInput.value.trim()) {
      markError('group-houseBuildingWard', houseBuildingWardInput);
    } else {
      clearError('group-houseBuildingWard');
    }

    if (!streetAreaLandmarkInput.value.trim()) {
      markError('group-streetAreaLandmark', streetAreaLandmarkInput);
    } else {
      clearError('group-streetAreaLandmark');
    }

    if (!stateSelect.value) {
      markError('group-state', stateSelect);
    } else {
      clearError('group-state');
    }

    if (!districtSelect.value) {
      markError('group-district', districtSelect);
    } else {
      clearError('group-district');
    }

    if (!tehsilSelect.value) {
      markError('group-tehsil', tehsilSelect);
    } else {
      clearError('group-tehsil');
    }

    const cleanPincode = pincodeInput.value.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      markError('group-pincode', pincodeInput);
    } else {
      clearError('group-pincode');
    }

    const status = getSelectedStatus();
    if (status === 'दीक्षा झालेली आहे') {
      if (!dikshaDateInput.value) {
        markError('group-dikshaDate', dikshaDateInput);
      } else {
        clearError('group-dikshaDate');
      }

      if (!dikshaTypeSelect.value) {
        markError('group-dikshaType', dikshaTypeSelect);
      } else if ((dikshaTypeSelect.value === 'इतर' || dikshaTypeSelect.value === 'Other' || dikshaTypeSelect.value === 'अन्य') && !dikshaTypeOtherInput.value.trim()) {
        otherDikshaTypeWrapper.classList.add('has-error');
        isValid = false;
        if (!firstErrorElem) firstErrorElem = dikshaTypeOtherInput;
      } else {
        clearError('group-dikshaType');
        otherDikshaTypeWrapper.classList.remove('has-error');
      }

      if (!dikshaGuruSelect.value) {
        markError('group-dikshaGuru', dikshaGuruSelect);
      } else if ((dikshaGuruSelect.value === 'इतर' || dikshaGuruSelect.value === 'Other' || dikshaGuruSelect.value === 'अन्य') && !dikshaGuruOtherInput.value.trim()) {
        otherGuruWrapper.classList.add('has-error');
        isValid = false;
        if (!firstErrorElem) firstErrorElem = dikshaGuruOtherInput;
      } else {
        clearError('group-dikshaGuru');
        otherGuruWrapper.classList.remove('has-error');
      }
    }

    if (!isValid && firstErrorElem) {
      firstErrorElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorElem.focus();
    }

    return isValid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const status = getSelectedStatus();
    let diksha_date = null;
    let diksha_type = null;
    let diksha_type_other = null;
    let diksha_guru = null;
    let diksha_guru_other = null;
    let interest_notes = null;

    const isOtherType = dikshaTypeSelect.value === 'इतर' || dikshaTypeSelect.value === 'Other' || dikshaTypeSelect.value === 'अन्य';
    const isOtherGuru = dikshaGuruSelect.value === 'इतर' || dikshaGuruSelect.value === 'Other' || dikshaGuruSelect.value === 'अन्य';

    if (status === 'दीक्षा झालेली आहे') {
      diksha_date = dikshaDateInput.value;
      diksha_type = isOtherType ? 'Other' : dikshaTypeSelect.value;
      diksha_type_other = isOtherType ? dikshaTypeOtherInput.value.trim() : null;
      diksha_guru = isOtherGuru ? 'Other' : dikshaGuruSelect.value;
      diksha_guru_other = isOtherGuru ? dikshaGuruOtherInput.value.trim() : null;
      interest_notes = "दीक्षा प्राप्त साधक";
    } else if (status === 'दीक्षा घेणार / इच्छुक') {
      diksha_date = aspiringDateInput.value || null;
      const isAspOtherType = aspiringDikshaTypeSelect.value === 'इतर' || aspiringDikshaTypeSelect.value === 'Other' || aspiringDikshaTypeSelect.value === 'अन्य';
      diksha_type = isAspOtherType ? 'Other' : aspiringDikshaTypeSelect.value;
      diksha_type_other = isAspOtherType ? aspiringTypeOther.value.trim() : null;
      diksha_guru = aspiringGuruSelect.value;
      interest_notes = aspiringNotesInput.value.trim() || "दीक्षा इच्छुक साधक";
    } else {
      diksha_type = "लागू नाही";
      diksha_guru = "लागू नाही";
      interest_notes = `${generalInterestSelect.value} ${generalNotesInput.value.trim() ? '- ' + generalNotesInput.value.trim() : ''}`;
    }

    const payload = {
      full_name: fullNameInput.value.trim(),
      dob: dobInput.value,
      mobile: mobileInput.value.replace(/\D/g, ''),
      house_building_ward: houseBuildingWardInput.value.trim(),
      street_area_landmark: streetAreaLandmarkInput.value.trim(),
      state: stateSelect.value,
      district: districtSelect.value,
      tehsil: tehsilSelect.value,
      pincode: pincodeInput.value.replace(/\D/g, ''),
      diksha_status: status,
      diksha_date: diksha_date,
      diksha_type: diksha_type,
      diksha_type_other: diksha_type_other,
      diksha_guru: diksha_guru,
      diksha_guru_other: diksha_guru_other,
      interest_notes: interest_notes,
      photo_url: photoUrlInput.value.trim() || null
    };

    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');
    submitIcon.style.display = 'none';
    submitSpinner.style.display = 'inline-block';
    submitBtnText.textContent = t.savingText;

    try {
      const response = await fetch('/api/sadhaks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccessMessage(payload.full_name, result.record_id, status, result.created_at || new Date().toLocaleTimeString());
        form.reset();
        resetPhotoUpload();
        resetDynamicDropdowns();
        fetchRecordsCount();
      } else {
        alert('त्रुटी: ' + (result.error || 'नोंद जतन होऊ शकली नाही'));
      }
    } catch (err) {
      console.warn('API error, saving to local storage fallback:', err);
      const localId = saveToLocalStorage(payload);
      showSuccessMessage(payload.full_name, 'LOC-' + localId, status, new Date().toLocaleTimeString() + ' (Local DB)');
      form.reset();
      resetPhotoUpload();
      resetDynamicDropdowns();
      fetchRecordsCount();
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-loading');
      submitIcon.style.display = 'inline-block';
      submitSpinner.style.display = 'none';
      submitBtnText.textContent = t.submitBtn;
    }
  });

  function showSuccessMessage(name, recordId, status, timestamp) {
    if (currentLang === 'mr') {
      successTitle.textContent = 'नोंद यशस्वीरीत्या जतन झाली!';
      successMessage.innerHTML = `साधक <strong>${escapeHtml(name)}</strong> (${escapeHtml(status)}) यांची माहिती डेटाबेसमध्ये कायमस्वरूपी नोंदवली गेली आहे.`;
      successMeta.textContent = `नोंद क्रमांक: #${recordId} | वेळ: ${timestamp}`;
    } else if (currentLang === 'hi') {
      successTitle.textContent = 'विवरण सफलतापूर्वक सहेजा गया!';
      successMessage.innerHTML = `साधक <strong>${escapeHtml(name)}</strong> (${escapeHtml(status)}) का विवरण डेटाबेस में सुरक्षित रूप से दर्ज कर लिया गया है।`;
      successMeta.textContent = `पंजीयन संख्या: #${recordId} | समय: ${timestamp}`;
    } else {
      successTitle.textContent = 'Record Successfully Saved!';
      successMessage.innerHTML = `Details for sadhak <strong>${escapeHtml(name)}</strong> (${escapeHtml(status)}) have been permanently saved in the database.`;
      successMeta.textContent = `Record ID: #${recordId} | Time: ${timestamp}`;
    }
    
    successBanner.style.display = 'block';
    successBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetPhotoUpload() {
    photoFileInput.value = '';
    cameraMobileDirectInput.value = '';
    photoUrlInput.value = '';
    avatarImage.src = '';
    avatarImage.style.display = 'none';
    avatarPlaceholderIcon.style.display = 'inline-block';
    removePhotoBtn.style.display = 'none';
  }

  function resetDynamicDropdowns() {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    districtSelect.innerHTML = `<option value="">${t.districtSelectPlaceholder}</option>`;
    districtSelect.disabled = true;
    tehsilSelect.innerHTML = `<option value="">${t.tehsilSelectPlaceholder}</option>`;
    tehsilSelect.disabled = true;
    otherDikshaTypeWrapper.classList.remove('is-active', 'has-error');
    dikshaTypeOtherInput.required = false;
    otherGuruWrapper.classList.remove('is-active', 'has-error');
    dikshaGuruOtherInput.required = false;
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
    
    const firstRadio = document.querySelector('input[name="diksha_status"][value="दीक्षा झालेली आहे"]');
    if (firstRadio) firstRadio.checked = true;
    handleStatusChange();
  }

  resetBtn.addEventListener('click', () => {
    const confirmMsg = currentLang === 'mr' 
      ? 'तुम्हाला फॉर्ममधील सर्व माहिती साफ करायची आहे का?' 
      : (currentLang === 'hi' ? 'क्या आप फॉर्म की पूरी जानकारी साफ़ करना चाहते हैं?' : 'Are you sure you want to clear the form?');
    if (confirm(confirmMsg)) {
      form.reset();
      resetPhotoUpload();
      resetDynamicDropdowns();
      successBanner.style.display = 'none';
    }
  });

  bannerNewEntryBtn.addEventListener('click', () => {
    successBanner.style.display = 'none';
    fullNameInput.focus();
  });

  // Local storage fallback
  function saveToLocalStorage(record) {
    const records = JSON.parse(localStorage.getItem('sadhak_records') || '[]');
    record.id = records.length + 1;
    record.created_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    records.push(record);
    localStorage.setItem('sadhak_records', JSON.stringify(records));
    return record.id;
  }

  function getLocalRecords() {
    return JSON.parse(localStorage.getItem('sadhak_records') || '[]');
  }

  // --------------------------------------------------------------------------
  // 8. Live Record Counts
  // --------------------------------------------------------------------------
  async function fetchRecordsCount() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const stats = await res.json();
        statCompletedCount.textContent = stats.completed_count || 0;
        statAspiringCount.textContent = stats.aspiring_count || 0;
        statNoneCount.textContent = stats.none_count || 0;
        return;
      }
    } catch (e) {}

    const local = getLocalRecords();
    let c = 0, a = 0, n = 0;
    local.forEach(r => {
      if (r.diksha_status === 'दीक्षा झालेली आहे') c++;
      else if (r.diksha_status === 'दीक्षा घेणार / इच्छुक') a++;
      else n++;
    });
    statCompletedCount.textContent = c;
    statAspiringCount.textContent = a;
    statNoneCount.textContent = n;
  }

  // --------------------------------------------------------------------------
  // 9. Records Directory Modal
  // --------------------------------------------------------------------------
  let cachedRecords = [];
  let currentFilter = 'all';

  openRecordsBtn.addEventListener('click', async () => {
    recordsModal.classList.add('active');
    loadRecordsTable();
  });

  closeRecordsBtn.addEventListener('click', () => {
    recordsModal.classList.remove('active');
  });

  recordsModal.addEventListener('click', (e) => {
    if (e.target === recordsModal) recordsModal.classList.remove('active');
  });

  filterTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.status;
      applyFilters();
    });
  });

  async function loadRecordsTable() {
    const loadingText = currentLang === 'mr' ? 'माहिती लोड होत आहे...' : (currentLang === 'hi' ? 'विवरण लोड हो रहा है...' : 'Loading directory...');
    recordsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #94a3b8;">${loadingText}</td></tr>`;
    try {
      const res = await fetch('/api/sadhaks');
      if (res.ok) {
        cachedRecords = await res.json();
        applyFilters();
        return;
      }
    } catch (e) {}

    cachedRecords = getLocalRecords();
    applyFilters();
  }

  function applyFilters() {
    let list = cachedRecords;
    if (currentFilter !== 'all') {
      list = list.filter(r => r.diksha_status === currentFilter);
    }

    const q = recordSearchInput.value.toLowerCase().trim();
    if (q) {
      list = list.filter(r => 
        (r.full_name && r.full_name.toLowerCase().includes(q)) ||
        (r.mobile && r.mobile.includes(q)) ||
        (r.district && r.district.toLowerCase().includes(q)) ||
        (r.diksha_guru && r.diksha_guru.toLowerCase().includes(q)) ||
        (r.interest_notes && r.interest_notes.toLowerCase().includes(q))
      );
    }

    renderTable(list);
  }

  function renderTable(records) {
    if (!records || records.length === 0) {
      const emptyText = currentLang === 'mr' ? 'कोणतीही नोंद सापडली नाही.' : (currentLang === 'hi' ? 'कोई विवरण नहीं मिला।' : 'No records found.');
      recordsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #64748b;">${emptyText}</td></tr>`;
      return;
    }

    recordsTableBody.innerHTML = records.map(r => {
      let badgeClass = 'badge-completed';
      let statusLabel = currentLang === 'mr' ? 'दीक्षा झालेली आहे' : (currentLang === 'hi' ? 'दीक्षा प्राप्त' : 'Initiated');
      
      if (r.diksha_status === 'दीक्षा घेणार / इच्छुक') {
        badgeClass = 'badge-aspiring';
        statusLabel = currentLang === 'mr' ? 'दीक्षा घेणारे/इच्छुक' : (currentLang === 'hi' ? 'दीक्षा इच्छुक' : 'Aspiring');
      } else if (r.diksha_status === 'दीक्षा झालेली नाही') {
        badgeClass = 'badge-none';
        statusLabel = currentLang === 'mr' ? 'साधक परिवार' : (currentLang === 'hi' ? 'साधक परिवार' : 'Devotee');
      }

      const displayGuru = (r.diksha_guru === 'Other' || r.diksha_guru === 'इतर' || r.diksha_guru === 'अन्य') && r.diksha_guru_other 
        ? `${escapeHtml(r.diksha_guru_other)}` 
        : escapeHtml(r.diksha_guru || '-');

      const displayType = (r.diksha_type === 'Other' || r.diksha_type === 'इतर' || r.diksha_type === 'अन्य') && r.diksha_type_other
        ? `${escapeHtml(r.diksha_type_other)}`
        : escapeHtml(r.diksha_type || '-');

      const extraDetails = r.diksha_date 
        ? `${escapeHtml(r.diksha_date)}<br><small style="color: #64748b;">${displayType}</small>`
        : `<small style="color: #64748b;">${escapeHtml(r.interest_notes || '-')}</small>`;

      const photoHtml = r.photo_url 
        ? `<img src="${escapeHtml(r.photo_url)}" class="table-avatar" alt="Avatar">`
        : `<div class="table-avatar" style="display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#94a3b8;">👤</div>`;

      return `
        <tr>
          <td><strong>#${r.id}</strong></td>
          <td>
            <div class="table-user-cell">
              ${photoHtml}
              <div>
                <strong>${escapeHtml(r.full_name)}</strong><br>
                <small style="color: #64748b;">${escapeHtml(r.dob)}</small>
              </div>
            </div>
          </td>
          <td>${escapeHtml(r.mobile)}</td>
          <td>${escapeHtml(r.district)}, ${escapeHtml(r.state)}<br><small style="color: #64748b;">${escapeHtml(r.tehsil)}</small></td>
          <td><span class="tag-badge ${badgeClass}">${statusLabel}</span></td>
          <td>${extraDetails}</td>
          <td>${displayGuru}</td>
        </tr>
      `;
    }).join('');
  }

  recordSearchInput.addEventListener('input', applyFilters);

  // --------------------------------------------------------------------------
  // 10. Birthday & Diksha Anniversary Tracker + WhatsApp Greetings
  // --------------------------------------------------------------------------
  openTrackerBtn.addEventListener('click', () => {
    trackerModal.classList.add('active');
    loadAnniversaries();
  });

  closeTrackerBtn.addEventListener('click', () => {
    trackerModal.classList.remove('active');
  });

  trackerModal.addEventListener('click', (e) => {
    if (e.target === trackerModal) trackerModal.classList.remove('active');
  });

  btnTabDikshaAnniversary.addEventListener('click', () => {
    btnTabDikshaAnniversary.classList.add('active');
    btnTabBirthday.classList.remove('active');
    dikshaAnniversariesView.style.display = 'block';
    birthdaysView.style.display = 'none';
  });

  btnTabBirthday.addEventListener('click', () => {
    btnTabBirthday.classList.add('active');
    btnTabDikshaAnniversary.classList.remove('active');
    birthdaysView.style.display = 'block';
    dikshaAnniversariesView.style.display = 'none';
  });

  async function loadAnniversaries() {
    const loadingText = currentLang === 'mr' ? 'लोड होत आहे...' : (currentLang === 'hi' ? 'लोड हो रहा है...' : 'Loading...');
    dikshaAnniversariesGrid.innerHTML = `<p style="text-align:center;grid-column:1/-1;padding:2rem;color:#94a3b8;">${loadingText}</p>`;
    birthdaysGrid.innerHTML = `<p style="text-align:center;grid-column:1/-1;padding:2rem;color:#94a3b8;">${loadingText}</p>`;

    try {
      const res = await fetch('/api/anniversaries?days=30');
      if (res.ok) {
        const data = await res.json();
        renderDikshaAnniversaries(data.diksha_anniversaries || []);
        renderBirthdays(data.birthdays || []);
        return;
      }
    } catch (e) {
      console.warn('API error for anniversaries:', e);
    }

    const emptyText = currentLang === 'mr' ? 'पुढील ३० दिवसांत कोणतेही स्मरण नाही.' : (currentLang === 'hi' ? 'अगले 30 दिनों में कोई विवरण नहीं है।' : 'No upcoming dates.');
    dikshaAnniversariesGrid.innerHTML = `<p style="text-align:center;grid-column:1/-1;padding:2rem;color:#64748b;">${emptyText}</p>`;
    birthdaysGrid.innerHTML = `<p style="text-align:center;grid-column:1/-1;padding:2rem;color:#64748b;">${emptyText}</p>`;
  }

  function renderDikshaAnniversaries(list) {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    if (!list.length) {
      dikshaAnniversariesGrid.innerHTML = `<p style="text-align:center;grid-column:1/-1;padding:2rem;color:#64748b;">${t.noAnniversariesText}</p>`;
      return;
    }

    const EMOJI_DIKSHA = "\u{1F339}\u{1FAB7}\u{1F490}\u{2728}\u{1F549}\u{1F339}";
    const EMOJI_PRAY = "\u{1F64F}\u{1F339}";

    dikshaAnniversariesGrid.innerHTML = list.map(item => {
      const todayBadge = item.is_today ? `<span class="anniversary-badge-today">${t.trackerTodayBadge}</span>` : '';
      const daysText = item.is_today 
        ? (currentLang === 'mr' ? 'आजचा दिवस!' : (currentLang === 'hi' ? 'आज का दिन!' : 'Today!')) 
        : `${item.days_left} ${t.trackerDaysLeft}`;
      
      const photoHtml = item.photo_url 
        ? `<img src="${escapeHtml(item.photo_url)}" class="anniversary-avatar" alt="Avatar">`
        : `<div class="anniversary-avatar" style="display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#94a3b8;">👤</div>`;

      const locLine = item.location ? `${item.location}\n` : '';
      const salutationName = item.full_name.trim();

      let wishMsg = '';
      if (currentLang === 'hi') {
        wishMsg = `आदरणीय श्री ${salutationName} जी\n${locLine}आज आपका पावन दीक्षा दिवस है (${item.years_completed} वर्ष पूर्ण), इस शुभ अवसर पर आपको बहुत-बहुत हार्दिक शुभकामनाएं ${EMOJI_PRAY}\nप. पू. श्री गुरुदेव जी का आशीर्वाद सदैव आपके साथ रहे ${EMOJI_DIKSHA}`;
      } else if (currentLang === 'en') {
        wishMsg = `Respected Shri ${salutationName}\n${locLine}Heartiest congratulations on your auspicious Diksha Anniversary (${item.years_completed} years completed) ${EMOJI_PRAY}\nMay the holy blessings of Param Pujya Shri Gurudev Ji always be with you ${EMOJI_DIKSHA}`;
      } else {
        wishMsg = `आ श्री ${salutationName}\n${locLine}आज आपला पावन दीक्षा दिवस आहे (${item.years_completed} वर्षे पूर्ण), या शुभ दिनाच्या आपल्याला खूप खूप खूप शुभेच्छा ${EMOJI_PRAY}\nप पू श्री गुरुदेव जी चे आशीर्वाद सदैव आपल्या पाठीशी आहेत ${EMOJI_DIKSHA}`;
      }

      const waLink = `https://api.whatsapp.com/send?phone=91${item.mobile}&text=${encodeURIComponent(wishMsg)}`;
      const sendWaText = currentLang === 'hi' ? '📲 WhatsApp पर भेजें' : (currentLang === 'en' ? '📲 Send on WhatsApp' : '📲 WhatsApp वर पाठवा');
      const copyBtnText = currentLang === 'hi' ? '📋 कॉपी' : (currentLang === 'en' ? '📋 Copy' : '📋 कॉपी');

      return `
        <div class="anniversary-card ${item.is_today ? 'is-today' : ''}">
          ${todayBadge}
          <div class="anniversary-card-header">
            ${photoHtml}
            <div>
              <div class="anniversary-name">${escapeHtml(item.full_name)}</div>
              <div class="anniversary-meta">${escapeHtml(item.date_str)} ${locLine ? '• ' + escapeHtml(item.location) : ''}</div>
              <div class="anniversary-meta" style="color: #b45309; font-weight:700;">${item.years_completed} ${t.trackerYearsCompleted}</div>
            </div>
          </div>
          <div class="anniversary-countdown">⏱️ ${daysText}</div>
          
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:auto;">
            <a href="${waLink}" target="_blank" class="btn-whatsapp-wish" style="flex:1;">
              <span>${sendWaText}</span>
            </a>
            <button type="button" class="btn btn-outline btn-copy-diksha" data-msg="${escapeHtml(wishMsg)}" style="padding:0.45rem 0.75rem;font-size:0.8rem;" title="मेसेज कॉपी करा">
              ${copyBtnText}
            </button>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-copy-diksha').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.dataset.msg;
        const copiedNotice = currentLang === 'hi' ? '✅ कॉपी हो गया!' : (currentLang === 'en' ? '✅ Copied!' : '✅ कॉपी झाले!');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(msg).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = copiedNotice;
            setTimeout(() => btn.innerHTML = originalText, 2500);
          });
        }
      });
    });
  }

  function renderBirthdays(list) {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.mr;
    if (!list.length) {
      birthdaysGrid.innerHTML = `<p style="text-align:center;grid-column:1/-1;padding:2rem;color:#64748b;">${t.noAnniversariesText}</p>`;
      return;
    }

    // Exact Unicode Emoji sequences (100% immune to charset/codepage corruption)
    const EMOJI_BLESSINGS = "\u{1F339}\u{1F9C3}\u{1F36D}\u{1F36B}\u{1F36C}\u{1F9C9}\u{1F959}\u{1FAB7}\u{1F353}\u{1F34D}\u{1F351}\u{1F490}\u{1FAD3}\u{1FAD0}\u{1F34E}\u{1F35F}\u{1F360}\u{1F345}\u{1F350}\u{1F352}\u{1F96D}\u{1F96F}\u{1F32D}\u{1F339}";
    const EMOJI_PRAY = "\u{1F64F}\u{1F339}";

    birthdaysGrid.innerHTML = list.map(item => {
      const todayBadge = item.is_today ? `<span class="anniversary-badge-today">${t.trackerTodayBadge}</span>` : '';
      const daysText = item.is_today 
        ? (currentLang === 'mr' ? 'आज वाढदिवस आहे!' : (currentLang === 'hi' ? 'आज जन्मदिवस है!' : 'Happy Birthday Today!')) 
        : `${item.days_left} ${t.trackerDaysLeft}`;

      const photoHtml = item.photo_url 
        ? `<img src="${escapeHtml(item.photo_url)}" class="anniversary-avatar" alt="Avatar">`
        : `<div class="anniversary-avatar" style="display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#94a3b8;">👤</div>`;

      const locLine = item.location ? `${item.location}\n` : '';
      const salutationName = item.full_name.trim();

      // Authentic Ashram Birthday Wish Template with Exact Emojis
      let wishMsg = '';
      if (currentLang === 'hi') {
        wishMsg = `आदरणीय श्री ${salutationName} जी\n${locLine}आज आपका जन्मदिवस है, इस शुभ अवसर पर आपको बहुत-बहुत हार्दिक शुभकामनाएं ${EMOJI_PRAY}\nप. पू. श्री गुरुदेव जी का आशीर्वाद सदैव आपके साथ रहे ${EMOJI_BLESSINGS}`;
      } else if (currentLang === 'en') {
        wishMsg = `Respected Shri ${salutationName}\n${locLine}Wishing you a very Happy Birthday! May this auspicious day bring you peace, joy and spiritual progress ${EMOJI_PRAY}\nMay the holy blessings of Param Pujya Shri Gurudev Ji always be with you ${EMOJI_BLESSINGS}`;
      } else {
        wishMsg = `आ श्री ${salutationName}\n${locLine}भाऊजी आज आपला वाढदिवस आहे या शुभ दिनाच्या आपल्याला खूप खूप खूप शुभेच्छा ${EMOJI_PRAY}\nप पू श्री गुरुदेव जी चे आशीर्वाद सदैव आपल्या पाठीशी आहेत ${EMOJI_BLESSINGS}`;
      }

      const waLink = `https://api.whatsapp.com/send?phone=91${item.mobile}&text=${encodeURIComponent(wishMsg)}`;
      const sendWaText = currentLang === 'hi' ? '📲 WhatsApp पर भेजें' : (currentLang === 'en' ? '📲 Send on WhatsApp' : '📲 WhatsApp वर पाठवा');
      const copyBtnText = currentLang === 'hi' ? '📋 कॉपी' : (currentLang === 'en' ? '📋 Copy' : '📋 कॉपी');

      return `
        <div class="anniversary-card ${item.is_today ? 'is-today' : ''}">
          ${todayBadge}
          <div class="anniversary-card-header">
            ${photoHtml}
            <div>
              <div class="anniversary-name">${escapeHtml(item.full_name)}</div>
              <div class="anniversary-meta">${escapeHtml(item.date_str)} ${locLine ? '• ' + escapeHtml(item.location) : ''}</div>
              <div class="anniversary-meta" style="color: #047857; font-weight:700;">${item.age} ${t.trackerAge}</div>
            </div>
          </div>
          <div class="anniversary-countdown">⏱️ ${daysText}</div>
          
          <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:auto;">
            <a href="${waLink}" target="_blank" class="btn-whatsapp-wish" style="flex:1;">
              <span>${sendWaText}</span>
            </a>
            <button type="button" class="btn btn-outline btn-copy-msg" data-msg="${escapeHtml(wishMsg)}" style="padding:0.45rem 0.75rem;font-size:0.8rem;" title="मेसेज कॉपी करा">
              ${copyBtnText}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach copy event listeners
    document.querySelectorAll('.btn-copy-msg').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.dataset.msg;
        const copiedNotice = currentLang === 'hi' ? '✅ कॉपी हो गया!' : (currentLang === 'en' ? '✅ Copied!' : '✅ कॉपी झाले!');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(msg).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = copiedNotice;
            setTimeout(() => btn.innerHTML = originalText, 2500);
          });
        }
      });
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // 11. Initialization
  // --------------------------------------------------------------------------
  initLocationDropdowns();
  handleStatusChange();
  applyLanguage(currentLang);
  fetchRecordsCount();
});
