export interface TranslationKeys {
  appName: string;
  loginTitle: string;
  loginSubtitle: string;
  usernameLabel: string;
  passwordLabel: string;
  loginButton: string;
  welcomeMessage: string;
  dashboardGreeting: string;
  counterTitle: string;
  counterIncrement: string;
  counterDecrement: string;
  themeToggle: string;
  languageToggle: string;
  activeLanguage: string;
  activeTheme: string;
  activePermission: string;
  hasPermissionText: string;
  noPermissionText: string;
  apiSectionTitle: string;
  apiFetchData: string;
  apiStatusIdle: string;
  apiStatusLoading: string;
  apiStatusSuccess: string;
  apiStatusError: string;
  settingsTitle: string;
  homeTitle: string;
  permissionGuardDemo: string;
  requiredPermissionAdmin: string;
  requiredPermissionUser: string;
  logoutButton: string;
  requiredFieldsError: string;
  registerTitle: string;
  registerSubtitle: string;
  fullNameLabel: string;
  registerButton: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  guestWelcome: string;
  guestSubtitle: string;
  accountNumberLabel: string;
  availableBalanceLabel: string;
  actionTransfer: string;
  actionDeposit: string;
  actionWithdraw: string;
  actionStatement: string;
  transferTitle: string;
  transferSubtitle: string;
  recipientAccountLabel: string;
  amountLabel: string;
  transferSuccess: string;
  btnSubmitTransfer: string;
  depositTitle: string;
  depositSubtitle: string;
  depositSuccess: string;
  btnSubmitDeposit: string;
  withdrawTitle: string;
  withdrawSubtitle: string;
  withdrawSuccess: string;
  btnSubmitWithdraw: string;
  invalidAmountError: string;
  insufficientFundsError: string;
  accountNotFoundError: string;
  backToHome: string;
  btnMakeNewDeposit: string;
  btnMakeNewWithdraw: string;
  btnMakeNewTransfer: string;
  statementTitle: string;
  statementSubtitle: string;
  noTransactions: string;
  typeDEPOSIT: string;
  typeWITHDRAW: string;
  typeTRANSFER: string;
  settingsLanguageLabel: string;
  settingsThemeLabel: string;
  settingsHideBalanceLabel: string;
  settingsAntifraudEnabledLabel: string;
  settingsAntifraudLatitudeLabel: string;
  settingsAntifraudLongitudeLabel: string;
  settingsAntifraudRadiusLabel: string;
  settingsSearchAddressPlaceholder: string;
  settingsSearchAddressBtn: string;
  settingsCaptureLocationBtn: string;
  settingsNotificationsPushLabel: string;
  settingsTransferMaxLabel: string;
  settingsTransferMaxDailyLabel: string;
  settingsSaveBtn: string;
  settingsSaveSuccess: string;
  settingsSaveError: string;
  locationRequiredError: string;
  antifraudBlockedError: string;
  transferLimitExceededError: string;
  dailyLimitExceededError: string;
  settingsGeneralPreferences: string;
  settingsSecurityAntifraud: string;
  optionPt: string;
  optionEn: string;
  optionLight: string;
  optionDark: string;
  optionSystem: string;
  optionEnabled: string;
  optionDisabled: string;
}

export const translationSeeder: {
  en: TranslationKeys;
  pt: TranslationKeys;
} = {
  en: {
    appName: process.env.EXPO_PUBLIC_BANK_NAME || "JavaBank",
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to manage your digital assets",
    usernameLabel: "Username / E-mail",
    passwordLabel: "Password",
    loginButton: "Sign In",
    welcomeMessage: "Hello, {name}! Welcome to your secure banking session.",
    dashboardGreeting: "Hello, {name}!",
    counterTitle: "Redux State Counter",
    counterIncrement: "Increment State",
    counterDecrement: "Decrement State",
    themeToggle: "Toggle Theme Mode",
    languageToggle: "Switch Language",
    activeLanguage: "Active Language: English",
    activeTheme: "Active Theme: {theme}",
    activePermission: "Active Permission Role: {role}",
    hasPermissionText: "Granted: You have permission to see this special panel!",
    noPermissionText: "Locked: You do not have permission to view this panel.",
    apiSectionTitle: "RTK Query HTTP Client",
    apiFetchData: "Fetch Users API Test",
    apiStatusIdle: "Idle (Ready to fetch)",
    apiStatusLoading: "Loading from API...",
    apiStatusSuccess: "Success! Fetched {count} users.",
    apiStatusError: "Error fetching data from server.",
    settingsTitle: "App Settings",
    homeTitle: "Dashboard Overview",
    permissionGuardDemo: "Permission Guard Demonstration",
    requiredPermissionAdmin: "Requires Admin Role",
    requiredPermissionUser: "Requires User Role",
    logoutButton: "Sign Out",
    requiredFieldsError: "Please fill in all fields",
    registerTitle: "Create Account",
    registerSubtitle: `Sign up to start banking with ${process.env.EXPO_PUBLIC_BANK_NAME || "JavaBank"}`,
    fullNameLabel: "Full Name",
    registerButton: "Create Account",
    alreadyHaveAccount: "Already have an account? Sign In",
    dontHaveAccount: "Don't have an account? Sign Up",
    guestWelcome: `Welcome to ${process.env.EXPO_PUBLIC_BANK_NAME || "JavaBank"}`,
    guestSubtitle: "Sign in or create a new account to access secure digital banking services.",
    accountNumberLabel: "Account Number",
    availableBalanceLabel: "Available Balance",
    actionTransfer: "Transfer",
    actionDeposit: "Deposit",
    actionWithdraw: "Withdraw",
    actionStatement: "Statement",
    transferTitle: "Transfer Funds",
    transferSubtitle: "Transfer money securely to another account",
    recipientAccountLabel: "Recipient Account Number",
    amountLabel: "Amount",
    transferSuccess: "Transfer completed successfully!",
    btnSubmitTransfer: "Confirm Transfer",
    depositTitle: "Deposit Funds",
    depositSubtitle: "Add money to your balance",
    depositSuccess: "Deposit completed successfully!",
    btnSubmitDeposit: "Confirm Deposit",
    withdrawTitle: "Withdraw Funds",
    withdrawSubtitle: "Withdraw money from your balance",
    withdrawSuccess: "Withdrawal completed successfully!",
    btnSubmitWithdraw: "Confirm Withdrawal",
    invalidAmountError: "Please enter a valid amount",
    insufficientFundsError: "Insufficient funds in your account",
    accountNotFoundError: "Destination account not found",
    backToHome: "Back to Dashboard",
    btnMakeNewDeposit: "Make new deposit",
    btnMakeNewWithdraw: "Make new withdrawal",
    btnMakeNewTransfer: "Make new transfer",
    statementTitle: "Account Statement",
    statementSubtitle: "View your recent transaction history",
    noTransactions: "No transactions yet.",
    typeDEPOSIT: "Deposit",
    typeWITHDRAW: "Withdraw",
    typeTRANSFER: "Transfer",
    settingsLanguageLabel: "Language",
    settingsThemeLabel: "Theme",
    settingsHideBalanceLabel: "Hide Balance on Dashboard",
    settingsAntifraudEnabledLabel: "Antifraud Enabled",
    settingsAntifraudLatitudeLabel: "Antifraud - Latitude",
    settingsAntifraudLongitudeLabel: "Antifraud - Longitude",
    settingsAntifraudRadiusLabel: "Antifraud - Radius (km)",
    settingsSearchAddressPlaceholder: "Search for an address...",
    settingsSearchAddressBtn: "Search",
    settingsCaptureLocationBtn: "Capture current location",
    settingsNotificationsPushLabel: "Enable Push Notifications",
    settingsTransferMaxLabel: "Max Amount per Transfer ($)",
    settingsTransferMaxDailyLabel: "Daily Transfer Limit ($)",
    settingsSaveBtn: "Save Settings",
    settingsSaveSuccess: "Settings saved successfully!",
    settingsSaveError: "Error saving settings.",
    locationRequiredError: "Could not retrieve your current location to validate antifraud.",
    antifraudBlockedError: "Security Block: Transfer location is outside your allowed geographical radius.",
    transferLimitExceededError: "Transfer amount exceeds your allowed per-transaction limit.",
    dailyLimitExceededError: "Transfer amount exceeds your daily accumulated transfer limit.",
    settingsGeneralPreferences: "General Preferences",
    settingsSecurityAntifraud: "Security & Antifraud",
    optionPt: "Portuguese",
    optionEn: "English",
    optionLight: "Light",
    optionDark: "Dark",
    optionSystem: "System / Automatic",
    optionEnabled: "Enabled",
    optionDisabled: "Disabled"
  },
  pt: {
    appName: process.env.EXPO_PUBLIC_BANK_NAME || "JavaBank",
    loginTitle: "Bem-vindo de Volta",
    loginSubtitle: "Entre para gerenciar seus ativos digitais",
    usernameLabel: "Usuário / E-mail",
    passwordLabel: "Senha",
    loginButton: "Entrar",
    welcomeMessage: "Olá, {name}! Bem-vindo à sua sessão bancária segura.",
    dashboardGreeting: "Olá, {name}!",
    counterTitle: "Contador do Redux State",
    counterIncrement: "Incrementar Estado",
    counterDecrement: "Decrementar Estado",
    themeToggle: "Alternar Tema",
    languageToggle: "Mudar Idioma",
    activeLanguage: "Idioma Ativo: Português",
    activeTheme: "Tema Ativo: {theme}",
    activePermission: "Nível de Permissão Ativo: {role}",
    hasPermissionText: "Permitido: Você tem permissão para ver este painel especial!",
    noPermissionText: "Bloqueado: Você não tem permissão para visualizar este painel.",
    apiSectionTitle: "RTK Query HTTP Client",
    apiFetchData: "Testar API Buscar Usuários",
    apiStatusIdle: "Ocioso (Pronto para buscar)",
    apiStatusLoading: "Carregando da API...",
    apiStatusSuccess: "Sucesso! Buscou {count} usuários.",
    apiStatusError: "Erro ao buscar dados do servidor.",
    settingsTitle: "Configurações",
    homeTitle: "Visão Geral",
    permissionGuardDemo: "Demonstração de Guarda de Permissão",
    requiredPermissionAdmin: "Requer Função Administrador",
    requiredPermissionUser: "Requer Função Usuário",
    logoutButton: "Sair",
    requiredFieldsError: "Por favor, preencha todos os campos",
    registerTitle: "Criar Conta",
    registerSubtitle: `Cadastre-se para começar a usar o ${process.env.EXPO_PUBLIC_BANK_NAME || "JavaBank"}`,
    fullNameLabel: "Nome Completo",
    registerButton: "Criar Conta",
    alreadyHaveAccount: "Já tem uma conta? Entrar",
    dontHaveAccount: "Não tem uma conta? Cadastre-se",
    guestWelcome: `Bem-vindo ao ${process.env.EXPO_PUBLIC_BANK_NAME || "JavaBank"}`,
    guestSubtitle: "Entre ou crie uma nova conta para acessar os serviços bancários digitais seguros.",
    accountNumberLabel: "Número da Conta",
    availableBalanceLabel: "Saldo Disponível",
    actionTransfer: "Transferência",
    actionDeposit: "Depósito",
    actionWithdraw: "Saque",
    actionStatement: "Extrato",
    transferTitle: "Transferência de Recursos",
    transferSubtitle: "Transfira dinheiro de forma segura para outra conta",
    recipientAccountLabel: "Número da Conta de Destino",
    amountLabel: "Valor",
    transferSuccess: "Transferência realizada com sucesso!",
    btnSubmitTransfer: "Confirmar Transferência",
    depositTitle: "Depositar Recursos",
    depositSubtitle: "Adicione dinheiro ao seu saldo",
    depositSuccess: "Depósito realizado com sucesso!",
    btnSubmitDeposit: "Confirmar Depósito",
    withdrawTitle: "Sacar Recursos",
    withdrawSubtitle: "Saque dinheiro do seu saldo",
    withdrawSuccess: "Saque realizado com sucesso!",
    btnSubmitWithdraw: "Confirmar Saque",
    invalidAmountError: "Por favor, insira um valor válido",
    insufficientFundsError: "Saldo insuficiente na sua conta",
    accountNotFoundError: "Conta de destino não encontrada",
    backToHome: "Voltar ao Painel",
    btnMakeNewDeposit: "Fazer novo depósito",
    btnMakeNewWithdraw: "Fazer novo saque",
    btnMakeNewTransfer: "Fazer nova transferência",
    statementTitle: "Extrato da Conta",
    statementSubtitle: "Veja seu histórico recente de transações",
    noTransactions: "Nenhuma transação ainda.",
    typeDEPOSIT: "Depósito",
    typeWITHDRAW: "Saque",
    typeTRANSFER: "Transferência",
    settingsLanguageLabel: "Idioma",
    settingsThemeLabel: "Tema",
    settingsHideBalanceLabel: "Ocultar Saldo no Dashboard",
    settingsAntifraudEnabledLabel: "Antifraude Ativado",
    settingsAntifraudLatitudeLabel: "Antifraude - Latitude",
    settingsAntifraudLongitudeLabel: "Antifraude - Longitude",
    settingsAntifraudRadiusLabel: "Antifraude - Raio (km)",
    settingsSearchAddressPlaceholder: "Buscar por um endereço...",
    settingsSearchAddressBtn: "Buscar",
    settingsCaptureLocationBtn: "Capturar localização atual",
    settingsNotificationsPushLabel: "Habilitar Notificações Push",
    settingsTransferMaxLabel: "Limite Máximo por Transferência (R$)",
    settingsTransferMaxDailyLabel: "Limite Diário de Transferência (R$)",
    settingsSaveBtn: "Salvar Configurações",
    settingsSaveSuccess: "Configurações salvas com sucesso!",
    settingsSaveError: "Erro ao salvar as configurações.",
    locationRequiredError: "Não foi possível obter sua localização atual para validar o antifraude.",
    antifraudBlockedError: "Bloqueio de Segurança: A localização desta transferência está fora do raio geográfico permitido.",
    transferLimitExceededError: "O valor da transferência excede o limite máximo permitido por transação.",
    dailyLimitExceededError: "O valor acumulado de transferências excede o seu limite diário permitido.",
    settingsGeneralPreferences: "Preferências Gerais",
    settingsSecurityAntifraud: "Segurança e Antifraude",
    optionPt: "Português",
    optionEn: "Inglês",
    optionLight: "Claro",
    optionDark: "Escuro",
    optionSystem: "Automático / Sistema",
    optionEnabled: "Ativado",
    optionDisabled: "Desativado"
  }
};
