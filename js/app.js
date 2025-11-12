        // Wrap everything in a DOMContentLoaded listener
        document.addEventListener('DOMContentLoaded', () => {
            const app = {
                // UI Elements
                countdownContainer: document.getElementById('countdownContainer'),
                addDateBtn: document.getElementById('addDateBtn'),
                settingsBtn: document.getElementById('settingsBtn'),
                themeSwitcher: document.getElementById('themeSwitcher'),
                helpBtn: document.getElementById('helpBtn'),

                // NEW: Profile UI
                profileContainer: document.getElementById('profileContainer'),
                profileBtn: document.getElementById('profileBtn'),
                currentProfileName: document.getElementById('currentProfileName'),
                profilePopover: document.getElementById('profilePopover'),
                profileList: document.getElementById('profileList'),
                newProfileName: document.getElementById('newProfileName'),
                addProfileBtn: document.getElementById('addProfileBtn'),

                // Goal Modal
                dateModal: document.getElementById('dateModal'),
                modalTitle: document.getElementById('modalTitle'),
                closeModalBtn: document.getElementById('closeModalBtn'),
                cancelModalBtn: document.getElementById('cancelModalBtn'),
                saveDateBtn: document.getElementById('saveDateBtn'),
                deleteDateBtn: document.getElementById('deleteDateBtn'),
                dateId: document.getElementById('dateId'),
                dateTitle: document.getElementById('dateTitle'),
                dateNotes: document.getElementById('dateNotes'),
                dateTarget: document.getElementById('dateTarget'),
                dateType: document.getElementById('dateType'), // MODIFIED
                dateTypeCustom: document.getElementById('dateTypeCustom'), // NEW
                dateIconColor: document.getElementById('dateIconColor'), // MODIFIED
                dateIconName: document.getElementById('dateIconName'),
                dateGroup: document.getElementById('dateGroup'),
                groupSuggestions: document.getElementById('groupSuggestions'),

                // NEW: Label UI
                dateLabel: document.getElementById('dateLabel'),
                dateShowLabel: document.getElementById('dateShowLabel'),
                labelSuggestions: document.getElementById('labelSuggestions'),

                // NEW: Status & Timer Mode
                dateStatus: document.getElementById('dateStatus'),
                dateTimerMode: document.getElementById('dateTimerMode'),

                // Remembrance Fields
                remembranceCheckboxContainer: document.getElementById('remembranceCheckboxContainer'),
                isRemembrance: document.getElementById('isRemembrance'),
                dateOfDeathContainer: document.getElementById('dateOfDeathContainer'),
                dateOfDeath: document.getElementById('dateOfDeath'),

                // Milestones
                milestonesContainer: document.getElementById('milestonesContainer'),
                newMilestoneInput: document.getElementById('newMilestoneInput'),
                addMilestoneBtn: document.getElementById('addMilestoneBtn'),
                milestoneSection: document.getElementById('milestoneSection'),
                dateShowMilestones: document.getElementById('dateShowMilestones'),

                // Settings Modal
                settingsModal: document.getElementById('settingsModal'),
                closeSettingsBtn: document.getElementById('closeSettingsBtn'),
                exportDataBtn: document.getElementById('exportDataBtn'),
                importFile: document.getElementById('importFile'),
                columnCountSelect: document.getElementById('columnCountSelect'),
                // exportProfileName: document.getElementById('exportProfileName'), // REMOVED

                // Confirm Modal
                confirmModal: document.getElementById('confirmModal'),
                confirmTitle: document.getElementById('confirmTitle'),
                confirmMessage: document.getElementById('confirmMessage'),
                confirmCancel: document.getElementById('confirmCancel'),
                confirmDelete: document.getElementById('confirmDelete'),
                
                // Toast
                toastContainer: document.getElementById('toastContainer'),

                // Onboarding
                onboardingOverlay: document.getElementById('onboardingOverlay'),
                onboardingStep: document.getElementById('onboardingStep'),
                onboardingText: document.getElementById('onboardingText'),
                onboardingSkip: document.getElementById('onboardingSkip'),
                onboardingPrev: document.getElementById('onboardingPrev'),
                onboardingNext: document.getElementById('onboardingNext'),
                onboardingArrow: document.getElementById('onboardingArrow'),

                // App State
                appState: {}, // NEW: Main state object
                currentProfileId: null, // NEW
                timers: [],
                currentMilestones: [],
                _confirmCallback: null,
                sortableGroups: null,
                sortableCards: [],
                // columnCount: 2, // REMOVED: Now part of profile settings

                // Onboarding State
                tourSteps: [],
                currentTourStep: 0,
                popperInstance: null,

                // --- NEW: App State Getters ---
                // These functions get data for the *current* profile
                ensureProfileData() {
                    if (!this.appState.profileData[this.currentProfileId]) {
                        console.warn("Ensuring profile data for", this.currentProfileId);
                        this.appState.profileData[this.currentProfileId] = {
                            dates: [],
                            groupOrder: [],
                            settings: this.getDefaultSettings()
                        };
                    }
                    // Ensure settings object exists as well
                    if (!this.appState.profileData[this.currentProfileId].settings) {
                         this.appState.profileData[this.currentProfileId].settings = this.getDefaultSettings();
                    }
                    // Ensure dates array exists
                    if (!this.appState.profileData[this.currentProfileId].dates) {
                         this.appState.profileData[this.currentProfileId].dates = [];
                    }
                    // Ensure groupOrder array exists
                    if (!this.appState.profileData[this.currentProfileId].groupOrder) {
                         this.appState.profileData[this.currentProfileId].groupOrder = [];
                    }
                    
                    return this.appState.profileData[this.currentProfileId];
                },

                getDates() {
                    // return this.appState.profileData[this.currentProfileId]?.dates || [];
                    return this.ensureProfileData().dates;
                },
                getGroupOrder() {
                    // return this.appState.profileData[this.currentProfileId]?.groupOrder || [];
                    return this.ensureProfileData().groupOrder;
                },
                getSettings() {
                    // return this.appState.profileData[this.currentProfileId]?.settings || this.getDefaultSettings();
                    return this.ensureProfileData().settings;
                },
                getCurrentProfile() {
                    return this.appState.profiles[this.currentProfileId] || null;
                },
                getCurrentData() {
                    return this.appState.profileData[this.currentProfileId] || null;
                },
                getDefaultSettings() {
                    return {
                        theme: 'dark',
                        columnCount: 2,
                        hasSeenTour: false
                    };
                },
                
                // NEW: Demo Data Generator
                getDemoDates() {
                    // Use a fixed "today" for consistent demo data
                    const today = new Date('2025-10-29T18:30:00'); 
                    
                    const addDays = (date, days) => {
                        const newDate = new Date(date);
                        newDate.setDate(newDate.getDate() + days);
                        return newDate.toISOString().substring(0, 16); // 'YYYY-MM-DDTHH:mm'
                    };
                    
                    const addMonths = (date, months) => {
                        const newDate = new Date(date);
                        newDate.setMonth(newDate.getMonth() + months);
                        return newDate.toISOString().substring(0, 16);
                    };
                    
                    const addYears = (date, years) => {
                        const newDate = new Date(date);
                        newDate.setFullYear(newDate.getFullYear() + years);
                        return newDate.toISOString().substring(0, 16);
                    };

                    return [
                        {
                            id: 'demo_project_1',
                            title: 'Project Phoenix Launch',
                            notes: 'Final push for the new platform launch.',
                            date: addMonths(today, 2), // ~2 months from now
                            type: 'Work', // MODIFIED
                            iconColor: '#f97316', // MODIFIED
                            label: 'P1', // NEW
                            showLabel: true, // NEW
                            iconName: 'rocket',
                            group: 'Projects',
                            milestones: [
                                { id: 'ms_demo_1', text: 'Finalize UI', completed: true },
                                { id: 'ms_demo_2', text: 'Deploy to Staging', completed: true },
                                { id: 'ms_demo_3', text: 'Run final QA', completed: false },
                                { id: 'ms_demo_4', text: 'Go-Live!', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_birthday_1',
                            title: 'My Birthday',
                            notes: 'Time to celebrate!',
                            date: '1990-11-15', // DOB
                            type: 'Birthday', // MODIFIED
                            iconColor: '#ec4899', // MODIFIED
                            label: '', // NEW
                            showLabel: true, // NEW
                            iconName: 'cake',
                            group: 'Personal',
                            milestones: [
                                { id: 'ms_demo_5', text: 'Send out invites', completed: true },
                                { id: 'ms_demo_6', text: 'Order cake', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_travel_1',
                            title: 'Trip to Japan',
                            notes: 'Cherry blossom season!',
                            date: '2026-04-10T09:00', // Far future
                            type: 'Travel', // MODIFIED
                            iconColor: '#14b8a6', // MODIFIED
                            label: 'Vacation', // NEW
                            showLabel: true, // NEW
                            iconName: 'globe-2',
                            group: 'Travel',
                            milestones: [
                                { id: 'ms_demo_7', text: 'Book flights', completed: false },
                                { id: 'ms_demo_8', text: 'Book hotels', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_anniv_1',
                            title: 'Work Anniversary',
                            notes: 'Started at Tymo Inc.',
                            date: '2022-03-01', // Anniversary date
                            type: 'Anniversary', // MODIFIED
                            iconColor: '#6366f1', // MODIFIED
                            label: '', // NEW
                            showLabel: true, // NEW
                            iconName: 'award',
                            group: 'Work',
                            milestones: [
                                { id: 'ms_demo_25', text: 'Demo Milestone 1', completed: false },
                                { id: 'ms_demo_26', text: 'Demo Milestone 2', completed: true }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_remembrance_1',
                            title: 'Grandma',
                            notes: 'Always in our hearts.',
                            date: '1940-07-10', // DOB
                            type: 'Birthday', // MODIFIED
                            iconColor: '#a855f7', // MODIFIED
                            label: '', // NEW
                            showLabel: true, // NEW
                            iconName: 'flower-2',
                            group: 'Personal',
                            milestones: [],
                            status: 'Pending',
                            showMilestones: false,
                            isRemembrance: true,
                            dateOfDeath: '2021-05-20', // DOD
                        },
                        {
                            id: 'demo_completed_1',
                            title: 'Q3 Report',
                            notes: 'Submitted to management.',
                            date: '2025-09-30T17:00', // In the past
                            type: 'Work', // MODIFIED
                            iconColor: '#84cc16', // MODIFIED
                            label: 'Completed', // NEW
                            showLabel: true, // NEW
                            iconName: 'check-square',
                            group: 'Work',
                            milestones: [
                                { id: 'ms_demo_9', text: 'Gather data', completed: true },
                                { id: 'ms_demo_10', text: 'Submit draft', completed: true }
                            ],
                            status: 'Completed', // <-- This is key
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        // --- NEW DEMO ITEMS ---
                        {
                            id: 'demo_fitness_1',
                            title: 'Run a 10k',
                            notes: 'Training for the city marathon.',
                            date: addMonths(today, 3), // ~3 months from now
                            type: 'Health', // MODIFIED
                            iconColor: '#22c55e', // MODIFIED
                            label: '', // NEW
                            showLabel: true, // NEW
                            iconName: 'activity',
                            group: 'Personal',
                            milestones: [
                                { id: 'ms_demo_11', text: 'Run 5k', completed: true },
                                { id: 'ms_demo_12', text: 'Run 7k', completed: false },
                                { id: 'ms_demo_13', text: 'Register for race', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_learn_1',
                            title: 'Complete JS Course',
                            notes: 'Finish the advanced JavaScript module.',
                            date: addDays(today, 45), // 1.5 months
                            type: 'Learn', // MODIFIED
                            iconColor: '#3b82f6', // MODIFIED
                            label: '', // NEW
                            showLabel: true, // NEW
                            iconName: 'graduation-cap',
                            group: 'Personal',
                            milestones: [
                                { id: 'ms_demo_14', text: 'Async/Await', completed: true },
                                { id: 'ms_demo_15', text: 'Data Structures', completed: true },
                                { id: 'ms_demo_16', text: 'Final Project', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_finance_1',
                            title: 'House Deposit Goal',
                            notes: 'Target $50,000.',
                            date: addYears(today, 3), // 3 years from now
                            type: 'Finance', // MODIFIED
                            iconColor: '#10b981', // MODIFIED
                            label: 'Long-Term', // NEW
                            showLabel: true, // NEW
                            iconName: 'piggy-bank',
                            group: 'Finance',
                            milestones: [
                                { id: 'ms_demo_17', text: '$10k', completed: true },
                                { id: 'ms_demo_18', text: '$25k', completed: true },
                                { id: 'ms_demo_19', text: '$40k', completed: false },
                                { id: 'ms_demo_20', text: '$50k!', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_read_1',
                            title: 'Finish "Dune"',
                            notes: 'The spice must flow...',
                            date: addDays(today, 10), // 10 days
                            type: 'Personal', // MODIFIED
                            iconColor: '#a855f7', // MODIFIED
                            label: '', // NEW
                            showLabel: true, // NEW
                            iconName: 'book-open',
                            group: 'Personal',
                            milestones: [],
                            status: 'Pending',
                            showMilestones: false,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_travel_2',
                            title: 'Camping',
                            notes: 'At Big Bear Lake.',
                            date: addDays(today, 3), // This weekend!
                            type: 'Travel', // MODIFIED
                            iconColor: '#14b8a6', // MODIFIED
                            label: 'Upcoming', // NEW
                            showLabel: true, // NEW
                            iconName: 'tent',
                            group: 'Travel',
                            milestones: [
                                { id: 'ms_demo_21', text: 'Buy supplies', completed: false },
                                { id: 'ms_demo_22', text: 'Pack car', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        },
                        {
                            id: 'demo_work_2',
                            title: 'Q4 Session',
                            notes: 'Summary for the board.',
                            date: addDays(today, 20), // ~3 weeks
                            type: 'Work', // MODIFIED
                            iconColor: '#f97316', // MODIFIED
                            label: 'Important', // NEW
                            showLabel: true, // NEW
                            iconName: 'presentation',
                            group: 'Projects',
                            milestones: [
                                { id: 'ms_demo_23', text: 'Draft slides', completed: false },
                                { id: 'ms_demo_24', text: 'Review with team', completed: false }
                            ],
                            status: 'Pending',
                            showMilestones: true,
                            isRemembrance: false,
                            dateOfDeath: '',
                        }
                    ];
                },
                // --- END: App State Getters ---

                init() {
                    // This function is now guaranteed to run after Sortable and lucide are defined
                    // because of the `defer` attribute on the script tags.
                    this.loadAppState(); // NEW: Single load function
                    this.loadProfileData(this.currentProfileId); // NEW: Load data for the active profile
                    
                    // REMOVED: loadTheme, loadDates, loadAndApplyColumnCount
                    
                    // renderAllDates and updateDatalists are called inside loadProfileData
                    this.attachEventListeners();
                    this.initThemes();
                    this.initTourSteps();
                    this.startTour();
                    // Initialize Lucide icons if available
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                    }
                },

                // NEW: Helper to parse YYYY-MM-DD as local date
                parseLocalDate(dateString) {
                    if (!dateString) return new Date();
                    const [datePart] = dateString.split('T');
                    const [year, month, day] = datePart.split('-').map(Number);
                    if (!year || !month || !day) return new Date();
                    // Creates a date at midnight in the user's local timezone
                    return new Date(year, month - 1, day); 
                },

                attachEventListeners() {
                    this.addDateBtn.addEventListener('click', () => this.openModal());
                    this.settingsBtn.addEventListener('click', () => this.openSettings());
                    this.helpBtn.addEventListener('click', () => this.startTour(true));
                    
                    // NEW: Profile Listeners
                    this.profileBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleProfilePopover();
                    });
                    this.addProfileBtn.addEventListener('click', () => this.addProfile());
                    this.newProfileName.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            this.addProfile();
                        }
                    });
                    // Close popover on outside click
                    document.addEventListener('click', (e) => {
                        if (!this.profileContainer.contains(e.target)) {
                            this.profilePopover.classList.remove('flex');
                        }
                    });

                    // Goal Modal
                    this.closeModalBtn.addEventListener('click', () => this.closeModal());
                    this.cancelModalBtn.addEventListener('click', () => this.closeModal());
                    this.saveDateBtn.addEventListener('click', () => this.saveDate());
                    this.deleteDateBtn.addEventListener('click', () => this.handleDeleteDate());
                    this.dateType.addEventListener('change', (e) => {
                        if (e.target.value === '') {
                            // Show custom input if empty
                            this.dateTypeCustom.classList.remove('hidden');
                            this.dateTypeCustom.value = '';
                        } else {
                            // Hide custom input if a type is selected
                            this.dateTypeCustom.classList.add('hidden');
                            this.dateTypeCustom.value = '';
                        }
                        this.updateModalForType();
                    }); // MODIFIED
                    this.dateTypeCustom.addEventListener('input', () => {
                        // When typing custom type, clear the select
                        if (this.dateTypeCustom.value.trim()) {
                            this.dateType.value = '';
                        }
                        this.updateModalForType();
                    });
                    this.isRemembrance.addEventListener('change', () => this.updateModalForType()); // MODIFIED

                    // Milestones
                    this.addMilestoneBtn.addEventListener('click', () => this.addMilestone());
                    this.newMilestoneInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            this.addMilestone();
                        }
                    });
                    this.milestonesContainer.addEventListener('click', (e) => {
                        if (e.target.closest('.delete-milestone')) {
                            const id = e.target.closest('.milestone-item').dataset.id;
                            this.deleteMilestone(id);
                        } else if (e.target.closest('.milestone-checkbox')) {
                            const id = e.target.closest('.milestone-item').dataset.id;
                            this.toggleMilestone(id);
                        }
                    });
                    
                    // Settings Modal
                    this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
                    this.exportDataBtn.addEventListener('click', () => this.exportData());
                    this.importFile.addEventListener('change', (e) => this.importData(e));
                    this.columnCountSelect.addEventListener('change', (e) => this.setColumnCount(e.target.value));

                    // Confirm Modal
                    this.confirmCancel.addEventListener('click', () => this.closeConfirm());
                    this.confirmDelete.addEventListener('click', () => this.runConfirm());

                    // Card actions
                    this.countdownContainer.addEventListener('click', (e) => {
                        const card = e.target.closest('[data-id]');
                        if (!card) return;
                        const id = card.dataset.id;
                        
                        // If 'complete' button is clicked, toggle complete and stop.
                        if (e.target.closest('.complete-card')) {
                            this.toggleComplete(id);
                        } else {
                            // Otherwise, any click on the card opens the modal.
                            this.openModal(id);
                        }
                    });

                    // Onboarding
                    this.onboardingSkip.addEventListener('click', () => this.endTour());
                    this.onboardingNext.addEventListener('click', () => this.nextTourStep());
                    this.onboardingPrev.addEventListener('click', () => this.prevTourStep());
                },

                initThemes() {
                    this.themeSwitcher.addEventListener('click', (e) => {
                        const themeBtn = e.target.closest('.theme-btn');
                        if (themeBtn) {
                            this.setTheme(themeBtn.dataset.theme);
                        }
                    });
                },

                // UPDATED: Now part of profile settings
                loadTheme() {
                    const theme = this.getSettings().theme;
                    this.setTheme(theme, false); // false = don't save, just apply
                },

                // UPDATED: Now saves to profile
                setTheme(themeName, doSave = true) {
                    document.documentElement.dataset.theme = themeName;
                    
                    if (doSave) {
                        this.getSettings().theme = themeName;
                        this.saveAppState();
                    }

                    this.themeSwitcher.querySelectorAll('.theme-btn').forEach(btn => {
                        btn.classList.toggle('active-theme', btn.dataset.theme === themeName);
                    });
                },
                
                // REMOVED: loadDates()
                // REMOVED: saveDatesData()
                // REMOVED: saveGroupOrderData()

                // --- NEW: Profile & State Management ---
                loadAppState() {
                    const appData = localStorage.getItem('tymrApp');
                    if (appData) {
                        this.appState = JSON.parse(appData);
                        this.currentProfileId = this.appState.currentProfileId;
                        // Migration check for older data
                        if (!this.appState.profileData) {
                            this.migrateOldData();
                        }
                    } else {
                        // No data, create default
                        this.createDefaultProfileData();
                    }
                    
                    // Ensure a valid profile is always selected
                    if (!this.currentProfileId || !this.appState.profiles[this.currentProfileId]) {
                        this.currentProfileId = Object.keys(this.appState.profiles)[0];
                        this.appState.currentProfileId = this.currentProfileId;
                        this.saveAppState();
                    }
                },
                
                saveAppState() {
                    localStorage.setItem('tymrApp', JSON.stringify(this.appState));
                },
                
                createDefaultProfileData() {
                    const defaultProfileId = `profile_${Date.now()}`;
                    this.appState = {
                        currentProfileId: defaultProfileId,
                        profiles: {
                            [defaultProfileId]: { id: defaultProfileId, name: 'Demo Profile' } // MODIFIED
                        },
                        profileData: {
                            [defaultProfileId]: {
                                dates: this.getDemoDates(), // MODIFIED
                                groupOrder: ['Projects', 'Work', 'Personal', 'Travel', 'Finance'], // MODIFIED
                                settings: this.getDefaultSettings()
                            }
                        }
                    };
                    this.currentProfileId = defaultProfileId;
                    this.saveAppState();
                },
                
                // NEW: Handle migrating data from the old format
                migrateOldData() {
                    console.log("Migrating old data...");
                    const oldDates = JSON.parse(localStorage.getItem('countdownDates') || '[]');
                    const oldGroupOrder = JSON.parse(localStorage.getItem('tymrGroupOrder') || '[]');
                    const oldTheme = localStorage.getItem('tymrTheme') || 'dark';
                    const oldColumnCount = parseInt(localStorage.getItem('tymrColumnCount') || '2', 10);
                    const oldTourSeen = localStorage.getItem('tymrTourSeen') === 'true';

                    const defaultProfileId = `profile_${Date.now()}`;
                    this.appState = {
                        currentProfileId: defaultProfileId,
                        profiles: {
                            [defaultProfileId]: { id: defaultProfileId, name: 'Personal (Migrated)' }
                        },
                        profileData: {
                            [defaultProfileId]: {
                                dates: oldDates,
                                groupOrder: oldGroupOrder,
                                settings: {
                                    theme: oldTheme,
                                    columnCount: oldColumnCount,
                                    hasSeenTour: oldTourSeen
                                }
                            }
                        }
                    };
                    this.currentProfileId = defaultProfileId;
                    this.saveAppState();
                    
                    // Clean up old keys
                    localStorage.removeItem('countdownDates');
                    localStorage.removeItem('tymrGroupOrder');
                    localStorage.removeItem('tymrTheme');
                    localStorage.removeItem('tymrColumnCount');
                    localStorage.removeItem('tymrTourSeen');
                },

                // NEW: This is the main "switcher" function
                loadProfileData(profileId) {
                    if (!this.appState.profiles[profileId]) {
                        console.error("Profile not found:", profileId);
                        return;
                    }
                    
                    this.currentProfileId = profileId;
                    this.appState.currentProfileId = profileId;
                    this.saveAppState(); // Save the new active profile ID

                    const profile = this.getCurrentProfile();
                    const settings = this.getSettings();
                    
                    // 1. Update UI
                    this.currentProfileName.textContent = profile.name;
                    // this.exportProfileName.textContent = profile.name; // REMOVED
                    this.renderProfileList();
                    
                    // 2. Apply Settings
                    this.setTheme(settings.theme, false); // Apply, don't re-save
                    this.applyColumnClasses(settings.columnCount);
                    this.columnCountSelect.value = settings.columnCount;
                    
                    // 3. Render Data
                    this.renderAllDates(); // This now uses getDates() and getGroupOrder()
                    this.updateDatalists();
                },

                toggleProfilePopover() {
                    this.profilePopover.classList.toggle('flex');
                    if (this.profilePopover.classList.contains('flex')) {
                        this.renderProfileList();
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                    }
                },
                
                renderProfileList() {
                    this.profileList.innerHTML = '';
                    const profiles = Object.values(this.appState.profiles);
                    
                    if (profiles.length === 0) {
                         this.profileList.innerHTML = '<span class="px-3 py-2 text-sm text-muted">No profiles.</span>';
                         return;
                    }
                    
                    profiles.sort((a, b) => (a.name || '').localeCompare(b.name || '')).forEach(profile => {
                        const isCurrent = profile.id === this.currentProfileId;
                        const item = document.createElement('div');
                        item.className = `profile-list-item flex items-center justify-between group ${isCurrent ? 'bg-interactive' : ''}`;
                        
                        const switchBtn = document.createElement('button');
                        switchBtn.className = 'flex-1 flex items-center gap-2 text-left px-3 py-2 text-sm text-secondary';
                        switchBtn.innerHTML = `
                            ${isCurrent ? '<i data-lucide="check" class="w-4 h-4 text-accent"></i>' : '<span class="w-4 h-4"></span>'}
                            <span class="truncate ${isCurrent ? 'font-semibold text-primary' : ''}">${this.escapeHTML(profile.name)}</span>
                        `;
                        switchBtn.onclick = () => {
                            this.loadProfileData(profile.id);
                            this.toggleProfilePopover();
                        };
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'p-2 text-muted-light hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity';
                        deleteBtn.title = `Delete ${this.escapeHTML(profile.name)}`;
                        deleteBtn.innerHTML = '<i data-lucide="trash-2" class="w-4 h-4"></i>';
                        deleteBtn.onclick = (e) => {
                            e.stopPropagation();
                            this.handleDeleteProfile(profile.id);
                        };

                        item.appendChild(switchBtn);
                        // Don't allow deleting the last profile
                        if (profiles.length > 1) {
                            item.appendChild(deleteBtn);
                        }
                        this.profileList.appendChild(item);
                    });
                },
                
                addProfile() {
                    const name = this.newProfileName.value.trim();
                    if (!name) {
                        this.showToast("Please enter a profile name.", "error");
                        return;
                    }
                    
                    const newId = `profile_${Date.now()}`;
                    this.appState.profiles[newId] = { id: newId, name: name };
                    this.appState.profileData[newId] = {
                        dates: [],
                        groupOrder: [],
                        settings: this.getDefaultSettings()
                    };
                    
                    this.saveAppState();
                    this.loadProfileData(newId); // Switch to the new profile
                    this.newProfileName.value = '';
                    this.toggleProfilePopover();
                },

                handleDeleteProfile(profileId) {
                    if (Object.keys(this.appState.profiles).length <= 1) {
                        this.showToast("Cannot delete the last profile.", "error");
                        return;
                    }
                    
                    const profileName = this.appState.profiles[profileId].name;
                    this.showConfirm(
                        `Delete "${profileName}"?`,
                        `Are you sure? All dates and settings for this profile will be permanently lost.`,
                        () => {
                            delete this.appState.profiles[profileId];
                            delete this.appState.profileData[profileId];
                            
                            // If we deleted the active profile, switch to the first available one
                            if (this.currentProfileId === profileId) {
                                const newCurrentId = Object.keys(this.appState.profiles)[0];
                                this.loadProfileData(newCurrentId);
                            } else {
                                this.renderProfileList(); // Just re-render the list
                            }
                            this.saveAppState();
                            this.showToast(`Profile "${profileName}" deleted.`, 'success');
                        }
                    );
                },
                // --- END: Profile & State Management ---

                // UPDATED: Now part of saveAndRender()
                saveAndRender() {
                    // This function no longer saves directly,
                    // it just triggers the render.
                    // The actual save happens in saveDate(), setColumnCount(), etc.
                    this.renderAllDates();
                    this.updateDatalists();
                },

                openModal(id = null) {
                    this.resetModal();
                    if (id) {
                        const date = this.getDates().find(g => g.id === id); // UPDATED
                        if (date) {
                            this.modalTitle.textContent = 'Edit Date';
                            this.dateId.value = date.id;
                            this.dateTitle.value = date.title;
                            this.dateNotes.value = date.notes || '';
                            this.dateTarget.value = date.date ? date.date.split('T')[0] : ''; // UPDATED
                            // MODIFIED: Handle type select or custom
                            const dateType = date.type || '';
                            const isCustomType = !['Personal', 'Work', 'Birthday', 'Anniversary', 'Health', 'Finance', 'Learn', 'Travel', 'Home'].includes(dateType);
                            if (isCustomType && dateType) {
                                this.dateType.value = '';
                                this.dateTypeCustom.value = dateType;
                                this.dateTypeCustom.classList.remove('hidden');
                            } else {
                                this.dateType.value = dateType;
                                this.dateTypeCustom.value = '';
                                this.dateTypeCustom.classList.add('hidden');
                            }
                            this.dateIconColor.value = date.iconColor || '#374151'; // MODIFIED
                            this.dateIconName.value = date.iconName || '';
                            this.dateGroup.value = date.group || '';
                            // NEW: Populate Label
                            this.dateLabel.value = date.label || '';
                            this.dateShowLabel.checked = date.showLabel ?? true;

                            this.currentMilestones = JSON.parse(JSON.stringify(date.milestones || []));
                            this.deleteDateBtn.style.display = 'block';

                            this.isRemembrance.checked = date.isRemembrance || false;
                            this.dateOfDeath.value = date.dateOfDeath || '';
                            this.dateShowMilestones.checked = date.showMilestones ?? true;
                            document.getElementById('dateStatus').value = date.status || 'Pending'; // NEW: Populate status
                            this.dateTimerMode.value = date.timerMode || 'auto'; // NEW: Populate timer mode
                        }
                    } else {
                        this.modalTitle.textContent = 'Add New Date';
                        this.deleteDateBtn.style.display = 'none';
                    }
                    this.renderMilestones();
                    this.updateModalForType(); // MODIFIED
                    this.dateModal.classList.add('flex');
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                },

                closeModal() {
                    this.dateModal.classList.remove('flex');
                    this.resetModal();
                },

                resetModal() {
                    this.modalTitle.textContent = 'Add New Date';
                    this.dateId.value = '';
                    this.dateTitle.value = '';
                    this.dateNotes.value = '';
                    this.dateTarget.value = '';
                    this.dateType.value = ''; // MODIFIED
                    this.dateTypeCustom.value = ''; // NEW
                    this.dateTypeCustom.classList.add('hidden'); // NEW
                    this.dateIconColor.value = '#374151'; // MODIFIED
                    this.dateIconName.value = '';
                    this.dateGroup.value = '';
                    // NEW: Reset Label
                    this.dateLabel.value = '';
                    this.dateShowLabel.checked = true;

                    this.currentMilestones = [];
                    this.milestonesContainer.innerHTML = '';
                    this.newMilestoneInput.value = '';
                    this.dateShowMilestones.checked = true;
                    this.remembranceCheckboxContainer.classList.add('hidden');
                    this.isRemembrance.checked = false;
                    this.dateOfDeathContainer.classList.add('hidden');
                    this.dateOfDeath.value = '';
                    document.getElementById('dateStatus').value = 'Pending'; // NEW: Reset status
                    document.getElementById('dateStatusContainer').classList.remove('hidden'); // NEW: Ensure status is visible on reset
                    this.dateTimerMode.value = 'auto'; // NEW: Reset timer mode
                },

                updateModalForType() { // MODIFIED: Renamed function
                    const categoryLabel = document.querySelector('label[for="dateTarget"]');
                    // Get type from select or custom input
                    const typeValue = this.dateType.value.trim() || this.dateTypeCustom.value.trim();
                    const categoryLower = typeValue.toLowerCase(); // MODIFIED
                    const isBirthday = categoryLower === 'birthday';
                    const isAnniversary = categoryLower === 'anniversary';
                    const isSpecialDate = isBirthday || isAnniversary;
                    const remembranceChecked = this.isRemembrance.checked;
                    
                    const milestoneTitle = this.milestoneSection.querySelector('h3');
                    const statusContainer = document.getElementById('dateStatusContainer'); // NEW

                    if (isSpecialDate) {
                        statusContainer.classList.add('hidden'); // NEW: Hide status for special dates
                    } else {
                        statusContainer.classList.remove('hidden'); // NEW: Show status for other dates
                    }

                    this.milestoneSection.style.display = 'block';
                    if (isSpecialDate) {
                        if (milestoneTitle) milestoneTitle.textContent = 'Checklist';
                    } else {
                        if (milestoneTitle) milestoneTitle.textContent = 'Key Results (Milestones)';
                    }

                    if (isBirthday) {
                        this.remembranceCheckboxContainer.classList.remove('hidden');
                    } else {
                        this.remembranceCheckboxContainer.classList.add('hidden');
                    }
        
                    if (isBirthday && remembranceChecked) {
                        this.dateOfDeathContainer.classList.remove('hidden');
                    } else {
                        this.dateOfDeathContainer.classList.add('hidden');
                    }

                    // UPDATED: Simplified logic. Type is always 'date'.
                    if (isSpecialDate) {
                        if (isBirthday) {
                            categoryLabel.textContent = 'Birthday (Date of Birth)';
                        } else if (isAnniversary) {
                            categoryLabel.textContent = 'Anniversary Date';
                        }
                    } else {
                        categoryLabel.textContent = 'Target Date';
                    }
                    // Always ensure value is just YYYY-MM-DD
                    if (this.dateTarget.value.includes('T')) {
                        this.dateTarget.value = this.dateTarget.value.split('T')[0];
                    }
                },

                saveDate() {
                    const id = this.dateId.value;
                    const title = this.dateTitle.value.trim();
                    const target = this.dateTarget.value;

                    if (!title || !target) {
                        this.showToast('Please fill in both Date Title and Target Date.', 'error');
                        return;
                    }
                    if (this.isRemembrance.checked && !this.dateOfDeath.value) {
                        this.showToast('Please add a Date of Passing for remembrance.', 'error');
                        return;
                    }
                    
                    // NEW: Check if this is a special date type
                    const typeValue = this.dateType.value.trim() || this.dateTypeCustom.value.trim();
                    const categoryLower = typeValue.toLowerCase(); // MODIFIED
                    const isBirthday = categoryLower === 'birthday';
                    const isAnniversary = categoryLower === 'anniversary';
                    const isNonCompletable = isBirthday || isAnniversary;

                    const dates = this.getDates(); // UPDATED
                    const existingDate = dates.find(g => g.id === id);

                    const dateData = {
                        title: title,
                        notes: this.dateNotes.value.trim(),
                        date: target,
                        type: (this.dateType.value.trim() || this.dateTypeCustom.value.trim()), // MODIFIED: Use select or custom
                        iconColor: this.dateIconColor.value, // MODIFIED
                        iconName: this.dateIconName.value.trim(),
                        group: this.dateGroup.value.trim() || 'General',
                        // NEW: Save Label
                        label: this.dateLabel.value.trim(),
                        showLabel: this.dateShowLabel.checked,

                        milestones: this.currentMilestones,
                        status: isNonCompletable ? 'Pending' : document.getElementById('dateStatus').value, // UPDATED: Save status
                        showMilestones: this.dateShowMilestones.checked,
                        isRemembrance: this.isRemembrance.checked,
                        dateOfDeath: this.isRemembrance.checked ? this.dateOfDeath.value : '',
                        timerMode: this.dateTimerMode.value || 'auto', // NEW: Save timer mode
                    };

                    if (id) {
                        const index = dates.findIndex(g => g.id === id);
                        if (index !== -1) {
                            this.getDates()[index] = { ...dates[index], ...dateData }; // UPDATED
                        }
                    } else {
                        this.getDates().push({ // UPDATED
                            ...dateData,
                            id: `goal_${Date.now()}`
                        });
                    }

                    this.saveAppState(); // NEW
                    this.saveAndRender();
                    this.closeModal();
                },
                
                handleDeleteDate() {
                    const id = this.dateId.value;
                    if (!id) return;
                    
                    this.showConfirm(
                        'Delete Date?',
                        'Are you sure you want to delete this date? This action cannot be undone.',
                        () => {
                            // UPDATED
                            const dates = this.getDates();
                            const newDates = dates.filter(g => g.id !== id);
                            this.appState.profileData[this.currentProfileId].dates = newDates;
                            
                            this.saveAppState(); // NEW
                            this.saveAndRender();
                            this.closeModal();
                        }
                    );
                },

                // NEW: Added missing function for card delete button
                handleDeleteCard(id) {
                    if (!id) return;
                    const date = this.getDates().find(g => g.id === id);
                    if (!date) return;

                    this.showConfirm(
                        `Delete "${this.escapeHTML(date.title)}"?`,
                        'Are you sure you want to delete this date? This action cannot be undone.',
                        () => {
                            const dates = this.getDates();
                            const newDates = dates.filter(g => g.id !== id);
                            this.appState.profileData[this.currentProfileId].dates = newDates;
                            
                            this.saveAppState();
                            this.saveAndRender();
                            this.showToast('Date deleted.', 'success');
                        }
                    );
                },

                toggleComplete(id) {
                    const date = this.getDates().find(g => g.id === id); // UPDATED
                    if (date) {
                        date.status = date.status === 'Completed' ? 'Pending' : 'Completed';
                        this.saveAppState(); // NEW
                        this.saveAndRender();
                    }
                },

                renderMilestones() {
                    this.milestonesContainer.innerHTML = '';
                    if (this.currentMilestones.length === 0) {
                        this.milestonesContainer.innerHTML = '<p class="text-xs text-muted italic">No milestones added yet.</p>';
                        return;
                    }
                    this.currentMilestones.forEach(milestone => {
                        this.milestonesContainer.appendChild(this.createMilestoneElement(milestone));
                    });
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    } // NEW: Render milestone icons
                },
                
                createMilestoneElement(milestone) {
                    const div = document.createElement('div');
                    div.className = 'milestone-item flex items-center justify-between bg-interactive p-2 rounded-md';
                    div.dataset.id = milestone.id;
                    
                    const checked = milestone.completed ? 'checked' : '';
                    const textClass = milestone.completed ? 'line-through text-muted-light' : 'text-secondary';

                    div.innerHTML = `
                        <div class="flex items-center gap-2">
                            <input type="checkbox" ${checked} class="milestone-checkbox form-checkbox h-4 w-4 bg-interactive border-color-strong text-accent-light rounded focus:ring-accent-light focus:ring-offset-gray-800">
                            <span class="text-sm ${textClass}">${this.escapeHTML(milestone.text)}</span>
                        </div>
                        <button type="button" class="delete-milestone text-muted-light hover-text-danger p-1">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    `;
                    return div;
                },
                
                addMilestone() {
                    const text = this.newMilestoneInput.value.trim();
                    if (text) {
                        this.currentMilestones.push({
                            id: `ms_${Date.now()}`,
                            text: text,
                            completed: false
                        });
                        this.newMilestoneInput.value = '';
                        this.renderMilestones();
                    }
                },

                deleteMilestone(id) {
                    this.currentMilestones = this.currentMilestones.filter(ms => ms.id !== id);
                    this.renderMilestones();
                },
                
                toggleMilestone(id) {
                    const milestone = this.currentMilestones.find(ms => ms.id === id); // Fixed: Was !==
                    if (milestone) {
                        milestone.completed = !milestone.completed;
                        this.renderMilestones();
                    }
                },

                openSettings() {
                    this.settingsModal.classList.add('flex');
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                },

                closeSettings() {
                    this.settingsModal.classList.remove('flex');
                },
                
                // UPDATED: Exports current profile data
                exportData() {
                    const currentData = this.getCurrentData(); // NEW
                    if (currentData.dates.length === 0) {
                        this.showToast('No dates in this profile to export.', 'error');
                        return;
                    }
                    // Export dates, groupOrder, and settings for this profile
                    const dataToExport = {
                        dates: currentData.dates,
                        groupOrder: currentData.groupOrder,
                        settings: currentData.settings
                    };
                    
                    const dataStr = JSON.stringify(dataToExport, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    const profileName = this.getCurrentProfile().name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    a.download = `tymr_${profileName}_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    this.closeSettings();
                },
                
                // UPDATED: Exports ALL app data
                exportData() {
                    if (!this.appState || !this.appState.profiles || Object.keys(this.appState.profiles).length === 0) {
                        this.showToast('No data to export.', 'error');
                        return;
                    }
                    
                    // Export the entire appState
                    const dataToExport = this.appState;
                    
                    const dataStr = JSON.stringify(dataToExport, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `tymo_all_data_${new Date().toISOString().split('T')[0]}.json`; // New filename
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    this.closeSettings();
                    this.showToast('All data exported successfully.', 'success');
                },
                
                // UPDATED: Imports ALL app data
                importData(event) {
                    const file = event.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedData = JSON.parse(e.target.result);
                            // Check for the new structure (the full appState)
                            if (importedData.currentProfileId && importedData.profiles && importedData.profileData) {
                                this.showConfirm(
                                    'Import All Data?',
                                    `This will overwrite *all* existing profiles, dates, and settings. This cannot be undone. Are you sure?`,
                                    () => {
                                        this.appState = importedData; // Overwrite entire state
                                        this.saveAppState();
                                        // Load the active profile from the *newly* imported data
                                        this.loadProfileData(this.appState.currentProfileId); 
                                        this.closeSettings();
                                        event.target.value = null; // Reset file input
                                        this.showToast('All data imported successfully.', 'success');
                                    }
                                );
                            } else {
                                this.showToast('Invalid file format. Expected full application data.', 'error');
                            }
                        } catch (err) {
                            console.error('Error importing data:', err);
                            this.showToast('Failed to read or parse file.', 'error');
                        }
                    };
                    reader.readAsText(file);
                },

                // --- Onboarding Tour Methods ---
                initTourSteps() {
                    this.tourSteps = [
                        {
                            selector: 'h1',
                            text: `
                                <div class='flex items-center gap-2 mb-3'>
                                    <span class='text-2xl font-bold text-primary'>Tymo — Count What Matters</span>
                                </div>
                                <p class='text-sm text-color mb-3 italic'>
                                    Time is always moving — quietly, constantly.<br>
                                    Tymo&nbsp;helps you stay connected to it.
                                </p>
                                <p class='text-sm text-color mb-3'>
                                    Not just a countdown app, but a living record of everything that deserves your attention.
                                    <br>Moments to come, memories to honor, milestones to anticipate.
                                </p>
                                <p class='text-sm text-color mb-2 font-medium'>
                                    Use it to track:
                                </p>
                                <ul class='list-none space-y-1.5 text-sm text-color mb-3'>
                                    <li class='flex items-start gap-2'>
                                        <i data-lucide='rocket' class='w-4 h-4 text-accent-light shrink-0 mt-0.5'></i>
                                        <span>Product launches & critical deadlines</span>
                                    </li>
                                    <li class='flex items-start gap-2'>
                                        <i data-lucide='plane' class='w-4 h-4 text-accent-light shrink-0 mt-0.5'></i>
                                        <span>Upcoming trips & vacations</span>
                                    </li>
                                    <li class='flex items-start gap-2'>
                                        <i data-lucide='cake' class='w-4 h-4 text-accent-light shrink-0 mt-0.5'></i>
                                        <span>Birthdays, anniversaries & events</span>
                                    </li>
                                    <li class='flex items-start gap-2'>
                                        <i data-lucide='target' class='w-4 h-4 text-accent-light shrink-0 mt-0.5'></i>
                                        <span>Personal goals & habits</span>
                                    </li>
                                </ul>
                                <p class='text-sm text-muted'>
                                    This is your demo dashboard. Once you’re onboarded, you can delete this and create your own profiles.
                                </p>
                            `,
                            placement: 'bottom-start'
                        },
                        // MODIFIED: Point to demo project
                        {
                            selector: '[data-id="demo_project_1"]',
                            text: "This is a countdown for a project. You can add milestones, notes, and an icon.",
                            placement: 'bottom',
                            fallbackSelector: '[data-id="demo_birthday_1"]',
                            fallbackText: "This is a countdown widget. You can add milestones, notes, and an icon."
                        },
                        // MODIFIED: Point to birthday
                        {
                            selector: '[data-id="demo_birthday_1"]',
                            text: "Tymo handles special dates, like birthdays and anniversaries, automatically.",
                            placement: 'bottom',
                            fallbackSelector: '[data-id="demo_remembrance_1"]',
                            fallbackText: "Tymo handles special dates, like birthdays and anniversaries."
                        },
                        // NEW: Point to remembrance
                        {
                            selector: '[data-id="demo_remembrance_1"]',
                            text: "It can also track remembrance dates to honor loved ones.",
                            placement: 'bottom',
                            fallbackSelector: '[data-id="demo_travel_1"]',
                            fallbackText: "It can also track special dates."
                        },
                        // NEW: Point to completed
                        {
                            selector: '[data-id="demo_completed_1"]',
                            text: "Completed items are grayed out, keeping your dashboard clean.",
                            placement: 'top',
                            fallbackSelector: '[data-id="demo_travel_1"]'
                        },
                        // NEW: Point to group header
                        {
                            selector: '[data-group-name="Projects"]',
                            text: "Drag groups or individual cards to re-order your dashboard.",
                            placement: 'bottom',
                            fallbackSelector: '#countdownContainer'
                        },
                        // MODIFIED: Updated text
                        {
                            selector: '#profileBtn',
                            text: "This is your profile switcher! Create separate profiles for 'Work', 'Home', etc.",
                            placement: 'bottom-end',
                            finalFallbackSelector: '#addDateBtn',
                            finalFallbackText: "Click 'Add Date' to create your own countdown!"
                        },
                        {
                            selector: '#addDateBtn',
                            text: "Click 'Add Date' to create your own countdowns in this profile!",
                            placement: 'bottom-end'
                        },
                        {
                            selector: '#themeSwitcher',
                            text: "Choose your favorite look. The theme is saved to your current profile.",
                            placement: 'bottom'
                        },
                        {
                            selector: '#settingsBtn',
                            text: "Here you can change column counts or export/import all your data.",
                            placement: 'bottom-end'
                        },
                        {
                            selector: '#helpBtn',
                            text: "You can restart this guide anytime by clicking this help icon.",
                            placement: 'bottom-end'
                        }
                    ];
                },

                startTour(force = false) {
                    const hasSeenTour = this.getSettings().hasSeenTour; // UPDATED
                    if (hasSeenTour && !force) {
                        this.endTour(false); // false = don't save
                        return;
                    }
                    this.showTourStep(0);
                },

                endTour(doSave = true) {
                    if (this.popperInstance) this.popperInstance.destroy();
                    document.querySelectorAll('.onboarding-highlight').forEach(el => el.classList.remove('onboarding-highlight'));
                    
                    this.onboardingStep.classList.remove('flex');
                    this.onboardingOverlay.classList.remove('flex');
                    
                    if (doSave) {
                        this.getSettings().hasSeenTour = true; // UPDATED
                        this.saveAppState(); // NEW
                    }
                },

                showTourStep(index) {
                    if (this.popperInstance) this.popperInstance.destroy();
                    document.querySelectorAll('.onboarding-highlight').forEach(el => el.classList.remove('onboarding-highlight'));

                    if (index >= this.tourSteps.length) {
                        this.endTour();
                        return;
                    }

                    this.currentTourStep = index;
                    let step = this.tourSteps[index];
                    let targetElement = document.querySelector(step.selector);
                    let text = step.text;
                    let placement = step.placement;

                    // NEW: Added fallback logic
                    if (!targetElement && step.fallbackSelector) {
                        targetElement = document.querySelector(step.fallbackSelector);
                        if (targetElement) {
                            text = step.fallbackText || text;
                            placement = step.fallbackPlacement || placement;
                        }
                    }
                    if (!targetElement && step.finalFallbackSelector) {
                        targetElement = document.querySelector(step.finalFallbackSelector);
                        if (targetElement) {
                            text = step.finalFallbackText || text;
                            placement = step.finalFallbackPlacement || placement;
                        }
                    }
                    
                    // NEW: Adjust modal width
                    const stepElement = this.onboardingStep;
                    stepElement.classList.remove('max-w-xs', 'max-w-md');
                    if (index === 0) {
                        stepElement.classList.add('max-w-md'); // Wider for the intro text
                    } else {
                        stepElement.classList.add('max-w-xs'); // Default width
                    }
                    
                    this.onboardingText.innerHTML = text; // <-- CHANGED from textContent
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    } // NEW: Render icons in tour step
                    this.onboardingStep.classList.add('flex');
                    this.onboardingOverlay.classList.add('flex');

                    if (targetElement) {
                        targetElement.classList.add('onboarding-highlight');
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

                        this.popperInstance = Popper.createPopper(targetElement, this.onboardingStep, {
                            placement: placement,
                            modifiers: [
                                { name: 'offset', options: { offset: [0, 12] } },
                                { name: 'arrow', options: { element: this.onboardingArrow } }
                            ]
                        });
                    } else {
                        this.onboardingStep.style.top = '50%';
                        this.onboardingStep.style.left = '50%';
                        this.onboardingStep.style.transform = 'translate(-50%, -50%)';
                    }

                    this.onboardingPrev.style.display = (index === 0) ? 'none' : 'block';
                    this.onboardingNext.textContent = (index === this.tourSteps.length - 1) ? 'Done' : 'Next';
                },

                nextTourStep() {
                    this.showTourStep(this.currentTourStep + 1);
                },

                prevTourStep() {
                    this.showTourStep(this.currentTourStep - 1);
                },
                // --- END: Onboarding Tour Methods ---

                showConfirm(title, message, callback) {
                    this.confirmTitle.textContent = title;
                    this.confirmMessage.textContent = message;
                    this._confirmCallback = callback;
                    this.confirmModal.classList.add('flex');
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                },

                closeConfirm() {
                    this.confirmModal.classList.remove('flex');
                    this._confirmCallback = null;
                },

                runConfirm() {
                    if (this._confirmCallback) {
                        this._confirmCallback();
                    }
                    this.closeConfirm();
                },

                showToast(message, type = 'error') {
                    const toast = document.createElement('div');
                    let icon = '';
                    let classes = '';

                    if (type === 'error') {
                        classes = 'bg-red-600 text-white';
                        icon = `<i data-lucide="alert-circle" class="w-5 h-5"></i>`;
                    } else {
                        classes = 'bg-green-600 text-white';
                        icon = `<i data-lucide="check-circle" class="w-5 h-5"></i>`;
                    }

                    toast.className = `flex items-center gap-3 w-full p-4 rounded-lg shadow-lg ${classes}`;
                    toast.classList.add('animate-fadeIn');
                    toast.innerHTML = `
                        <div class="shrink-0">${icon}</div>
                        <div class="text-sm font-medium">${this.escapeHTML(message)}</div>
                    `;
                    
                    this.toastContainer.appendChild(toast);
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }

                    setTimeout(() => {
                        toast.classList.add('animate-fadeOut');
                        setTimeout(() => toast.remove(), 500);
                    }, 3000);
                },

                // --- Column Count Functions ---
                // UPDATED: No longer loads, just applies
                loadAndApplyColumnCount() {
                    const columnCount = this.getSettings().columnCount; // UPDATED
                    this.columnCountSelect.value = columnCount;
                    this.applyColumnClasses(columnCount);
                },

                // UPDATED: Saves to profile
                setColumnCount(count) {
                    const columnCount = parseInt(count, 10); // UPDATED
                    this.getSettings().columnCount = columnCount; // UPDATED
                    this.saveAppState(); // NEW
                    this.applyColumnClasses(columnCount);
                    if (this.getDates().length === 0) { // UPDATED
                        this.renderAllDates();
                    }
                },

                applyColumnClasses(count) {
                    const container = this.countdownContainer;
                    container.classList.remove('md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');

                    switch (count) {
                        case 1: break;
                        case 2: container.classList.add('md:grid-cols-2'); break;
                        case 3: container.classList.add('md:grid-cols-2', 'lg:grid-cols-3'); break;
                        case 4: container.classList.add('md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4'); break;
                    }
                },
                
                getColumnColspanClasses(count) {
                    switch (count) {
                        case 1: return '';
                        case 2: return 'md:col-span-2';
                        case 3: return 'md:col-span-2 lg:col-span-3';
                        case 4: return 'md:col-span-2 lg:col-span-3 xl:col-span-4';
                        default: return 'md:col-span-2';
                    }
                },
                // --- END: Column Count Functions ---

                renderAllDates() {
                    this.timers.forEach(timer => clearInterval(timer));
                    this.timers = [];
                    
                    try {
                        if (this.sortableGroups) {
                            this.sortableGroups.destroy();
                            this.sortableGroups = null; // Explicitly nullify
                        }
                    } catch (e) {
                        console.warn("Error destroying group Sortable:", e);
                    }
                    
                    try {
                        this.sortableCards.forEach(s => {
                            if (s) s.destroy();
                        });
                    } catch (e) {
                        console.warn("Error destroying card Sortable:", e);
                    }
                    this.sortableCards = [];
                    
                    this.countdownContainer.innerHTML = '';
                    
                    const dates = this.getDates(); // UPDATED
                    const groupOrder = this.getGroupOrder(); // UPDATED
                    const columnCount = this.getSettings().columnCount; // UPDATED

                    if (dates.length === 0) {
                        const colspanClasses = this.getColumnColspanClasses(columnCount); // UPDATED
                        this.countdownContainer.innerHTML = `
                            <div data-empty-state class="${colspanClasses} text-center text-muted mt-12 w-full">
                                <i data-lucide="calendar-days" class="w-16 h-16 mx-auto mb-4" stroke-width="1.5"></i>
                                <h3 class="text-xl font-semibold text-primary">No Dates Yet</h3>
                                <p class="text-muted">Click "Add Date" to get started.</p>
                            </div>
                        `;
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    } // Render empty state icon
                        return;
                    }

                    const groupedDates = dates.reduce((acc, date) => {
                        const groupName = date.group || 'General';
                        if (!acc[groupName]) acc[groupName] = [];
                        acc[groupName].push(date);
                        return acc;
                    }, {});

                    for (const groupName in groupedDates) {
                        groupedDates[groupName].sort((a, b) => new Date(a.date) - new Date(b.date));
                    }

                    const allGroupNames = Object.keys(groupedDates);
                    let sortedGroupNames = groupOrder.filter(name => allGroupNames.includes(name));
                    allGroupNames.forEach(name => {
                        if (!sortedGroupNames.includes(name)) sortedGroupNames.push(name);
                    });
                    if (!groupOrder.includes('General') && sortedGroupNames.includes('General')) {
                        sortedGroupNames = sortedGroupNames.filter(name => name !== 'General');
                        sortedGroupNames.push('General');
                    }
                    
                    // UPDATED: Save new group order to current profile
                    this.appState.profileData[this.currentProfileId].groupOrder = sortedGroupNames;
                    this.saveAppState();


                    for (const groupName of sortedGroupNames) {
                        const groupContainer = document.createElement('div');
                        groupContainer.className = 'group-container w-full';
                        groupContainer.dataset.groupName = groupName;

                        const groupHeader = document.createElement('h2');
                        groupHeader.className = 'group-header text-xl font-semibold text-primary w-full mb-3 mt-5 border-b border-color pb-2 flex items-center gap-2';
                        groupHeader.innerHTML = `
                            <i data-lucide="grip-vertical" class="w-4 h-4 text-muted shrink-0"></i>
                            ${this.escapeHTML(groupName)}
                        `;
                        
                        const cardList = document.createElement('div');
                        cardList.className = 'card-list';

                        for (const date of groupedDates[groupName]) {
                            const card = this.createDateCard(date);
                            cardList.appendChild(card);
                        }
                        
                        groupContainer.appendChild(groupHeader);
                        groupContainer.appendChild(cardList);
                        this.countdownContainer.appendChild(groupContainer);
                    }
                    
                    this.initSortable();
                    this.startTimers();
                    if (typeof lucide !== 'undefined' && lucide.createIcons) {
                        lucide.createIcons();
                    }
                },

                initSortable() {
                    // Check if Sortable is loaded
                    if (typeof Sortable === 'undefined') {
                        console.error('SortableJS is not loaded.');
                        this.showToast('Drag-and-drop failed to load. Please refresh.', 'error');
                        return;
                    }
                    
                    this.sortableGroups = new Sortable(this.countdownContainer, {
                        animation: 150,
                        handle: '.group-header',
                        ghostClass: 'sortable-ghost',
                        dragClass: 'sortable-drag',
                        onEnd: (evt) => this.handleGroupDrop(evt)
                    });

                    const cardLists = this.countdownContainer.querySelectorAll('.card-list');
                    cardLists.forEach(list => {
                        const sortableList = new Sortable(list, {
                            animation: 150,
                            group: 'goals',
                            ghostClass: 'sortable-ghost',
                            dragClass: 'sortable-drag',
                            onEnd: (evt) => this.handleCardDrop(evt)
                        });
                        this.sortableCards.push(sortableList);
                    });
                },

                handleCardDrop(evt) {
                    const dateId = evt.item.dataset.id;
                    const newGroupEl = evt.to.closest('.group-container');
                    if (!newGroupEl) return;

                    const newGroupName = newGroupEl.dataset.groupName;
                    
                    const date = this.getDates().find(g => g.id === dateId); // UPDATED
                    if (date && date.group !== newGroupName) {
                        date.group = newGroupName;
                        this.saveAppState(); // UPDATED
                    }
                },

                handleGroupDrop(evt) {
                    const newOrder = Array.from(this.countdownContainer.children)
                        .map(el => el.dataset.groupName)
                        .filter(Boolean);
                    
                    this.appState.profileData[this.currentProfileId].groupOrder = newOrder; // UPDATED
                    this.saveAppState(); // UPDATED
                },

                calculateNextBirthday(dobString) {
                    try {
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const birthDate = this.parseLocalDate(dobString); // UPDATED
                        if (isNaN(birthDate.getTime())) throw new Error('Invalid date');
                        const birthMonth = birthDate.getMonth();
                        const birthDay = birthDate.getDate();
                        const birthYear = birthDate.getFullYear();
                        const currentYear = now.getFullYear();
                        let nextBirthdayDate = new Date(currentYear, birthMonth, birthDay);
                        let nextAge = currentYear - birthYear;
                        let currentAge = nextAge;
                        if (nextBirthdayDate < today) {
                            nextBirthdayDate.setFullYear(currentYear + 1);
                            nextAge = nextBirthdayDate.getFullYear() - birthYear;
                        } else {
                            currentAge = nextAge - 1;
                        }
                        if (nextBirthdayDate.getTime() === today.getTime()) {
                            currentAge = nextAge;
                        }
                        return { nextBirthdayDate, nextAge, currentAge };
                    } catch (e) {
                        console.error("Error calculating birthday:", e, dobString);
                        return { nextBirthdayDate: new Date(), nextAge: 0, currentAge: 0 };
                    }
                },

                calculateNextAnniversary(anniversaryDateString) {
                    try {
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const anniversaryDate = this.parseLocalDate(anniversaryDateString); // UPDATED
                        if (isNaN(anniversaryDate.getTime())) throw new Error('Invalid date');
                        const annivMonth = anniversaryDate.getMonth();
                        const annivDay = anniversaryDate.getDate();
                        const annivYear = anniversaryDate.getFullYear();
                        const currentYear = now.getFullYear();
                        let nextAnniversaryDate = new Date(currentYear, annivMonth, annivDay);
                        let nextAnniversaryNumber = currentYear - annivYear;
                        if (nextAnniversaryDate < today) {
                            nextAnniversaryDate.setFullYear(currentYear + 1);
                            nextAnniversaryNumber = nextAnniversaryDate.getFullYear() - annivYear;
                        }
                        return { nextAnniversaryDate, nextAnniversaryNumber };
                    } catch (e) {
                        console.error("Error calculating anniversary:", e, anniversaryDateString);
                        return { nextAnniversaryDate: new Date(), nextAnniversaryNumber: 0 };
                    }
                },

                calculateRemembranceInfo(dobString, dodString) {
                    try {
                        const dob = this.parseLocalDate(dobString); // UPDATED
                        const dod = this.parseLocalDate(dodString); // UPDATED
                        if (isNaN(dob.getTime()) || isNaN(dod.getTime())) throw new Error('Invalid date');
                        let livedForYears = dod.getFullYear() - dob.getFullYear();
                        const m = dod.getMonth() - dob.getMonth();
                        if (m < 0 || (m === 0 && dod.getDate() < dob.getDate())) {
                            livedForYears--;
                        }
                        const now = new Date();
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const dodMonth = dod.getMonth();
                        const dodDay = dod.getDate();
                        const currentYear = now.getFullYear();
                        const dodYear = dod.getFullYear();
                        let nextDeathAnniversary = new Date(currentYear, dodMonth, dodDay);
                        if (nextDeathAnniversary < today) {
                            nextDeathAnniversary.setFullYear(currentYear + 1);
                        }
                        return {
                            livedForYears: livedForYears,
                            nextDeathAnniversary: nextDeathAnniversary,
                            nextAnniversaryNumber: nextDeathAnniversary.getFullYear() - dodYear
                        };
                    } catch (e) {
                        console.error("Error calculating remembrance:", e, dobString, dodString);
                        return { livedForYears: 0, nextDeathAnniversary: new Date(), nextAnniversaryNumber: 0 };
                    }
                },

                createDateCard(dateData) {
                    const card = document.createElement('div');
                    // Add 'group' class to enable group-hover states and 'cursor-pointer'
                    // UX POLISH: Increased width from w-40 to w-48 for more space
                    card.className = 'card-bg group p-2.5 rounded-lg shadow-lg flex flex-col space-y-2 w-48 cursor-pointer'; 
                    card.dataset.id = dateData.id;
                    
                    let targetDate, formattedDate, timerDateString, nextAge = 0, currentAge = 0, nextAnniversaryNumber = 0, livedForYears = 0, nextDeathAnniversaryNumber = 0;
                    const categoryLower = dateData.type?.trim().toLowerCase() || ''; // MODIFIED
                    const isRemembrance = dateData.isRemembrance && categoryLower === 'birthday';
                    let isBirthday = categoryLower === 'birthday' && !isRemembrance;
                    let isAnniversary = categoryLower === 'anniversary';
                    
                    if (isBirthday && dateData.date) {
                        const bdayInfo = this.calculateNextBirthday(dateData.date);
                        targetDate = bdayInfo.nextBirthdayDate;
                        timerDateString = targetDate.toISOString();
                        const originalBirthdate = new Date(dateData.date);
                        formattedDate = originalBirthdate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                        nextAge = bdayInfo.nextAge;
                        currentAge = bdayInfo.currentAge;
                    } else if (isAnniversary && dateData.date) {
                        const annivInfo = this.calculateNextAnniversary(dateData.date);
                        targetDate = annivInfo.nextAnniversaryDate;
                        timerDateString = targetDate.toISOString();
                        const originalAnnivDate = new Date(dateData.date);
                        formattedDate = originalAnnivDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                        nextAnniversaryNumber = annivInfo.nextAnniversaryNumber;
                    } else if (isRemembrance && dateData.date && dateData.dateOfDeath) {
                        const remInfo = this.calculateRemembranceInfo(dateData.date, dateData.dateOfDeath);
                        targetDate = remInfo.nextDeathAnniversary;
                        timerDateString = targetDate.toISOString();
                        livedForYears = remInfo.livedForYears;
                        nextDeathAnniversaryNumber = remInfo.nextAnniversaryNumber;
                        
                        // --- MODIFICATION: Format both dates ---
                        const originalBirthdate = this.parseLocalDate(dateData.date); // Use parseLocalDate
                        const originalDeathdate = this.parseLocalDate(dateData.dateOfDeath); // Use parseLocalDate
                        
                        const formattedDOB = originalBirthdate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                        // const formattedDOD = originalDeathdate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); // Not needed here
                        // Use formattedDOB for 'formattedDate' as the main date display
                        formattedDate = formattedDOB; 
                        // --- END MODIFICATION ---
                    } else {
                        isBirthday = false;
                        isAnniversary = false;
                        targetDate = this.parseLocalDate(dateData.date); // UPDATED
                        timerDateString = targetDate.toISOString(); // UPDATED
                        formattedDate = targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                    
                    const totalMilestones = dateData.milestones?.length || 0;
                    const completedMilestones = dateData.milestones?.filter(m => m.completed).length || 0;
                    
                    const milestoneDots = (totalMilestones > 0 ?
                        [...Array(totalMilestones)].map((_, i) => 
                            `<div class="w-1.5 h-1.5 rounded-full ${i < completedMilestones ? 'bg-accent-light' : 'bg-interactive'}"></div>`
                        ).join('') :
                        '<div class="w-1.5 h-1.5 rounded-full opacity-0"></div>'
                    );

                    const isComplete = dateData.status === 'Completed';
                    const completeClass = isComplete ? 'opacity-60' : '';
                    const completeIconClass = isComplete ? 'text-success' : 'text-muted-light';

                    const tagBGColor = this.escapeHTML(dateData.iconColor || 'var(--bg-interactive)'); // MODIFIED
                    const categoryTextColor = this.getContrastingTextColor(tagBGColor); // MODIFIED
                    const iconColor = this.escapeHTML(dateData.iconColor || 'var(--text-muted)'); // MODIFIED
                    
                    let categoryDisplay, categoryTitle;
                    
                    // NEW: Label logic
                    const label = this.escapeHTML(dateData.label);
                    const showLabel = dateData.showLabel ?? true; // Default to true
                    const type = this.escapeHTML(dateData.type) || 'Misc';

                    if (isRemembrance) {
                        categoryDisplay = "Remembrance";
                        categoryTitle = "Type: Remembrance";
                    } else if (showLabel && label) {
                        categoryDisplay = label;
                        categoryTitle = `Label: ${label}`;
                    } else {
                        categoryDisplay = type;
                        categoryTitle = `Type: ${type}`;
                    }

                    let lucideIconName = this.escapeHTML(dateData.iconName?.trim().toLowerCase());
                    if (!lucideIconName) {
                        if (isRemembrance) lucideIconName = 'flower-2';
                        else if (isBirthday) lucideIconName = 'cake';
                        else if (isAnniversary) lucideIconName = 'gift';
                        else {
                            const categoryName = dateData.type?.trim().toLowerCase() || ''; // MODIFIED
                            const categoryIconMap = { 'work': 'briefcase', 'personal': 'user', 'health': 'heart', 'learn': 'graduation-cap', 'finance': 'dollar-sign', 'travel': 'globe-2', 'home': 'home' };
                            lucideIconName = categoryIconMap[categoryName] || 'flag';
                        }
                    }
                    const iconSVG = `<i data-lucide="${lucideIconName}" class="w-3.5 h-3.5 shrink-0" style="stroke: ${iconColor};"></i>`;

                    let dateOrSpecialMessageHTML = '';
                    let remembranceHTML = ''; // NEW: Define B/P HTML here

                    if (isBirthday) {
                        // --- MODIFICATION START ---
                        // Moved "Turning X in" message to be above timer.
                        // Show the original birth date here instead.
                        dateOrSpecialMessageHTML = `
                            <div class="flex items-center gap-1.5 text-muted ${completeClass}">
                                <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0" stroke="currentColor"></i>
                                <span class="text-xs">${formattedDate}</span>
                            </div>
                        `;
                        // --- MODIFICATION END ---
                    } else if (isAnniversary) {
                        // --- MODIFICATION START ---
                        // Moved "X Anniversary in" message to be above timer.
                        // Show the original anniversary date here instead.
                        dateOrSpecialMessageHTML = `
                            <div class="flex items-center gap-1.5 text-muted ${completeClass}">
                                <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0" stroke="currentColor"></i>
                                <span class="text-xs">${formattedDate}</span>
                            </div>
                        `;
                        // --- MODIFICATION END ---
                    } else if (isRemembrance) {
                        // --- MODIFICATION START ---
                        // Get formatted DOB and DOD
                        const originalBirthdate = this.parseLocalDate(dateData.date);
                        const originalDeathdate = this.parseLocalDate(dateData.dateOfDeath);
                        
                        // REMOVED: old full-date format, not used now
                        
                        // --- NEW: dd-mm-yyyy formatting ---
                        const formattedDOB_ddmmyyyy = this.formatDateDDMMYYYY(originalBirthdate);
                        const formattedDOD_ddmmyyyy = this.formatDateDDMMYYYY(originalDeathdate);
                        
                        // Show "Lived for X years" where the date normally is
                        dateOrSpecialMessageHTML = `
                            <div class="flex flex-col gap-0.5 py-0"> 
                                <div class="flex items-center gap-1.5 text-xs text-secondary ${completeClass}">
                                    <i data-lucide="user" class="w-3.5 h-3.5 shrink-0" stroke="currentColor"></i>
                                    <span class="font-medium">Lived for ${livedForYears} years</span>
                                </div>
                            </div>
                        `;
                        // --- MODIFICATION END ---

                        // NEW: Define remembranceHTML to be used in the placeholder or footer
                        // --- MODIFICATION START: Add background boxes
                        remembranceHTML = `
                            <div class="flex items-start justify-between text-[11px] ${completeClass} gap-2 w-full" data-remembrance-footer>
                                <!-- Left Section with background -->
                                <div class="flex flex-col text-center bg-interactive px-1 py-0.5 rounded-md flex-1">
                                    <span class="text-success font-medium">Born</span>
                                    <span class="text-color font-medium">${formattedDOB_ddmmyyyy}</span>
                                </div>
                                <!-- Right Section with background -->
                                <div class="flex flex-col text-center bg-interactive px-1 py-0.5 rounded-md flex-1">
                                    <span class="text-danger font-medium">Passed</span>
                                    <span class="text-color font-medium">${formattedDOD_ddmmyyyy}</span>
                                </div>
                            </div>
                        `;
                        // --- MODIFICATION END ---
                    } else {
                        dateOrSpecialMessageHTML = `
                            <div class="flex items-center gap-1.5 text-muted ${completeClass}">
                                <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0" stroke="currentColor"></i>
                                <span class="text-xs">${formattedDate}</span>
                            </div>
                        `;
                    }
                    
                    const isSpecialDate = isBirthday || isAnniversary || isRemembrance;
                    const showMilestones = dateData.showMilestones ?? true;
                    const milestoneSectionHTML = `
                        <div class="${completeClass}"> <!-- MODIFICATION: Removed pt-0.5 -->
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-muted">${isSpecialDate ? 'Checklist' : 'Milestones'}</span>
                                <span class="text-xs font-medium text-color">${completedMilestones} / ${totalMilestones}</span>
                            </div>
                            <div class="flex items-center gap-1 mt-1.5 h-1.5">
                                ${milestoneDots}
                            </div>
                        </div>
                    `;

                    card.innerHTML = `
                        <div class="flex items-start justify-between gap-1.5 ${completeClass}">
                            <div class="flex items-center gap-1.5 min-w-0"> <!-- Removed nested flex-col -->
                                ${iconSVG}
                                <h3 class="text-sm font-semibold text-primary truncate" title="${this.escapeHTML(dateData.title)}">${this.escapeHTML(dateData.title)}</h3>
                            </div>
                            <!-- STATUS CIRCLE REMOVED FROM HERE -->
                        </div>

                        ${dateOrSpecialMessageHTML}
                        
                        <!-- NEW: Wrapper div to group milestones/special message and fix spacing -->
                        <div>
                            <!-- FIX: Check for remembrance FIRST. -->
                            ${isRemembrance ? `
                                <!-- Always show B/P in this slot for remembrance cards -->
                                ${remembranceHTML}
                            ` : (showMilestones ? `
                                <!-- Not remembrance, so show milestones if enabled -->
                                ${milestoneSectionHTML}
                            ` : `
                                <!-- Not remembrance, milestones disabled, show placeholder -->
                                <div class="${completeClass}"> <!-- MODIFICATION: Removed pt-0.5 -->
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs h-[12px]">&nbsp;</span> <!-- Placeholder for text line (h-3 / text-xs height) -->
                                        <span class="text-xs h-[12px]">&nbsp;</span> <!-- Placeholder for 1 / 2 -->
                                    </div>
                                    <div class="flex items-center gap-1 mt-1.5 h-1.5">
                                        <div class="w-1.5 h-1.5 rounded-full opacity-0"></div> <!-- Placeholder for dots -->
                                    </div>
                                </div>
                            `)}

                            <!-- "5th Anniversary in..." message is now grouped -->
                            <div class="flex flex-col justify-center items-center text-center min-h-[1.25rem] ${completeClass}" data-special-message-container>
                                ${isBirthday ? `
                                    <div class="flex items-center gap-1.5 text-accent-light">
                                    <i data-lucide="gift" class="w-3.5 h-3.5 shrink-0" stroke="currentColor"></i>
                                    <!-- FIX: Was data-anniversary-message -->
                                    <span class="text-xs font-medium" data-birthday-message></span>
                                </div>
                                ` : ''}
                                <!-- NEW: Added missing block for Anniversary -->
                                ${isAnniversary ? `
                                    <div class="flex items-center gap-1.5 text-accent-light">
                                        <i data-lucide="gift" class="w-3.5 h-3.5 shrink-0" stroke="currentColor"></i>
                                        <span class="text-xs font-medium" data-anniversary-message></span>
                                    </div>
                                ` : ''}
                                ${isRemembrance ? `
                                <div class="flex items-center gap-1.5 text-xs text-accent-light">
                                    <i data-lucide="flower-2" class="w-3.5 h-3.5 shrink-0" stroke="currentColor"></i>
                                    <span class="font-medium" data-remembrance-anniversary-message></span>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        <!-- END: Wrapper div -->

                        <!-- FIX: Consistent timer container structure for alignment -->
                        <div class="relative flex gap-0.5 text-center ${completeClass} min-h-[3.5rem]" data-date="${timerDateString}" data-id="${dateData.id}" data-time-container 
                             data-is-birthday="${isBirthday}" 
                             data-is-anniversary="${isAnniversary}" 
                             data-is-remembrance="${isRemembrance}" 
                             data-next-age="${nextAge}" 
                             data-next-anniversary-number="${nextAnniversaryNumber}"
                             data-next-death-anniversary-number="${nextDeathAnniversaryNumber}"
                             data-timer-mode="${dateData.timerMode || 'auto'}">
                            <!-- Each segment is flex-1 to distribute width equally -->
                            <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                <span class="block text-sm font-bold text-primary" data-days>0</span>
                                <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Days</span>
                            </div>
                            <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                <span class="block text-sm font-bold text-primary" data-hours>00</span>
                                <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Hours</span>
                            </div>
                            <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                <span class="block text-sm font-bold text-primary" data-minutes>00</span>
                                <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Mins</span>
                            </div>
                            <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                <span class="block text-sm font-bold text-primary" data-seconds>00</span>
                                <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Secs</span>
                            </div>
                            
                            <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-accent-light p-1 hidden" data-milestone-alert></span>
                        </div>
                        
                        <!-- REMOVED: Unused alert container
                        <div class="text-center" data-non-birthday-alert-container></div>
                        -->

                        <!-- NEW FOOTER: Single efficient row -->
                        <!-- MODIFIED: Conditionally center footer if it's a special date -->
                        <!-- FIX: Removed mt-1, which was redundant with the parent's space-y-2 -->
                        <!-- FIX 2: Removed conditional justify-center. Will default to justify-between, which pins single item to the left. -->
                        <div class="pt-2 border-t border-color flex items-center justify-between min-w-0 gap-2">
                            <!-- Label (centered or on left) -->
                            <!-- REMOVED: Unnecessary min-w-0 wrapper -->
                            <span class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.65rem] font-medium ${completeClass} truncate" 
                                <span class="inline-flex items-center rounded-md px-1.5 py-0.5 text-[0.65rem] font-medium ${completeClass} truncate" 
                                      style="background-color: ${tagBGColor}; color: ${categoryTextColor};" 
                                      title="${categoryTitle}">
                                ${categoryDisplay}
                            </span>
                            
                            <!-- REMOVED: B/P logic from footer -->
                            
                            ${!isSpecialDate ? `
                            <!-- Right Side: Status + Actions (Only show if not a special date) -->
                            <div class="flex items-center gap-1.5 shrink-0"> 
                                <div class="flex items-center gap-0.5"> 
                                    <button class="complete-card p-1.5 text-muted-light hover-text-success rounded ${completeIconClass}" title="Toggle Complete">
                                        <i data-lucide="check" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    `;
                    return card;
                },

                startTimers() {
                    const timerElements = this.countdownContainer.querySelectorAll('[data-date]');
                    timerElements.forEach(el => {
                        const timerId = setInterval(() => {
                            this.updateTimer(el);
                        }, 1000);
                        this.timers.push(timerId);
                        this.updateTimer(el);
                    });
                },

                updateTimer(el) {
                    // NEW: Define YMDBox helper at the top of the function
                    // Helper function to create the box HTML
                    const createYMDBox = (value, label, isAgo = false) => {
                       // Handle pluralization: 1 = singular, 0 or 2+ = plural
                       let correctLabel = label;
                       if (value === 1) {
                           // Convert plural to singular
                           if (label === 'Years') correctLabel = 'Year';
                           else if (label === 'Months') correctLabel = 'Month';
                           else if (label === 'Days') correctLabel = 'Day';
                       }
                       
                       // This HTML structure matches the default timer segments
                       // MODIFICATION: Smaller font size for full labels
                       const labelClass = 'block text-[0.55rem] leading-none font-medium text-muted uppercase';
                       
                       if (isAgo) {
                           // "Sunken" style for past dates
                           // --- MODIFICATION: Matched padding/font size to future boxes ---
                           return `<div class="bg-interactive-deep py-1 px-1 rounded flex flex-col justify-center border border-color-strong opacity-90 flex-1 min-w-0">
                                <span class="block text-lg font-bold text-primary truncate">${value}</span>
                                <span class="${labelClass} truncate">${correctLabel}</span>
                           </div>`;
                       }
                       
                       // "Future" style
                       return `<div class="bg-interactive py-1 px-1 rounded flex-1 flex-col justify-center min-w-0" data-timer-segment>
                            <span class="block text-lg font-bold text-primary truncate">${value}</span>
                            <span class="${labelClass} truncate">${correctLabel}</span>
                       </div>`;
                    };

                    const targetDate = new Date(el.dataset.date).getTime();
                    const now = new Date().getTime();
                    const distance = targetDate - now;

                    const isBirthday = el.dataset.isBirthday === 'true';
                    const isAnniversary = el.dataset.isAnniversary === 'true';
                    const isRemembrance = el.dataset.isRemembrance === 'true';
                    const nextAge = el.dataset.nextAge;
                    const nextAnniversaryNumber = el.dataset.nextAnniversaryNumber;
                    const nextDeathAnniversaryNumber = el.dataset.nextDeathAnniversaryNumber;

                    const daysEl = el.querySelector('[data-days]');
                    const hoursEl = el.querySelector('[data-hours]');
                    const minutesEl = el.querySelector('[data-minutes]');
                    const secondsEl = el.querySelector('[data-seconds]');
                    
                    const card = el.closest('.card-bg[data-id]');
                    if (!card) return; // Stop if card is gone

                    const birthdayMessageEl = card.querySelector('[data-birthday-message]');
                    const anniversaryMessageEl = card.querySelector('[data-anniversary-message]');
                    const remembranceAnniversaryMessageEl = card.querySelector('[data-remembrance-anniversary-message]');
                    const alertEl = el.querySelector('[data-milestone-alert]');
                    // const nonBirthdayAlertContainer = card.querySelector('[data-non-birthday-alert-container]'); // REMOVED
                    const timeContainer = el;
                    const timerSegments = el.querySelectorAll('[data-timer-segment]');


                    if (distance < 0) {
                        const daysAgo = Math.floor(Math.abs(distance) / (1000 * 60 * 60 * 24));
                        let pastMessage;
                        
                        const absDist = Math.abs(distance);
                        const isToday = absDist < (1000 * 60 * 60 * 24);

                        if (isBirthday) {
                            pastMessage = isToday ? `Happy ${this.getOrdinal(nextAge)} Birthday!` : `Birthday passed (Turned ${nextAge})`;
                            if (timeContainer) {
                                timeContainer.innerHTML = `<div class="flex gap-0.5 text-center min-h-[3.5rem]"><div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center"><span class="block text-xs font-bold text-accent-light">${pastMessage}</span><span class="block text-[0.6rem] font-medium text-muted uppercase">&nbsp;</span></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div></div>`;
                            }
                        } else if (isAnniversary) {
                            pastMessage = isToday ? `Happy ${this.getOrdinal(nextAnniversaryNumber)} Anniversary!` : `Anniversary passed (${this.getOrdinal(nextAnniversaryNumber)})`;
                            if (timeContainer) {
                                timeContainer.innerHTML = `<div class="flex gap-0.5 text-center min-h-[3.5rem]"><div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center"><span class="block text-xs font-bold text-accent-light">${pastMessage}</span><span class="block text-[0.6rem] font-medium text-muted uppercase">&nbsp;</span></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div></div>`;
                            }
                        } else if (isRemembrance) {
                            pastMessage = isToday ? `${this.getOrdinal(nextDeathAnniversaryNumber)} Anniversary` : `${this.getOrdinal(nextDeathAnniversaryNumber)} Anniversary passed`;
                            if (timeContainer) {
                                timeContainer.innerHTML = `<div class="flex gap-0.5 text-center min-h-[3.5rem]"><div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center"><span class="block text-xs font-bold text-accent-light">${pastMessage}</span><span class="block text-[0.6rem] font-medium text-muted uppercase">&nbsp;</span></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div><div class="bg-interactive py-1 px-1 rounded flex-1 opacity-0"></div></div>`;
                            }
                        } else if (daysAgo === 0) {
                            pastMessage = "Today!";
                            if (timeContainer) {
                                timeContainer.className = 'relative flex justify-center items-center text-center min-h-[3.5rem]';
                                // --- MODIFIED: "Today!" is now a bright accent box ---
                                timeContainer.innerHTML = `
                                    <div class="bg-accent py-2 px-3 rounded flex flex-col justify-center shadow-lg">
                                        <span class="block text-lg font-bold text-on-accent leading-none">Today!</span>
                                        <span class="block text-[0.6rem] font-medium text-on-accent uppercase mt-1 opacity-90">EVENT DAY</span>
                                    </div>
                                `;
                            }
                        } else { // This covers 1 day ago and "X days ago"
                            const daysAgoText = daysAgo === 1 ? 'DAY AGO' : 'DAYS AGO';
                            if (timeContainer) {
                                // --- MODIFICATION: Use Y/M/D boxes for past dates ---
                                const { years, months, days: preciseDays } = this.getYearsMonthsDays(daysAgo);

                                // Use the 'isAgo = true' flag for the sunken style
                                // MODIFICATION: Use full text labels
                                let yearsHtml = createYMDBox(years, 'Years', true);
                                let monthsHtml = createYMDBox(months, 'Months', true);
                                let daysHtml = createYMDBox(preciseDays, 'Days', true);
                                
                                // Logic to show/hide boxes
                                if (daysAgo <= 0) {
                                    // MODIFICATION: Use full text label
                                    daysHtml = createYMDBox(0, 'Days', true);
                                    yearsHtml = `<div class="hidden">${yearsHtml}</div>`;
                                    monthsHtml = `<div class="hidden">${monthsHtml}</div>`;
                                } else if (years === 0 && months > 0) {
                                    yearsHtml = `<div class="hidden">${yearsHtml}</div>`;
                                } else if (years === 0 && months === 0) {
                                    yearsHtml = `<div class="hidden">${yearsHtml}</div>`;
                                    monthsHtml = `<div class="hidden">${monthsHtml}</div>`;
                                }
                                // If years > 0, all three will be shown
                                
                                const partsHtml = yearsHtml + monthsHtml + daysHtml;

                                timeContainer.className = 'relative flex gap-0.5 text-center min-h-[3.5rem]';
                                timeContainer.setAttribute('data-days-ago', ''); // Mark as past
                                timeContainer.innerHTML = partsHtml;
                                // --- END MODIFICATION ---
                            }
                        }
                        
                        if (birthdayMessageEl) birthdayMessageEl.innerHTML = '';
                        if (anniversaryMessageEl) anniversaryMessageEl.innerHTML = '';
                        if (remembranceAnniversaryMessageEl) remembranceAnniversaryMessageEl.innerHTML = '';
                        // if (nonBirthdayAlertContainer) nonBirthdayAlertContainer.innerHTML = ''; // REMOVED
                        return;
                    }

                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    const timerMode = el.dataset.timerMode || 'auto';
                    const hoursInMs = 24 * 60 * 60 * 1000;
                    
                    // --- MODIFIED: Logic for timer display modes ---
                    const showFullTimer = timerMode === 'full';
                    // Show days only if mode is 'days', OR if mode is 'auto' and distance is > 24h
                    const showDaysOnly = timerMode === 'days' || (timerMode === 'auto' && distance > hoursInMs);
                    // Show hrs/mins/secs only if not full, not days, AND distance is <= 24h
                    // It only shows if timerMode is 'auto' and it's under 24h
                    const showHoursMinsSecs = !showFullTimer && !showDaysOnly && (timerMode === 'auto' && distance <= hoursInMs);
                    // --- END MODIFICATION ---

                    // Check current display mode
                    const currentDaysOnlyEl = timeContainer?.hasAttribute('data-days-only');
                    const currentHoursMinsSecsEl = timeContainer?.hasAttribute('data-hours-mins-secs');

                    // If showing days only (like "days ago" format)
                    if (showDaysOnly && !isBirthday && !isAnniversary && !isRemembrance) {
                        // --- MODIFIED: Render Years/Months/Days in boxes, per screenshot ---
                        
                        // REMOVED: Helper function to create the box HTML (it's now at the top)
                        
                        const { years, months, days: preciseDays } = this.getYearsMonthsDays(days);
                        
                        // --- MODIFICATION: Abbreviated labels to prevent truncation ---
                        // MODIFICATION: Use full text labels
                        let yearsHtml = createYMDBox(years, 'Years');
                        let monthsHtml = createYMDBox(months, 'Months');
                        let daysHtml = createYMDBox(preciseDays, 'Days');

                        // Hide 0 values (same logic as past events)
                        if (days <= 0) {
                            // Only show "0 Days"
                            // MODIFICATION: Use full text label
                            daysHtml = createYMDBox(0, 'Days');
                            monthsHtml = `<div class="hidden">${monthsHtml}</div>`;
                            yearsHtml = `<div class="hidden">${yearsHtml}</div>`;
                        } else if (years === 0 && months > 0) {
                            // Hide years, show months and days
                            yearsHtml = `<div class="hidden">${yearsHtml}</div>`;
                        } else if (years === 0 && months === 0) {
                            // Show "Days" only
                            yearsHtml = `<div class="hidden">${yearsHtml}</div>`;
                            monthsHtml = `<div class="hidden">${monthsHtml}</div>`;
                        }
                        // If years > 0, all three will be shown by default
                        
                        const partsHtml = yearsHtml + monthsHtml + daysHtml;

                        // Always update structure or values, using the same layout as the default timer
                        if (timeContainer) {
                            timeContainer.className = 'relative flex gap-0.5 text-center min-h-[3.5rem]';
                            timeContainer.setAttribute('data-days-only', '');
                            timeContainer.removeAttribute('data-hours-mins-secs');
                            timeContainer.innerHTML = partsHtml;
                        }
                        // --- END MODIFICATION ---

                    } else if (showHoursMinsSecs && !isBirthday && !isAnniversary && !isRemembrance) {
                        // Show hours, mins, secs only (no days)
                        // Only replace if structure doesn't exist or mode changed
                        if (!currentHoursMinsSecsEl || currentDaysOnlyEl) {
                            if (timeContainer) {
                                timeContainer.className = 'relative flex gap-0.5 text-center min-h-[3.5rem]';
                                timeContainer.setAttribute('data-hours-mins-secs', '');
                                timeContainer.innerHTML = `
                                    <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                        <span class="block text-sm font-bold text-primary" data-hours>${String(hours).padStart(2, '0')}</span>
                                        <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Hours</span>
                                    </div>
                                    <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                        <span class="block text-sm font-bold text-primary" data-minutes>${String(minutes).padStart(2, '0')}</span>
                                        <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Mins</span>
                                    </div>
                                    <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                        <span class="block text-sm font-bold text-primary" data-seconds>${String(seconds).padStart(2, '0')}</span>
                                        <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Secs</span>
                                    </div>
                                `;
                            }
                        } else {
                            // Update existing values
                            const hoursElNew = timeContainer?.querySelector('[data-hours]');
                            const minutesElNew = timeContainer?.querySelector('[data-minutes]');
                            const secondsElNew = timeContainer?.querySelector('[data-seconds]');
                            if (hoursElNew) hoursElNew.textContent = String(hours).padStart(2, '0');
                            if (minutesElNew) minutesElNew.textContent = String(minutes).padStart(2, '0');
                            if (secondsElNew) secondsElNew.textContent = String(seconds).padStart(2, '0');
                        }
                    } else {
                        // Show full timer (days, hours, mins, secs) - default for birthdays/anniversaries or when timerMode is "full"
                        // Only replace if structure doesn't exist or mode changed
                        if (currentDaysOnlyEl || currentHoursMinsSecsEl || !daysEl) {
                            // Restore full timer structure
                            if (timeContainer) {
                                timeContainer.className = 'relative flex gap-0.5 text-center min-h-[3.5rem]';
                                timeContainer.removeAttribute('data-hours-mins-secs');
                                timeContainer.removeAttribute('data-days-only');
                                timeContainer.innerHTML = `
                                    <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                        <span class="block text-sm font-bold text-primary" data-days>${days}</span>
                                        <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Days</span>
                                    </div>
                                    <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                        <span class="block text-sm font-bold text-primary" data-hours>${String(hours).padStart(2, '0')}</span>
                                        <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Hours</span>
                                    </div>
                                    <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                        <span class="block text-sm font-bold text-primary" data-minutes>${String(minutes).padStart(2, '0')}</span>
                                        <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Mins</span>
                                    </div>
                                    <div class="bg-interactive py-1 px-1 rounded flex-1 flex flex-col justify-center" data-timer-segment>
                                        <span class="block text-sm font-bold text-primary" data-seconds>${String(seconds).padStart(2, '0')}</span>
                                        <span class="block text-[0.55rem] leading-none font-medium text-muted uppercase">Secs</span>
                                    </div>
                                `;
                            }
                        } else {
                            // Update existing values
                            if (daysEl) daysEl.textContent = days;
                            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
                            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
                            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
                        }
                    }
                    
                    if (isBirthday) {
                        if (birthdayMessageEl) birthdayMessageEl.textContent = `Turning ${nextAge} in`;
                        if (anniversaryMessageEl) anniversaryMessageEl.textContent = '';
                        if (remembranceAnniversaryMessageEl) remembranceAnniversaryMessageEl.textContent = '';
                        if (alertEl) alertEl.classList.add('hidden'); 
                        // if (nonBirthdayAlertContainer) nonBirthdayAlertContainer.innerHTML = ''; // REMOVED
                        if (timerSegments) timerSegments.forEach(seg => seg.style.visibility = 'visible');
                    } else if (isAnniversary) {
                        if (anniversaryMessageEl) anniversaryMessageEl.textContent = `${this.getOrdinal(nextAnniversaryNumber)} Anniversary in`;
                        if (birthdayMessageEl) birthdayMessageEl.textContent = '';
                        if (remembranceAnniversaryMessageEl) remembranceAnniversaryMessageEl.textContent = '';
                        if (alertEl) alertEl.classList.add('hidden'); 
                        // if (nonBirthdayAlertContainer) nonBirthdayAlertContainer.innerHTML = ''; // REMOVED
                        if (timerSegments) timerSegments.forEach(seg => seg.style.visibility = 'visible');
                    } else if (isRemembrance) {
                        if (remembranceAnniversaryMessageEl) remembranceAnniversaryMessageEl.textContent = `${this.getOrdinal(nextDeathAnniversaryNumber)} Anniversary in`;
                        if (birthdayMessageEl) birthdayMessageEl.textContent = '';
                        if (anniversaryMessageEl) anniversaryMessageEl.textContent = '';
                        if (alertEl) alertEl.classList.add('hidden'); 
                        // if (nonBirthdayAlertContainer) nonBirthdayAlertContainer.innerHTML = ''; // REMOVED
                        if (timerSegments) timerSegments.forEach(seg => seg.style.visibility = 'visible');
                    } else {
                        if (birthdayMessageEl) birthdayMessageEl.textContent = '';
                        if (anniversaryMessageEl) anniversaryMessageEl.textContent = '';
                        if (remembranceAnniversaryMessageEl) remembranceAnniversaryMessageEl.textContent = '';
                        if (alertEl) {
                            alertEl.textContent = ''; 
                            alertEl.classList.add('hidden'); 
                        }
                        if (timerSegments) timerSegments.forEach(seg => seg.style.visibility = 'visible');
                        /* REMOVED
                        if (nonBirthdayAlertContainer) {
                            nonBirthdayAlertContainer.innerHTML = '';
                        }
                        */
                    }
                },
                
                getOrdinal(n) {
                    if (n === null || n === undefined) return '';
                    const s = ['th', 'st', 'nd', 'rd'];
                    const v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                },

                // NEW: Helper function for dd-mm-yyyy format
                formatDateDDMMYYYY(date) {
                    if (!date) return '';
                    // Ensure 'date' is a Date object
                    const d = (date instanceof Date) ? date : this.parseLocalDate(date.split('T')[0]);
                    if (isNaN(d.getTime())) return ''; // Invalid date
                    
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
                    const year = d.getFullYear();
                    return `${day}-${month}-${year}`;
                },

                // NEW: Helper function to break down days
                getYearsMonthsDays(totalDays) {
                    if (totalDays <= 0) {
                        return { years: 0, months: 0, days: 0 };
                    }
                    
                    // Average days, accounting for leap years
                    const avgDaysInYear = 365.2425;
                    const avgDaysInMonth = 30.436875; // avgDaysInYear / 12

                    let remainingDays = totalDays;

                    const years = Math.floor(remainingDays / avgDaysInYear);
                    remainingDays -= years * avgDaysInYear;

                    const months = Math.floor(remainingDays / avgDaysInMonth);
                    remainingDays -= months * avgDaysInMonth;

                    const days = Math.round(remainingDays); // Round the final days
                    
                    if (days >= 30) {
                         // This is a rough approximation, handle rounding carry-over
                         return { years: years, months: months + 1, days: 0 };
                    }

                    return { years, months, days };
                },

                getMilestoneAlert(distance, days) {
                    // ... (This function is no longer used, but kept for posterity)
                    return '';
                },

                updateDatalists() {
                    const dates = this.getDates(); // UPDATED
                    const types = [...new Set(dates.map(g => g.type).filter(Boolean))]; // MODIFIED
                    const groups = [...new Set(dates.map(g => g.group).filter(Boolean))];
                    const labels = [...new Set(dates.map(g => g.label).filter(Boolean))]; // NEW

                    // MODIFIED: Add custom types to select dropdown
                    const standardTypes = ['Personal', 'Work', 'Birthday', 'Anniversary', 'Health', 'Finance', 'Learn', 'Travel', 'Home'];
                    const customTypes = types.filter(t => !standardTypes.includes(t));
                    const typeSelect = this.dateType;
                    
                    // Remove existing custom options (keep standard ones)
                    Array.from(typeSelect.options).forEach(opt => {
                        if (opt.value && !standardTypes.includes(opt.value) && opt.value !== '') {
                            opt.remove();
                        }
                    });
                    
                    // Add custom types as options
                    customTypes.forEach(type => {
                        const option = document.createElement('option');
                        option.value = type;
                        option.textContent = type;
                        typeSelect.appendChild(option);
                    });

                    this.groupSuggestions.innerHTML = groups.map(g => `<option value="${this.escapeHTML(g)}"></option>`).join('');
                    this.labelSuggestions.innerHTML = labels.map(l => `<option value="${this.escapeHTML(l)}"></option>`).join(''); // NEW
                },
                
                escapeHTML(str) {
                    if (str === null || str === undefined) {
                        return '';
                    }
                    return str.toString()
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;');
                },

                getContrastingTextColor(hexColor) {
                    if (!hexColor) return 'var(--text-primary)';
                    hexColor = hexColor.replace(/^#/, '');
                    let r, g, b;
                    if (hexColor.length === 3) {
                        r = parseInt(hexColor.substring(0, 1) + hexColor.substring(0, 1), 16);
                        g = parseInt(hexColor.substring(1, 2) + hexColor.substring(1, 2), 16);
                        b = parseInt(hexColor.substring(2, 3) + hexColor.substring(2, 3), 16);
                    } else if (hexColor.length === 6) {
                        r = parseInt(hexColor.substring(0, 2), 16);
                        g = parseInt(hexColor.substring(2, 4), 16);
                        b = parseInt(hexColor.substring(4, 6), 16);
                    } else {
                        return 'var(--text-primary)';
                    }
                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    return luminance > 0.5 ? '#000000' : '#FFFFFF';
                },
            };
            app.init();
        });
