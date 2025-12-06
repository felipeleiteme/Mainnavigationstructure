/**
 * Traduções do Mynis
 * Sistema de internacionalização (i18n)
 * 
 * Idiomas suportados:
 * - pt-BR: Português (Brasil)
 * - es: Español
 * - en: English
 */

import { LanguageCode, LanguageService } from '../../services/languageService';
import { useState, useEffect } from 'react';

export interface Translations {
  // Navegação principal
  nav: {
    inicio: string;
    espiritual: string;
    estudos: string;
    campo: string;
    diario: string;
    leitura: string;
    perfil: string;
  };

  // Acesso rápido às traduções de navegação (para App.tsx)
  inicio: string;
  espiritual: string;
  estudos: string;
  campo: string;
  perfil: string;

  // Configurações
  settings: {
    title: string;
    subtitle: string;
    appearance: string;
    appearanceDesc: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    themeAuto: string;
    themeLightDesc: string;
    themeDarkDesc: string;
    themeAutoDesc: string;
    language: string;
    languageDesc: string;
    moreLanguages: string;
    notifications: string;
    notificationsDesc: string;
    notificationsEnable: string;
    notificationsControl: string;
    notificationsReminders: string;
    notifications24h: string;
    notifications1h: string;
    notificationsReceiveFor: string;
    notificationsBibleStudies: string;
    notificationsReturnVisits: string;
    notificationsBibleReading: string;
    notificationsGratitude: string;
    notificationsSpiritualGoals: string;
    alertPreferences: string;
    sound: string;
    vibration: string;
    languageRegion: string;
    resetSettings: string;
    redoOnboarding: string;
    redoOnboardingDesc: string;
    privacyLocal: string;
    privacyDesc: string;
    development: string;
    developmentDesc: string;
    about: string;
    aboutDesc: string;
  };

  // Estudos Bíblicos
  studies: {
    title: string;
    activeStudies: (count: number) => string;
    searchPlaceholder: string;
    filterAll: string;
    filterAvailable: string;
    filterHot: string;
    filterPaused: string;
    statusAdvanced: string;
    statusProgressing: string;
    statusStarting: string;
    newStudy: string;
    noStudiesTitle: string;
    noStudiesMessage: string;
    noStudiesAction: string;
    days: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
  };

  // Campo
  field: {
    title: string;
    subtitle: string;
    newReturn: string;
    editReturn: string;
    name: string;
    origin: string;
    originHouseToHouse: string;
    originWitnessing: string;
    originBusiness: string;
    originOther: string;
    firstConversation: string;
    publications: string;
    status: string;
    statusNew: string;
    statusHot: string;
    statusBusiness: string;
    statusRest: string;
    interestInStudy: string;
    startStudy: string;
  };

  // Diário
  diary: {
    title: string;
    subtitle: string;
    goals: string;
    monthlyReport: string;
    hours: string;
    placements: string;
    returnVisits: string;
    studies: string;
  };

  // Leitura Bíblica
  reading: {
    title: string;
    subtitle: string;
    chronological: string;
    progress: string;
    todaysReading: string;
    markAsRead: string;
    completed: string;
  };

  // Perfil
  profile: {
    title: string;
    memberOf: string;
    contactInfo: string;
    congregation: string;
    email: string;
    phone: string;
    publisherType: string;
    pioneerRegular: string;
    pioneerAuxiliary: string;
    publisher: string;
    goal: string;
    goalHours: (hours: number) => string;
    emergencyInfo: string;
    dpaValidity: string;
    emergencyContact: string;
    editPhoto: string;
    editInfo: string;
    editEmergency: string;
    settings: string;
    settingsSubtitle: string;
    appearance: string;
    appearanceDesc: string;
    notifications: string;
    notificationsDesc: string;
    yearText: string;
    currentText: string;
    yearTextNote: string;
  };

  // Editar Informações
  editInfo: {
    title: string;
    subtitle: string;
    keepUpdated: string;
    keepUpdatedDesc: string;
    profilePhoto: string;
    noPhoto: string;
    choosePhoto: string;
    photoNote: string;
    congregationLabel: string;
    congregationPlaceholder: string;
    emailLabel: string;
    emailNote: string;
    phoneLabel: string;
    phoneNote: string;
    preview: string;
    saveInfo: string;
  };

  // Editar Tipo de Publicador
  editPublisherType: {
    title: string;
    subtitle: string;
    regularPublisher: string;
    regularPublisherDesc: string;
    regularPublisherGoal: string;
    auxiliaryPioneer15: string;
    auxiliaryPioneer15Desc: string;
    auxiliaryPioneer15Goal: string;
    auxiliaryPioneer30: string;
    auxiliaryPioneer30Desc: string;
    auxiliaryPioneer30Goal: string;
    regularPioneer: string;
    regularPioneerDesc: string;
    regularPioneerGoal: string;
    tipTitle: string;
    tipDesc: string;
    cancel: string;
    saveChanges: string;
  };

  // Editar Texto do Ano
  editYearText: {
    title: string;
    subtitle: string;
    howItWorks: string;
    howItWorksDesc: string;
    tip: string;
    biblicalTextLabel: string;
    biblicalTextPlaceholder: string;
    biblicalRefLabel: string;
    biblicalRefPlaceholder: string;
    preview: string;
    yearTextTitle: string;
    saveYearText: string;
  };

  // Editar Emergência
  emergency: {
    title: string;
    subtitle: string;
    aboutDPA: string;
    aboutDPAText: string;
    docValidity: string;
    validityLabel: string;
    validityHelp: string;
    emergencyContacts: string;
    contactLabel: string;
    contactPlaceholder: string;
    contactHelp: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHelp: string;
    additionalMedicalInfo: string;
    allergiesLabel: string;
    allergiesPlaceholder: string;
    allergiesHelp: string;
    summary: string;
    dpaValidity: string;
    status: string;
    emergencyContact: string;
    phoneNumber: string;
    allergies: string;
    saveButton: string;
    statusNotFilled: string;
    statusExpired: string;
    statusExpiringSoon: (days: number) => string;
    statusExpiringMonths: (months: number) => string;
    statusValid: string;
    toastErrorValidityTitle: string;
    toastErrorValidityDesc: string;
    toastErrorContactTitle: string;
    toastErrorContactDesc: string;
    toastErrorPhoneTitle: string;
    toastErrorPhoneDesc: string;
    toastExpiredTitle: string;
    toastExpiredDesc: string;
    toastExpiringTitle: string;
    toastExpiringDesc: (days: number) => string;
    toastSuccessTitle: string;
    toastSuccessDesc: string;
  };

  // Aba de Estudos Bíblicos
  studiesTab: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterActive: string;
    filterPaused: string;
    filterCompleted: string;
    filterToday: string;
    filterRest: string;
    statusStarting: string;
    statusInProgress: string;
    statusAdvanced: string;
    statusWithDoubt: string;
    studyScheduledToday: string;
    prepareConversation: string;
    newStudy: string;
    today: string;
    daysAgo: (days: number) => string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    viewDetails: string;
    todayBanner: (count: number) => string;
  };

  // Aba de Campo (Revisitas)
  fieldTab: {
    title: string;
    subtitle: (count: number) => string;
    searchPlaceholder: string;
    filterAll: string;
    filterAvailable: string;
    filterHot: string;
    filterRevisit: string;
    availableBannerText: string;
    firstVisit: string;
    today: string;
    daysAgo: (days: number) => string;
    dayAgo: string;
    revisitUrgent: string;
    statusNew: string;
    statusHot: string;
    statusCommerce: string;
    statusRest: string;
    emptyTitle: string;
    emptyDescription: string;
    emptySearchDescription: string;
    studyStartedToast: string;
    studyStartedDescription: (name: string) => string;
  };

  // Detalhes da Revisita
  returnVisitDetails: {
    visits: (count: number) => string;
    contactInfo: string;
    fullName: string;
    phone: string;
    call: string;
    whatsapp: string;
    fullAddress: string;
    viewOnMap: string;
    lastVisit: string;
    date: string;
    daysAgo: (days: number) => string;
    nextVisitScheduled: string;
    reminderSet: string;
    firstConversation: string;
    firstConversationTitle: string;
    additionalDetails: string;
    contactOrigin: string;
    originInformalWitnessing: string;
    originHouseToHouse: string;
    originPublicWitnessing: string;
    originBusiness: string;
    originOther: string;
    dateAdded: string;
    publicationsDelivered: string;
    summary: string;
    totalVisits: string;
    daysSinceLast: string;
    registerNewVisit: string;
    dangerZone: string;
    dangerZoneWarning: string;
    removeReturnVisit: string;
    confirmRemoval: string;
    confirmRemovalMessage: (name: string) => string;
    cancel: string;
    remove: string;
    returnVisitNotFound: string;
    back: string;
    phoneNotRegistered: string;
    addressNotRegistered: string;
    returnVisitRemoved: string;
    edit: string;
    statusNew: string;
    statusHot: string;
    statusBusiness: string;
    statusRest: string;
    interestInStudyBadge: string;
    convertToStudy: string;
    observations: string;
    publicationsLeft: string;
    visitHistory: string;
    found: string;
    notFound: string;
    mostRecent: string;
    scheduledFor: string;
    availability: string;
    notInformed: string;
    neverVisited: string;
  };

  // Botões comuns
  fab: {
    newStudy: string;
    newReturnVisit: string;
    newActivity: string;
    paused: string;
  };

  // Detalhes do Estudo
  studyDetails: {
    title: string;
    contactInfo: string;
    fullName: string;
    phone: string;
    call: string;
    whatsapp: string;
    fullAddress: string;
    viewOnMap: string;
    studyDetails: string;
    publication: string;
    progress: string;
    nextStudy: string;
    today: string;
    observations: string;
    dangerZone: string;
    dangerZoneWarning: string;
    removeStudy: string;
    confirmRemoval: string;
    confirmRemovalMessage: (name: string) => string;
    cancel: string;
    remove: string;
    studyNotFound: string;
    back: string;
    phoneNotRegistered: string;
    addressNotRegistered: string;
    studyRemoved: string;
  };

  // Formulário de Estudo (Novo/Editar)
  studyForm: {
    newStudyTitle: string;
    editStudyTitle: string;
    newStudySubtitle: string;
    editStudySubtitle: string;
    conversionBannerTitle: string;
    conversionBannerDescription: (name: string) => string;
    contactInfo: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    studyDetails: string;
    publicationLabel: string;
    publicationOptions: {
      option1: string;
      option2: string;
      option3: string;
      option4: string;
    };
    statusLabel: string;
    statusOptions: {
      starting: {
        name: string;
        description: string;
      };
      progressing: {
        name: string;
        description: string;
      };
      doubts: {
        name: string;
        description: string;
      };
      advanced: {
        name: string;
        description: string;
      };
    };
    schedulingTitle: string;
    nextDateLabel: string;
    timeLabel: string;
    observationsTitle: string;
    observationsPlaceholder: string;
    dangerZoneTitle: string;
    dangerZoneWarning: string;
    deleteStudy: string;
    saveChanges: string;
    createStudy: string;
    validationErrors: {
      nameRequired: string;
      addressRequired: string;
      publicationRequired: string;
    };
    successMessages: {
      updated: string;
      created: string;
      createdDescription: (name: string) => string;
      deleted: string;
    };
    deleteConfirmation: (name: string) => string;
  };

  // Formulário de Revisita (Novo/Editar)
  returnVisitForm: {
    newTitle: string;
    editTitle: string;
    newSubtitle: string;
    editSubtitle: string;
    contactInfo: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    placeType: string;
    placeTypeOptions: {
      house: string;
      building: string;
      business: string;
    };
    status: string;
    statusOptions: {
      new: string;
      interested: string;
      hot: string;
      resting: string;
    };
    firstConversation: string;
    firstConversationLabel: string;
    firstConversationPlaceholder: string;
    additionalDetails: string;
    availabilityLabel: string;
    availabilityPlaceholder: string;
    scheduledDateLabel: string;
    scheduledDateHint: string;
    publicationsLabel: string;
    publicationsPlaceholder: string;
    publicationsHint: string;
    observationsLabel: string;
    observationsPlaceholder: string;
    studyInterest: string;
    dangerZone: string;
    dangerZoneWarning: string;
    deleteReturnVisit: string;
    saveChanges: string;
    createReturnVisit: string;
    validationErrors: {
      nameRequired: string;
      addressRequired: string;
      firstConversationRequired: string;
    };
    successMessages: {
      updated: string;
      created: string;
      deleted: string;
    };
    deleteConfirmation: (name: string) => string;
  };

  // Aba Espiritual (Onboarding)
  spiritualTab: {
    onboardingTitle: string;
    onboardingSubtitle: string;
    bibleReadingTitle: string;
    bibleReadingSetup: string;
    bibleReadingTrack: string;
    gratitudeTitle: string;
    gratitudeStart: string;
    gratitudeStrength: string;
    goalsTitle: string;
    goalsEstablish: string;
    worshipIdeasTitle: string;
    suggestIdea: string;
  };

  // Empty State - Leitura da Bíblia
  emptyStateBible: {
    headerTitle: string;
    headerSubtitle: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    benefitsTitle: string;
    benefit1Title: string;
    benefit1Description: string;
    benefit2Title: string;
    benefit2Description: string;
    benefit3Title: string;
    benefit3Description: string;
    toastSuccess: string;
    toastDescription: string;
  };

  // Página de Configurações de Leitura
  bibleSettingsPage: {
    headerTitle: string;
    headerSubtitle: string;
    planTypeTitle: string;
    planTypeDesc: string;
    chronological: string;
    chronologicalDesc: string;
    thematic: string;
    thematicDesc: string;
    sequential: string;
    sequentialDesc: string;
    dailyGoalTitle: string;
    dailyGoalDesc: string;
    oneChapter: string;
    oneChapterDesc: string;
    threeChapters: string;
    threeChaptersDesc: string;
    fiveChapters: string;
    fiveChaptersDesc: string;
    notificationsTitle: string;
    notificationsDesc: string;
    dailyReminder: string;
    dailyReminderDesc: string;
    reflectionReminder: string;
    reflectionReminderDesc: string;
    summaryTitle: string;
    readingPlan: string;
    dailyGoal: string;
    reminders: string;
    allActive: string;
    partiallyActive: string;
    disabled: string;
    saveButton: string;
    resetDialogTitle: string;
    resetDialogDesc: string;
    resetDialogWarning: string;
    completedReadings: string;
    streakDays: string;
    unlockedAchievements: string;
    registeredReflections: string;
    resetDialogTip: string;
    cancel: string;
    confirmReset: string;
    toastSaved: string;
    toastSavedDesc: string;
    toastReset: string;
    toastResetDesc: string;
  };

  // Onboarding de Leitura
  bibleOnboarding: {
    headerTitle: string;
    step: string;
    stepOf: string;
    
    // Etapa 1
    step1Title: string;
    step1Subtitle: string;
    chronological: string;
    chronologicalDesc: string;
    sequential: string;
    sequentialDesc: string;
    thematic: string;
    thematicDesc: string;
    
    // Etapa 2
    step2Title: string;
    step2Subtitle: string;
    oneChapter: string;
    oneChapterDesc: string;
    threeChapters: string;
    threeChaptersDesc: string;
    fiveChapters: string;
    fiveChaptersDesc: string;
    step2Tip: string;
    
    // Etapa 3
    step3Title: string;
    step3Subtitle: string;
    dailyReminder: string;
    dailyReminderDesc: string;
    reflectionReminder: string;
    reflectionReminderDesc: string;
    step3Message: string;
    
    // Botões
    continueButton: string;
    startReadingButton: string;
  };

  // Dialog de Marcar Leitura
  markReadingDialog: {
    title: string;
    youRead: string;
    addReflection: string;
    yourReflection: string;
    remove: string;
    whatDidYouLearn: string;
    whatDidYouLearnPlaceholder: string;
    howCanYouApply: string;
    howCanYouApplyPlaceholder: string;
    keywordOfTheDay: string;
    keywordPlaceholder: string;
    cancel: string;
    markAsRead: string;
  };

  // Página de Leitura da Bíblia
  biblePage: {
    headerTitle: string;
    headerSubtitle: string;
    nextReading: string;
    completed: string;
    alreadyRead: string;
    markAsRead: string;
    streakDays: string;
    record: string;
    yourProgress: string;
    readingPlan2025: string;
    chapters: string;
    books: string;
    consecutiveDays: string;
    achievements: string;
    achievementFirstWeek: string;
    achievementWeekComplete: string;
    achievementTwoWeeks: string;
    achievementMonthComplete: string;
    achievement3Days: string;
    achievement7Days: string;
    achievement14Days: string;
    achievement30Days: string;
    motivationalNoAchievements: string;
    motivationalSomeAchievements: (count: number) => string;
    motivationalAllAchievements: string;
    recentReflections: string;
    toastConfigured: string;
    toastConfiguredDesc: string;
    toastAlreadyRead: string;
    toastAlreadyReadDesc: string;
    toastReadingRegistered: string;
    toastReadingRegisteredDesc: (book: string, chapter: string) => string;
    toastNewAchievement: string;
  };

  // Diário de Gratidão
  gratitudeDiary: {
    headerTitle: string;
    headerSubtitle: string;
    whyTitle: string;
    whyDescription: string;
    bibleVerse: string;
    startTitle: string;
    startDescription: string;
    startTip: string;
    summaryTitle: string;
    totalRecords: string;
    daysPracticing: string;
    toastDeleted: string;
    addButtonLabel: string;
    toastReportSaved: string;
  };

  // Nova Gratidão
  newGratitude: {
    headerTitleNew: string;
    headerTitleEdit: string;
    headerSubtitleNew: string;
    headerSubtitleEdit: string;
    dateLabel: string;
    gratitudeLabel: string;
    gratitudePlaceholder: string;
    buttonSaveNew: string;
    buttonSaveEdit: string;
    toastErrorEmpty: string;
    toastSuccessNew: string;
    toastSuccessNewDesc: string;
    toastSuccessEdit: string;
    toastSuccessEditDesc: string;
  };

  // Alvos Espirituais
  spiritualGoals: {
    headerTitle: string;
    headerSubtitle: (count: number) => string;
    whyTitle: string;
    whyDescription: string;
    bibleVerse: string;
    startTitle: string;
    startDescription: string;
    startTip: string;
    sectionInProgress: string;
    sectionPaused: string;
    sectionCompleted: string;
    summaryTitle: string;
    summaryInProgress: string;
    summaryCompleted: string;
    summaryPaused: string;
    buttonEdit: string;
    buttonPause: string;
    buttonComplete: string;
    buttonResume: string;
    newGoalTitle: string;
    newGoalSubtitle: string;
    fieldGoalTitle: string;
    fieldGoalPlaceholder: string;
    fieldMeta: string;
    fieldMetaPlaceholder: string;
    fieldDeadline: string;
    buttonCreate: string;
    toastSuccess: string;
    toastError: string;
  };

  // Tela Inicial
  home: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    yearText: string;
    progressTitle: string;
    progressOf: string;
    progressMonth: string;
    statusAhead: string;
    statusOnTrack: string;
    statusBehind: string;
    messageAhead: string;
    messageOnTrack: string;
    messageBehind: string;
    scheduleTitle: string;
    scheduleStudy: string;
    scheduleStudies: string;
    scheduleReturnVisit: string;
    scheduleReturnVisits: string;
    scheduleFree: string;
    statisticsTitle: string;
    annualGoal: string;
    accomplished: string;
    completed: string;
    remaining: string;
    studies: string;
    returnVisits: string;
    tapForDetails: string;
    publisherRegular: string;
    publisherAuxiliary: string;
    publisherRegularPioneer: string;
    publisherSpecialPioneer: string;
    publisherCircuitOverseer: string;
    dayMonday: string;
    dayTuesday: string;
    dayWednesday: string;
    dayThursday: string;
    dayFriday: string;
    daySaturday: string;
    daySunday: string;
  };

  // Página de Progresso
  progress: {
    title: string;
    ministry: string;
    goalAchieved: string;
    of: string;
    month: string;
    congratsGoalReached: string;
    keepGoingGreat: string;
    activityHistory: string;
    noRecordsThisMonth: string;
    useButtonToAdd: string;
    noRecordsForMonth: string;
    fieldMinistry: string;
    creditTime: string;
    edit: string;
    delete: string;
    deleteRecordTitle: string;
    deleteRecordDescription: string;
    confirm: string;
    cancel: string;
    deleteSuccess: string;
    // Nomes dos meses
    monthJanuary: string;
    monthFebruary: string;
    monthMarch: string;
    monthApril: string;
    monthMay: string;
    monthJune: string;
    monthJuly: string;
    monthAugust: string;
    monthSeptember: string;
    monthOctober: string;
    monthNovember: string;
    monthDecember: string;
    // Nomes dos dias da semana (por extenso)
    weekdayMonday: string;
    weekdayTuesday: string;
    weekdayWednesday: string;
    weekdayThursday: string;
    weekdayFriday: string;
    weekdaySaturday: string;
    weekdaySunday: string;
    // Tipos de atividade
    activityHouseToHouse: string;
    activityPublicWitnessing: string;
    activityByPhone: string;
    activityByLetter: string;
    activityInformal: string;
    activityReturnVisit: string;
    activityBibleStudy: string;
    activityCredit: string;
    activityOther: string;
    // Períodos do dia
    periodMorning: string;
    periodAfternoon: string;
    periodEvening: string;
  };

  // Página de Cadastrar Tempo
  registerTime: {
    title: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    step3DescriptionWithPerson: string;
    reviewTitle: string;
    reviewDescription: string;
    // Tipos de atividade
    houseToHouseTitle: string;
    houseToHouseDesc: string;
    returnVisitTitle: string;
    returnVisitDesc: string;
    bibleStudyTitle: string;
    bibleStudyDesc: string;
    publicWitnessingTitle: string;
    publicWitnessingDesc: string;
    byPhoneTitle: string;
    byPhoneDesc: string;
    byLetterTitle: string;
    byLetterDesc: string;
    informalTitle: string;
    informalDesc: string;
    creditTitle: string;
    creditDesc: string;
    // Ações
    addMoreActivities: string;
    finish: string;
    confirm: string;
    cancel: string;
    remove: string;
    edit: string;
    save: string;
    hours: string;
    minutes: string;
    howLongDidItTake: string;
    selectActivityType: string;
    selectPerson: string;
    noReturnVisits: string;
    noReturnVisitsDescription: string;
    noStudents: string;
    noStudentsDescription: string;
    addReturnVisit: string;
    addStudent: string;
    totalTime: string;
    activitySummary: string;
    sessionSavedSuccess: string;
    sessionUpdatedSuccess: string;
    selectActivityFirst: string;
    invalidTime: string;
    selectedActivity: string;
    setDuration: string;
    addActivity: string;
    saveEdit: string;
    howMuchTimeDidYouDedicate: string;
    activityAdded: string;
    activityRemoved: string;
    timeUpdated: string;
    addAtLeastOneActivity: string;
    recordUpdatedSuccess: string;
    timeSavedSuccess: string;
    activities: string;
    noReturnVisitRegistered: string;
    noStudyRegistered: string;
    registerReturnVisitFirst: string;
    registerStudyFirst: string;
    continueWithoutSelecting: string;
    selectReturnVisit: string;
    selectStudent: string;
    reviewAndComplete: string;
    lastStepConfirmActivities: string;
    totalAccumulated: string;
    activity: string;
    noActivityAdded: string;
    addAtLeastOneActivityToContinue: string;
    registeredActivities: string;
    completeRegistration: string;
    field: string;
    credit: string;
  };

  // Página de Cronograma da Semana
  schedule: {
    title: string;
    thisWeek: string;
    nextWeek: string;
    lastWeek: string;
    weeksAhead: string; // "Daqui a {n} semanas"
    weeksAgo: string; // "{n} semanas atrás"
    today: string;
    // Dias da semana
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    // Badges e status
    free: string; // "Livre" - dia sem agendamentos
    appointment: string; // "agendamento" (singular)
    appointments: string; // "agendamentos" (plural)
    bibleStudy: string; // "Estudo Bíblico"
    returnVisit: string; // "Revisita"
    lesson: string; // "Lição"
    visit: string; // "visita" - usado em "2ª visita"
    // Empty states
    weekFinished: string; // "Semana finalizada"
    allDaysPassed: string; // "Todos os dias desta semana já passaram."
    seeNextWeek: string; // "Ver Próxima Semana"
    noActivityScheduled: string; // "Nenhuma atividade foi agendada"
    noActivityPlanned: string; // "Nenhuma atividade planejada"
    // Info card
    howItWorks: string; // "Como funciona?"
    howItWorksDescription: string; // Descrição de como funciona a tela
  };

  // Página de Estatísticas
  statistics: {
    title: string; // "Estatísticas"
    // Tabs principais
    goals: string; // "Metas"
    activities: string; // "Atividades"
    hours: string; // "Horas"
    // Meta Mensal e Anual
    monthlyGoal: string; // "Meta Mensal"
    yearlyGoal: string; // "Meta Anual"
    completed: string; // "Realizado"
    percentComplete: string; // "{n}% concluído"
    remaining: string; // "Faltam {time}"
    // Mensagens de encorajamento
    everyHourCounts: string; // "Cada hora dedicada conta!"
    everyMonthOpportunity: string; // "Cada mês é uma nova oportunidade!"
    monthlyGoalReached: string; // "Meta mensal atingida! Continue firme!"
    yearlyGoalReached: string; // "Meta anual atingida! Que bênção!"
    almostMonthly: string; // "Falta pouco para sua meta mensal!"
    almostYearly: string; // "Você está quase lá no seu alvo anual!"
    keepGoing: string; // "Continue assim! Cada passo importa."
    // Resumo mensal
    summaryOf: string; // "Resumo de {month}"
    // Tipos de atividades
    houseToHouse: string; // "Casa em Casa"
    returnVisit: string; // "Revisita"
    bibleStudy: string; // "Estudo Bíblico"
    returnVisits: string; // "Revisitas" (plural)
    bibleStudies: string; // "Estudos" (plural)
    sessions: string; // "Sessões"
    publicWitnessing: string; // "Testemunho Público"
    phone: string; // "Telefone"
    letter: string; // "Carta"
    informal: string; // "Informal"
    credit: string; // "Crédito"
    // Filtros
    total: string; // "Total"
    // Meses do ano
    january: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
    // Ano de serviço
    serviceYear: string; // "Ano de serviço {year}"
    // Tempo
    inThisMonth: string; // "neste mês"
    inThisYear: string; // "neste ano"
    // Visão geral
    overview: string; // "Visão Geral"
    activitiesThisMonth: string; // "atividades este mês"
    occurrencesThisMonth: string; // "ocorrências este mês"
    activitiesThisMonthCount: string; // "atividades realizadas este mês"
    returnVisitsCount: string; // "revisitas"
    studentsCount: string; // "estudantes"
    activityDistribution: string; // "Distribuição de Atividades"
    breakdownByActivity: string; // "Detalhamento por Atividade"
    dedicatedToMinistry: string; // "dedicadas ao ministério este mês"
    timeDistribution: string; // "Distribuição de Tempo"
    noOccurrencesThisMonth: string; // "Nenhuma ocorrência de {activity} este mês"
    noSessionsThisMonth: string; // "Nenhuma sessão de {activity} este mês"
    serviceYearLabel: string; // "Ano de Serviço"
    peopleRegistered: string; // "pessoa cadastrada"
    peopleRegisteredPlural: string; // "pessoas cadastradas"
    activeStudent: string; // "estudante ativo"
    activeStudentsPlural: string; // "estudantes ativos"
    details: string; // "Detalhes"
  };

  // Teste de Notificações
  notificationTest: {
    title: string;
    studyReminder: string;
    idealSchedule: string;
    bibleReading: string;
    report: string;
    forgottenStudy: string;
    fieldPause: string;
    verse: string;
    celebration: string;
    encouragement: string;
    dpaExpiring: string;
    welcome: string;
    anniversary: string;
    dailyText: string;
    syncOffline: string;
    syncComplete: string;
    description: string;
  };

  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    back: string;
    next: string;
    confirm: string;
    yes: string;
    no: string;
    close: string;
    ok: string;
  };

  // Mensagens
  messages: {
    loading: string;
    saving: string;
    deleting: string;
    success: string;
    error: string;
    noData: string;
    requiredField: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  'pt-BR': {
    nav: {
      inicio: 'Início',
      espiritual: 'Espiritual',
      estudos: 'Estudos',
      campo: 'Campo',
      diario: 'Diário',
      leitura: 'Leitura',
      perfil: 'Perfil'
    },
    inicio: 'Início',
    espiritual: 'Espiritual',
    estudos: 'Estudos',
    campo: 'Campo',
    perfil: 'Perfil',
    settings: {
      title: 'Configurações',
      subtitle: 'Personalize sua experiência',
      appearance: 'Aparência',
      appearanceDesc: 'Personalize o tema visual',
      theme: 'Tema',
      themeLight: 'Tema Claro',
      themeDark: 'Tema Escuro',
      themeAuto: 'Automático',
      themeLightDesc: 'Interface clara e luminosa',
      themeDarkDesc: 'Reduz cansaço visual à noite',
      themeAutoDesc: 'Segue o tema do sistema',
      language: 'Idioma do Aplicativo',
      languageDesc: 'Escolha seu idioma preferido',
      moreLanguages: 'Mais idiomas em breve',
      notifications: 'Notificações e Lembretes',
      notificationsDesc: 'Gerencie alertas',
      notificationsEnable: 'Ativar Notificações',
      notificationsControl: 'Controle principal',
      notificationsReminders: 'Antecedência dos Lembretes',
      notifications24h: '24 horas',
      notifications1h: '1 hora',
      notificationsReceiveFor: 'Receber lembretes para:',
      notificationsBibleStudies: 'Estudos Bíblicos',
      notificationsReturnVisits: 'Revisitas Agendadas',
      notificationsBibleReading: 'Leitura da Bíblia',
      notificationsGratitude: 'Diário de Gratidão',
      notificationsSpiritualGoals: 'Alvos Espirituais',
      alertPreferences: 'Preferências de Alerta',
      sound: 'Som',
      vibration: 'Vibraão',
      languageRegion: 'Idioma e Região',
      resetSettings: 'Redefinir Configurações',
      redoOnboarding: 'Refazer Onboarding',
      redoOnboardingDesc: 'Voltar para as telas de boas-vindas e configuração inicial',
      privacyLocal: 'Todas as suas configurações são armazenadas <strong>localmente</strong> no seu dispositivo',
      privacyDesc: 'Privacidade total: nenhum dado é enviado para servidores externos',
      development: 'Desenvolvimento',
      developmentDesc: 'Ferramentas para desenvolvedores',
      about: 'Sobre o Mynis',
      aboutDesc: 'Versão e informações'
    },
    studies: {
      title: 'Estudos Bíblicos',
      activeStudies: (count) => `Estudos Ativos (${count})`,
      searchPlaceholder: 'Pesquisar estudantes...',
      filterAll: 'Todos',
      filterAvailable: 'Disponíveis',
      filterHot: 'Quentes',
      filterPaused: 'Inativos',
      statusAdvanced: 'Avançado',
      statusProgressing: 'Em Progresso',
      statusStarting: 'Iniciando',
      newStudy: 'Novo Estudo',
      noStudiesTitle: 'Nenhum Estudo Ativo',
      noStudiesMessage: 'Você ainda não tem estudantes ativos. Comece um novo estudo para acompanhar seu progresso.',
      noStudiesAction: 'Novo Estudo',
      days: {
        monday: 'Segunda-feira',
        tuesday: 'Terça-feira',
        wednesday: 'Quarta-feira',
        thursday: 'Quinta-feira',
        friday: 'Sexta-feira',
        saturday: 'Sábado',
        sunday: 'Domingo'
      }
    },
    field: {
      title: 'Ministério de Campo',
      subtitle: 'Suas revisitas e território',
      newReturn: 'Nova Revisita',
      editReturn: 'Editar Revisita',
      name: 'Nome',
      origin: 'Origem',
      originHouseToHouse: 'Casa em casa',
      originWitnessing: 'Testemunho público',
      originBusiness: 'Comércio',
      originOther: 'Outros',
      firstConversation: 'Primeira Conversa',
      publications: 'Publicações',
      status: 'Status',
      statusNew: 'Nova',
      statusHot: 'Quente',
      statusBusiness: 'Comércio',
      statusRest: 'Descanso',
      interestInStudy: 'Interesse em estudar',
      startStudy: 'Iniciar Estudo'
    },
    diary: {
      title: 'Diário Espiritual',
      subtitle: 'Seu crescimento no ministério',
      goals: 'Alvos Espirituais',
      monthlyReport: 'Relatório do Mês',
      hours: 'Horas',
      placements: 'Publicações',
      returnVisits: 'Revisitas',
      studies: 'Estudos'
    },
    reading: {
      title: 'Leitura da Bíblia',
      subtitle: 'Programa cronológico',
      chronological: 'Cronológica',
      progress: 'Progresso',
      todaysReading: 'Leitura de Hoje',
      markAsRead: 'Marcar como Lida',
      completed: 'Concluída'
    },
    profile: {
      title: 'Perfil',
      memberOf: 'Membro de',
      contactInfo: 'Informações de Contato',
      congregation: 'Congregação',
      email: 'E-mail',
      phone: 'Telefone',
      publisherType: 'Tipo de Publicador',
      pioneerRegular: 'Pioneiro Regular',
      pioneerAuxiliary: 'Pioneiro Auxiliar',
      publisher: 'Publicador',
      goal: 'Meta',
      goalHours: (hours) => `Meta de ${hours} horas`,
      emergencyInfo: 'Informações de Emergência',
      dpaValidity: 'Validade do DPA',
      emergencyContact: 'Contato de Emergência',
      editPhoto: 'Editar Foto',
      editInfo: 'Editar Informações',
      editEmergency: 'Editar Emergência',
      settings: 'Configurações',
      settingsSubtitle: 'Personalize sua experiência',
      appearance: 'Aparência',
      appearanceDesc: 'Tema e cores',
      notifications: 'Notificações',
      notificationsDesc: 'Lembretes',
      yearText: 'Texto do Ano',
      currentText: 'Texto atual:',
      yearTextNote: 'Este texto é exibido na tela de Início'
    },
    editInfo: {
      title: 'Editar Informações',
      subtitle: 'Atualize seus dados de contato',
      keepUpdated: 'Mantenha seus dados atualizados',
      keepUpdatedDesc: 'Essas informações são importantes para a comunicação com a congregação e para o envio de relatórios mensais.',
      profilePhoto: 'Foto de Perfil',
      noPhoto: 'Nenhuma foto selecionada',
      choosePhoto: 'Escolher Foto',
      photoNote: 'Sua foto aparecerá nas telas de Início e Perfil. Formatos aceitos: JPG, PNG, GIF (máx. 5MB)',
      congregationLabel: 'Congregação:',
      congregationPlaceholder: 'Digite o nome completo da sua congregação',
      emailLabel: 'Email:',
      emailNote: 'Usado para envio de relatórios e comunicações',
      phoneLabel: 'Telefone:',
      phoneNote: 'Número de contato com DDD',
      preview: 'Pré-visualização',
      saveInfo: 'Salvar Informações'
    },
    editPublisherType: {
      title: 'Tipo de Publicador',
      subtitle: 'Escolha seu tipo de serviço',
      regularPublisher: 'Publicador Regular',
      regularPublisherDesc: 'Meta sugerida de 10 horas mensais',
      regularPublisherGoal: 'Meta: 10h/mês',
      auxiliaryPioneer15: 'Pioneiro Auxiliar (15h)',
      auxiliaryPioneer15Desc: 'Compromisso de 15 horas mensais',
      auxiliaryPioneer15Goal: 'Meta: 15h/mês',
      auxiliaryPioneer30: 'Pioneiro Auxiliar (30h)',
      auxiliaryPioneer30Desc: 'Compromisso de 30 horas mensais',
      auxiliaryPioneer30Goal: 'Meta: 30h/mês',
      regularPioneer: 'Pioneiro Regular',
      regularPioneerDesc: 'Compromisso de 50 horas mensais',
      regularPioneerGoal: 'Meta: 50h/mês',
      tipTitle: 'Dica: A meta mensal é ajustada automaticamente de acordo com o tipo selecionado.',
      tipDesc: 'Você pode acompanhar seu progresso na tela Início e no card de Relatório do Mês.',
      cancel: 'Cancelar',
      saveChanges: 'Salvar Alterações'
    },
    editYearText: {
      title: 'Editar Texto do Ano',
      subtitle: 'Personalize o versículo da tela inicial',
      howItWorks: 'Como funciona?',
      howItWorksDesc: 'Este texto aparecerá no topo da tela de Início, logo abaixo da saudação. Escolha um versículo que inspire sua jornada espiritual.',
      tip: 'Dica: Você pode usar o tema anual da Organização ou escolher um texto pessoal.',
      biblicalTextLabel: 'Texto Bíblico:',
      biblicalTextPlaceholder: 'Digite o versículo completo entre aspas',
      biblicalRefLabel: 'Referência Bíblica:',
      biblicalRefPlaceholder: 'Digite o livro, capítulo e versículo',
      preview: 'Pré-visualização',
      yearTextTitle: 'Texto do Ano',
      saveYearText: 'Salvar Texto do Ano'
    },
    emergency: {
      title: 'Informações de Emergência',
      subtitle: 'Mantenha seus dados médicos atualizados',
      aboutDPA: 'Sobre o Documento de Procuração para Assistência (DPA)',
      aboutDPAText: 'O DPA garante que suas decisões médicas sejam respeitadas. Mantenha a validade sempre atualizada e compartilhe com familiares e anciãos da congregação.',
      docValidity: 'Validade do Documento',
      validityLabel: 'Validade do DPA',
      validityHelp: 'Selecione a data de validade do seu DPA',
      emergencyContacts: 'Contatos de Emergência',
      contactLabel: 'Nome do Contato',
      contactPlaceholder: 'Nome completo do contato de emergência',
      contactHelp: 'Pessoa que deve ser contatada em caso de emergência',
      phoneLabel: 'Telefone',
      phonePlaceholder: '(00) 00000-0000',
      phoneHelp: 'Número de telefone do contato de emergência',
      additionalMedicalInfo: 'Informações Médicas Adicionais',
      allergiesLabel: 'Alergias e Informações Médicas',
      allergiesPlaceholder: 'Ex: Alergia a penicilina, usa medicação para pressão alta...',
      allergiesHelp: 'Registre alergias, medicamentos contínuos ou condições importantes',
      summary: 'Resumo das Informações',
      dpaValidity: 'Validade do DPA',
      status: 'Status',
      emergencyContact: 'Contato de Emergência',
      phoneNumber: 'Telefone',
      allergies: 'Alergias',
      saveButton: 'Salvar Informações',
      statusNotFilled: 'Não preenchido',
      statusExpired: 'DPA Expirado',
      statusExpiringSoon: (days) => `Expira em ${days} ${days === 1 ? 'dia' : 'dias'}`,
      statusExpiringMonths: (months) => `Válido por ${months} ${months === 1 ? 'mês' : 'meses'}`,
      statusValid: 'DPA Válido',
      toastErrorValidityTitle: 'Data de validade obrigatória',
      toastErrorValidityDesc: 'Por favor, informe a data de validade do DPA',
      toastErrorContactTitle: 'Contato obrigatório',
      toastErrorContactDesc: 'Por favor, informe o nome do contato de emergência',
      toastErrorPhoneTitle: 'Telefone obrigatório',
      toastErrorPhoneDesc: 'Por favor, informe o telefone do contato de emergência',
      toastExpiredTitle: 'DPA Expirado',
      toastExpiredDesc: 'A data de validade do DPA já passou. Por favor, renove seu documento.',
      toastExpiringTitle: 'DPA próximo de expirar',
      toastExpiringDesc: (days) => `Seu DPA expira em ${days} ${days === 1 ? 'dia' : 'dias'}. Considere renová-lo em breve.`,
      toastSuccessTitle: 'Informações salvas!',
      toastSuccessDesc: 'Suas informações de emergência foram atualizadas com sucesso'
    },
    studiesTab: {
      title: 'Estudos Bíblicos',
      subtitle: 'Estudos Ativos',
      searchPlaceholder: 'Buscar estudantes...',
      filterAll: 'Todos',
      filterActive: 'Ativos',
      filterPaused: 'Pausados',
      filterCompleted: 'Concluídos',
      filterToday: 'Hoje',
      filterRest: 'Para Descanso',
      statusStarting: 'Iniciando',
      statusInProgress: 'Em Progresso',
      statusAdvanced: 'Avançado',
      statusWithDoubt: 'Com dúvidas',
      studyScheduledToday: 'Estudo Agendado para Hoje',
      prepareConversation: 'Prepare-se para uma ótima conversa!',
      newStudy: 'Novo Estudo',
      today: 'Hoje',
      daysAgo: (days) => days === 1 ? 'Há 1 dia' : `Há ${days} dias`,
      monday: 'segunda-feira',
      tuesday: 'terça-feira',
      wednesday: 'quarta-feira',
      thursday: 'quinta-feira',
      friday: 'sexta-feira',
      saturday: 'sábado',
      sunday: 'domingo',
      emptyTitle: 'Nenhum estudo bíblico ainda',
      emptyDescription: 'Quando você iniciar estudos bíblicos com as pessoas, eles aparecerão aqui para você acompanhar o progresso de cada um.',
      emptyAction: 'Adicionar Primeiro Estudo',
      viewDetails: 'Ver Detalhes',
      todayBanner: (count) => `Você tem ${count} ${count === 1 ? 'estudo' : 'estudos'} agendado${count === 1 ? '' : 's'} para hoje. Prepare-se para ótimas conversas!`
    },
    fieldTab: {
      title: 'Campo',
      subtitle: (count) => `${count} ${count === 1 ? 'revisita' : 'revisitas'}`,
      searchPlaceholder: 'Buscar por nome, endereço...',
      filterAll: 'Todas',
      filterAvailable: 'Disponíveis Agora',
      filterHot: 'Quentes',
      filterRevisit: 'Para Revisitar',
      availableBannerText: 'Estas pessoas estão disponíveis agora segundo a disponibilidade cadastrada. Aproveite para visitá-las!',
      firstVisit: 'Primeira visita',
      today: 'Hoje',
      daysAgo: (days) => days === 1 ? 'Há 1 dia' : `Há ${days} dias`,
      dayAgo: 'Há 1 dia',
      revisitUrgent: 'Revisitar urgente',
      statusNew: 'Nova',
      statusHot: 'Quente',
      statusCommerce: 'Comércio',
      statusRest: 'Descanso',
      emptyTitle: 'Vamos começar sua jornada!',
      emptyDescription: 'Ainda não há revisitas aqui. Que tal adicionar as primeiras pessoas que você conheceu no ministério?',
      emptySearchDescription: 'Nenhuma revisita encontrada com esses critérios.',
      studyStartedToast: 'Estudo Bíblico Iniciado!',
      studyStartedDescription: (name) => `${name} agora está na lista de Estudos Bíblicos`
    },
    returnVisitDetails: {
      visits: (count) => `Revisitas (${count})`,
      contactInfo: 'Informações de Contato',
      fullName: 'Nome Completo',
      phone: 'Telefone',
      call: 'Ligar',
      whatsapp: 'WhatsApp',
      fullAddress: 'Endereço Completo',
      viewOnMap: 'Ver no Mapa',
      lastVisit: 'Última Revisita',
      date: 'Data',
      daysAgo: (days) => days === 1 ? 'Há 1 dia' : `Há ${days} dias`,
      nextVisitScheduled: 'Próxima Revisita Agendada',
      reminderSet: 'Lembrete Definido',
      firstConversation: 'Primeira Conversa',
      additionalDetails: 'Detalhes Adicionais',
      contactOrigin: 'Origem do Contato',
      originInformalWitnessing: 'Testemunho Informal',
      originHouseToHouse: 'Casa em Casa',
      originPublicWitnessing: 'Testemunho Público',
      originBusiness: 'Comércio',
      originOther: 'Outros',
      dateAdded: 'Data de Adição',
      publicationsDelivered: 'Publicações Entregues',
      summary: 'Resumo',
      totalVisits: 'Total de Revisitas',
      daysSinceLast: 'Dias Desde a Última Revisita',
      registerNewVisit: 'Registrar Nova Revisita',
      dangerZone: 'Zona de Perigo',
      dangerZoneWarning: 'Remover esta revisita irá excluí-la permanentemente.',
      removeReturnVisit: 'Remover Revisita',
      confirmRemoval: 'Confirmar Remoção',
      confirmRemovalMessage: (name) => `Tem certeza de que deseja remover a revisita com ${name}?`,
      cancel: 'Cancelar',
      remove: 'Remover',
      returnVisitNotFound: 'Revisita não encontrada',
      back: 'Voltar',
      phoneNotRegistered: 'Telefone não registrado',
      addressNotRegistered: 'Endereço não registrado',
      returnVisitRemoved: 'Revisita removida com sucesso',
      edit: 'Editar',
      statusNew: 'Nova',
      statusHot: 'Quente',
      statusBusiness: 'Comércio',
      statusRest: 'Descanso',
      interestInStudyBadge: 'Interesse em estudar',
      convertToStudy: 'Converter em Estudo Bíblico',
      observations: 'Observações',
      publicationsLeft: 'Publicações Deixadas',
      visitHistory: 'Histórico de Visitas',
      found: 'Encontrou',
      notFound: 'Não encontrou',
      mostRecent: 'Mais recente',
      scheduledFor: 'Agendou para',
      availability: 'Disponibilidade',
      notInformed: 'Não informada',
      neverVisited: 'Nunca visitado',
      firstConversationTitle: 'Primeira Conversa',
      dangerZoneWarningFull: 'Ao excluir esta revisita, todos os dados serão removidos permanentemente. Esta ação não pode ser desfeita.',
      confirmRemovalFull: (name: string) => `Tem certeza que deseja remover a revisita com <strong>${name}</strong>? Esta ação não pode ser desfeita.`,
      totalVisitsLabel: 'Total de visitas',
      daysSinceLastLabel: 'Dias desde última',
      visitHistoryTitle: (count: number) => `Histórico de Visitas (${count})`,
      publicationsLeftLabel: 'Publicações deixadas:',
      scheduledForLabel: 'Agendou para:'
    },
    fab: {
      newStudy: 'Novo Estudo',
      newReturnVisit: 'Nova Revisita',
      newActivity: 'Nova Atividade',
      paused: 'Pausado'
    },
    studyDetails: {
      title: 'Detalhes do Estudo',
      contactInfo: 'Informações de Contato',
      fullName: 'Nome Completo',
      phone: 'Telefone',
      call: 'Ligar',
      whatsapp: 'WhatsApp',
      fullAddress: 'Endereço Completo',
      viewOnMap: 'Ver no Mapa',
      studyDetails: 'Detalhes do Estudo',
      publication: 'Publicação',
      progress: 'Progresso',
      nextStudy: 'Próximo Estudo',
      today: 'Hoje',
      observations: 'Observações',
      dangerZone: 'Zona de Perigo',
      dangerZoneWarning: 'Remover este estudo irá excluí-lo permanentemente.',
      removeStudy: 'Remover Estudo',
      confirmRemoval: 'Confirmar Remoção',
      confirmRemovalMessage: (name) => `Tem certeza de que deseja remover o estudo com ${name}?`,
      cancel: 'Cancelar',
      remove: 'Remover',
      studyNotFound: 'Estudo não encontrado',
      back: 'Voltar',
      phoneNotRegistered: 'Telefone não registrado',
      addressNotRegistered: 'Endereço não registrado',
      studyRemoved: 'Estudo removido com sucesso'
    },
    studyForm: {
      newStudyTitle: 'Novo Estudo',
      editStudyTitle: 'Editar Estudo',
      newStudySubtitle: 'Adicione um novo estudo para acompanhar seu progresso',
      editStudySubtitle: 'Atualize os detalhes do estudo',
      conversionBannerTitle: 'Conversão!',
      conversionBannerDescription: (name) => `${name} foi convertido!`,
      contactInfo: 'Informações de Contato',
      fullNameLabel: 'Nome Completo:',
      fullNamePlaceholder: 'Digite o nome completo',
      phoneLabel: 'Telefone:',
      phonePlaceholder: 'Digite o número de telefone',
      addressLabel: 'Endereço Completo:',
      addressPlaceholder: 'Digite o endereço completo',
      studyDetails: 'Detalhes do Estudo',
      publicationLabel: 'Publicação:',
      publicationOptions: {
        option1: 'Publicação 1',
        option2: 'Publicação 2',
        option3: 'Publicação 3',
        option4: 'Publicação 4'
      },
      statusLabel: 'Status:',
      statusOptions: {
        starting: {
          name: 'Iniciando',
          description: 'O estudo está começando'
        },
        progressing: {
          name: 'Em Progresso',
          description: 'O estudo está em andamento'
        },
        doubts: {
          name: 'Com Dúvidas',
          description: 'O estudo tem dúvidas'
        },
        advanced: {
          name: 'Avançado',
          description: 'O estudo está avançado'
        }
      },
      schedulingTitle: 'Agendamento',
      nextDateLabel: 'Próxima Data:',
      timeLabel: 'Horário:',
      observationsTitle: 'Observações',
      observationsPlaceholder: 'Digite quaisquer observações importantes',
      dangerZoneTitle: 'Zona de Perigo',
      dangerZoneWarning: 'Excluir este estudo irá removê-lo permanentemente.',
      deleteStudy: 'Excluir Estudo',
      saveChanges: 'Salvar Alterações',
      createStudy: 'Criar Estudo',
      validationErrors: {
        nameRequired: 'O nome completo é obrigatrio',
        addressRequired: 'O endereço completo é obrigatório',
        publicationRequired: 'A publicação é obrigatória'
      },
      successMessages: {
        updated: 'Estudo atualizado com sucesso!',
        created: 'Estudo criado com sucesso!',
        createdDescription: (name) => `Estudo com ${name} criado com sucesso!`,
        deleted: 'Estudo excluído com sucesso!'
      },
      deleteConfirmation: (name) => `Tem certeza de que deseja excluir o estudo com ${name}?`
    },
    returnVisitForm: {
      newTitle: 'Nova Revisita',
      editTitle: 'Editar Revisita',
      newSubtitle: 'Preencha as informações',
      editSubtitle: 'Atualize as informações',
      contactInfo: 'Informações de Contato',
      fullNameLabel: 'Nome completo *',
      fullNamePlaceholder: 'Ex: Maria Silva',
      phoneLabel: 'Telefone (opcional)',
      phonePlaceholder: '(00) 00000-0000',
      addressLabel: 'Endereço completo *',
      addressPlaceholder: 'Rua, número, bairro, cidade',
      placeType: 'Tipo de Local',
      placeTypeOptions: {
        house: 'Casa',
        building: 'Prédio',
        business: 'Comércio'
      },
      status: 'Status da Revisita',
      statusOptions: {
        new: 'Nova',
        interested: 'Interessado',
        hot: 'Quente',
        resting: 'Descanso'
      },
      firstConversation: 'Primeira Conversa',
      firstConversationLabel: 'Sobre o que vocês conversaram? *',
      firstConversationPlaceholder: 'Ex: Demonstrou interesse em saber sobre o Reino de Deus...',
      additionalDetails: 'Detalhes Adicionais',
      availabilityLabel: 'Disponibilidade',
      availabilityPlaceholder: 'Ex: Sábados pela manhã',
      scheduledDateLabel: 'Data Combinada para Retornar',
      scheduledDateHint: 'Quando o morador pediu para você voltar?',
      publicationsLabel: 'Publicações Deixadas',
      publicationsPlaceholder: 'Ex: Bom dia!, O que a Bíblia diz?',
      publicationsHint: 'Separe por vírgula',
      observationsLabel: 'Observações',
      observationsPlaceholder: 'Outras anotações importantes...',
      studyInterest: 'Esta pessoa demonstrou interesse em estudar a Bíblia',
      dangerZone: 'Zona de Perigo',
      dangerZoneWarning: 'Ao excluir esta revisita, todos os dados serão removidos permanentemente. Esta ação não pode ser desfeita.',
      deleteReturnVisit: 'Excluir Revisita',
      saveChanges: 'Salvar Alterações',
      createReturnVisit: 'Cadastrar Revisita',
      validationErrors: {
        nameRequired: 'Precisamos do nome da pessoa',
        addressRequired: 'Precisamos do endereço',
        firstConversationRequired: 'Conte como foi a primeira conversa'
      },
      successMessages: {
        updated: 'Você atualizou a revisita',
        created: 'Revisita cadastrada!',
        deleted: 'Você removeu a revisita'
      },
      deleteConfirmation: (name) => `Tem certeza que deseja excluir a revisita de ${name}?\n\nEsta ação não pode ser desfeita.`
    },
    spiritualTab: {
      onboardingTitle: 'Preparando o Solo',
      onboardingSubtitle: 'Sua base espiritual para jogar sementes',
      bibleReadingTitle: 'Leitura da Bíblia',
      bibleReadingSetup: 'Configure seu plano de leitura',
      bibleReadingTrack: 'Acompanhe seu progresso espiritual',
      gratitudeTitle: 'Diário de Gratidão',
      gratitudeStart: 'Comece registrando pelo que você é grato hoje',
      gratitudeStrength: 'Cultivar gratidão fortalece sua espiritualidade',
      goalsTitle: 'Alvos Espirituais',
      goalsEstablish: 'Estabeleça seus alvos espirituais',
      worshipIdeasTitle: 'Sem ideias para a adoração?',
      suggestIdea: 'Sugerir uma Ideia'
    },
    emptyStateBible: {
      headerTitle: 'Comece sua jornada',
      headerSubtitle: 'Configure sua leitura',
      ctaTitle: 'Configure sua leitura',
      ctaDescription: 'Para começar, configure suas preferências de leitura da Bíblia',
      ctaButton: 'Ir para Configurações',
      benefitsTitle: 'O que você vai conseguir:',
      benefit1Title: 'Metas Personalizadas',
      benefit1Description: 'Escolha quantos capítulos ler por dia de acordo com sua rotina',
      benefit2Title: 'Acompanhamento Diário',
      benefit2Description: 'Registre suas leituras e mantenha uma ofensiva de dias seguidos',
      benefit3Title: 'Conquistas e Reflexões',
      benefit3Description: 'Desbloqueie conquistas e registre suas reflexões espirituais',
      toastSuccess: 'Plano configurado com sucesso!',
      toastDescription: 'Comece sua jornada de leitura agora'
    },
    bibleSettingsPage: {
      headerTitle: 'Configurações',
      headerSubtitle: 'Personalize sua experiência',
      planTypeTitle: 'Tipo de Plano',
      planTypeDesc: 'Escolha como deseja ler a Bíblia',
      chronological: 'Cronológico',
      chronologicalDesc: 'Leia a Bíblia na ordem histórica dos eventos',
      thematic: 'Temático',
      thematicDesc: 'Explore temas e assuntos bíblicos específicos',
      sequential: 'Sequencial',
      sequentialDesc: 'Leia do Gênesis ao Apocalipse em ordem',
      dailyGoalTitle: 'Meta Diária',
      dailyGoalDesc: 'Quantos capítulos deseja ler por dia?',
      oneChapter: '1 capítulo por dia',
      oneChapterDesc: 'Ritmo tranquilo e reflexivo',
      threeChapters: '3 capítulos por dia',
      threeChaptersDesc: 'Ritmo moderado e equilibrado',
      fiveChapters: '5 capítulos por dia',
      fiveChaptersDesc: 'Ritmo intenso e dedicado',
      notificationsTitle: 'Notificações',
      notificationsDesc: 'Configure lembretes para sua rotina de leitura',
      dailyReminder: 'Lembrete diário',
      dailyReminderDesc: 'Receba um lembrete para ler todos os dias às 9h',
      reflectionReminder: 'Lembrete de reflexão',
      reflectionReminderDesc: 'Incentivo para meditar sobre o que você leu',
      summaryTitle: 'Resumo das Configurações',
      readingPlan: 'Plano de leitura:',
      dailyGoal: 'Meta diária:',
      reminders: 'Lembretes:',
      allActive: 'Todos ativos',
      partiallyActive: 'Parcialmente ativos',
      disabled: 'Desativados',
      saveButton: 'Salvar Configurações',
      resetDialogTitle: 'Resetar Progresso?',
      resetDialogDesc: 'Alterar o plano de leitura ou meta diária irá resetar seu progresso atual incluindo leituras, ofensiva, conquistas e reflexões.',
      resetDialogWarning: 'Esta ação irá resetar os seguintes dados:',
      completedReadings: 'Leituras concluídas',
      streakDays: 'Dias de ofensiva',
      unlockedAchievements: 'Conquistas desbloqueadas',
      registeredReflections: 'Reflexões registradas',
      resetDialogTip: 'Você começará uma nova jornada de leitura com as novas configurações.',
      cancel: 'Cancelar',
      confirmReset: 'Confirmar Reset',
      toastSaved: 'Configurações salvas',
      toastSavedDesc: 'Suas preferências foram atualizadas',
      toastReset: 'Progresso resetado',
      toastResetDesc: 'Suas novas configurações foram salvas. Você começar�� do zero!',
      
      // Cards
      planTypeTitle: 'Tipo de Plano',
      planTypeSubtitle: 'Escolha como deseja ler a Bíblia',
      dailyGoalTitle: 'Meta Diária',
      dailyGoalSubtitle: 'Quantos capítulos deseja ler por dia?',
      oneChapterShort: '1 capítulo por dia',
      oneChapterPace: 'Ritmo tranquilo e reflexivo',
      threeChaptersShort: '3 capítulos por dia',
      threeChaptersPace: 'Ritmo moderado e equilibrado',
      fiveChaptersShort: '5 capítulos por dia',
      fiveChaptersPace: 'Ritmo intenso e dedicado',
      notificationsTitle: 'Notificações',
      notificationsSubtitle: 'Configure lembretes para sua rotina de leitura',
      dailyReminderShort: 'Lembrete diário',
      dailyReminderShortDesc: 'Receba um lembrete para ler todos os dias às 9h',
      reflectionReminderShort: 'Lembrete de reflexão',
      reflectionReminderShortDesc: 'Incentivo para meditar sobre o que você leu',
      summaryTitle: 'Resumo das Configurações',
      summaryPlan: 'Plano de leitura:',
      summaryGoal: 'Meta diária:',
      summaryReminders: 'Lembretes:',
      remindersAll: 'Todos ativos',
      remindersPartial: 'Parcialmente ativos',
      remindersNone: 'Desativados',
      saveButton: 'Salvar Configurações',
      toastSaveSuccess: 'Configurações salvas',
      toastSaveSuccessDesc: 'Suas preferências foram atualizadas',
      
      // Dialog de Reset
      resetDialogTitle: 'Resetar Progresso?',
      resetDialogDescription: 'Alterar o plano de leitura ou meta diária irá resetar seu progresso atual incluindo leituras, ofensiva, conquistas e reflexões.',
      resetDialogText: 'Esta ação irá',
      resetDialogTextBold: 'resetar',
      resetDialogTextContinue: 'os seguintes dados:',
      resetItem1: 'Leituras concluídas',
      resetItem2: 'Dias de ofensiva',
      resetItem3: 'Conquistas desbloqueadas',
      resetItem4: 'Reflexões registradas',
      resetDialogTip: 'Você começará uma nova jornada de leitura com as novas configurações.',
      resetDialogCancel: 'Cancelar',
      resetDialogConfirm: 'Confirmar Reset'
    },
    bibleOnboarding: {
      headerTitle: 'Configure seu Plano',
      step: 'Etapa',
      stepOf: 'de',
      step1Title: 'Escolha seu Programa de Leitura',
      step1Subtitle: 'Selecione a forma que melhor se adapta a você',
      chronological: 'Cronológico',
      chronologicalDesc: 'Leia os 1189 capítulos na ordem histórica dos eventos. Jó após a criação, Salmos durante o reino de Davi',
      chronologicalShort: 'Leia a Bíblia na ordem histórica dos eventos',
      sequential: 'Sequencial',
      sequentialDesc: 'Leia do Gênesis ao Apocalipse na ordem tradicional dos livros, começando pelo AT e seguindo ao NT',
      sequentialShort: 'Leia do Gênesis ao Apocalipse em ordem',
      thematic: 'Temático',
      thematicDesc: 'Explore 10 temas bíblicos: fé, sabedoria, amor, oração, ministério, perseverança e vida de Jesus',
      thematicShort: 'Explore temas e assuntos bíblicos específicos',
      step2Title: 'Defina sua Meta Diária',
      step2Subtitle: 'Escolha quantos capítulos você deseja ler por dia',
      oneChapter: '1 capítulo por dia',
      oneChapterDesc: 'Aproximadamente 5 minutos diários · Leitura reflexiva',
      threeChapters: '3 capítulos por dia',
      threeChaptersDesc: 'Aproximadamente 15 minutos diários · Ritmo equilibrado',
      fiveChapters: '5 capítulos por dia',
      fiveChaptersDesc: 'Aproximadamente 25 minutos diários · Ritmo mais dedicado',
      step2Tip: 'Dica: Comece com 3 capítulos por dia. Você pode ajustar sua meta a qualquer momento nas configurações.',
      step3Title: 'Configurações Finais',
      step3Subtitle: 'Deseja receber lembretes para auxiliá-lo?',
      dailyReminder: 'Lembrete diário de leitura',
      dailyReminderDesc: 'Receba uma notificação todos os dias às 9h para não esquecer sua leitura',
      reflectionReminder: 'Lembrete de reflexão',
      reflectionReminderDesc: 'Receba incentivos para meditar e aplicar o que você aprendeu',
      step3Message: 'Você está pronto para começar! Acompanhe seu progresso de leitura e mantenha uma rotina regular de estudo da Palavra de Deus.',
      continueButton: 'Continuar',
      startReadingButton: 'Começar a Ler'
    },
    markReadingDialog: {
      title: 'Marcar Leitura',
      youRead: 'Você leu:',
      addReflection: 'Adicionar Reflexão (opcional)',
      yourReflection: 'Sua Reflexão',
      remove: 'Remover',
      whatDidYouLearn: 'O que você aprendeu?',
      whatDidYouLearnPlaceholder: 'Digite aqui seu aprendizado...',
      howCanYouApply: 'Como pode aplicar?',
      howCanYouApplyPlaceholder: 'Digite como pode aplicar na sua vida...',
      keywordOfTheDay: 'Palavra-chave do dia',
      keywordPlaceholder: 'Ex: Amor, Fé, Perseverança...',
      cancel: 'Cancelar',
      markAsRead: 'Marcar como Lido'
    },
    biblePage: {
      headerTitle: 'Leitura da Bíblia',
      headerSubtitle: 'Sua base espiritual para jogar sementes',
      nextReading: 'Próxima leitura:',
      completed: 'Concluído',
      alreadyRead: 'Já li hoje',
      markAsRead: 'Marcar como Lido',
      streakDays: 'Dias de ofensiva',
      record: 'Recorde',
      yourProgress: 'Seu Progresso',
      readingPlan2025: 'Plano de Leitura 2025',
      chapters: 'Capítulos',
      books: 'Livros',
      consecutiveDays: 'Dias seguidos',
      achievements: 'Conquistas',
      achievementFirstWeek: 'Início\nHumilde',
      achievementWeekComplete: 'Semana\nCompleta',
      achievementTwoWeeks: 'Leitor\nDedicado',
      achievementMonthComplete: 'Leitor\nVoraz',
      achievement3Days: '3 Dias Seguidos',
      achievement7Days: 'Semana Completa',
      achievement14Days: '14 Dias Seguidos',
      achievement30Days: 'Mês Completo',
      motivationalNoAchievements: 'Continue lendo para desbloquear conquistas!',
      motivationalSomeAchievements: (count: number) => `Você desbloqueou ${count} de 4 conquistas! Continue assim!`,
      motivationalAllAchievements: 'Parabéns! Você desbloqueou todas as conquistas!',
      recentReflections: 'Reflexões Recentes',
      toastConfigured: 'Plano configurado com sucesso!',
      toastConfiguredDesc: 'Comece sua jornada de leitura agora',
      toastAlreadyRead: 'Você já registrou sua leitura hoje!',
      toastAlreadyReadDesc: 'Continue amanhã para manter sua ofensiva',
      toastReadingRegistered: 'Leitura registrada!',
      toastReadingRegisteredDesc: (book: string, chapter: string) => `${book} ${chapter} concluído`,
      toastNewAchievement: 'Nova Conquista Desbloqueada!'
    },
    gratitudeDiary: {
      headerTitle: 'Diário de Gratidão',
      headerSubtitle: 'Cultivando um coração grato',
      whyTitle: 'Por que cultivar gratidão?',
      whyDescription: 'Registrar pelo que somos gratos fortalece nossa espiritualidade e nos ajuda a ver as bênçãos de Jeová em nossa vida. A Bíblia nos incentiva a sermos gratos em todas as circunstâncias.',
      bibleVerse: '"Sejam gratos." — Colossenses 3:15',
      startTitle: 'Comece seu diário',
      startDescription: 'Registre pelo que você é grato hoje',
      startTip: 'Clique no botão + abaixo para adicionar sua primeira entrada',
      summaryTitle: 'Resumo',
      totalRecords: 'Total de registros',
      daysPracticing: 'Dias praticando',
      toastDeleted: 'Você removeu a entrada',
      addButtonLabel: 'Adicionar nova gratidão',
      toastReportSaved: 'Sua reflexão foi salva no Diário de Gratidão'
    },
    newGratitude: {
      headerTitleNew: 'Nova Gratidão',
      headerTitleEdit: 'Editar Gratidão',
      headerSubtitleNew: 'O que te fez sentir grato hoje?',
      headerSubtitleEdit: 'Atualize sua gratidão',
      dateLabel: 'Data',
      gratitudeLabel: 'Pelo que você é grato?',
      gratitudePlaceholder: 'Ex: Jeová me deu forças para superar um desafio hoje...',
      buttonSaveNew: 'Salvar Gratidão',
      buttonSaveEdit: 'Atualizar Gratidão',
      toastErrorEmpty: 'Escreva algo pelo que você é grato',
      toastSuccessNew: 'Gratidão registrada!',
      toastSuccessNewDesc: 'Salva no seu Diário de Gratidão',
      toastSuccessEdit: 'Gratidão atualizada!',
      toastSuccessEditDesc: 'Alterações salvas com sucesso'
    },
    spiritualGoals: {
      headerTitle: 'Alvos Espirituais',
      headerSubtitle: (count: number) => `${count} ${count === 1 ? 'alvo ativo' : 'alvos ativos'}`,
      whyTitle: 'Por que ter alvos espirituais?',
      whyDescription: 'Estabelecer alvos espirituais nos ajuda a crescer em nossa relação com Jeová e nos motiva a progredir espiritualmente. São como mapas que guiam nossa jornada cristã.',
      bibleVerse: '"Certifique-se das coisas mais importantes." — Filipenses 1:10',
      startTitle: 'Estabeleça seu primeiro alvo',
      startDescription: 'Comece criando um alvo espiritual para sua jornada',
      startTip: 'Clique no botão + abaixo para criar seu primeiro alvo',
      sectionInProgress: 'Em Andamento',
      sectionPaused: 'Pausados',
      sectionCompleted: 'Concluídos',
      summaryTitle: 'Resumo',
      summaryInProgress: 'Em andamento',
      summaryCompleted: 'Concluídos',
      summaryPaused: 'Pausados',
      buttonEdit: 'Editar',
      buttonPause: 'Pausar',
      buttonComplete: 'Concluir',
      buttonResume: 'Retomar',
      newGoalTitle: 'Novo Alvo Espiritual',
      newGoalSubtitle: 'Estabeleça um objetivo espiritual',
      fieldGoalTitle: 'Qual seu alvo?',
      fieldGoalPlaceholder: 'Ex: Ler toda a Bíblia',
      fieldMeta: 'Meta (opcional)',
      fieldMetaPlaceholder: 'Ex: 3 capítulos por dia',
      fieldDeadline: 'Prazo (opcional)',
      buttonCreate: 'Criar Alvo',
      toastSuccess: 'Alvo criado!',
      toastError: 'Precisamos de um título para o alvo'
    },
    home: {
      greetingMorning: 'Bom dia',
      greetingAfternoon: 'Boa tarde',
      greetingEvening: 'Boa noite',
      yearText: 'Texto do Ano',
      progressTitle: 'Progresso',
      progressOf: 'de',
      progressMonth: 'mês',
      statusAhead: 'Adiantado',
      statusOnTrack: 'No Ritmo',
      statusBehind: 'Atrasado',
      messageAhead: 'Parabéns! Você está à frente da meta!',
      messageOnTrack: 'Continue assim! Você está no caminho certo!',
      messageBehind: 'Não desanime! Você consegue alcançar sua meta!',
      scheduleTitle: 'Cronograma da Semana',
      scheduleStudy: 'estudo',
      scheduleStudies: 'estudos',
      scheduleReturnVisit: 'revisita',
      scheduleReturnVisits: 'revisitas',
      scheduleFree: 'Livre',
      statisticsTitle: 'Estatísticas',
      annualGoal: 'Meta Anual',
      accomplished: 'Realizado',
      completed: 'concluído',
      remaining: 'Faltam',
      studies: 'Estudos',
      returnVisits: 'Revisitas',
      tapForDetails: 'Toque para ver detalhes completos',
      publisherRegular: 'Publicador',
      publisherAuxiliary: 'Pioneiro Auxiliar',
      publisherRegularPioneer: 'Pioneiro Regular',
      publisherSpecialPioneer: 'Pioneiro Especial',
      publisherCircuitOverseer: 'Superintendente de Circuito',
      dayMonday: 'Seg',
      dayTuesday: 'Ter',
      dayWednesday: 'Qua',
      dayThursday: 'Qui',
      dayFriday: 'Sex',
      daySaturday: 'Sáb',
      daySunday: 'Dom'
    },
    progress: {
      title: 'Progresso do Mês',
      ministry: 'Ministério',
      goalAchieved: 'Meta atingida!',
      of: 'de',
      month: 'mês',
      congratsGoalReached: 'Parabéns! Você atingiu sua meta mensal!',
      keepGoingGreat: 'Continue assim, você está indo muito bem!',
      activityHistory: 'Histórico de Atividades',
      noRecordsThisMonth: 'Nenhum registro neste mês',
      useButtonToAdd: 'Use o botão "+" para adicionar suas atividades.',
      noRecordsForMonth: 'Não há registros para este mês.',
      fieldMinistry: 'Ministério de Campo',
      creditTime: 'Tempo de Crédito',
      edit: 'Editar',
      delete: 'Excluir',
      deleteRecordTitle: 'Excluir Registro?',
      deleteRecordDescription: 'Você tem certeza de que deseja excluir este registro de ministério?',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      deleteSuccess: 'Registro excluído com sucesso',
      monthJanuary: 'Janeiro',
      monthFebruary: 'Fevereiro',
      monthMarch: 'Março',
      monthApril: 'Abril',
      monthMay: 'Maio',
      monthJune: 'Junho',
      monthJuly: 'Julho',
      monthAugust: 'Agosto',
      monthSeptember: 'Setembro',
      monthOctober: 'Outubro',
      monthNovember: 'Novembro',
      monthDecember: 'Dezembro',
      weekdayMonday: 'segunda-feira',
      weekdayTuesday: 'terça-feira',
      weekdayWednesday: 'quarta-feira',
      weekdayThursday: 'quinta-feira',
      weekdayFriday: 'sexta-feira',
      weekdaySaturday: 'sábado',
      weekdaySunday: 'domingo',
      activityHouseToHouse: 'Casa em Casa',
      activityPublicWitnessing: 'Testemunho Público',
      activityByPhone: 'Por Telefone',
      activityByLetter: 'Por Carta',
      activityInformal: 'Informal',
      activityReturnVisit: 'Revisita',
      activityBibleStudy: 'Estudo Bíblico',
      activityCredit: 'Crédito',
      activityOther: 'Outro',
      periodMorning: 'manhã',
      periodAfternoon: 'tarde',
      periodEvening: 'noite'
    },
    registerTime: {
      title: 'Cadastrar Tempo',
      step1Title: 'Passo 1: Escolha a atividade',
      step1Description: 'Selecione o tipo de atividade que você realizou',
      step2Title: 'Selecione a Pessoa',
      step2Description: 'Passo 2: Quem foi visitado?',
      step3Title: 'Quanto tempo durou?',
      step3Description: 'Passo 2: Defina a duração',
      step3DescriptionWithPerson: 'Passo 3: Defina a duração',
      reviewTitle: 'Revisão Final',
      reviewDescription: 'Confirme as informações antes de salvar',
      houseToHouseTitle: 'Casa em Casa',
      houseToHouseDesc: 'Visitação porta a porta',
      returnVisitTitle: 'Revisita',
      returnVisitDesc: 'Visitar interesse',
      bibleStudyTitle: 'Estudo Bíblico',
      bibleStudyDesc: 'Conduzir estudo',
      publicWitnessingTitle: 'Testemunho Público',
      publicWitnessingDesc: 'Carrinho ou banca pública',
      byPhoneTitle: 'Por Telefone',
      byPhoneDesc: 'Chamadas e mensagens',
      byLetterTitle: 'Por Carta',
      byLetterDesc: 'Cartas e mensagens escritas',
      informalTitle: 'Informal',
      informalDesc: 'Conversas casuais',
      creditTitle: 'Crédito',
      creditDesc: 'Tempo especial (LDC, hospitalar, etc)',
      addMoreActivities: 'Adicionar Mais Atividades',
      finish: 'Finalizar',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      remove: 'Remover',
      edit: 'Editar',
      save: 'Salvar',
      hours: 'Horas',
      minutes: 'Minutos',
      howLongDidItTake: 'Quanto tempo durou?',
      selectActivityType: 'Selecione o tipo de atividade que você realizou',
      selectPerson: 'Selecione a Pessoa',
      noReturnVisits: 'Nenhuma revisita cadastrada',
      noReturnVisitsDescription: 'Adicione revisitas na aba Campo primeiro',
      noStudents: 'Nenhum estudante cadastrado',
      noStudentsDescription: 'Adicione estudos na aba Estudos primeiro',
      addReturnVisit: 'Adicionar Revisita',
      addStudent: 'Adicionar Estudante',
      totalTime: 'Tempo Total',
      activitySummary: 'Resumo das Atividades',
      sessionSavedSuccess: 'Sessão de ministério cadastrada com sucesso!',
      sessionUpdatedSuccess: 'Sessão de ministério atualizada com sucesso!',
      selectActivityFirst: 'Por favor, selecione uma atividade primeiro',
      invalidTime: 'Por favor, defina um tempo válido (maior que 0)',
      selectedActivity: 'Atividade selecionada',
      setDuration: 'Defina a duração',
      addActivity: 'Adicionar Atividade',
      saveEdit: 'Salvar Edição',
      howMuchTimeDidYouDedicate: 'Quanto tempo você dedicou?',
      activityAdded: 'Atividade adicionada!',
      activityRemoved: 'Atividade removida',
      timeUpdated: 'Tempo atualizado',
      addAtLeastOneActivity: 'Adicione pelo menos uma atividade',
      recordUpdatedSuccess: 'Registro atualizado com sucesso! ✏️',
      timeSavedSuccess: 'Tempo cadastrado com sucesso!',
      activities: 'atividade(s)',
      noReturnVisitRegistered: 'Nenhuma revisita cadastrado',
      noStudyRegistered: 'Nenhum estudo cadastrado',
      registerReturnVisitFirst: 'Cadastre uma revisita primeiro para continuar',
      registerStudyFirst: 'Cadastre um estudo primeiro para continuar',
      continueWithoutSelecting: 'Continuar sem selecionar',
      selectReturnVisit: 'Selecione a revisita',
      selectStudent: 'Selecione o estudante',
      reviewAndComplete: 'Revisar e Concluir',
      lastStepConfirmActivities: 'Última etapa: Confirme suas atividades',
      totalAccumulated: 'Total acumulado',
      activity: 'atividade',
      noActivityAdded: 'Nenhuma atividade adicionada',
      addAtLeastOneActivityToContinue: 'Adicione pelo menos uma atividade para continuar',
      registeredActivities: 'Atividades cadastradas',
      completeRegistration: 'Concluir Cadastro',
      field: 'Campo',
      credit: 'Crédito'
    },
    schedule: {
      title: 'Cronograma da Semana',
      thisWeek: 'Esta Semana',
      nextWeek: 'Próxima Semana',
      lastWeek: 'Semana Passada',
      weeksAhead: 'Daqui a {n} semanas',
      weeksAgo: '{n} semanas atrás',
      today: 'Hoje',
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo',
      free: 'Livre',
      appointment: 'agendamento',
      appointments: 'agendamentos',
      bibleStudy: 'Estudo Bíblico',
      returnVisit: 'Revisita',
      lesson: 'Lição',
      visit: 'visita',
      weekFinished: 'Semana finalizada',
      allDaysPassed: 'Todos os dias desta semana já passaram.',
      seeNextWeek: 'Ver Próxima Semana',
      noActivityScheduled: 'Nenhuma atividade foi agendada',
      noActivityPlanned: 'Nenhuma atividade planejada',
      howItWorks: 'Como funciona?',
      howItWorksDescription: 'Esta tela mostra seus estudos bíblicos agendados (data + horário) e suas revisitas com próxima visita marcada para cada dia da semana.'
    },
    statistics: {
      title: 'Estatísticas',
      goals: 'Metas',
      activities: 'Atividades',
      hours: 'Horas',
      monthlyGoal: 'Meta Mensal',
      yearlyGoal: 'Meta Anual 2025',
      completed: 'Realizado',
      percentComplete: '{n}% concluído',
      remaining: 'Faltam {time}',
      everyHourCounts: 'Cada hora dedicada conta!',
      everyMonthOpportunity: 'Cada mês é uma nova oportunidade!',
      monthlyGoalReached: 'Meta mensal atingida! Continue firme!',
      yearlyGoalReached: 'Meta anual atingida! Que bênção!',
      almostMonthly: 'Falta pouco para sua meta mensal!',
      almostYearly: 'Você está quase lá no seu alvo anual!',
      keepGoing: 'Continue assim! Cada passo importa.',
      summaryOf: 'Resumo de {month}',
      houseToHouse: 'Casa em Casa',
      returnVisit: 'Revisita',
      bibleStudy: 'Estudo Bíblico',
      returnVisits: 'Revisitas',
      bibleStudies: 'Estudos',
      sessions: 'Sessões',
      publicWitnessing: 'Testemunho Público',
      phone: 'Telefone',
      letter: 'Carta',
      informal: 'Informal',
      credit: 'Crédito',
      total: 'Total',
      january: 'janeiro',
      february: 'fevereiro',
      march: 'março',
      april: 'abril',
      may: 'maio',
      june: 'junho',
      july: 'julho',
      august: 'agosto',
      september: 'setembro',
      october: 'outubro',
      november: 'novembro',
      december: 'dezembro',
      serviceYear: 'Ano de serviço {year}',
      inThisMonth: 'neste mês',
      inThisYear: 'neste ano',
      overview: 'Visão Geral',
      activitiesThisMonth: 'atividades este mês',
      occurrencesThisMonth: 'ocorrências este mês',
      activitiesThisMonthCount: 'atividades realizadas este mês',
      returnVisitsCount: 'revisitas',
      studentsCount: 'estudantes',
      activityDistribution: 'Distribuição de Atividades',
      breakdownByActivity: 'Detalhamento por Atividade',
      dedicatedToMinistry: 'dedicadas ao ministério este mês',
      timeDistribution: 'Distribuição de Tempo',
      noOccurrencesThisMonth: 'Nenhuma ocorrência de {activity} este mês',
      noSessionsThisMonth: 'Nenhuma sessão de {activity} este mês',
      serviceYearLabel: 'Ano de Serviço',
      peopleRegistered: 'pessoa cadastrada',
      peopleRegisteredPlural: 'pessoas cadastradas',
      activeStudent: 'estudante ativo',
      activeStudentsPlural: 'estudantes ativos',
      details: 'Detalhes'
    },
    notificationTest: {
      title: 'Testar Notificações',
      studyReminder: 'Lembrete Estudo',
      idealSchedule: 'Cronograma Ideal',
      bibleReading: 'Leitura Bíblia',
      report: 'Relatório',
      forgottenStudy: 'Estudo Esquecido',
      fieldPause: 'Pausa Campo',
      verse: 'Versículo',
      celebration: 'Celebração',
      encouragement: 'Encorajamento',
      dpaExpiring: 'DPA Vencendo',
      welcome: 'Boas-vindas',
      anniversary: 'Aniversário',
      dailyText: 'Texto Diário',
      syncOffline: 'Sync Offline',
      syncComplete: 'Sync Completo',
      description: 'Clique nos botões acima para testar diferentes tipos de notificações'
    },
    common: {
      save: 'Save',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Excluir',
      back: 'Voltar',
      next: 'Próximo',
      confirm: 'Confirmar',
      yes: 'Sim',
      no: 'Não',
      close: 'Fechar',
      ok: 'OK'
    },
    messages: {
      loading: 'Carregando...',
      saving: 'Salvando...',
      deleting: 'Excluindo...',
      success: 'Sucesso!',
      error: 'Erro!',
      noData: 'Nenhum dado encontrado',
      requiredField: 'Este campo é obrigatório'
    }
  },

  'es': {
    nav: {
      inicio: 'Inicio',
      espiritual: 'Espiritual',
      estudos: 'Estudios',
      campo: 'Campo',
      diario: 'Diario',
      leitura: 'Lectura',
      perfil: 'Perfil'
    },
    inicio: 'Inicio',
    espiritual: 'Espiritual',
    estudos: 'Estudios',
    campo: 'Campo',
    perfil: 'Perfil',
    settings: {
      title: 'Configuración',
      subtitle: 'Personaliza tu experiencia',
      appearance: 'Apariencia',
      appearanceDesc: 'Personaliza el tema visual',
      theme: 'Tema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      themeAuto: 'Automático',
      themeLightDesc: 'Tema claro para días soleados',
      themeDarkDesc: 'Tema oscuro para noches o entornos internos',
      themeAutoDesc: 'Tema que se ajusta automáticamente al horario del día',
      language: 'Idioma de la Aplicación',
      languageDesc: 'Elige tu idioma preferido',
      moreLanguages: 'Más idiomas próximamente',
      notifications: 'Notificaciones y Recordatorios',
      notificationsDesc: 'Administra alertas',
      notificationsEnable: 'Habilitar notificaciones',
      notificationsControl: 'Control de notificaciones',
      notificationsReminders: 'Recordatorios',
      notifications24h: '24 horas',
      notifications1h: '1 hora',
      notificationsReceiveFor: 'Recibir notificaciones para:',
      notificationsBibleStudies: 'Estudios Bíblicos',
      notificationsReturnVisits: 'Revisitas',
      notificationsBibleReading: 'Lectura Bíblica',
      notificationsGratitude: 'Agradecimiento',
      notificationsSpiritualGoals: 'Metas Espirituales',
      alertPreferences: 'Preferencias de alerta',
      sound: 'Sonido',
      vibration: 'Vibración',
      languageRegion: 'Idioma y región',
      resetSettings: 'Restablecer configuración',
      redoOnboarding: 'Repetir introducción',
      redoOnboardingDesc: 'Reiniciar la introducción de la aplicación',
      privacyLocal: 'Privacidad local',
      privacyDesc: 'Administra los datos almacenados localmente',
      development: 'Desarrollo',
      developmentDesc: 'Herramientas para desarrolladores',
      about: 'Acerca de Mynis',
      aboutDesc: 'Versión e información'
    },
    studies: {
      title: 'Estudios Bíblicos',
      activeStudies: (count) => `Estudios Activos (${count})`,
      searchPlaceholder: 'Buscar estudiantes...',
      filterAll: 'Todos',
      filterAvailable: 'Disponibles',
      filterHot: 'Calientes',
      filterPaused: 'Inactivos',
      statusAdvanced: 'Avanzado',
      statusProgressing: 'En Progreso',
      statusStarting: 'Iniciando',
      newStudy: 'Nuevo Estudio',
      noStudiesTitle: 'Ningún Estudio Activo',
      noStudiesMessage: 'Aún no tienes estudiantes activos. Comienza un nuevo estudio para seguir tu progreso.',
      noStudiesAction: 'Nuevo Estudio',
      days: {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      }
    },
    field: {
      title: 'Ministerio del Campo',
      subtitle: 'Sus revisitas y territorio',
      newReturn: 'Nueva Revisita',
      editReturn: 'Editar Revisita',
      name: 'Nombre',
      origin: 'Origen',
      originHouseToHouse: 'Casa en casa',
      originWitnessing: 'Testimonio público',
      originBusiness: 'Comercio',
      originOther: 'Otros',
      firstConversation: 'Primera Conversación',
      publications: 'Publicaciones',
      status: 'Estado',
      statusNew: 'Nueva',
      statusHot: 'Caliente',
      statusBusiness: 'Comercio',
      statusRest: 'Descanso',
      interestInStudy: 'Interés en estudiar',
      startStudy: 'Iniciar Estudio'
    },
    diary: {
      title: 'Diario Espiritual',
      subtitle: 'Su crecimiento en el ministerio',
      goals: 'Metas Espirituales',
      monthlyReport: 'Informe del Mes',
      hours: 'Horas',
      placements: 'Publicaciones',
      returnVisits: 'Revisitas',
      studies: 'Estudios'
    },
    reading: {
      title: 'Lectura de la Biblia',
      subtitle: 'Programa cronológico',
      chronological: 'Cronológica',
      progress: 'Progreso',
      todaysReading: 'Lectura de Hoy',
      markAsRead: 'Marcar como Leída',
      completed: 'Completada'
    },
    profile: {
      title: 'Perfil',
      memberOf: 'Miembro de',
      contactInfo: 'Información de Contacto',
      congregation: 'Congregación',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      publisherType: 'Tipo de Publicador',
      pioneerRegular: 'Pionero Regular',
      pioneerAuxiliary: 'Pionero Auxiliar',
      publisher: 'Publicador',
      goal: 'Meta',
      goalHours: (hours) => `Meta de ${hours} horas`,
      emergencyInfo: 'Información de Emergencia',
      dpaValidity: 'Valididad del DPA',
      emergencyContact: 'Contacto de Emergencia',
      editPhoto: 'Editar Foto',
      editInfo: 'Editar Información',
      editEmergency: 'Editar Emergencia',
      settings: 'Configuración',
      settingsSubtitle: 'Personaliza tu experiencia',
      appearance: 'Apariencia',
      appearanceDesc: 'Personaliza el tema visual',
      notifications: 'Notificaciones y Recordatorios',
      notificationsDesc: 'Administra alertas',
      yearText: 'Año',
      currentText: 'Actual',
      yearTextNote: 'Año actual'
    },
    editInfo: {
      title: 'Editar Información',
      subtitle: 'Actualiza tus datos de contacto',
      keepUpdated: 'Mantén tus datos actualizados',
      keepUpdatedDesc: 'Estos datos son importantes para la comunicación con la congregación y para el envío de informes mensuales.',
      profilePhoto: 'Foto de Perfil',
      noPhoto: 'Ninguna foto seleccionada',
      choosePhoto: 'Elegir Foto',
      photoNote: 'Tu foto aparecerá en las pantallas de Inicio y Perfil. Formatos aceptados: JPG, PNG, GIF (máx. 5MB)',
      congregationLabel: 'Congregación:',
      congregationPlaceholder: 'Escribe el nombre completo de tu congregación',
      emailLabel: 'Correo electrónico:',
      emailNote: 'Usado para enviar informes y comunicaciones',
      phoneLabel: 'Teléfono:',
      phoneNote: 'Número de contacto con código de área',
      preview: 'Vista previa',
      saveInfo: 'Guardar Información'
    },
    editPublisherType: {
      title: 'Tipo de Publicador',
      subtitle: 'Escolha su tipo de servicio',
      regularPublisher: 'Publicador Regular',
      regularPublisherDesc: 'Meta sugerida de 10 horas mensuales',
      regularPublisherGoal: 'Meta: 10h/mes',
      auxiliaryPioneer15: 'Pionero Auxiliar (15h)',
      auxiliaryPioneer15Desc: 'Compromiso de 15 horas mensuales',
      auxiliaryPioneer15Goal: 'Meta: 15h/mes',
      auxiliaryPioneer30: 'Pionero Auxiliar (30h)',
      auxiliaryPioneer30Desc: 'Compromiso de 30 horas mensuales',
      auxiliaryPioneer30Goal: 'Meta: 30h/mes',
      regularPioneer: 'Pionero Regular',
      regularPioneerDesc: 'Compromiso de 50 horas mensuales',
      regularPioneerGoal: 'Meta: 50h/mes',
      tipTitle: 'Consejo: La meta mensual se ajusta automáticamente según el tipo seleccionado.',
      tipDesc: 'Puede seguir su progreso en la pantalla de Inicio y en el tarjeta de Informe Mensual.',
      cancel: 'Cancelar',
      saveChanges: 'Guardar Cambios'
    },
    editYearText: {
      title: 'Editar Texto del Año',
      subtitle: 'Personaliza el versículo de la pantalla inicial',
      howItWorks: '¿Cómo funciona?',
      howItWorksDesc: 'Este texto aparecerá en la parte superior de la pantalla de Inicio, justo debajo del saludo. Elige un versículo que inspire tu viaje espiritual.',
      tip: 'Consejo: Puedes usar el tema anual de la Organización o elegir un texto personal.',
      biblicalTextLabel: 'Texto Bíblico:',
      biblicalTextPlaceholder: 'Escribe el versículo completo entre comillas',
      biblicalRefLabel: 'Referencia Bíblica:',
      biblicalRefPlaceholder: 'Escribe el libro, capítulo y versículo',
      preview: 'Vista previa',
      yearTextTitle: 'Texto del Año',
      saveYearText: 'Guardar Texto del Año'
    },
    emergency: {
      title: 'Información de Emergencia',
      subtitle: 'Mantenga sus datos médicos actualizados',
      aboutDPA: 'Sobre el Documento de Instrucciones Médicas (DPA)',
      aboutDPAText: 'El DPA garantiza que sus decisiones médicas sean respetadas. Mantenga la validez siempre actualizada y compártala con familiares y ancianos de la congregación.',
      docValidity: 'Validez del Documento',
      validityLabel: 'Validez del DPA',
      validityHelp: 'Seleccione la fecha de validez de su DPA',
      emergencyContacts: 'Contactos de Emergencia',
      contactLabel: 'Nombre del Contacto',
      contactPlaceholder: 'Nombre completo del contacto de emergencia',
      contactHelp: 'Persona que debe ser contactada en caso de emergencia',
      phoneLabel: 'Teléfono',
      phonePlaceholder: '(00) 00000-0000',
      phoneHelp: 'Número de teléfono del contacto de emergencia',
      additionalMedicalInfo: 'Información Médica Adicional',
      allergiesLabel: 'Alergias e Información Médica',
      allergiesPlaceholder: 'Ej: Alergia a penicilina, usa medicación para presión alta...',
      allergiesHelp: 'Registre alergias, medicamentos continuos o condiciones importantes',
      summary: 'Resumen de Información',
      dpaValidity: 'Validez del DPA',
      status: 'Estado',
      emergencyContact: 'Contacto de Emergencia',
      phoneNumber: 'Teléfono',
      allergies: 'Alergias',
      saveButton: 'Guardar Información',
      statusNotFilled: 'No completado',
      statusExpired: 'DPA Expirado',
      statusExpiringSoon: (days) => `Expira en ${days} ${days === 1 ? 'día' : 'días'}`,
      statusExpiringMonths: (months) => `Válido por ${months} ${months === 1 ? 'mes' : 'meses'}`,
      statusValid: 'DPA Válido',
      toastErrorValidityTitle: 'Fecha de validez obligatoria',
      toastErrorValidityDesc: 'Por favor, informe la fecha de validez del DPA',
      toastErrorContactTitle: 'Contacto obligatorio',
      toastErrorContactDesc: 'Por favor, informe el nombre del contacto de emergencia',
      toastErrorPhoneTitle: 'Teléfono obligatorio',
      toastErrorPhoneDesc: 'Por favor, informe el teléfono del contacto de emergencia',
      toastExpiredTitle: 'DPA Expirado',
      toastExpiredDesc: 'La fecha de validez del DPA ya pasó. Por favor, renueve su documento.',
      toastExpiringTitle: 'DPA próximo a expirar',
      toastExpiringDesc: (days) => `Su DPA expira en ${days} ${days === 1 ? 'día' : 'días'}. Considere renovarlo pronto.`,
      toastSuccessTitle: '¡Información guardada!',
      toastSuccessDesc: 'Su información de emergencia ha sido actualizada con éxito'
    },
    studiesTab: {
      title: 'Estudios Bíblicos',
      subtitle: 'Estudios Ativos',
      searchPlaceholder: 'Buscar estudantes...',
      filterAll: 'Todos',
      filterActive: 'Ativos',
      filterPaused: 'Pausados',
      filterCompleted: 'Concluídos',
      filterToday: 'Hoy',
      filterRest: 'Para Descanso',
      statusStarting: 'Iniciando',
      statusInProgress: 'En Progreso',
      statusAdvanced: 'Avanzado',
      statusWithDoubt: 'Con dúvidas',
      studyScheduledToday: 'Estudio Agendado para Hoy',
      prepareConversation: 'Preparese para una ótima conversa!',
      newStudy: 'Nuevo Estudio',
      today: 'Hoy',
      daysAgo: (days) => days === 1 ? 'Há 1 dia' : `Há ${days} dias`,
      monday: 'lunes',
      tuesday: 'martes',
      wednesday: 'miércoles',
      thursday: 'jueves',
      friday: 'viernes',
      saturday: 'sábado',
      sunday: 'domingo',
      emptyTitle: 'Ningún estudio aún',
      emptyDescription: 'Aún no tienes estudios registrados. Comienza agregando tu primer estudio bíblico!',
      emptyAction: 'Agregar Primer Estudio',
      viewDetails: 'Ver Detalles',
      todayBanner: (count) => `Tienes ${count} ${count === 1 ? 'estudio' : 'estudios'} agendado${count === 1 ? '' : 's'} para hoy. Preparate para conversaciones excelentes!`
    },
    fieldTab: {
      title: 'Ministério de Campo',
      subtitle: (count) => `Revisitas (${count})`,
      searchPlaceholder: 'Buscar revisitas...',
      filterAll: 'Todos',
      filterAvailable: 'Disponibles',
      filterHot: 'Calientes',
      filterRevisit: 'Revisitas',
      availableBannerText: 'Revisitas disponibles para hoy',
      firstVisit: 'Primera Visita',
      today: 'Hoy',
      daysAgo: (days) => days === 1 ? 'Há 1 dia' : `Há ${days} dias`,
      dayAgo: 'Há 1 dia',
      revisitUrgent: 'Revisita Urgente',
      statusNew: 'Nueva',
      statusHot: 'Caliente',
      statusCommerce: 'Comercio',
      statusRest: 'Descanso',
      emptyTitle: 'Nenhuma revisita disponível',
      emptyDescription: 'Quando você iniciar revisitas com as pessoas, elas aparecerão aqui para você acompanhar o progresso de cada uma.',
      emptySearchDescription: 'Nenhuma revisita encontrada para os critérios de pesquisa.',
      studyStartedToast: 'Estudo Iniciado',
      studyStartedDescription: (name) => `Estudo con ${name} iniciado con sucesso!`
    },
    returnVisitDetails: {
      visits: (count) => `Revisitas (${count})`,
      contactInfo: 'Información de Contacto',
      fullName: 'Nombre Completo',
      phone: 'Teléfono',
      call: 'Llamar',
      whatsapp: 'WhatsApp',
      fullAddress: 'Dirección Completa',
      viewOnMap: 'Ver en Mapa',
      lastVisit: 'Última Revisita',
      date: 'Fecha',
      daysAgo: (days) => days === 1 ? 'Há 1 día' : `Há ${days} días`,
      nextVisitScheduled: 'Próxima Revisita Agendada',
      reminderSet: 'Recordatorio Definido',
      firstConversation: 'Primera Conversa',
      additionalDetails: 'Detalles Adicionales',
      contactOrigin: 'Origen del Contacto',
      originInformalWitnessing: 'Testimonio Informal',
      originHouseToHouse: 'Casa en Casa',
      originPublicWitnessing: 'Testimonio Público',
      originBusiness: 'Comercio',
      originOther: 'Otros',
      dateAdded: 'Fecha de Adición',
      publicationsDelivered: 'Publicaciones Entregues',
      summary: 'Resumen',
      totalVisits: 'Total de Revisitas',
      daysSinceLast: 'Días Desde la Última Revisita',
      registerNewVisit: 'Registrar Nueva Revisita',
      dangerZone: 'Zona de Peligro',
      dangerZoneWarning: 'Eliminar esta revisita la eliminará permanentemente.',
      removeReturnVisit: 'Eliminar Revisita',
      confirmRemoval: 'Confirmar Eliminación',
      confirmRemovalMessage: (name) => `¿Estás seguro de que deseas eliminar la revisita con ${name}?`,
      cancel: 'Cancelar',
      remove: 'Eliminar',
      returnVisitNotFound: 'Revisita no encontrada',
      back: 'Volver',
      phoneNotRegistered: 'Teléfono no registrado',
      addressNotRegistered: 'Dirección no registrada',
      returnVisitRemoved: 'Revisita eliminada con éxito',
      edit: 'Editar',
      statusNew: 'Nueva',
      statusHot: 'Caliente',
      statusBusiness: 'Comercio',
      statusRest: 'Descanso',
      interestInStudyBadge: 'Interés en estudiar',
      convertToStudy: 'Convertir en Estudio Bíblico',
      observations: 'Observaciones',
      publicationsLeft: 'Publicaciones Dejadas',
      visitHistory: 'Historial de Visitas',
      found: 'Encontró',
      notFound: 'No encontró',
      mostRecent: 'Más reciente',
      scheduledFor: 'Agendado para',
      availability: 'Disponibilidad',
      notInformed: 'No informada',
      neverVisited: 'Nunca visitado',
      firstConversationTitle: 'Primera Conversación',
      dangerZoneWarningFull: 'Al eliminar esta revisita, todos los datos se eliminarán permanentemente. Esta acción no se puede deshacer.',
      confirmRemovalFull: (name: string) => `¿Está seguro de que desea eliminar la revisita con <strong>${name}</strong>? Esta acción no se puede deshacer.`,
      totalVisitsLabel: 'Total de visitas',
      daysSinceLastLabel: 'Días desde la última',
      visitHistoryTitle: (count: number) => `Historial de Visitas (${count})`,
      publicationsLeftLabel: 'Publicaciones dejadas:',
      scheduledForLabel: 'Agendado para:'
    },
    fab: {
      newStudy: 'Nuevo Estudio',
      newReturnVisit: 'Nueva Revisita',
      newActivity: 'Nueva Actividad',
      paused: 'Pausado'
    },
    studyDetails: {
      title: 'Detalles del Estudio',
      contactInfo: 'Información de Contacto',
      fullName: 'Nombre Completo',
      phone: 'Teléfono',
      call: 'Llamar',
      whatsapp: 'WhatsApp',
      fullAddress: 'Dirección Completa',
      viewOnMap: 'Ver en Mapa',
      studyDetails: 'Detalles del Estudio',
      publication: 'Publicación',
      progress: 'Progreso',
      nextStudy: 'Próximo Estudio',
      today: 'Hoy',
      observations: 'Observaciones',
      dangerZone: 'Zona de Peligro',
      dangerZoneWarning: 'Eliminar este estudio lo eliminará permanentemente.',
      removeStudy: 'Eliminar Estudio',
      confirmRemoval: 'Confirmar Eliminación',
      confirmRemovalMessage: (name) => `¿Estás seguro de que deseas eliminar el estudio con ${name}?`,
      cancel: 'Cancelar',
      remove: 'Eliminar',
      studyNotFound: 'Estudio no encontrado',
      back: 'Volver',
      phoneNotRegistered: 'Teléfono no registrado',
      addressNotRegistered: 'Dirección no registrada',
      studyRemoved: 'Estudio eliminado con éxito'
    },
    studyForm: {
      newStudyTitle: 'Nuevo Estudio',
      editStudyTitle: 'Editar Estudio',
      newStudySubtitle: 'Adicione un nuevo estudio para seguir su progreso',
      editStudySubtitle: 'Actualice los detalles del estudio',
      conversionBannerTitle: 'Conversión!',
      conversionBannerDescription: (name) => `${name} ha sido convertido!`,
      contactInfo: 'Información de Contacto',
      fullNameLabel: 'Nombre Completo:',
      fullNamePlaceholder: 'Escriba el nombre completo',
      phoneLabel: 'Teléfono:',
      phonePlaceholder: 'Escriba el número de teléfono',
      addressLabel: 'Dirección Completa:',
      addressPlaceholder: 'Escriba la dirección completa',
      studyDetails: 'Detalles del Estudio',
      publicationLabel: 'Publicación:',
      publicationOptions: {
        option1: 'Publicación 1',
        option2: 'Publicación 2',
        option3: 'Publicación 3',
        option4: 'Publicación 4'
      },
      statusLabel: 'Estado:',
      statusOptions: {
        starting: {
          name: 'Iniciando',
          description: 'El estudio está comenzando'
        },
        progressing: {
          name: 'En Progreso',
          description: 'El estudio está en curso'
        },
        doubts: {
          name: 'Con Dudas',
          description: 'El estudio tiene dudas'
        },
        advanced: {
          name: 'Avanzado',
          description: 'El estudio está avanzado'
        }
      },
      schedulingTitle: 'Agendamiento',
      nextDateLabel: 'Próxima Fecha:',
      timeLabel: 'Hora:',
      observationsTitle: 'Observaciones',
      observationsPlaceholder: 'Escriba cualquier observación importante',
      dangerZoneTitle: 'Zona de Peligro',
      dangerZoneWarning: 'Eliminar este estudio lo eliminará permanentemente.',
      deleteStudy: 'Eliminar Estudio',
      saveChanges: 'Guardar Cambios',
      createStudy: 'Crear Estudio',
      validationErrors: {
        nameRequired: 'El nombre completo es obligatorio',
        addressRequired: 'La dirección completa es obligatoria',
        publicationRequired: 'La publicación es obligatoria'
      },
      successMessages: {
        updated: 'Estudio actualizado con éxito!',
        created: 'Estudio creado con éxito!',
        createdDescription: (name) => `Estudio con ${name} creado con éxito!`,
        deleted: 'Estudio eliminado con éxito!'
      },
      deleteConfirmation: (name) => `¿Está seguro de que desea eliminar el estudio con ${name}?`
    },
    returnVisitForm: {
      newTitle: 'Nueva Revisita',
      editTitle: 'Editar Revisita',
      newSubtitle: 'Complete la información',
      editSubtitle: 'Actualice la información',
      contactInfo: 'Información de Contacto',
      fullNameLabel: 'Nombre completo *',
      fullNamePlaceholder: 'Ej: María Silva',
      phoneLabel: 'Teléfono (opcional)',
      phonePlaceholder: '(00) 00000-0000',
      addressLabel: 'Dirección completa *',
      addressPlaceholder: 'Calle, número, barrio, ciudad',
      placeType: 'Tipo de Local',
      placeTypeOptions: {
        house: 'Casa',
        building: 'Edificio',
        business: 'Comercio'
      },
      status: 'Estado de la Revisita',
      statusOptions: {
        new: 'Nueva',
        interested: 'Interesado',
        hot: 'Caliente',
        resting: 'Descanso'
      },
      firstConversation: 'Primera Conversación',
      firstConversationLabel: '¿De qué hablaron? *',
      firstConversationPlaceholder: 'Ej: Mostró interés en saber sobre el Reino de Dios...',
      additionalDetails: 'Detalles Adicionales',
      availabilityLabel: 'Disponibilidad',
      availabilityPlaceholder: 'Ej: Sábados por la mañana',
      scheduledDateLabel: 'Fecha Programada para Regresar',
      scheduledDateHint: '¿Cuándo el residente pidió que regresaras?',
      publicationsLabel: 'Publicaciones Dejadas',
      publicationsPlaceholder: 'Ej: ¡Buenos días!, ¿Qué dice la Biblia?',
      publicationsHint: 'Separe por coma',
      observationsLabel: 'Observaciones',
      observationsPlaceholder: 'Otras notas importantes...',
      studyInterest: 'Esta persona mostró interés en estudiar la Biblia',
      dangerZone: 'Zona de Peligro',
      dangerZoneWarning: 'Al eliminar esta revisita, todos los datos serán eliminados permanentemente. Esta acción no se puede deshacer.',
      deleteReturnVisit: 'Eliminar Revisita',
      saveChanges: 'Guardar Cambios',
      createReturnVisit: 'Registrar Revisita',
      validationErrors: {
        nameRequired: 'Necesitamos el nombre de la persona',
        addressRequired: 'Necesitamos la dirección',
        firstConversationRequired: 'Cuéntanos cómo fue la primera conversación'
      },
      successMessages: {
        updated: 'Revisita actualizada',
        created: '¡Revisita registrada!',
        deleted: 'Revisita eliminada'
      },
      deleteConfirmation: (name) => `¿Está seguro de que desea eliminar la revisita de ${name}?\n\nEsta acción no se puede deshacer.`
    },
    spiritualTab: {
      onboardingTitle: 'Preparando el Terreno',
      onboardingSubtitle: 'Tu base espiritual para sembrar semillas',
      bibleReadingTitle: 'Lectura de la Biblia',
      bibleReadingSetup: 'Configura tu plan de lectura',
      bibleReadingTrack: 'Sigue tu progreso espiritual',
      gratitudeTitle: 'Diario de Gratitud',
      gratitudeStart: 'Comienza registrando por qué estás agradecido hoy',
      gratitudeStrength: 'Cultivar la gratitud fortalece tu espiritualidad',
      goalsTitle: 'Metas Espirituales',
      goalsEstablish: 'Establece tus metas espirituales',
      worshipIdeasTitle: '¿Sin ideas para la adoración?',
      suggestIdea: 'Sugerir una Idea'
    },
    emptyStateBible: {
      headerTitle: 'Comienza tu viaje',
      headerSubtitle: 'Configura tu lectura',
      ctaTitle: 'Configura tu lectura',
      ctaDescription: 'Para comenzar, configura tus preferencias de lectura de la Biblia',
      ctaButton: 'Ir a Configuración',
      benefitsTitle: 'Lo que vas a lograr:',
      benefit1Title: 'Metas Personalizadas',
      benefit1Description: 'Elige cuántos capítulos leer por día según tu rutina',
      benefit2Title: 'Seguimiento Diario',
      benefit2Description: 'Registra tus lecturas y mantén una racha de días consecutivos',
      benefit3Title: 'Logros y Reflexiones',
      benefit3Description: 'Desbloquea logros y registra tus reflexiones espirituales',
      toastSuccess: '¡Plan configurado con éxito!',
      toastDescription: 'Comienza tu viaje de lectura ahora'
    },
    bibleSettingsPage: {
      headerTitle: 'Configuración',
      headerSubtitle: 'Personaliza tu experiencia',
      planTypeTitle: 'Tipo de Plan',
      planTypeDesc: 'Elige cómo quieres leer la Biblia',
      chronological: 'Cronológico',
      chronologicalDesc: 'Lee la Biblia en orden histórico de los eventos',
      thematic: 'Temático',
      thematicDesc: 'Explora temas y asuntos bíblicos específicos',
      sequential: 'Secuencial',
      sequentialDesc: 'Lee del Génesis al Apocalipsis en orden',
      dailyGoalTitle: 'Meta Diaria',
      dailyGoalDesc: '¿Cuántos capítulos quieres leer por día?',
      oneChapter: '1 capítulo por día',
      oneChapterDesc: 'Ritmo tranquilo y reflexivo',
      threeChapters: '3 capítulos por día',
      threeChaptersDesc: 'Ritmo moderado y equilibrado',
      fiveChapters: '5 capítulos por día',
      fiveChaptersDesc: 'Ritmo intenso y dedicado',
      notificationsTitle: 'Notificaciones',
      notificationsDesc: 'Configura recordatorios para tu rutina de lectura',
      dailyReminder: 'Recordatorio diario',
      dailyReminderDesc: 'Recibe un recordatorio para leer todos los días a las 9h',
      reflectionReminder: 'Recordatorio de reflexión',
      reflectionReminderDesc: 'Incentivo para meditar sobre lo que leíste',
      summaryTitle: 'Resumen de la Configuración',
      readingPlan: 'Plan de lectura:',
      dailyGoal: 'Meta diaria:',
      reminders: 'Recordatorios:',
      allActive: 'Todos activos',
      partiallyActive: 'Parcialmente activos',
      disabled: 'Desactivados',
      saveButton: 'Guardar Configuración',
      resetDialogTitle: '¿Reiniciar Progreso?',
      resetDialogDesc: 'Cambiar el plan de lectura o meta diaria reiniciará tu progreso actual incluyendo lecturas, racha, logros y reflexiones.',
      resetDialogWarning: 'Esta acción reiniciará los siguientes datos:',
      completedReadings: 'Lecturas completadas',
      streakDays: 'Días de racha',
      unlockedAchievements: 'Logros desbloqueados',
      registeredReflections: 'Reflexiones registradas',
      resetDialogTip: 'Comenzarás un nuevo viaje de lectura con la nueva configuración.',
      cancel: 'Cancelar',
      confirmReset: 'Confirmar Reinicio',
      toastSaved: 'Configuración guardada',
      toastSavedDesc: 'Tus preferencias fueron actualizadas',
      toastReset: 'Progreso reiniciado',
      toastResetDesc: '¡Tu nueva configuración fue guardada. Comenzarás desde cero!',
      
      planTypeTitle: 'Tipo de Plan',
      planTypeSubtitle: 'Elige cómo deseas leer la Biblia',
      dailyGoalTitle: 'Meta Diaria',
      dailyGoalSubtitle: '¿Cuántos capítulos quieres leer por día?',
      oneChapterShort: '1 capítulo por día',
      oneChapterPace: 'Ritmo tranquilo y reflexivo',
      threeChaptersShort: '3 capítulos por día',
      threeChaptersPace: 'Ritmo moderado y equilibrado',
      fiveChaptersShort: '5 capítulos por día',
      fiveChaptersPace: 'Ritmo intenso y dedicado',
      notificationsTitle: 'Notificaciones',
      notificationsSubtitle: 'Configura recordatorios para tu rutina de lectura',
      dailyReminderShort: 'Recordatorio diario',
      dailyReminderShortDesc: 'Recibe un recordatorio para leer todos los días a las 9h',
      reflectionReminderShort: 'Recordatorio de reflexión',
      reflectionReminderShortDesc: 'Incentivo para meditar sobre lo que leíste',
      summaryTitle: 'Resumen de Configuración',
      summaryPlan: 'Plan de lectura:',
      summaryGoal: 'Meta diaria:',
      summaryReminders: 'Recordatorios:',
      remindersAll: 'Todos activos',
      remindersPartial: 'Parcialmente activos',
      remindersNone: 'Desactivados',
      saveButton: 'Guardar Configuración',
      toastSaveSuccess: 'Configuración guardada',
      toastSaveSuccessDesc: 'Tus preferencias fueron actualizadas',
      
      resetDialogTitle: '¿Reiniciar Progreso?',
      resetDialogDescription: 'Cambiar el plan de lectura o meta diaria reiniciará tu progreso actual incluyendo lecturas, ofensiva, conquistas y reflexiones.',
      resetDialogText: 'Esta acción',
      resetDialogTextBold: 'reiniciará',
      resetDialogTextContinue: 'los siguientes datos:',
      resetItem1: 'Lecturas completadas',
      resetItem2: 'Días de ofensiva',
      resetItem3: 'Conquistas desbloqueadas',
      resetItem4: 'Reflexiones registradas',
      resetDialogTip: 'Comenzarás una nueva jornada de lectura con la nueva configuración.',
      resetDialogCancel: 'Cancelar',
      resetDialogConfirm: 'Confirmar Reinicio'
    },
    bibleOnboarding: {
      headerTitle: 'Configura tu Plan',
      step: 'Paso',
      stepOf: 'de',
      step1Title: 'Elige tu Programa de Lectura',
      step1Subtitle: 'Selecciona la forma que mejor se adapta a ti',
      chronological: 'Cronológico',
      chronologicalDesc: 'Lee los 1189 capítulos en orden histórico de los eventos. Job después de la creación, Salmos durante el reino de David',
      chronologicalShort: 'Lee la Biblia en orden histórico de los eventos',
      sequential: 'Secuencial',
      sequentialDesc: 'Lee del Génesis al Apocalipsis en el orden tradicional de los libros, comenzando por el AT y siguiendo al NT',
      sequentialShort: 'Lee del Génesis al Apocalipsis en orden',
      thematic: 'Temático',
      thematicDesc: 'Explora 10 temas bíblicos: fe, sabiduría, amor, oración, ministerio, perseverancia y vida de Jesús',
      thematicShort: 'Explora temas y asuntos bíblicos específicos',
      step2Title: 'Define tu Meta Diaria',
      step2Subtitle: 'Elige cuántos capítulos quieres leer por día',
      oneChapter: '1 capítulo por día',
      oneChapterDesc: 'Aproximadamente 5 minutos diarios · Lectura reflexiva',
      threeChapters: '3 capítulos por día',
      threeChaptersDesc: 'Aproximadamente 15 minutos diarios · Ritmo equilibrado',
      fiveChapters: '5 capítulos por día',
      fiveChaptersDesc: 'Aproximadamente 25 minutos diarios · Ritmo más dedicado',
      step2Tip: 'Consejo: Comienza con 3 capítulos por día. Puedes ajustar tu meta en cualquier momento en la configuración.',
      step3Title: 'Configuración Final',
      step3Subtitle: '¿Deseas recibir recordatorios para ayudarte?',
      dailyReminder: 'Recordatorio diario de lectura',
      dailyReminderDesc: 'Recibe una notificación todos los días a las 9h para no olvidar tu lectura',
      reflectionReminder: 'Recordatorio de reflexión',
      reflectionReminderDesc: 'Recibe incentivos para meditar y aplicar lo que aprendiste',
      step3Message: '¡Estás listo para comenzar! Sigue tu progreso de lectura y mantén una rutina regular de estudio de la Palabra de Dios.',
      continueButton: 'Continuar',
      startReadingButton: 'Comenzar a Leer'
    },
    markReadingDialog: {
      title: 'Marcar Lectura',
      youRead: 'Leíste:',
      addReflection: 'Agregar Reflexión (opcional)',
      yourReflection: 'Tu Reflexión',
      remove: 'Quitar',
      whatDidYouLearn: '¿Qué aprendiste?',
      whatDidYouLearnPlaceholder: 'Escribe aquí lo que aprendiste...',
      howCanYouApply: '¿Cómo puedes aplicarlo?',
      howCanYouApplyPlaceholder: 'Escribe cómo puedes aplicarlo en tu vida...',
      keywordOfTheDay: 'Palabra clave del día',
      keywordPlaceholder: 'Ej: Amor, Fe, Perseverancia...',
      cancel: 'Cancelar',
      markAsRead: 'Marcar como Leído'
    },
    biblePage: {
      headerTitle: 'Lectura de la Biblia',
      headerSubtitle: 'Tu base espiritual para sembrar semillas',
      nextReading: 'Próxima lectura:',
      completed: 'Completado',
      alreadyRead: 'Ya leí hoy',
      markAsRead: 'Marcar como Leído',
      streakDays: 'Días de racha',
      record: 'Récord',
      yourProgress: 'Tu Progreso',
      readingPlan2025: 'Plan de Lectura 2025',
      chapters: 'Capítulos',
      books: 'Libros',
      consecutiveDays: 'Días consecutivos',
      achievements: 'Logros',
      achievementFirstWeek: 'Inicio\nHumilde',
      achievementWeekComplete: 'Semana\nCompleta',
      achievementTwoWeeks: 'Lector\nDedicado',
      achievementMonthComplete: 'Lector\nVoraz',
      achievement3Days: '3 Días Consecutivos',
      achievement7Days: 'Semana Completa',
      achievement14Days: '14 Días Consecutivos',
      achievement30Days: 'Mes Completo',
      motivationalNoAchievements: '¡Sigue leyendo para desbloquear logros!',
      motivationalSomeAchievements: (count: number) => `¡Has desbloqueado ${count} de 4 logros! ¡Sigue así!`,
      motivationalAllAchievements: '¡Felicitaciones! ¡Has desbloqueado todos los logros!',
      recentReflections: 'Reflexiones Recientes',
      toastConfigured: '¡Plan configurado con éxito!',
      toastConfiguredDesc: 'Comienza tu viaje de lectura ahora',
      toastAlreadyRead: '¡Ya registraste tu lectura hoy!',
      toastAlreadyReadDesc: 'Continúa mañana para mantener tu racha',
      toastReadingRegistered: '¡Lectura registrada!',
      toastReadingRegisteredDesc: (book: string, chapter: string) => `${book} ${chapter} completado`,
      toastNewAchievement: '¡Nuevo Logro Desbloqueado!'
    },
    gratitudeDiary: {
      headerTitle: 'Diario de Gratitud',
      headerSubtitle: 'Cultivando un corazón agradecido',
      whyTitle: '¿Por qué cultivar gratitud?',
      whyDescription: 'Registrar aquello por lo que estamos agradecidos fortalece nuestra espiritualidad y nos ayuda a ver las bendiciones de Jehová en nuestra vida. La Biblia nos anima a ser agradecidos en todas las circunstancias.',
      bibleVerse: '"Sean agradecidos." — Colosenses 3:15',
      startTitle: 'Comienza tu diario',
      startDescription: 'Registra aquello por lo que estás agradecido hoy',
      startTip: 'Haz clic en el botón + abajo para agregar tu primera entrada',
      summaryTitle: 'Resumen',
      totalRecords: 'Total de registros',
      daysPracticing: 'Días practicando',
      toastDeleted: 'Eliminaste la entrada',
      addButtonLabel: 'Agregar nueva gratitud',
      toastReportSaved: 'Tu reflexión fue guardada en el Diario de Gratitud'
    },
    newGratitude: {
      headerTitleNew: 'Nueva Gratitud',
      headerTitleEdit: 'Editar Gratitud',
      headerSubtitleNew: '¿Qué te hizo sentir agradecido hoy?',
      headerSubtitleEdit: 'Actualiza tu gratitud',
      dateLabel: 'Fecha',
      gratitudeLabel: '¿Por qué estás agradecido?',
      gratitudePlaceholder: 'Ej: Jehová me dio fuerzas para superar un desafío hoy...',
      buttonSaveNew: 'Guardar Gratitud',
      buttonSaveEdit: 'Actualizar Gratitud',
      toastErrorEmpty: 'Escribe algo por lo que estés agradecido',
      toastSuccessNew: '¡Gratitud registrada!',
      toastSuccessNewDesc: 'Guardada en tu Diario de Gratitud',
      toastSuccessEdit: '¡Gratitud actualizada!',
      toastSuccessEditDesc: 'Cambios guardados con éxito'
    },
    spiritualGoals: {
      headerTitle: 'Metas Espirituales',
      headerSubtitle: (count: number) => `${count} ${count === 1 ? 'meta activa' : 'metas activas'}`,
      whyTitle: '¿Por qué tener metas espirituales?',
      whyDescription: 'Establecer metas espirituales nos ayuda a crecer en nuestra relación con Jehová y nos motiva a progresar espiritualmente. Son como mapas que guían nuestro viaje cristiano.',
      bibleVerse: '"Asegúrense de las cosas más importantes." — Filipenses 1:10',
      startTitle: 'Establece tu primera meta',
      startDescription: 'Comienza creando una meta espiritual para tu viaje',
      startTip: 'Haz clic en el botón + abajo para crear tu primera meta',
      sectionInProgress: 'En Progreso',
      sectionPaused: 'Pausadas',
      sectionCompleted: 'Completadas',
      summaryTitle: 'Resumen',
      summaryInProgress: 'En progreso',
      summaryCompleted: 'Completadas',
      summaryPaused: 'Pausadas',
      buttonEdit: 'Editar',
      buttonPause: 'Pausar',
      buttonComplete: 'Completar',
      buttonResume: 'Reanudar',
      newGoalTitle: 'Nueva Meta Espiritual',
      newGoalSubtitle: 'Establece un objetivo espiritual',
      fieldGoalTitle: '¿Cuál es tu meta?',
      fieldGoalPlaceholder: 'Ej: Leer toda la Biblia',
      fieldMeta: 'Meta (opcional)',
      fieldMetaPlaceholder: 'Ej: 3 capítulos por día',
      fieldDeadline: 'Plazo (opcional)',
      buttonCreate: 'Crear Meta',
      toastSuccess: '¡Meta creada!',
      toastError: 'Necesitamos un título para la meta'
    },
    home: {
      greetingMorning: 'Buenos días',
      greetingAfternoon: 'Buenas tardes',
      greetingEvening: 'Buenas noches',
      yearText: 'Texto del Año',
      progressTitle: 'Progreso',
      progressOf: 'de',
      progressMonth: 'mes',
      statusAhead: 'Adelantado',
      statusOnTrack: 'En Ritmo',
      statusBehind: 'Atrasado',
      messageAhead: '¡Felicitaciones! ¡Estás por delante de la meta!',
      messageOnTrack: '¡Sigue así! ¡Vas por buen camino!',
      messageBehind: '¡No te desanimes! ¡Puedes alcanzar tu meta!',
      scheduleTitle: 'Cronograma de la Semana',
      scheduleStudy: 'estudio',
      scheduleStudies: 'estudios',
      scheduleReturnVisit: 'revisita',
      scheduleReturnVisits: 'revisitas',
      scheduleFree: 'Libre',
      statisticsTitle: 'Estadísticas',
      annualGoal: 'Meta Anual',
      accomplished: 'Realizado',
      completed: 'completado',
      remaining: 'Faltan',
      studies: 'Estudios',
      returnVisits: 'Revisitas',
      tapForDetails: 'Toca para ver detalles completos',
      publisherRegular: 'Publicador',
      publisherAuxiliary: 'Pionero Auxiliar',
      publisherRegularPioneer: 'Pionero Regular',
      publisherSpecialPioneer: 'Pionero Especial',
      publisherCircuitOverseer: 'Superintendente de Circuito',
      dayMonday: 'Lun',
      dayTuesday: 'Mar',
      dayWednesday: 'Mié',
      dayThursday: 'Jue',
      dayFriday: 'Vie',
      daySaturday: 'Sáb',
      daySunday: 'Dom'
    },
    progress: {
      title: 'Progreso del Mes',
      ministry: 'Ministerio',
      goalAchieved: '¡Meta alcanzada!',
      of: 'de',
      month: 'mes',
      congratsGoalReached: '¡Felicitaciones! ¡Has alcanzado tu meta mensual!',
      keepGoingGreat: '¡Sigue así, lo estás haciendo muy bien!',
      activityHistory: 'Historial de Actividades',
      noRecordsThisMonth: 'No hay registros este mes',
      useButtonToAdd: 'Usa el botón "+" para agregar tus actividades.',
      noRecordsForMonth: 'No hay registros para este mes.',
      fieldMinistry: 'Ministerio de Campo',
      creditTime: 'Tiempo de Crédito',
      edit: 'Editar',
      delete: 'Eliminar',
      deleteRecordTitle: '¿Eliminar Registro?',
      deleteRecordDescription: '¿Estás seguro de que deseas eliminar este registro de ministerio?',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      deleteSuccess: 'Registro eliminado con éxito',
      monthJanuary: 'Enero',
      monthFebruary: 'Febrero',
      monthMarch: 'Marzo',
      monthApril: 'Abril',
      monthMay: 'Mayo',
      monthJune: 'Junio',
      monthJuly: 'Julio',
      monthAugust: 'Agosto',
      monthSeptember: 'Septiembre',
      monthOctober: 'Octubre',
      monthNovember: 'Noviembre',
      monthDecember: 'Diciembre',
      weekdayMonday: 'lunes',
      weekdayTuesday: 'martes',
      weekdayWednesday: 'miércoles',
      weekdayThursday: 'jueves',
      weekdayFriday: 'viernes',
      weekdaySaturday: 'sábado',
      weekdaySunday: 'domingo',
      activityHouseToHouse: 'Casa en Casa',
      activityPublicWitnessing: 'Testimonio Público',
      activityByPhone: 'Por Teléfono',
      activityByLetter: 'Por Carta',
      activityInformal: 'Informal',
      activityReturnVisit: 'Revisita',
      activityBibleStudy: 'Estudio Bíblico',
      activityCredit: 'Crédito',
      activityOther: 'Otro',
      periodMorning: 'mañana',
      periodAfternoon: 'tarde',
      periodEvening: 'noche'
    },
    registerTime: {
      title: 'Registrar Tiempo',
      step1Title: 'Paso 1: Elige la actividad',
      step1Description: 'Selecciona el tipo de actividad que realizaste',
      step2Title: 'Selecciona la Persona',
      step2Description: 'Paso 2: ¿A quién visitaste?',
      step3Title: '¿Cuánto tiempo duró?',
      step3Description: 'Paso 2: Define la duración',
      step3DescriptionWithPerson: 'Paso 3: Define la duración',
      reviewTitle: 'Revisión Final',
      reviewDescription: 'Confirma la información antes de guardar',
      houseToHouseTitle: 'Casa en Casa',
      houseToHouseDesc: 'Visitación puerta a puerta',
      returnVisitTitle: 'Revisita',
      returnVisitDesc: 'Visitar interés',
      bibleStudyTitle: 'Estudio Bíblico',
      bibleStudyDesc: 'Conducir estudio',
      publicWitnessingTitle: 'Testimonio Público',
      publicWitnessingDesc: 'Carrito o mesa pública',
      byPhoneTitle: 'Por Teléfono',
      byPhoneDesc: 'Llamadas y mensajes',
      byLetterTitle: 'Por Carta',
      byLetterDesc: 'Cartas y mensajes escritos',
      informalTitle: 'Informal',
      informalDesc: 'Conversaciones casuales',
      creditTitle: 'Crédito',
      creditDesc: 'Tiempo especial (LDC, hospitalario, etc)',
      addMoreActivities: 'Agregar Más Actividades',
      finish: 'Finalizar',
      confirm: 'Confirmar',
      cancel: 'Cancelar',
      remove: 'Eliminar',
      edit: 'Editar',
      save: 'Guardar',
      hours: 'Horas',
      minutes: 'Minutos',
      howLongDidItTake: '¿Cuánto tiempo duró?',
      selectActivityType: 'Selecciona el tipo de actividad que realizaste',
      selectPerson: 'Selecciona la Persona',
      noReturnVisits: 'No hay revisitas registradas',
      noReturnVisitsDescription: 'Agrega revisitas en la pestaña Campo primero',
      noStudents: 'No hay estudiantes registrados',
      noStudentsDescription: 'Agrega estudios en la pestaña Estudios primero',
      addReturnVisit: 'Agregar Revisita',
      addStudent: 'Agregar Estudiante',
      totalTime: 'Tiempo Total',
      activitySummary: 'Resumen de Actividades',
      sessionSavedSuccess: '¡Sesión de ministerio registrada con éxito!',
      sessionUpdatedSuccess: '¡Sesión de ministerio actualizada con éxito!',
      selectActivityFirst: 'Por favor, selecciona una actividad primero',
      invalidTime: 'Por favor, define un tiempo válido (mayor que 0)',
      selectedActivity: 'Actividad seleccionada',
      setDuration: 'Define la duración',
      addActivity: 'Agregar Actividad',
      saveEdit: 'Guardar Edición',
      howMuchTimeDidYouDedicate: '¿Cuánto tiempo dedicaste?',
      activityAdded: '¡Actividad agregada!',
      activityRemoved: 'Actividad eliminada',
      timeUpdated: 'Tiempo actualizado',
      addAtLeastOneActivity: 'Agrega al menos una actividad',
      recordUpdatedSuccess: '¡Registro actualizado con éxito! ✏️',
      timeSavedSuccess: '¡Tiempo guardado con éxito!',
      activities: 'actividad(es)',
      noReturnVisitRegistered: 'Ninguna revisita registrada',
      noStudyRegistered: 'Ningún estudio registrado',
      registerReturnVisitFirst: 'Registra una revisita primero para continuar',
      registerStudyFirst: 'Registra un estudio primero para continuar',
      continueWithoutSelecting: 'Continuar sin seleccionar',
      selectReturnVisit: 'Selecciona la revisita',
      selectStudent: 'Selecciona el estudiante',
      reviewAndComplete: 'Revisar y Finalizar',
      lastStepConfirmActivities: 'Último paso: Confirma tus actividades',
      totalAccumulated: 'Total acumulado',
      activity: 'actividad',
      noActivityAdded: 'Ninguna actividad agregada',
      addAtLeastOneActivityToContinue: 'Agrega al menos una actividad para continuar',
      registeredActivities: 'Actividades registradas',
      completeRegistration: 'Finalizar Registro',
      field: 'Campo',
      credit: 'Crédito'
    },
    schedule: {
      title: 'Programa de la Semana',
      thisWeek: 'Esta Semana',
      nextWeek: 'Próxima Semana',
      lastWeek: 'Semana Pasada',
      weeksAhead: 'En {n} semanas',
      weeksAgo: 'Hace {n} semanas',
      today: 'Hoy',
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo',
      free: 'Libre',
      appointment: 'cita',
      appointments: 'citas',
      bibleStudy: 'Estudio Bíblico',
      returnVisit: 'Revisita',
      lesson: 'Lección',
      visit: 'visita',
      weekFinished: 'Semana finalizada',
      allDaysPassed: 'Todos los días de esta semana ya pasaron.',
      seeNextWeek: 'Ver Próxima Semana',
      noActivityScheduled: 'Ninguna actividad fue programada',
      noActivityPlanned: 'Ninguna actividad planificada',
      howItWorks: '¿Cómo funciona?',
      howItWorksDescription: 'Esta pantalla muestra tus estudios bíblicos programados (fecha + horario) y tus revisitas con próxima visita marcada para cada día de la semana.'
    },
    statistics: {
      title: 'Estadísticas',
      goals: 'Metas',
      activities: 'Actividades',
      hours: 'Horas',
      monthlyGoal: 'Meta Mensual',
      yearlyGoal: 'Meta Anual 2025',
      completed: 'Realizado',
      percentComplete: '{n}% completado',
      remaining: 'Faltan {time}',
      everyHourCounts: '¡Cada hora dedicada cuenta!',
      everyMonthOpportunity: '¡Cada mes es una nueva oportunidad!',
      monthlyGoalReached: '¡Meta mensual alcanzada! ¡Sigue firme!',
      yearlyGoalReached: '¡Meta anual alcanzada! ¡Qué bendición!',
      almostMonthly: '¡Falta poco para tu meta mensual!',
      almostYearly: '¡Ya casi llegas a tu meta anual!',
      keepGoing: '¡Sigue así! Cada paso importa.',
      summaryOf: 'Resumen de {month}',
      houseToHouse: 'Casa en Casa',
      returnVisit: 'Revisita',
      bibleStudy: 'Estudio Bíblico',
      returnVisits: 'Revisitas',
      bibleStudies: 'Estudios',
      sessions: 'Sesiones',
      publicWitnessing: 'Testificación Pública',
      phone: 'Teléfono',
      letter: 'Carta',
      informal: 'Informal',
      credit: 'Crédito',
      total: 'Total',
      january: 'enero',
      february: 'febrero',
      march: 'marzo',
      april: 'abril',
      may: 'mayo',
      june: 'junio',
      july: 'julio',
      august: 'agosto',
      september: 'septiembre',
      october: 'octubre',
      november: 'noviembre',
      december: 'diciembre',
      serviceYear: 'Año de servicio {year}',
      inThisMonth: 'en este mes',
      inThisYear: 'en este año',
      overview: 'Vista General',
      activitiesThisMonth: 'actividades en este mes',
      occurrencesThisMonth: 'ocurrencias en este mes',
      activitiesThisMonthCount: 'actividades realizadas este mes',
      returnVisitsCount: 'revisitas',
      studentsCount: 'estudiantes',
      activityDistribution: 'Distribución de Actividades',
      breakdownByActivity: 'Detalle por Actividad',
      dedicatedToMinistry: 'dedicadas al ministerio este mes',
      timeDistribution: 'Distribución de Tiempo',
      noOccurrencesThisMonth: 'Ninguna ocurrencia de {activity} este mes',
      noSessionsThisMonth: 'Ninguna sesión de {activity} este mes',
      serviceYearLabel: 'Año de Servicio',
      peopleRegistered: 'persona registrada',
      peopleRegisteredPlural: 'personas registradas',
      activeStudent: 'estudiante activo',
      activeStudentsPlural: 'estudiantes activos',
      details: 'Detalles'
    },
    notificationTest: {
      title: 'Probar Notificaciones',
      studyReminder: 'Recordatorio Estudio',
      idealSchedule: 'Horario Ideal',
      bibleReading: 'Lectura Bíblica',
      report: 'Informe',
      forgottenStudy: 'Estudio Olvidado',
      fieldPause: 'Pausa Campo',
      verse: 'Versículo',
      celebration: 'Celebración',
      encouragement: 'Ánimo',
      dpaExpiring: 'DPA Venciendo',
      welcome: 'Bienvenida',
      anniversary: 'Aniversario',
      dailyText: 'Texto Diario',
      syncOffline: 'Sync Offline',
      syncComplete: 'Sync Completo',
      description: 'Haga clic en los botones de arriba para probar diferentes tipos de notificaciones'
    },
    common: {
      save: 'Save',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      back: 'Volver',
      next: 'Siguiente',
      confirm: 'Confirmar',
      yes: 'Sí',
      no: 'No',
      close: 'Cerrar',
      ok: 'OK'
    },
    messages: {
      loading: 'Cargando...',
      saving: 'Guardando...',
      deleting: 'Eliminando...',
      success: '¡Éxito!',
      error: '¡Error!',
      noData: 'No se encontraron datos',
      requiredField: 'Este campo es obligatorio'
    }
  },

  'en': {
    nav: {
      inicio: 'Home',
      espiritual: 'Spiritual',
      estudos: 'Studies',
      campo: 'Field',
      diario: 'Diary',
      leitura: 'Reading',
      perfil: 'Profile'
    },
    inicio: 'Home',
    espiritual: 'Spiritual',
    estudos: 'Studies',
    campo: 'Field',
    perfil: 'Profile',
    settings: {
      title: 'Settings',
      subtitle: 'Customize your experience',
      appearance: 'Appearance',
      appearanceDesc: 'Customize the visual theme',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeAuto: 'Automatic',
      themeLightDesc: 'Light theme for sunny days',
      themeDarkDesc: 'Dark theme for nights or indoor environments',
      themeAutoDesc: 'Theme that adjusts automatically to the time of day',
      language: 'App Language',
      languageDesc: 'Choose your preferred language',
      moreLanguages: 'More languages coming soon',
      notifications: 'Notifications and Reminders',
      notificationsDesc: 'Manage alerts',
      notificationsEnable: 'Enable notifications',
      notificationsControl: 'Notification control',
      notificationsReminders: 'Reminders',
      notifications24h: '24 hours',
      notifications1h: '1 hour',
      notificationsReceiveFor: 'Receive notifications for:',
      notificationsBibleStudies: 'Bible Studies',
      notificationsReturnVisits: 'Return Visits',
      notificationsBibleReading: 'Bible Reading',
      notificationsGratitude: 'Gratitude',
      notificationsSpiritualGoals: 'Spiritual Goals',
      alertPreferences: 'Alert preferences',
      sound: 'Sound',
      vibration: 'Vibration',
      languageRegion: 'Language and region',
      resetSettings: 'Reset settings',
      redoOnboarding: 'Redo onboarding',
      redoOnboardingDesc: 'Restart the app introduction',
      privacyLocal: 'Local privacy',
      privacyDesc: 'Manage locally stored data',
      development: 'Development',
      developmentDesc: 'Developer tools',
      about: 'About Mynis',
      aboutDesc: 'Version and information'
    },
    studies: {
      title: 'Bible Studies',
      activeStudies: (count) => `Active Studies (${count})`,
      searchPlaceholder: 'Search students...',
      filterAll: 'All',
      filterAvailable: 'Available',
      filterHot: 'Hot',
      filterPaused: 'Inactive',
      statusAdvanced: 'Advanced',
      statusProgressing: 'In Progress',
      statusStarting: 'Starting',
      newStudy: 'New Study',
      noStudiesTitle: 'No Active Studies',
      noStudiesMessage: 'You don\'t have any active students yet. Start a new study to track your progress.',
      noStudiesAction: 'New Study',
      days: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      }
    },
    field: {
      title: 'Field Ministry',
      subtitle: 'Your return visits and territory',
      newReturn: 'New Return Visit',
      editReturn: 'Edit Return Visit',
      name: 'Name',
      origin: 'Origin',
      originHouseToHouse: 'House to house',
      originWitnessing: 'Public witnessing',
      originBusiness: 'Business',
      originOther: 'Other',
      firstConversation: 'First Conversation',
      publications: 'Publications',
      status: 'Status',
      statusNew: 'New',
      statusHot: 'Hot',
      statusBusiness: 'Business',
      statusRest: 'Rest',
      interestInStudy: 'Interest in studying',
      startStudy: 'Start Study'
    },
    diary: {
      title: 'Spiritual Diary',
      subtitle: 'Your ministry growth',
      goals: 'Spiritual Goals',
      monthlyReport: 'Monthly Report',
      hours: 'Hours',
      placements: 'Placements',
      returnVisits: 'Return Visits',
      studies: 'Studies'
    },
    reading: {
      title: 'Bible Reading',
      subtitle: 'Chronological program',
      chronological: 'Chronological',
      progress: 'Progress',
      todaysReading: "Today's Reading",
      markAsRead: 'Mark as Read',
      completed: 'Completed'
    },
    profile: {
      title: 'Profile',
      memberOf: 'Member of',
      contactInfo: 'Contact Information',
      congregation: 'Congregation',
      email: 'Email',
      phone: 'Phone',
      publisherType: 'Publisher Type',
      pioneerRegular: 'Regular Pioneer',
      pioneerAuxiliary: 'Auxiliary Pioneer',
      publisher: 'Publisher',
      goal: 'Goal',
      goalHours: (hours) => `Goal of ${hours} hours`,
      emergencyInfo: 'Emergency Information',
      dpaValidity: 'DPA Validity',
      emergencyContact: 'Emergency Contact',
      editPhoto: 'Edit Photo',
      editInfo: 'Edit Information',
      editEmergency: 'Edit Emergency',
      settings: 'Settings',
      settingsSubtitle: 'Customize your experience',
      appearance: 'Appearance',
      appearanceDesc: 'Customize the visual theme',
      notifications: 'Notifications and Reminders',
      notificationsDesc: 'Manage alerts',
      yearText: 'Year',
      currentText: 'Current',
      yearTextNote: 'Current year'
    },
    editInfo: {
      title: 'Edit Information',
      subtitle: 'Update your contact details',
      keepUpdated: 'Keep your details up to date',
      keepUpdatedDesc: 'These details are important for communication with the congregation and for sending monthly reports.',
      profilePhoto: 'Profile Photo',
      noPhoto: 'No photo selected',
      choosePhoto: 'Choose Photo',
      photoNote: 'Your photo will appear on the Home and Profile screens. Accepted formats: JPG, PNG, GIF (max. 5MB)',
      congregationLabel: 'Congregation:',
      congregationPlaceholder: 'Enter the full name of your congregation',
      emailLabel: 'Email:',
      emailNote: 'Used for sending reports and communications',
      phoneLabel: 'Phone:',
      phoneNote: 'Contact number with area code',
      preview: 'Preview',
      saveInfo: 'Save Information'
    },
    editPublisherType: {
      title: 'Publisher Type',
      subtitle: 'Choose your service type',
      regularPublisher: 'Regular Publisher',
      regularPublisherDesc: 'Suggested monthly goal of 10 hours',
      regularPublisherGoal: 'Goal: 10h/mo',
      auxiliaryPioneer15: 'Auxiliary Pioneer (15h)',
      auxiliaryPioneer15Desc: '15-hour monthly commitment',
      auxiliaryPioneer15Goal: 'Goal: 15h/mo',
      auxiliaryPioneer30: 'Auxiliary Pioneer (30h)',
      auxiliaryPioneer30Desc: '30-hour monthly commitment',
      auxiliaryPioneer30Goal: 'Goal: 30h/mo',
      regularPioneer: 'Regular Pioneer',
      regularPioneerDesc: '50-hour monthly commitment',
      regularPioneerGoal: 'Goal: 50h/mo',
      tipTitle: 'Tip: Your monthly goal is automatically adjusted based on the selected type.',
      tipDesc: 'You can track your progress on the Home screen and in the Monthly Report card.',
      cancel: 'Cancel',
      saveChanges: 'Save Changes'
    },
    editYearText: {
      title: 'Edit Year Text',
      subtitle: 'Customize the verse on the home screen',
      howItWorks: 'How does it work?',
      howItWorksDesc: 'This text will appear at the top of the Home screen, just below the greeting. Choose a verse that inspires your spiritual journey.',
      tip: 'Tip: You can use the annual theme of the Organization or choose a personal text.',
      biblicalTextLabel: 'Biblical Text:',
      biblicalTextPlaceholder: 'Enter the full verse in quotes',
      biblicalRefLabel: 'Biblical Reference:',
      biblicalRefPlaceholder: 'Enter the book, chapter, and verse',
      preview: 'Preview',
      yearTextTitle: 'Year Text',
      saveYearText: 'Save Year Text'
    },
    emergency: {
      title: 'Emergency Information',
      subtitle: 'Keep your medical data updated',
      aboutDPA: 'About the Advance Directive (DPA)',
      aboutDPAText: 'The DPA ensures your medical decisions are respected. Keep the validity always updated and share with family members and congregation elders.',
      docValidity: 'Document Validity',
      validityLabel: 'DPA Validity',
      validityHelp: 'Select the expiration date of your DPA',
      emergencyContacts: 'Emergency Contacts',
      contactLabel: 'Contact Name',
      contactPlaceholder: 'Full name of emergency contact',
      contactHelp: 'Person to be contacted in case of emergency',
      phoneLabel: 'Phone',
      phonePlaceholder: '(00) 00000-0000',
      phoneHelp: 'Emergency contact phone number',
      additionalMedicalInfo: 'Additional Medical Information',
      allergiesLabel: 'Allergies and Medical Information',
      allergiesPlaceholder: 'Ex: Allergy to penicillin, uses medication for high blood pressure...',
      allergiesHelp: 'Record allergies, continuous medications, or important conditions',
      summary: 'Information Summary',
      dpaValidity: 'DPA Validity',
      status: 'Status',
      emergencyContact: 'Emergency Contact',
      phoneNumber: 'Phone',
      allergies: 'Allergies',
      saveButton: 'Save Information',
      statusNotFilled: 'Not filled',
      statusExpired: 'DPA Expired',
      statusExpiringSoon: (days) => `Expires in ${days} ${days === 1 ? 'day' : 'days'}`,
      statusExpiringMonths: (months) => `Valid for ${months} ${months === 1 ? 'month' : 'months'}`,
      statusValid: 'DPA Valid',
      toastErrorValidityTitle: 'Validity date required',
      toastErrorValidityDesc: 'Please enter the DPA expiration date',
      toastErrorContactTitle: 'Contact required',
      toastErrorContactDesc: 'Please enter the emergency contact name',
      toastErrorPhoneTitle: 'Phone required',
      toastErrorPhoneDesc: 'Please enter the emergency contact phone',
      toastExpiredTitle: 'DPA Expired',
      toastExpiredDesc: 'The DPA expiration date has passed. Please renew your document.',
      toastExpiringTitle: 'DPA about to expire',
      toastExpiringDesc: (days) => `Your DPA expires in ${days} ${days === 1 ? 'day' : 'days'}. Consider renewing it soon.`,
      toastSuccessTitle: 'Information saved!',
      toastSuccessDesc: 'Your emergency information has been successfully updated'
    },
    studiesTab: {
      title: 'Bible Studies',
      subtitle: 'Active Studies',
      searchPlaceholder: 'Search students...',
      filterAll: 'All',
      filterActive: 'Active',
      filterPaused: 'Paused',
      filterCompleted: 'Completed',
      filterToday: 'Today',
      filterRest: 'For Rest',
      statusStarting: 'Starting',
      statusInProgress: 'In Progress',
      statusAdvanced: 'Advanced',
      statusWithDoubt: 'With Doubt',
      studyScheduledToday: 'Study Scheduled for Today',
      prepareConversation: 'Prepare for a great conversation!',
      newStudy: 'New Study',
      today: 'Today',
      daysAgo: (days) => days === 1 ? '1 day ago' : `${days} days ago`,
      monday: 'monday',
      tuesday: 'tuesday',
      wednesday: 'wednesday',
      thursday: 'thursday',
      friday: 'friday',
      saturday: 'saturday',
      sunday: 'sunday',
      emptyTitle: 'No studies yet',
      emptyDescription: 'You don\'t have any studies registered yet. Start by adding your first Bible study!',
      emptyAction: 'Add First Study',
      viewDetails: 'View Details',
      todayBanner: (count) => `You have ${count} ${count === 1 ? 'study' : 'studies'} scheduled for today. Prepare for great conversations!`
    },
    fieldTab: {
      title: 'Field Ministry',
      subtitle: (count) => `Return Visits (${count})`,
      searchPlaceholder: 'Search return visits...',
      filterAll: 'All',
      filterAvailable: 'Available',
      filterHot: 'Hot',
      filterRevisit: 'Return Visits',
      availableBannerText: 'Available return visits for today',
      firstVisit: 'First Visit',
      today: 'Today',
      daysAgo: (days) => days === 1 ? '1 day ago' : `${days} days ago`,
      dayAgo: '1 day ago',
      revisitUrgent: 'Urgent Revisit',
      statusNew: 'New',
      statusHot: 'Hot',
      statusCommerce: 'Business',
      statusRest: 'Rest',
      emptyTitle: 'No return visits available',
      emptyDescription: 'When you start return visits with people, they will appear here for you to track their progress.',
      emptySearchDescription: 'No return visits found for the search criteria.',
      studyStartedToast: 'Study Started',
      studyStartedDescription: (name) => `Study with ${name} started successfully!`
    },
    returnVisitDetails: {
      visits: (count) => `Return Visits (${count})`,
      contactInfo: 'Contact Information',
      fullName: 'Full Name',
      phone: 'Phone',
      call: 'Call',
      whatsapp: 'WhatsApp',
      fullAddress: 'Full Address',
      viewOnMap: 'View on Map',
      lastVisit: 'Last Visit',
      date: 'Date',
      daysAgo: (days) => days === 1 ? '1 day ago' : `${days} days ago`,
      nextVisitScheduled: 'Next Visit Scheduled',
      reminderSet: 'Reminder Set',
      firstConversation: 'First Conversation',
      additionalDetails: 'Additional Details',
      contactOrigin: 'Contact Origin',
      originInformalWitnessing: 'Informal Witnessing',
      originHouseToHouse: 'House to House',
      originPublicWitnessing: 'Public Witnessing',
      originBusiness: 'Business',
      originOther: 'Other',
      dateAdded: 'Date Added',
      publicationsDelivered: 'Publications Delivered',
      summary: 'Summary',
      totalVisits: 'Total Visits',
      daysSinceLast: 'Days Since Last Visit',
      registerNewVisit: 'Register New Visit',
      dangerZone: 'Danger Zone',
      dangerZoneWarning: 'Removing this return visit will permanently delete it.',
      removeReturnVisit: 'Remove Return Visit',
      confirmRemoval: 'Confirm Removal',
      confirmRemovalMessage: (name) => `Are you sure you want to remove the return visit with ${name}?`,
      cancel: 'Cancel',
      remove: 'Remove',
      returnVisitNotFound: 'Return Visit not found',
      back: 'Back',
      phoneNotRegistered: 'Phone not registered',
      addressNotRegistered: 'Address not registered',
      returnVisitRemoved: 'Return Visit removed successfully',
      edit: 'Edit',
      statusNew: 'New',
      statusHot: 'Hot',
      statusBusiness: 'Business',
      statusRest: 'Rest',
      interestInStudyBadge: 'Interest in studying',
      convertToStudy: 'Convert to Bible Study',
      observations: 'Observations',
      publicationsLeft: 'Publications Left',
      visitHistory: 'Visit History',
      found: 'Found',
      notFound: 'Not found',
      mostRecent: 'Most recent',
      scheduledFor: 'Scheduled for',
      availability: 'Availability',
      notInformed: 'Not informed',
      neverVisited: 'Never visited',
      firstConversationTitle: 'First Conversation',
      dangerZoneWarningFull: 'Deleting this return visit will permanently remove all data. This action cannot be undone.',
      confirmRemovalFull: (name: string) => `Are you sure you want to remove the return visit with <strong>${name}</strong>? This action cannot be undone.`,
      totalVisitsLabel: 'Total visits',
      daysSinceLastLabel: 'Days since last',
      visitHistoryTitle: (count: number) => `Visit History (${count})`,
      publicationsLeftLabel: 'Publications left:',
      scheduledForLabel: 'Scheduled for:'
    },
    fab: {
      newStudy: 'New Study',
      newReturnVisit: 'New Return Visit',
      newActivity: 'New Activity',
      paused: 'Paused'
    },
    studyDetails: {
      title: 'Study Details',
      contactInfo: 'Contact Information',
      fullName: 'Full Name',
      phone: 'Phone',
      call: 'Call',
      whatsapp: 'WhatsApp',
      fullAddress: 'Full Address',
      viewOnMap: 'View on Map',
      studyDetails: 'Study Details',
      publication: 'Publication',
      progress: 'Progress',
      nextStudy: 'Next Study',
      today: 'Today',
      observations: 'Observations',
      dangerZone: 'Danger Zone',
      dangerZoneWarning: 'Removing this study will permanently delete it.',
      removeStudy: 'Remove Study',
      confirmRemoval: 'Confirm Removal',
      confirmRemovalMessage: (name) => `Are you sure you want to remove the study with ${name}?`,
      cancel: 'Cancel',
      remove: 'Remove',
      studyNotFound: 'Study not found',
      back: 'Back',
      phoneNotRegistered: 'Phone not registered',
      addressNotRegistered: 'Address not registered',
      studyRemoved: 'Study removed successfully'
    },
    studyForm: {
      newStudyTitle: 'New Study',
      editStudyTitle: 'Edit Study',
      newStudySubtitle: 'Add a new study to track your progress',
      editStudySubtitle: 'Update study details',
      conversionBannerTitle: 'Conversion!',
      conversionBannerDescription: (name) => `${name} has been converted!`,
      contactInfo: 'Contact Information',
      fullNameLabel: 'Full Name:',
      fullNamePlaceholder: 'Enter the full name',
      phoneLabel: 'Phone:',
      phonePlaceholder: 'Enter the phone number',
      addressLabel: 'Full Address:',
      addressPlaceholder: 'Enter the full address',
      studyDetails: 'Study Details',
      publicationLabel: 'Publication:',
      publicationOptions: {
        option1: 'Publication 1',
        option2: 'Publication 2',
        option3: 'Publication 3',
        option4: 'Publication 4'
      },
      statusLabel: 'Status:',
      statusOptions: {
        starting: {
          name: 'Starting',
          description: 'The study is starting'
        },
        progressing: {
          name: 'In Progress',
          description: 'The study is in progress'
        },
        doubts: {
          name: 'With Doubts',
          description: 'The study has doubts'
        },
        advanced: {
          name: 'Advanced',
          description: 'The study is advanced'
        }
      },
      schedulingTitle: 'Scheduling',
      nextDateLabel: 'Next Date:',
      timeLabel: 'Time:',
      observationsTitle: 'Observations',
      observationsPlaceholder: 'Enter any important observations',
      dangerZoneTitle: 'Danger Zone',
      dangerZoneWarning: 'Deleting this study will permanently remove it.',
      deleteStudy: 'Delete Study',
      saveChanges: 'Save Changes',
      createStudy: 'Create Study',
      validationErrors: {
        nameRequired: 'Full name is required',
        addressRequired: 'Full address is required',
        publicationRequired: 'Publication is required'
      },
      successMessages: {
        updated: 'Study updated successfully!',
        created: 'Study created successfully!',
        createdDescription: (name) => `Study with ${name} created successfully!`,
        deleted: 'Study deleted successfully!'
      },
      deleteConfirmation: (name) => `Are you sure you want to delete the study with ${name}?`
    },
    returnVisitForm: {
      newTitle: 'New Return Visit',
      editTitle: 'Edit Return Visit',
      newSubtitle: 'Fill in the information',
      editSubtitle: 'Update the information',
      contactInfo: 'Contact Information',
      fullNameLabel: 'Full name *',
      fullNamePlaceholder: 'e.g. Maria Silva',
      phoneLabel: 'Phone (optional)',
      phonePlaceholder: '(00) 00000-0000',
      addressLabel: 'Full address *',
      addressPlaceholder: 'Street, number, neighborhood, city',
      placeType: 'Place Type',
      placeTypeOptions: {
        house: 'House',
        building: 'Building',
        business: 'Business'
      },
      status: 'Return Visit Status',
      statusOptions: {
        new: 'New',
        interested: 'Interested',
        hot: 'Hot',
        resting: 'Resting'
      },
      firstConversation: 'First Conversation',
      firstConversationLabel: 'What did you talk about? *',
      firstConversationPlaceholder: 'e.g. Showed interest in learning about God\'s Kingdom...',
      additionalDetails: 'Additional Details',
      availabilityLabel: 'Availability',
      availabilityPlaceholder: 'e.g. Saturday mornings',
      scheduledDateLabel: 'Scheduled Return Date',
      scheduledDateHint: 'When did the resident ask you to return?',
      publicationsLabel: 'Publications Left',
      publicationsPlaceholder: 'e.g. Good Morning!, What Does the Bible Say?',
      publicationsHint: 'Separate by comma',
      observationsLabel: 'Observations',
      observationsPlaceholder: 'Other important notes...',
      studyInterest: 'This person showed interest in studying the Bible',
      dangerZone: 'Danger Zone',
      dangerZoneWarning: 'Deleting this return visit will permanently remove all data. This action cannot be undone.',
      deleteReturnVisit: 'Delete Return Visit',
      saveChanges: 'Save Changes',
      createReturnVisit: 'Create Return Visit',
      validationErrors: {
        nameRequired: 'We need the person\'s name',
        addressRequired: 'We need the address',
        firstConversationRequired: 'Tell us about the first conversation'
      },
      successMessages: {
        updated: 'Return visit updated',
        created: 'Return visit registered!',
        deleted: 'Return visit removed'
      },
      deleteConfirmation: (name) => `Are you sure you want to delete the return visit with ${name}?\n\nThis action cannot be undone.`
    },
    spiritualTab: {
      onboardingTitle: 'Preparing the Soil',
      onboardingSubtitle: 'Your spiritual foundation for planting seeds',
      bibleReadingTitle: 'Bible Reading',
      bibleReadingSetup: 'Set up your reading plan',
      bibleReadingTrack: 'Track your spiritual progress',
      gratitudeTitle: 'Gratitude Journal',
      gratitudeStart: 'Start by recording what you are grateful for today',
      gratitudeStrength: 'Cultivating gratitude strengthens your spirituality',
      goalsTitle: 'Spiritual Goals',
      goalsEstablish: 'Set your spiritual goals',
      worshipIdeasTitle: 'Need worship ideas?',
      suggestIdea: 'Suggest an Idea'
    },
    emptyStateBible: {
      headerTitle: 'Start Your Journey',
      headerSubtitle: 'Set up your reading',
      ctaTitle: 'Set up your reading',
      ctaDescription: 'To get started, configure your Bible reading preferences',
      ctaButton: 'Go to Settings',
      benefitsTitle: 'What you will achieve:',
      benefit1Title: 'Custom Goals',
      benefit1Description: 'Choose how many chapters to read per day according to your routine',
      benefit2Title: 'Daily Tracking',
      benefit2Description: 'Record your readings and maintain a streak of consecutive days',
      benefit3Title: 'Achievements and Reflections',
      benefit3Description: 'Unlock achievements and record your spiritual reflections',
      toastSuccess: 'Plan successfully configured!',
      toastDescription: 'Start your reading journey now'
    },
    bibleSettingsPage: {
      headerTitle: 'Settings',
      headerSubtitle: 'Customize your experience',
      planTypeTitle: 'Plan Type',
      planTypeDesc: 'Choose how you want to read the Bible',
      chronological: 'Chronological',
      chronologicalDesc: 'Read the Bible in historical order of events',
      thematic: 'Thematic',
      thematicDesc: 'Explore specific biblical themes and topics',
      sequential: 'Sequential',
      sequentialDesc: 'Read from Genesis to Revelation in order',
      dailyGoalTitle: 'Daily Goal',
      dailyGoalDesc: 'How many chapters do you want to read per day?',
      oneChapter: '1 chapter per day',
      oneChapterDesc: 'Calm and reflective pace',
      threeChapters: '3 chapters per day',
      threeChaptersDesc: 'Moderate and balanced pace',
      fiveChapters: '5 chapters per day',
      fiveChaptersDesc: 'Intense and dedicated pace',
      notificationsTitle: 'Notifications',
      notificationsDesc: 'Set reminders for your reading routine',
      dailyReminder: 'Daily reminder',
      dailyReminderDesc: 'Get a reminder to read every day at 9am',
      reflectionReminder: 'Reflection reminder',
      reflectionReminderDesc: 'Encouragement to meditate on what you read',
      summaryTitle: 'Settings Summary',
      readingPlan: 'Reading plan:',
      dailyGoal: 'Daily goal:',
      reminders: 'Reminders:',
      allActive: 'All active',
      partiallyActive: 'Partially active',
      disabled: 'Disabled',
      saveButton: 'Save Settings',
      resetDialogTitle: 'Reset Progress?',
      resetDialogDesc: 'Changing the reading plan or daily goal will reset your current progress including readings, streak, achievements and reflections.',
      resetDialogWarning: 'This action will reset the following data:',
      completedReadings: 'Completed readings',
      streakDays: 'Streak days',
      unlockedAchievements: 'Unlocked achievements',
      registeredReflections: 'Registered reflections',
      resetDialogTip: 'You will start a new reading journey with the new settings.',
      cancel: 'Cancel',
      confirmReset: 'Confirm Reset',
      toastSaved: 'Settings saved',
      toastSavedDesc: 'Your preferences have been updated',
      toastReset: 'Progress reset',
      toastResetDesc: 'Your new settings have been saved. You will start from scratch!',
      
      planTypeTitle: 'Plan Type',
      planTypeSubtitle: 'Choose how you want to read the Bible',
      dailyGoalTitle: 'Daily Goal',
      dailyGoalSubtitle: 'How many chapters do you want to read per day?',
      oneChapterShort: '1 chapter per day',
      oneChapterPace: 'Calm and reflective pace',
      threeChaptersShort: '3 chapters per day',
      threeChaptersPace: 'Moderate and balanced pace',
      fiveChaptersShort: '5 chapters per day',
      fiveChaptersPace: 'Intense and dedicated pace',
      notificationsTitle: 'Notifications',
      notificationsSubtitle: 'Set up reminders for your reading routine',
      dailyReminderShort: 'Daily reminder',
      dailyReminderShortDesc: 'Get a reminder to read every day at 9am',
      reflectionReminderShort: 'Reflection reminder',
      reflectionReminderShortDesc: 'Encouragement to meditate on what you read',
      summaryTitle: 'Settings Summary',
      summaryPlan: 'Reading plan:',
      summaryGoal: 'Daily goal:',
      summaryReminders: 'Reminders:',
      remindersAll: 'All active',
      remindersPartial: 'Partially active',
      remindersNone: 'Disabled',
      saveButton: 'Save Settings',
      toastSaveSuccess: 'Settings saved',
      toastSaveSuccessDesc: 'Your preferences have been updated',
      
      resetDialogTitle: 'Reset Progress?',
      resetDialogDescription: 'Changing your reading plan or daily goal will reset your current progress including readings, streak, achievements and reflections.',
      resetDialogText: 'This action will',
      resetDialogTextBold: 'reset',
      resetDialogTextContinue: 'the following data:',
      resetItem1: 'Completed readings',
      resetItem2: 'Streak days',
      resetItem3: 'Unlocked achievements',
      resetItem4: 'Recorded reflections',
      resetDialogTip: 'You will start a new reading journey with the new settings.',
      resetDialogCancel: 'Cancel',
      resetDialogConfirm: 'Confirm Reset'
    },
    bibleOnboarding: {
      headerTitle: 'Set Up Your Plan',
      step: 'Step',
      stepOf: 'of',
      step1Title: 'Choose Your Reading Program',
      step1Subtitle: 'Select the approach that best suits you',
      chronological: 'Chronological',
      chronologicalDesc: 'Read the 1189 chapters in historical order of events. Job after creation, Psalms during David\'s reign',
      chronologicalShort: 'Read the Bible in historical order of events',
      sequential: 'Sequential',
      sequentialDesc: 'Read from Genesis to Revelation in the traditional order of books, starting with the OT and moving to the NT',
      sequentialShort: 'Read from Genesis to Revelation in order',
      thematic: 'Thematic',
      thematicDesc: 'Explore 10 biblical themes: faith, wisdom, love, prayer, ministry, perseverance and the life of Jesus',
      thematicShort: 'Explore specific biblical themes and topics',
      step2Title: 'Set Your Daily Goal',
      step2Subtitle: 'Choose how many chapters you want to read per day',
      oneChapter: '1 chapter per day',
      oneChapterDesc: 'Approximately 5 minutes daily · Reflective reading',
      threeChapters: '3 chapters per day',
      threeChaptersDesc: 'Approximately 15 minutes daily · Balanced pace',
      fiveChapters: '5 chapters per day',
      fiveChaptersDesc: 'Approximately 25 minutes daily · More dedicated pace',
      step2Tip: 'Tip: Start with 3 chapters per day. You can adjust your goal anytime in settings.',
      step3Title: 'Final Settings',
      step3Subtitle: 'Would you like to receive reminders to help you?',
      dailyReminder: 'Daily reading reminder',
      dailyReminderDesc: 'Get a notification every day at 9am to not forget your reading',
      reflectionReminder: 'Reflection reminder',
      reflectionReminderDesc: 'Receive encouragement to meditate and apply what you learned',
      step3Message: 'You\'re ready to start! Track your reading progress and maintain a regular routine of studying God\'s Word.',
      continueButton: 'Continue',
      startReadingButton: 'Start Reading'
    },
    markReadingDialog: {
      title: 'Mark Reading',
      youRead: 'You read:',
      addReflection: 'Add Reflection (optional)',
      yourReflection: 'Your Reflection',
      remove: 'Remove',
      whatDidYouLearn: 'What did you learn?',
      whatDidYouLearnPlaceholder: 'Write what you learned here...',
      howCanYouApply: 'How can you apply it?',
      howCanYouApplyPlaceholder: 'Write how you can apply it in your life...',
      keywordOfTheDay: 'Keyword of the day',
      keywordPlaceholder: 'Ex: Love, Faith, Perseverance...',
      cancel: 'Cancel',
      markAsRead: 'Mark as Read'
    },
    biblePage: {
      headerTitle: 'Bible Reading',
      headerSubtitle: 'Your spiritual foundation for sowing seeds',
      nextReading: 'Next reading:',
      completed: 'Completed',
      alreadyRead: 'Already read today',
      markAsRead: 'Mark as Read',
      streakDays: 'Streak days',
      record: 'Record',
      yourProgress: 'Your Progress',
      readingPlan2025: 'Reading Plan 2025',
      chapters: 'Chapters',
      books: 'Books',
      consecutiveDays: 'Consecutive days',
      achievements: 'Achievements',
      achievementFirstWeek: 'Humble\nBeginning',
      achievementWeekComplete: 'Week\nComplete',
      achievementTwoWeeks: 'Dedicated\nReader',
      achievementMonthComplete: 'Voracious\nReader',
      achievement3Days: '3 Consecutive Days',
      achievement7Days: 'Week Complete',
      achievement14Days: '14 Consecutive Days',
      achievement30Days: 'Month Complete',
      motivationalNoAchievements: 'Keep reading to unlock achievements!',
      motivationalSomeAchievements: (count: number) => `You unlocked ${count} of 4 achievements! Keep it up!`,
      motivationalAllAchievements: 'Congratulations! You unlocked all achievements!',
      recentReflections: 'Recent Reflections',
      toastConfigured: 'Plan successfully configured!',
      toastConfiguredDesc: 'Start your reading journey now',
      toastAlreadyRead: 'You already recorded your reading today!',
      toastAlreadyReadDesc: 'Continue tomorrow to maintain your streak',
      toastReadingRegistered: 'Reading recorded!',
      toastReadingRegisteredDesc: (book: string, chapter: string) => `${book} ${chapter} completed`,
      toastNewAchievement: 'New Achievement Unlocked!'
    },
    gratitudeDiary: {
      headerTitle: 'Gratitude Diary',
      headerSubtitle: 'Cultivating a grateful heart',
      whyTitle: 'Why cultivate gratitude?',
      whyDescription: 'Recording what we are grateful for strengthens our spirituality and helps us see Jehovah\'s blessings in our lives. The Bible encourages us to be grateful in all circumstances.',
      bibleVerse: '"Be thankful." — Colossians 3:15',
      startTitle: 'Start your diary',
      startDescription: 'Record what you are grateful for today',
      startTip: 'Click the + button below to add your first entry',
      summaryTitle: 'Summary',
      totalRecords: 'Total records',
      daysPracticing: 'Days practicing',
      toastDeleted: 'You removed the entry',
      addButtonLabel: 'Add new gratitude',
      toastReportSaved: 'Your reflection was saved in the Gratitude Diary'
    },
    newGratitude: {
      headerTitleNew: 'New Gratitude',
      headerTitleEdit: 'Edit Gratitude',
      headerSubtitleNew: 'What made you feel grateful today?',
      headerSubtitleEdit: 'Update your gratitude',
      dateLabel: 'Date',
      gratitudeLabel: 'What are you grateful for?',
      gratitudePlaceholder: 'Ex: Jehovah gave me strength to overcome a challenge today...',
      buttonSaveNew: 'Save Gratitude',
      buttonSaveEdit: 'Update Gratitude',
      toastErrorEmpty: 'Write something you are grateful for',
      toastSuccessNew: 'Gratitude recorded!',
      toastSuccessNewDesc: 'Saved in your Gratitude Diary',
      toastSuccessEdit: 'Gratitude updated!',
      toastSuccessEditDesc: 'Changes saved successfully'
    },
    spiritualGoals: {
      headerTitle: 'Spiritual Goals',
      headerSubtitle: (count: number) => `${count} ${count === 1 ? 'active goal' : 'active goals'}`,
      whyTitle: 'Why have spiritual goals?',
      whyDescription: 'Setting spiritual goals helps us grow in our relationship with Jehovah and motivates us to progress spiritually. They are like maps that guide our Christian journey.',
      bibleVerse: '"Make sure of the more important things." — Philippians 1:10',
      startTitle: 'Set your first goal',
      startDescription: 'Start creating a spiritual goal for your journey',
      startTip: 'Click the + button below to create your first goal',
      sectionInProgress: 'In Progress',
      sectionPaused: 'Paused',
      sectionCompleted: 'Completed',
      summaryTitle: 'Summary',
      summaryInProgress: 'In progress',
      summaryCompleted: 'Completed',
      summaryPaused: 'Paused',
      buttonEdit: 'Edit',
      buttonPause: 'Pause',
      buttonComplete: 'Complete',
      buttonResume: 'Resume',
      newGoalTitle: 'New Spiritual Goal',
      newGoalSubtitle: 'Set a spiritual objective',
      fieldGoalTitle: 'What is your goal?',
      fieldGoalPlaceholder: 'Ex: Read the entire Bible',
      fieldMeta: 'Goal (optional)',
      fieldMetaPlaceholder: 'Ex: 3 chapters per day',
      fieldDeadline: 'Deadline (optional)',
      buttonCreate: 'Create Goal',
      toastSuccess: 'Goal created!',
      toastError: 'We need a title for the goal'
    },
    home: {
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      yearText: 'Year Text',
      progressTitle: 'Progress',
      progressOf: 'of',
      progressMonth: 'month',
      statusAhead: 'Ahead',
      statusOnTrack: 'On Track',
      statusBehind: 'Behind',
      messageAhead: 'Congratulations! You are ahead of your goal!',
      messageOnTrack: 'Keep it up! You are on the right track!',
      messageBehind: 'Don\'t give up! You can reach your goal!',
      scheduleTitle: 'Week Schedule',
      scheduleStudy: 'study',
      scheduleStudies: 'studies',
      scheduleReturnVisit: 'return visit',
      scheduleReturnVisits: 'return visits',
      scheduleFree: 'Free',
      statisticsTitle: 'Statistics',
      annualGoal: 'Annual Goal',
      accomplished: 'Accomplished',
      completed: 'completed',
      remaining: 'Remaining',
      studies: 'Studies',
      returnVisits: 'Return Visits',
      tapForDetails: 'Tap to see full details',
      publisherRegular: 'Publisher',
      publisherAuxiliary: 'Auxiliary Pioneer',
      publisherRegularPioneer: 'Regular Pioneer',
      publisherSpecialPioneer: 'Special Pioneer',
      publisherCircuitOverseer: 'Circuit Overseer',
      dayMonday: 'Mon',
      dayTuesday: 'Tue',
      dayWednesday: 'Wed',
      dayThursday: 'Thu',
      dayFriday: 'Fri',
      daySaturday: 'Sat',
      daySunday: 'Sun'
    },
    progress: {
      title: 'Month Progress',
      ministry: 'Ministry',
      goalAchieved: 'Goal achieved!',
      of: 'of',
      month: 'month',
      congratsGoalReached: 'Congratulations! You reached your monthly goal!',
      keepGoingGreat: 'Keep it up, you are doing great!',
      activityHistory: 'Activity History',
      noRecordsThisMonth: 'No records this month',
      useButtonToAdd: 'Use the "+" button to add your activities.',
      noRecordsForMonth: 'There are no records for this month.',
      fieldMinistry: 'Field Ministry',
      creditTime: 'Credit Time',
      edit: 'Edit',
      delete: 'Delete',
      deleteRecordTitle: 'Delete Record?',
      deleteRecordDescription: 'Are you sure you want to delete this ministry record?',
      confirm: 'Confirm',
      cancel: 'Cancel',
      deleteSuccess: 'Record deleted successfully',
      monthJanuary: 'January',
      monthFebruary: 'February',
      monthMarch: 'March',
      monthApril: 'April',
      monthMay: 'May',
      monthJune: 'June',
      monthJuly: 'July',
      monthAugust: 'August',
      monthSeptember: 'September',
      monthOctober: 'October',
      monthNovember: 'November',
      monthDecember: 'December',
      weekdayMonday: 'Monday',
      weekdayTuesday: 'Tuesday',
      weekdayWednesday: 'Wednesday',
      weekdayThursday: 'Thursday',
      weekdayFriday: 'Friday',
      weekdaySaturday: 'Saturday',
      weekdaySunday: 'Sunday',
      activityHouseToHouse: 'House to House',
      activityPublicWitnessing: 'Public Witnessing',
      activityByPhone: 'By Phone',
      activityByLetter: 'By Letter',
      activityInformal: 'Informal',
      activityReturnVisit: 'Return Visit',
      activityBibleStudy: 'Bible Study',
      activityCredit: 'Credit',
      activityOther: 'Other',
      periodMorning: 'morning',
      periodAfternoon: 'afternoon',
      periodEvening: 'evening'
    },
    registerTime: {
      title: 'Register Time',
      step1Title: 'Step 1: Choose the activity',
      step1Description: 'Select the type of activity you performed',
      step2Title: 'Select the Person',
      step2Description: 'Step 2: Who was visited?',
      step3Title: 'How long did it take?',
      step3Description: 'Step 2: Define the duration',
      step3DescriptionWithPerson: 'Step 3: Define the duration',
      reviewTitle: 'Final Review',
      reviewDescription: 'Confirm the information before saving',
      houseToHouseTitle: 'House to House',
      houseToHouseDesc: 'Door-to-door visitation',
      returnVisitTitle: 'Return Visit',
      returnVisitDesc: 'Visit interest',
      bibleStudyTitle: 'Bible Study',
      bibleStudyDesc: 'Conduct study',
      publicWitnessingTitle: 'Public Witnessing',
      publicWitnessingDesc: 'Cart or public stand',
      byPhoneTitle: 'By Phone',
      byPhoneDesc: 'Calls and messages',
      byLetterTitle: 'By Letter',
      byLetterDesc: 'Letters and written messages',
      informalTitle: 'Informal',
      informalDesc: 'Casual conversations',
      creditTitle: 'Credit',
      creditDesc: 'Special time (LDC, hospital, etc)',
      addMoreActivities: 'Add More Activities',
      finish: 'Finish',
      confirm: 'Confirm',
      cancel: 'Cancel',
      remove: 'Remove',
      edit: 'Edit',
      save: 'Save',
      hours: 'Hours',
      minutes: 'Minutes',
      howLongDidItTake: 'How long did it take?',
      selectActivityType: 'Select the type of activity you performed',
      selectPerson: 'Select the Person',
      noReturnVisits: 'No return visits registered',
      noReturnVisitsDescription: 'Add return visits in the Field tab first',
      noStudents: 'No students registered',
      noStudentsDescription: 'Add studies in the Studies tab first',
      addReturnVisit: 'Add Return Visit',
      addStudent: 'Add Student',
      totalTime: 'Total Time',
      activitySummary: 'Activity Summary',
      sessionSavedSuccess: 'Ministry session registered successfully!',
      sessionUpdatedSuccess: 'Ministry session updated successfully!',
      selectActivityFirst: 'Please, select an activity first',
      invalidTime: 'Please, set a valid time (greater than 0)',
      selectedActivity: 'Selected activity',
      setDuration: 'Set the duration',
      addActivity: 'Add Activity',
      saveEdit: 'Save Edit',
      howMuchTimeDidYouDedicate: 'How much time did you dedicate?',
      activityAdded: 'Activity added!',
      activityRemoved: 'Activity removed',
      timeUpdated: 'Time updated',
      addAtLeastOneActivity: 'Add at least one activity',
      recordUpdatedSuccess: 'Record updated successfully! ✏️',
      timeSavedSuccess: 'Time saved successfully!',
      activities: 'activity(ies)',
      noReturnVisitRegistered: 'No return visit registered',
      noStudyRegistered: 'No study registered',
      registerReturnVisitFirst: 'Register a return visit first to continue',
      registerStudyFirst: 'Register a study first to continue',
      continueWithoutSelecting: 'Continue without selecting',
      selectReturnVisit: 'Select the return visit',
      selectStudent: 'Select the student',
      reviewAndComplete: 'Review and Complete',
      lastStepConfirmActivities: 'Last step: Confirm your activities',
      totalAccumulated: 'Total accumulated',
      activity: 'activity',
      noActivityAdded: 'No activity added',
      addAtLeastOneActivityToContinue: 'Add at least one activity to continue',
      registeredActivities: 'Registered activities',
      completeRegistration: 'Complete Registration',
      field: 'Field',
      credit: 'Credit'
    },
    schedule: {
      title: 'Week Schedule',
      thisWeek: 'This Week',
      nextWeek: 'Next Week',
      lastWeek: 'Last Week',
      weeksAhead: 'In {n} weeks',
      weeksAgo: '{n} weeks ago',
      today: 'Today',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      free: 'Free',
      appointment: 'appointment',
      appointments: 'appointments',
      bibleStudy: 'Bible Study',
      returnVisit: 'Return Visit',
      lesson: 'Lesson',
      visit: 'visit',
      weekFinished: 'Week finished',
      allDaysPassed: 'All days of this week have already passed.',
      seeNextWeek: 'See Next Week',
      noActivityScheduled: 'No activity was scheduled',
      noActivityPlanned: 'No activity planned',
      howItWorks: 'How does it work?',
      howItWorksDescription: 'This screen shows your scheduled bible studies (date + time) and your return visits with next visit marked for each day of the week.'
    },
    statistics: {
      title: 'Statistics',
      goals: 'Goals',
      activities: 'Activities',
      hours: 'Hours',
      monthlyGoal: 'Monthly Goal',
      yearlyGoal: 'Yearly Goal 2025',
      completed: 'Completed',
      percentComplete: '{n}% completed',
      remaining: '{time} remaining',
      everyHourCounts: 'Every hour dedicated counts!',
      everyMonthOpportunity: 'Every month is a new opportunity!',
      monthlyGoalReached: 'Monthly goal reached! Keep it up!',
      yearlyGoalReached: 'Yearly goal reached! What a blessing!',
      almostMonthly: 'Almost there with your monthly goal!',
      almostYearly: 'You\'re almost at your yearly goal!',
      keepGoing: 'Keep going! Every step matters.',
      summaryOf: 'Summary of {month}',
      houseToHouse: 'House to House',
      returnVisit: 'Return Visit',
      bibleStudy: 'Bible Study',
      returnVisits: 'Return Visits',
      bibleStudies: 'Studies',
      sessions: 'Sessions',
      publicWitnessing: 'Public Witnessing',
      phone: 'Phone',
      letter: 'Letter',
      informal: 'Informal',
      credit: 'Credit',
      total: 'Total',
      january: 'january',
      february: 'february',
      march: 'march',
      april: 'april',
      may: 'may',
      june: 'june',
      july: 'july',
      august: 'august',
      september: 'september',
      october: 'october',
      november: 'november',
      december: 'december',
      serviceYear: 'Service year {year}',
      inThisMonth: 'this month',
      inThisYear: 'this year',
      overview: 'Overview',
      activitiesThisMonth: 'activities this month',
      occurrencesThisMonth: 'occurrences this month',
      activitiesThisMonthCount: 'activities done this month',
      returnVisitsCount: 'return visits',
      studentsCount: 'students',
      activityDistribution: 'Activity Distribution',
      breakdownByActivity: 'Breakdown by Activity',
      dedicatedToMinistry: 'dedicated to ministry this month',
      timeDistribution: 'Time Distribution',
      noOccurrencesThisMonth: 'No occurrences of {activity} this month',
      noSessionsThisMonth: 'No sessions of {activity} this month',
      serviceYearLabel: 'Service Year',
      peopleRegistered: 'person registered',
      peopleRegisteredPlural: 'people registered',
      activeStudent: 'active student',
      activeStudentsPlural: 'active students',
      details: 'Details'
    },
    notificationTest: {
      title: 'Test Notifications',
      studyReminder: 'Study Reminder',
      idealSchedule: 'Ideal Schedule',
      bibleReading: 'Bible Reading',
      report: 'Report',
      forgottenStudy: 'Forgotten Study',
      fieldPause: 'Field Pause',
      verse: 'Verse',
      celebration: 'Celebration',
      encouragement: 'Encouragement',
      dpaExpiring: 'DPA Expiring',
      welcome: 'Welcome',
      anniversary: 'Anniversary',
      dailyText: 'Daily Text',
      syncOffline: 'Sync Offline',
      syncComplete: 'Sync Complete',
      description: 'Click the buttons above to test different types of notifications'
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
      ok: 'OK'
    },
    messages: {
      loading: 'Loading...',
      saving: 'Saving...',
      deleting: 'Deleting...',
      success: 'Success!',
      error: 'Error!',
      noData: 'No data found',
      requiredField: 'This field is required'
    }
  }
};

/**
 * Hook para obter traduções
 */
export function useTranslations(lang?: LanguageCode): Translations {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(
    lang || LanguageService.getLanguage()
  );
  
  useEffect(() => {
    if (lang) return; // Se lang foi passado como prop, não escuta mudanças
    
    const handleLanguageChange = () => {
      setCurrentLang(LanguageService.getLanguage());
    };
    
    LanguageService.on('mynis-language-change', handleLanguageChange);
    return () => LanguageService.off('mynis-language-change', handleLanguageChange);
  }, [lang]);
  
  return translations[currentLang];
}

/**
 * Função auxiliar para obter tradução específica
 */
export function t(lang: LanguageCode, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value[k];
    if (value === undefined) {
      console.warn(`Translation key not found: ${key} for language ${lang}`);
      return key;
    }
  }
  
  return value;
}