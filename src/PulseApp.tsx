import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════
// INTERNATIONALIZATION
// ═══════════════════════════════════════════
const LANGS = {
  en: { flag: "🇺🇸", label: "English" },
  es: { flag: "🇲🇽", label: "Español" },
  pt: { flag: "🇧🇷", label: "Português" },
  fr: { flag: "🇫🇷", label: "Français" },
  zh: { flag: "🇨🇳", label: "中文" },
  ar: { flag: "🇸🇦", label: "العربية" },
};

const T = {
  en: {
    investorDemo: "INVESTOR DEMO", interactive: "Interactive Prototype", welcomeBack: "Welcome back",
    availableBalance: "Available Balance", demoWallet: "USD • Demo Wallet", safeTo: "Safe to send: up to",
    aiOpportunities: "✨ AI Opportunities", seeAll: "See all →", sendMoney: "Send Money to Mexico 🇲🇽",
    liveRate: "Live Rate", recentTransfers: "Recent Transfers", sendMoneyTitle: "Send Money",
    enterAmount: "Enter the amount in USD", available: "Available", recipientGets: "RECIPIENT GETS",
    cont: "Continue", back: "← Back", chooseRecipient: "Choose Recipient", selectWho: "Select who receives",
    addNew: "+ Add New Recipient", reviewTransfer: "Review Transfer", youSend: "You send",
    gets: "gets", recipient: "Recipient", destination: "Destination", exchangeRate: "Exchange Rate",
    transferFee: "Transfer Fee", free: "Free", budgetGuard: "Budget Guard", delivery: "Delivery",
    under60: "Under 60 seconds", howPulse: "How Pulse works:", howDesc: "Your USD is captured via Stripe, converted to USDC stablecoin on Solana, then pushed as MXN to the recipient's debit card via Visa Direct — all in seconds.",
    payApple: " Pay with Apple Pay", demoMode: "Demo mode — no real payment will be made",
    processing: "Processing Transfer", complete: "Transfer Complete!", received: "received",
    receipt: "Transaction Receipt", txId: "Transaction ID", amtSent: "Amount Sent",
    amtReceived: "Amount Received", fee: "Fee", rail: "Rail", status: "Status",
    delivered: "✓ Delivered", seeRecipient: "See What", sees: "Sees →",
    sendAnother: "Send Another Transfer", withinSafe: "✓ Within safe limit",
    softWarn: "⚠ Soft warning", approved: "✓ Approved", userOverride: "⚠ User override",
    withinBudget: "Within your safe budget", budgetSoft: "Budget Guard — Soft warning (you can still send)",
    auth: "Authenticating payment", capturing: "Capturing funds", budgetCheck: "Budget Guard check",
    bridge: "USDC stablecoin bridge", converting: "Converting USD → MXN", pushing: "Pushing to recipient card",
    remittance: "Remittance", creditBuilder: "Credit Builder", simError: "Simulate Error",
    // Receiver
    hello: "¡Hola! 👋", balAvail: "Saldo Disponible", txReceived: "Transferencia recibida",
    from: "De", via: "Vía Pulse", details: "Detalles", origAmount: "Monto original",
    fxRate: "Tipo de cambio", amtRx: "Monto recibido", feePaid: "Comisión cobrada",
    method: "Método", visaDirect: "Visa Direct • Instantáneo", reference: "Referencia",
    credited: "✓ Acreditado", recentMoves: "Movimientos recientes", now: "Ahora",
    senderView: "🇺🇸 Sender", recipientView: "🇲🇽 Recipient",
    // Credit Builder
    cbTitle: "Credit Builder", cbDesc: "Build US credit history through your remittance patterns",
    cbScore: "Pulse Credit Score", cbPayments: "On-Time Payments", cbConsistency: "Consistency",
    cbGenerate: "✨ Generate AI Credit Letter", cbGenerating: "Generating with AI...",
    cbDownload: "Download PDF", cbHistory: "Payment History",
    // AI
    aiName: "Pulse AI", aiGreeting: "Hi! 👋 I'm your Pulse financial assistant powered by AI. Ask me anything about your finances.",
    aiSuggested: "SUGGESTED",
    aiQ1: "Can I afford to send $200?", aiQ2: "How much did I save on fees?", aiQ3: "Suggest an investment",
    // Error modal
    errTitle: "Transaction Issue", errExplain: "AI Explanation", errRetry: "Retry Transaction", errClose: "Dismiss",
  },
  es: {
    investorDemo: "DEMO PARA INVERSIONISTAS", interactive: "Prototipo Interactivo", welcomeBack: "Bienvenido",
    availableBalance: "Saldo Disponible", demoWallet: "USD • Billetera Demo", safeTo: "Seguro enviar: hasta",
    aiOpportunities: "✨ Oportunidades IA", seeAll: "Ver todo →", sendMoney: "Enviar Dinero a México 🇲🇽",
    liveRate: "Tasa en Vivo", recentTransfers: "Transferencias Recientes", sendMoneyTitle: "Enviar Dinero",
    enterAmount: "Ingresa el monto en USD", available: "Disponible", recipientGets: "DESTINATARIO RECIBE",
    cont: "Continuar", back: "← Atrás", chooseRecipient: "Elegir Destinatario", selectWho: "Selecciona quién recibe",
    addNew: "+ Agregar Nuevo", reviewTransfer: "Revisar Transferencia", youSend: "Envías",
    gets: "recibe", recipient: "Destinatario", destination: "Destino", exchangeRate: "Tipo de Cambio",
    transferFee: "Comisión", free: "Gratis", budgetGuard: "Guardia de Presupuesto", delivery: "Entrega",
    under60: "Menos de 60 segundos", howPulse: "Cómo funciona Pulse:", howDesc: "Tu USD se captura vía Stripe, se convierte a USDC en Solana, y se envía como MXN a la tarjeta del destinatario vía Visa Direct — en segundos.",
    payApple: " Pagar con Apple Pay", demoMode: "Modo demo — no se realizará ningún pago real",
    processing: "Procesando Transferencia", complete: "¡Transferencia Completa!", received: "recibió",
    receipt: "Recibo de Transacción", txId: "ID de Transacción", amtSent: "Monto Enviado",
    amtReceived: "Monto Recibido", fee: "Comisión", rail: "Riel", status: "Estado",
    delivered: "✓ Entregado", seeRecipient: "Ver lo que", sees: "Ve →",
    sendAnother: "Enviar Otra Transferencia", withinSafe: "✓ Dentro del límite seguro",
    softWarn: "⚠ Advertencia suave", approved: "✓ Aprobado", userOverride: "⚠ Aprobado por usuario",
    withinBudget: "Dentro de tu presupuesto seguro", budgetSoft: "Guardia — Advertencia suave (puedes enviar)",
    auth: "Autenticando pago", capturing: "Capturando fondos", budgetCheck: "Verificación de presupuesto",
    bridge: "Puente USDC stablecoin", converting: "Convirtiendo USD → MXN", pushing: "Enviando a tarjeta",
    remittance: "Remesas", creditBuilder: "Constructor de Crédito", simError: "Simular Error",
    hello: "¡Hola! 👋", balAvail: "Saldo Disponible", txReceived: "Transferencia recibida",
    from: "De", via: "Vía Pulse", details: "Detalles", origAmount: "Monto original",
    fxRate: "Tipo de cambio", amtRx: "Monto recibido", feePaid: "Comisión cobrada",
    method: "Método", visaDirect: "Visa Direct • Instantáneo", reference: "Referencia",
    credited: "✓ Acreditado", recentMoves: "Movimientos recientes", now: "Ahora",
    senderView: "🇺🇸 Remitente", recipientView: "🇲🇽 Destinatario",
    cbTitle: "Constructor de Crédito", cbDesc: "Construye historial crediticio con tus patrones de envío",
    cbScore: "Puntaje Pulse", cbPayments: "Pagos a Tiempo", cbConsistency: "Consistencia",
    cbGenerate: "✨ Generar Carta de Crédito IA", cbGenerating: "Generando con IA...",
    cbDownload: "Descargar PDF", cbHistory: "Historial de Pagos",
    aiName: "Pulse IA", aiGreeting: "¡Hola! 👋 Soy tu asistente financiero Pulse con IA. Pregúntame lo que quieras.",
    aiSuggested: "SUGERENCIAS",
    aiQ1: "¿Puedo enviar $200?", aiQ2: "¿Cuánto ahorré en comisiones?", aiQ3: "Sugiere una inversión",
    errTitle: "Problema de Transacción", errExplain: "Explicación IA", errRetry: "Reintentar", errClose: "Cerrar",
  },
  pt: { investorDemo: "DEMO INVESTIDOR", interactive: "Protótipo Interativo", welcomeBack: "Bem-vindo", availableBalance: "Saldo Disponível", demoWallet: "USD • Carteira Demo", safeTo: "Seguro enviar: até", aiOpportunities: "✨ Oportunidades IA", seeAll: "Ver tudo →", sendMoney: "Enviar para México 🇲🇽", liveRate: "Taxa Ao Vivo", recentTransfers: "Transferências Recentes", sendMoneyTitle: "Enviar Dinheiro", enterAmount: "Digite o valor em USD", available: "Disponível", recipientGets: "DESTINATÁRIO RECEBE", cont: "Continuar", back: "← Voltar", chooseRecipient: "Escolher Destinatário", selectWho: "Selecione quem recebe", addNew: "+ Adicionar Novo", reviewTransfer: "Revisar Transferência", youSend: "Você envia", gets: "recebe", recipient: "Destinatário", destination: "Destino", exchangeRate: "Taxa de Câmbio", transferFee: "Taxa", free: "Grátis", budgetGuard: "Guarda Orçamento", delivery: "Entrega", under60: "Menos de 60 segundos", howPulse: "Como funciona:", howDesc: "USD capturado via Stripe, convertido em USDC no Solana, e enviado como MXN via Visa Direct.", payApple: " Pagar com Apple Pay", demoMode: "Modo demo — nenhum pagamento real", processing: "Processando", complete: "Transferência Completa!", received: "recebeu", receipt: "Recibo", txId: "ID da Transação", amtSent: "Valor Enviado", amtReceived: "Valor Recebido", fee: "Taxa", rail: "Trilho", status: "Status", delivered: "✓ Entregue", seeRecipient: "Ver o que", sees: "Vê →", sendAnother: "Enviar Outra", withinSafe: "✓ Dentro do limite", softWarn: "⚠ Aviso", approved: "✓ Aprovado", userOverride: "⚠ Aprovado pelo usuário", withinBudget: "Dentro do orçamento", budgetSoft: "Guarda — Aviso suave", auth: "Autenticando", capturing: "Capturando", budgetCheck: "Verificação", bridge: "Ponte USDC", converting: "Convertendo", pushing: "Enviando", remittance: "Remessa", creditBuilder: "Construtor de Crédito", simError: "Simular Erro", hello: "Olá! 👋", balAvail: "Saldo", txReceived: "Transferência recebida", from: "De", via: "Via Pulse", details: "Detalhes", origAmount: "Valor original", fxRate: "Taxa de câmbio", amtRx: "Valor recebido", feePaid: "Taxa cobrada", method: "Método", visaDirect: "Visa Direct", reference: "Referência", credited: "✓ Creditado", recentMoves: "Movimentos recentes", now: "Agora", senderView: "🇺🇸 Remetente", recipientView: "🇲🇽 Destinatário", cbTitle: "Construtor de Crédito", cbDesc: "Construa histórico de crédito", cbScore: "Score Pulse", cbPayments: "Pagamentos em Dia", cbConsistency: "Consistência", cbGenerate: "✨ Gerar Carta IA", cbGenerating: "Gerando...", cbDownload: "Baixar PDF", cbHistory: "Histórico", aiName: "Pulse IA", aiGreeting: "Olá! 👋 Sou seu assistente financeiro.", aiSuggested: "SUGESTÕES", aiQ1: "Posso enviar $200?", aiQ2: "Quanto economizei?", aiQ3: "Sugira investimento", errTitle: "Problema", errExplain: "Explicação IA", errRetry: "Tentar Novamente", errClose: "Fechar" },
  fr: { investorDemo: "DÉMO INVESTISSEUR", interactive: "Prototype Interactif", welcomeBack: "Bienvenue", availableBalance: "Solde Disponible", demoWallet: "USD • Portefeuille Démo", safeTo: "Sûr d'envoyer: jusqu'à", aiOpportunities: "✨ Opportunités IA", seeAll: "Voir tout →", sendMoney: "Envoyer au Mexique 🇲🇽", liveRate: "Taux en Direct", recentTransfers: "Transferts Récents", sendMoneyTitle: "Envoyer", enterAmount: "Entrez le montant en USD", available: "Disponible", recipientGets: "LE DESTINATAIRE REÇOIT", cont: "Continuer", back: "← Retour", chooseRecipient: "Choisir", selectWho: "Sélectionner le destinataire", addNew: "+ Ajouter", reviewTransfer: "Vérifier", youSend: "Vous envoyez", gets: "reçoit", recipient: "Destinataire", destination: "Destination", exchangeRate: "Taux de Change", transferFee: "Frais", free: "Gratuit", budgetGuard: "Garde Budget", delivery: "Livraison", under60: "Moins de 60 secondes", howPulse: "Comment ça marche:", howDesc: "USD capturé via Stripe, converti en USDC sur Solana, puis envoyé en MXN via Visa Direct.", payApple: " Payer avec Apple Pay", demoMode: "Mode démo", processing: "Traitement", complete: "Transfert Terminé!", received: "a reçu", receipt: "Reçu", txId: "ID Transaction", amtSent: "Montant Envoyé", amtReceived: "Montant Reçu", fee: "Frais", rail: "Rail", status: "Statut", delivered: "✓ Livré", seeRecipient: "Voir ce que", sees: "Voit →", sendAnother: "Envoyer un Autre", withinSafe: "✓ Dans la limite", softWarn: "⚠ Avertissement", approved: "✓ Approuvé", userOverride: "⚠ Approuvé", withinBudget: "Dans le budget", budgetSoft: "Garde — Avertissement", auth: "Authentification", capturing: "Capture", budgetCheck: "Vérification budget", bridge: "Pont USDC", converting: "Conversion", pushing: "Envoi", remittance: "Transfert", creditBuilder: "Crédit", simError: "Simuler Erreur", hello: "Bonjour! 👋", balAvail: "Solde", txReceived: "Transfert reçu", from: "De", via: "Via Pulse", details: "Détails", origAmount: "Montant original", fxRate: "Taux de change", amtRx: "Montant reçu", feePaid: "Frais", method: "Méthode", visaDirect: "Visa Direct", reference: "Référence", credited: "✓ Crédité", recentMoves: "Mouvements récents", now: "Maintenant", senderView: "🇺🇸 Expéditeur", recipientView: "🇲🇽 Destinataire", cbTitle: "Crédit", cbDesc: "Construisez votre historique", cbScore: "Score Pulse", cbPayments: "Paiements à Temps", cbConsistency: "Régularité", cbGenerate: "✨ Générer Lettre IA", cbGenerating: "Génération...", cbDownload: "Télécharger", cbHistory: "Historique", aiName: "Pulse IA", aiGreeting: "Bonjour! 👋 Je suis votre assistant financier.", aiSuggested: "SUGGESTIONS", aiQ1: "Puis-je envoyer $200?", aiQ2: "Combien ai-je économisé?", aiQ3: "Suggérer investissement", errTitle: "Problème", errExplain: "Explication IA", errRetry: "Réessayer", errClose: "Fermer" },
  zh: { investorDemo: "投资者演示", interactive: "交互原型", welcomeBack: "欢迎回来", availableBalance: "可用余额", demoWallet: "USD • 演示钱包", safeTo: "安全发送：最多", aiOpportunities: "✨ AI 投资机会", seeAll: "查看全部 →", sendMoney: "汇款到墨西哥 🇲🇽", liveRate: "实时汇率", recentTransfers: "最近转账", sendMoneyTitle: "汇款", enterAmount: "输入美元金额", available: "可用", recipientGets: "收款人收到", cont: "继续", back: "← 返回", chooseRecipient: "选择收款人", selectWho: "选择接收", addNew: "+ 添加新收款人", reviewTransfer: "确认转账", youSend: "您发送", gets: "收到", recipient: "收款人", destination: "目的地", exchangeRate: "汇率", transferFee: "手续费", free: "免费", budgetGuard: "预算守护", delivery: "到账", under60: "60秒内", howPulse: "Pulse 如何运作：", howDesc: "通过Stripe捕获USD，在Solana上转换为USDC，然后通过Visa Direct发送MXN。", payApple: " Apple Pay 支付", demoMode: "演示模式 — 不会产生真实付款", processing: "处理中", complete: "转账完成！", received: "收到了", receipt: "交易收据", txId: "交易ID", amtSent: "发送金额", amtReceived: "接收金额", fee: "费用", rail: "通道", status: "状态", delivered: "✓ 已送达", seeRecipient: "查看", sees: "看到的 →", sendAnother: "再次转账", withinSafe: "✓ 安全范围内", softWarn: "⚠ 软警告", approved: "✓ 已批准", userOverride: "⚠ 用户确认", withinBudget: "预算安全", budgetSoft: "预算守护 — 软警告", auth: "认证支付", capturing: "捕获资金", budgetCheck: "预算检查", bridge: "USDC 桥接", converting: "转换中", pushing: "推送到卡", remittance: "汇款", creditBuilder: "信用建设", simError: "模拟错误", hello: "你好！👋", balAvail: "可用余额", txReceived: "收到转账", from: "来自", via: "通过 Pulse", details: "详情", origAmount: "原始金额", fxRate: "汇率", amtRx: "收到金额", feePaid: "手续费", method: "方式", visaDirect: "Visa Direct", reference: "参考号", credited: "✓ 已入账", recentMoves: "最近交易", now: "刚刚", senderView: "🇺🇸 发送方", recipientView: "🇲🇽 接收方", cbTitle: "信用建设", cbDesc: "通过汇款记录建立信用", cbScore: "Pulse 信用分", cbPayments: "准时付款", cbConsistency: "一致性", cbGenerate: "✨ AI生成信用信", cbGenerating: "生成中...", cbDownload: "下载PDF", cbHistory: "历史记录", aiName: "Pulse AI", aiGreeting: "你好！👋 我是你的Pulse金融助手。", aiSuggested: "建议", aiQ1: "我能发送$200吗？", aiQ2: "我节省了多少费用？", aiQ3: "建议投资", errTitle: "交易问题", errExplain: "AI 解释", errRetry: "重试", errClose: "关闭" },
  ar: { investorDemo: "عرض المستثمر", interactive: "نموذج تفاعلي", welcomeBack: "مرحباً", availableBalance: "الرصيد المتاح", demoWallet: "USD • محفظة تجريبية", safeTo: "آمن للإرسال: حتى", aiOpportunities: "✨ فرص الذكاء الاصطناعي", seeAll: "عرض الكل ←", sendMoney: "إرسال أموال إلى المكسيك 🇲🇽", liveRate: "سعر مباشر", recentTransfers: "التحويلات الأخيرة", sendMoneyTitle: "إرسال أموال", enterAmount: "أدخل المبلغ بالدولار", available: "متاح", recipientGets: "المستلم يحصل على", cont: "متابعة", back: "→ رجوع", chooseRecipient: "اختر المستلم", selectWho: "اختر من يستلم", addNew: "+ إضافة مستلم", reviewTransfer: "مراجعة التحويل", youSend: "ترسل", gets: "يستلم", recipient: "المستلم", destination: "الوجهة", exchangeRate: "سعر الصرف", transferFee: "الرسوم", free: "مجاني", budgetGuard: "حارس الميزانية", delivery: "التسليم", under60: "أقل من 60 ثانية", howPulse: "كيف يعمل Pulse:", howDesc: "يتم التقاط الدولار عبر Stripe، وتحويله إلى USDC على Solana، ثم إرساله كـ MXN عبر Visa Direct.", payApple: " الدفع بـ Apple Pay", demoMode: "وضع تجريبي", processing: "جاري المعالجة", complete: "!تم التحويل", received: "استلم", receipt: "إيصال", txId: "معرف المعاملة", amtSent: "المبلغ المرسل", amtReceived: "المبلغ المستلم", fee: "رسوم", rail: "القناة", status: "الحالة", delivered: "✓ تم التسليم", seeRecipient: "شاهد ما", sees: "يرى ←", sendAnother: "إرسال تحويل آخر", withinSafe: "✓ ضمن الحد الآمن", softWarn: "⚠ تحذير", approved: "✓ موافق عليه", userOverride: "⚠ موافقة المستخدم", withinBudget: "ضمن الميزانية", budgetSoft: "حارس الميزانية — تحذير", auth: "مصادقة الدفع", capturing: "التقاط الأموال", budgetCheck: "فحص الميزانية", bridge: "جسر USDC", converting: "تحويل العملة", pushing: "الإرسال للبطاقة", remittance: "التحويلات", creditBuilder: "بناء الائتمان", simError: "محاكاة خطأ", hello: "!مرحباً 👋", balAvail: "الرصيد المتاح", txReceived: "تحويل مستلم", from: "من", via: "عبر Pulse", details: "التفاصيل", origAmount: "المبلغ الأصلي", fxRate: "سعر الصرف", amtRx: "المبلغ المستلم", feePaid: "الرسوم", method: "الطريقة", visaDirect: "Visa Direct", reference: "المرجع", credited: "✓ تم الإيداع", recentMoves: "الحركات الأخيرة", now: "الآن", senderView: "🇺🇸 المرسل", recipientView: "🇲🇽 المستلم", cbTitle: "بناء الائتمان", cbDesc: "ابنِ تاريخك الائتماني", cbScore: "درجة Pulse", cbPayments: "مدفوعات في الوقت", cbConsistency: "الانتظام", cbGenerate: "✨ إنشاء خطاب ائتمان", cbGenerating: "...جاري الإنشاء", cbDownload: "تحميل PDF", cbHistory: "السجل", aiName: "Pulse AI", aiGreeting: "!مرحباً 👋 أنا مساعدك المالي", aiSuggested: "مقترحات", aiQ1: "هل يمكنني إرسال $200؟", aiQ2: "كم وفرت من الرسوم؟", aiQ3: "اقترح استثمار", errTitle: "مشكلة", errExplain: "شرح الذكاء الاصطناعي", errRetry: "إعادة المحاولة", errClose: "إغلاق" },
};

// ═══════════════════════════════════════════
// CONSTANTS & HELPERS
// ═══════════════════════════════════════════
const FX_RATE = 20.47;
const INITIAL_BALANCE = 100.0;
const formatUSD = (n) => `$${Number(n).toFixed(2)}`;
const formatMXN = (n) => `$${Number(n).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uuid = () => "PLS-" + Math.random().toString(36).slice(2, 10).toUpperCase();

const CONTACTS = [
  { id: 1, name: "María García", initials: "MG", city: "Mexico City", card: "4000 •••• •••• 7842", color: "#E8505B", prevBalance: 3420.5 },
  { id: 2, name: "Carlos López", initials: "CL", city: "Guadalajara", card: "4000 •••• •••• 3156", color: "#14B8A6", prevBalance: 1250.0 },
  { id: 3, name: "Ana Rodríguez", initials: "AR", city: "Monterrey", card: "4000 •••• •••• 9284", color: "#8B5CF6", prevBalance: 890.75 },
];

// Budget Guard
const SAFE_AMT = 65;
function getBudgetWarning(amount, balance) {
  const sa = Math.min(SAFE_AMT, balance);
  if (amount <= sa) return { level: "safe", safeAmount: sa, message: null };
  if (amount <= sa * 1.3) return { level: "caution", safeAmount: sa, message: `⚠️ Above recommended ${formatUSD(sa)}. Rent due in 5 days.` };
  return { level: "warning", safeAmount: sa, message: `🚨 Exceeds safe limit of ${formatUSD(sa)} by ${formatUSD(amount - sa)}.` };
}

// Opportunity Engine
function getSuggestions(bal) {
  const s = [];
  if (bal >= 5) s.push({ id: "1", title: "Round-Up Savings", yield: "4.2% APY", risk: "low", min: 1, icon: "🪙", grad: "linear-gradient(135deg,#059669,#10B981)", desc: "Auto-save spare change" });
  if (bal >= 10) s.push({ id: "2", title: "S&P 500 Micro", yield: "~10% avg/yr", risk: "low", min: 5, icon: "📈", grad: "linear-gradient(135deg,#2563EB,#3B82F6)", desc: "Fractional index fund" });
  if (bal >= 25) s.push({ id: "3", title: "Bitcoin Fractional", yield: "Volatile", risk: "high", min: 10, icon: "₿", grad: "linear-gradient(135deg,#D97706,#F59E0B)", desc: "BTC from $10" });
  if (bal >= 15) s.push({ id: "4", title: "MXN Gov Bond", yield: "9.1% APY", risk: "low", min: 10, icon: "🏛️", grad: "linear-gradient(135deg,#7C3AED,#8B5CF6)", desc: "High-yield bonds" });
  return s;
}

// Credit Builder mock data
const CREDIT_HISTORY = [
  { date: "2026-01-15", amount: 200, status: "on-time" },
  { date: "2025-12-20", amount: 150, status: "on-time" },
  { date: "2025-11-10", amount: 300, status: "on-time" },
  { date: "2025-10-05", amount: 100, status: "on-time" },
  { date: "2025-09-18", amount: 250, status: "late" },
  { date: "2025-08-22", amount: 175, status: "on-time" },
];

// ═══════════════════════════════════════════
// ANIMATED NUMBER
// ═══════════════════════════════════════════
function AnimNum({ value, prefix = "", suffix = "" }) {
  const [d, setD] = useState(value);
  const ref = useRef({ s: value, t: value, st: 0 });
  useEffect(() => {
    ref.current = { s: d, t: value, st: performance.now() };
    let raf;
    const tick = (now) => { const t = Math.min((now - ref.current.st) / 600, 1); const e = 1 - Math.pow(1 - t, 3); setD(ref.current.s + (ref.current.t - ref.current.s) * e); if (t < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{prefix}{Number(d).toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}</span>;
}

// ═══════════════════════════════════════════
// GEMINI AI INTEGRATION
// ═══════════════════════════════════════════
async function callAI(prompt, lang = "en") {
  try {
    const systemPrompt = `You are Pulse AI, a friendly bilingual fintech assistant. Respond in ${LANGS[lang]?.label || "English"}. Be concise (3-5 sentences max). Use **bold** for key numbers. You're advising a user with $100 balance, $65 safe-to-send limit, $1200 rent due in 5 days, who has saved $14.97 in fees using Pulse's 0% fee model vs 4.9% industry average. Available investments: Round-Up Savings (4.2% APY), S&P 500 Micro-Share (~10%/yr), MXN Gov Bond ETF (9.1% APY), Bitcoin Fractional.`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("\n") || "I'm here to help with your finances.";
  } catch {
    return lang === "es" ? "Basado en tu perfil, tu límite seguro es **$65.00**. Tu renta de $1,200 vence en 5 días." : "Based on your profile, your safe limit is **$65.00**. Your $1,200 rent is due in 5 days.";
  }
}

async function callAIForError(errorCode, context, lang = "en") {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: `You explain banking/fintech errors to regular people in ${LANGS[lang]?.label || "English"}. Be warm, simple, and reassuring. 2-3 sentences. No jargon.`,
        messages: [{ role: "user", content: `Error code: ${errorCode}. Context: ${context}. Explain this simply.` }],
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("\n") || "A temporary issue occurred. Your money is safe.";
  } catch {
    return "A temporary issue occurred with your payment. Your money is safe and no charges were made. Please try again in a moment.";
  }
}

async function callAIForCredit(history, lang = "en") {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        system: `You are a credit analyst at Pulse Financial. Write a professional credit verification letter in ${LANGS[lang]?.label || "English"} for Alex Thompson based on their remittance history. The letter should be suitable for presenting to US credit bureaus. Include: total transactions, on-time rate, consistency assessment. Be formal but encouraging. Date: February 8, 2026.`,
        messages: [{ role: "user", content: `Payment history: ${JSON.stringify(history)}. Total sent: $1,175. On-time rate: 83%. Generate the credit letter.` }],
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("\n") || "Credit letter generation failed. Please try again.";
  } catch {
    return "PULSE FINANCIAL SERVICES\nCredit Verification Letter\n\nTo Whom It May Concern,\n\nThis letter certifies that Alex Thompson has maintained a consistent remittance pattern through Pulse Financial. Over the past 6 months, the account holder completed 6 international transfers totaling $1,175.00 with an 83% on-time payment rate.\n\nThis pattern demonstrates financial responsibility and consistent cross-border payment behavior.\n\nSincerely,\nPulse Financial Services\nDate: February 8, 2026";
  }
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
const SCR = { HOME: 0, AMT: 1, RECIP: 2, REVIEW: 3, PROC: 4, OK: 5, RX: 6 };
const TABS = { SEND: "send", CREDIT: "credit" };

export default function PulseApp() {
  const [lang, setLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);
  const t = T[lang] || T.en;
  const isRTL = lang === "ar";

  const [tab, setTab] = useState(TABS.SEND);
  const [screen, setScreen] = useState(SCR.HOME);
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [txHistory, setTxHistory] = useState([]);
  const [steps, setSteps] = useState([]);
  const [txId, setTxId] = useState("");
  const [slideDir, setSlideDir] = useState("right");
  const [aKey, setAKey] = useState(0);
  const [rxPhase, setRxPhase] = useState(0);
  const [rxBal, setRxBal] = useState(false);
  const [viewMode, setViewMode] = useState("sender");
  const [chatOpen, setChatOpen] = useState(false);
  const [investOpp, setInvestOpp] = useState(null);
  const [errModal, setErrModal] = useState({ open: false, code: "", ctx: "", explanation: "" });

  // Credit Builder state
  const [creditLetter, setCreditLetter] = useState("");
  const [creditLoading, setCreditLoading] = useState(false);

  const nav = (s, dir = "right") => { setSlideDir(dir); setAKey(k => k + 1); setScreen(s); };
  const mxn = (parseFloat(amount) || 0) * FX_RATE;
  const bw = getBudgetWarning(parseFloat(amount) || 0, balance);
  const sugs = getSuggestions(balance);

  // Transaction
  const runTx = useCallback(async () => {
    const id = uuid(); setTxId(id);
    const st = [
      { k: "auth", l: t.auth, d: "Apple Pay • Stripe", s: "active" },
      { k: "cap", l: t.capturing, d: "", s: "waiting" },
      { k: "bg", l: t.budgetCheck, d: "", s: "waiting" },
      { k: "br", l: t.bridge, d: "", s: "waiting" },
      { k: "cv", l: t.converting, d: "", s: "waiting" },
      { k: "pu", l: t.pushing, d: "", s: "waiting" },
    ];
    setSteps([...st]);
    await sleep(1400); st[0] = { ...st[0], s: "done", d: "pi_3R7x...auth" }; st[1] = { ...st[1], s: "active", d: `$${(parseFloat(amount)).toFixed(2)}` }; setSteps([...st]);
    await sleep(1100); st[1] = { ...st[1], s: "done", d: "captured" }; st[2] = { ...st[2], s: "active", d: "checking..." }; setSteps([...st]);
    await sleep(900); st[2] = { ...st[2], s: "done", d: bw.level === "safe" ? "✓ safe" : "⚠ user approved" }; st[3] = { ...st[3], s: "active", d: "Minting USDC via Circle" }; setSteps([...st]);
    await sleep(1800); st[3] = { ...st[3], s: "done", d: "Tx: 5Uj9k...SoLbr" }; st[4] = { ...st[4], s: "active", d: `${FX_RATE} MXN/USD` }; setSteps([...st]);
    await sleep(1200); st[4] = { ...st[4], s: "done", d: `${formatMXN(mxn)} settled` }; st[5] = { ...st[5], s: "active", d: `Visa Direct → ${recipient.card}` }; setSteps([...st]);
    await sleep(2000); st[5] = { ...st[5], s: "done", d: `Done • ${id}` }; setSteps([...st]);
    await sleep(600);
    setBalance(b => +(b - parseFloat(amount)).toFixed(2));
    setTxHistory(h => [{ id, recipient: recipient.name, usd: parseFloat(amount), mxn, city: recipient.city }, ...h]);
    nav(SCR.OK);
  }, [amount, recipient, mxn, bw, t]);

  useEffect(() => { if (screen === SCR.PROC) runTx(); }, [screen]);
  useEffect(() => {
    if (screen === SCR.RX) { setRxPhase(0); setRxBal(false);
      const t1 = setTimeout(() => setRxPhase(1), 800); const t2 = setTimeout(() => setRxPhase(2), 3500);
      const t3 = setTimeout(() => setRxBal(true), 4200); const t4 = setTimeout(() => setRxPhase(3), 5500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [screen]);

  const reset = () => { setAmount(""); setRecipient(null); setViewMode("sender"); nav(SCR.HOME, "left"); };

  // Error simulation
  const triggerError = async () => {
    setErrModal({ open: true, code: "ST-51", ctx: "Stripe PaymentIntent: Insufficient Funds", explanation: "" });
    const exp = await callAIForError("ST-51", "Stripe PaymentIntent Failed: Insufficient Funds", lang);
    setErrModal(p => ({ ...p, explanation: exp }));
  };

  // Credit letter
  const genCreditLetter = async () => {
    setCreditLoading(true); setCreditLetter("");
    const letter = await callAIForCredit(CREDIT_HISTORY, lang);
    setCreditLetter(letter); setCreditLoading(false);
  };

  // ══════ STYLES ══════
  const cs = { card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "18px" } };

  // ══════ SUB-COMPONENTS ══════
  const Step = ({ l, s, d }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", opacity: s === "waiting" ? 0.3 : 1, transition: "opacity 0.4s" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: s === "done" ? "#10B981" : s === "active" ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)", flexShrink: 0, fontSize: 13 }}>
        {s === "done" ? "✓" : s === "active" ? <div style={{ width: 12, height: 12, border: "2px solid #818CF8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : ""}
      </div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{l}</div>{d && s !== "waiting" && <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "'JetBrains Mono',monospace", marginTop: 2 }}>{d}</div>}</div>
    </div>
  );

  const OppCard = ({ o }) => (
    <button onClick={() => setInvestOpp(o)} style={{ minWidth: 180, padding: "16px 14px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: o.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{o.icon}</div>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#A5B4FC" }}>✨ AI</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 3 }}>{o.title}</div>
      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 8 }}>{o.desc}</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>{o.yield}</span>
        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: o.risk === "low" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: o.risk === "low" ? "#6EE7B7" : "#FCA5A5" }}>{o.risk.toUpperCase()}</span>
      </div>
    </button>
  );

  // ══════ AI CHAT ══════
  const Chat = () => {
    const [msgs, setMsgs] = useState([]);
    const [typing, setTyping] = useState(false);
    const end = useRef(null);
    useEffect(() => { if (chatOpen && msgs.length === 0) setMsgs([{ r: "ai", t: t.aiGreeting }]); }, [chatOpen]);
    useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
    const ask = async (q) => {
      setMsgs(m => [...m, { r: "user", t: q }]); setTyping(true);
      const resp = await callAI(q, lang);
      setTyping(false); setMsgs(m => [...m, { r: "ai", t: resp }]);
    };
    if (!chatOpen) return null;
    return (
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "72%", background: "linear-gradient(180deg,#0F1629,#111827)", borderTopLeftRadius: 24, borderTopRightRadius: 24, border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none", display: "flex", flexDirection: "column", zIndex: 50, animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 -20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✨</div>
            <div><div style={{ fontSize: 14, fontWeight: 700 }}>{t.aiName}</div><div style={{ fontSize: 10, color: "#10B981" }}>● Gemini AI</div></div>
          </div>
          <button onClick={() => setChatOpen(false)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#94A3B8", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "14px 18px" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.r === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: 14, background: m.r === "user" ? "linear-gradient(135deg,#6366F1,#7C3AED)" : "rgba(255,255,255,0.06)", borderBottomRightRadius: m.r === "user" ? 4 : 14, borderBottomLeftRadius: m.r === "ai" ? 4 : 14, fontSize: 13, lineHeight: 1.5, color: "#E2E8F0", whiteSpace: "pre-wrap" }}>
                {m.t.split("**").map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : <span key={j}>{p}</span>)}
              </div>
            </div>
          ))}
          {typing && <div style={{ display: "flex", marginBottom: 10 }}><div style={{ padding: "10px 18px", borderRadius: 14, borderBottomLeftRadius: 4, background: "rgba(255,255,255,0.06)", display: "flex", gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", animation: `dot 1.4s ${i * 0.2}s infinite` }} />)}</div></div>}
          <div ref={end} />
        </div>
        <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: "#475569", marginBottom: 6, fontWeight: 600, letterSpacing: 0.5 }}>{t.aiSuggested}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[{ k: "aiQ1" }, { k: "aiQ2" }, { k: "aiQ3" }].map(p => (
              <button key={p.k} onClick={() => ask(t[p.k])} disabled={typing} style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.06)", color: "#C7D2FE", fontSize: 12, fontWeight: 500, cursor: typing ? "default" : "pointer", fontFamily: "inherit", textAlign: "left", opacity: typing ? 0.4 : 1 }}>{t[p.k]}</button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ══════ INVEST MODAL ══════
  const InvestModal = () => {
    const [done, setDone] = useState(false);
    const [a, setA] = useState(investOpp?.min?.toString() || "5");
    if (!investOpp) return null;
    return (
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 60, display: "flex", alignItems: "flex-end", animation: "fadeIn 0.2s" }} onClick={() => { setInvestOpp(null); setDone(false); }}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", padding: "24px 22px", background: "linear-gradient(180deg,#1A1F35,#111827)", borderTopLeftRadius: 24, borderTopRightRadius: 24, border: "1px solid rgba(255,255,255,0.1)", animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
          {!done ? (<>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: investOpp.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{investOpp.icon}</div>
              <div><div style={{ fontSize: 17, fontWeight: 700 }}>{investOpp.title}</div><div style={{ fontSize: 12, color: "#64748B" }}>{investOpp.yield}</div></div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {[investOpp.min, investOpp.min * 2, investOpp.min * 5].filter(v => v <= balance).map(v => (
                <button key={v} onClick={() => setA(v.toString())} style={{ flex: 1, padding: "10px", borderRadius: 10, border: a === v.toString() ? "2px solid #6366F1" : "1px solid rgba(255,255,255,0.1)", background: a === v.toString() ? "rgba(99,102,241,0.15)" : "transparent", color: "#E2E8F0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{formatUSD(v)}</button>
              ))}
            </div>
            <button onClick={() => setDone(true)} style={{ width: "100%", padding: "14px", border: "none", borderRadius: 14, cursor: "pointer", background: investOpp.grad, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "inherit" }}>Invest {formatUSD(parseFloat(a))} →</button>
          </>) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Investment Submitted!</div>
              <div style={{ fontSize: 13, color: "#10B981", marginTop: 4 }}>{formatUSD(parseFloat(a))} → {investOpp.title}</div>
              <button onClick={() => { setInvestOpp(null); setDone(false); }} style={{ marginTop: 20, padding: "12px 36px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.08)", color: "#E2E8F0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Done</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ══════ ERROR MODAL ══════
  const ErrModal = () => {
    if (!errModal.open) return null;
    return (
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn 0.2s" }}>
        <div style={{ width: "100%", maxWidth: 340, padding: "28px 24px", background: "linear-gradient(180deg,#1A1F35,#111827)", borderRadius: 24, border: "1px solid rgba(239,68,68,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px" }}>⚠️</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{t.errTitle}</div>
            <div style={{ fontSize: 12, color: "#64748B", fontFamily: "'JetBrains Mono',monospace", marginTop: 4 }}>Code: {errModal.code}</div>
          </div>
          <div style={{ ...cs.card, background: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.15)", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A5B4FC", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>✨ {t.errExplain}</div>
            {errModal.explanation ? (
              <div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 }}>{errModal.explanation}</div>
            ) : (
              <div style={{ display: "flex", gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1", animation: `dot 1.4s ${i * 0.2}s infinite` }} />)}</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setErrModal({ open: false, code: "", ctx: "", explanation: "" })} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94A3B8", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.errClose}</button>
            <button onClick={() => setErrModal({ open: false, code: "", ctx: "", explanation: "" })} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.errRetry}</button>
          </div>
        </div>
      </div>
    );
  };

  // ══════ CREDIT BUILDER ══════
  const CreditBuilder = () => {
    const onTime = CREDIT_HISTORY.filter(h => h.status === "on-time").length;
    const total = CREDIT_HISTORY.length;
    const pct = Math.round((onTime / total) * 100);
    const score = Math.min(750, 580 + Math.round(pct * 1.7));
    return (
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t.cbTitle}</div>
        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>{t.cbDesc}</div>
        {/* Score Ring */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 140, height: 140, borderRadius: "50%", background: `conic-gradient(#6366F1 ${score / 850 * 360}deg, rgba(255,255,255,0.06) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", position: "relative" }}>
            <div style={{ width: 112, height: 112, borderRadius: "50%", background: "#111827", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#A5B4FC" }}>{score}</div>
              <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600 }}>{t.cbScore}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, ...cs.card, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#10B981" }}>{pct}%</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{t.cbPayments}</div>
          </div>
          <div style={{ flex: 1, ...cs.card, textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#A5B4FC" }}>6</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{t.cbConsistency}</div>
          </div>
        </div>
        {/* Generate button */}
        <button onClick={genCreditLetter} disabled={creditLoading} style={{ width: "100%", padding: "16px", border: "none", borderRadius: 14, cursor: "pointer", background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "inherit", opacity: creditLoading ? 0.6 : 1, marginBottom: 16 }}>
          {creditLoading ? t.cbGenerating : t.cbGenerate}
        </button>
        {/* Letter output */}
        {creditLetter && (
          <div style={{ ...cs.card, background: "rgba(99,102,241,0.05)", borderColor: "rgba(99,102,241,0.2)", marginBottom: 20, animation: "fadeUp 0.4s ease-out" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#A5B4FC", marginBottom: 8 }}>✨ AI-GENERATED CREDIT LETTER</div>
            <div style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono',monospace", maxHeight: 240, overflow: "auto" }}>{creditLetter}</div>
          </div>
        )}
        {/* History */}
        <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 }}>{t.cbHistory}</div>
        {CREDIT_HISTORY.map((h, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: h.status === "on-time" ? "#10B981" : "#F59E0B" }} />
              <span>{h.date}</span>
            </div>
            <div style={{ fontWeight: 600, color: h.status === "on-time" ? "#10B981" : "#FCD34D" }}>{formatUSD(h.amount)}</div>
          </div>
        ))}
      </div>
    );
  };

  // ══════ PHONE SHELL ══════
  const Phone = ({ children, label, active, grad, fab }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: active ? "#A5B4FC" : "#475569" }}>{label}</div>}
      <div style={{ width: 390, minHeight: 760, maxHeight: 844, background: grad || "linear-gradient(165deg,#0C0F1A,#111827,#0F172A)", borderRadius: 44, position: "relative", overflow: "hidden", boxShadow: active ? "0 50px 100px -20px rgba(0,0,0,0.7),0 0 0 2px rgba(99,102,241,0.4)" : "0 50px 100px -20px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.08)", fontFamily: "'DM Sans',-apple-system,sans-serif", color: "#F1F5F9", display: "flex", flexDirection: "column", transform: active ? "scale(1)" : "scale(0.97)", transition: "all 0.3s", direction: isRTL ? "rtl" : "ltr" }}>
        <div style={{ padding: "14px 28px 10px", display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#94A3B8", flexShrink: 0 }}><span>9:41</span><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ fontSize: 11 }}>5G</span><div style={{ width: 18, height: 10, border: "1.5px solid #94A3B8", borderRadius: 3 }}><div style={{ width: "75%", height: "100%", background: "#94A3B8", borderRadius: 1 }} /></div></div></div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 0 24px" }}>{children}</div>
        {fab && screen !== SCR.PROC && !chatOpen && <button onClick={() => setChatOpen(true)} style={{ position: "absolute", bottom: 28, right: 24, width: 52, height: 52, borderRadius: "50%", border: "none", cursor: "pointer", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", boxShadow: "0 8px 24px rgba(99,102,241,0.5)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, animation: "fabP 3s infinite" }}>✨</button>}
        {fab && <Chat />}
        {fab && <InvestModal />}
        {fab && <ErrModal />}
        <div style={{ flexShrink: 0, padding: "8px 0 12px", display: "flex", justifyContent: "center" }}><div style={{ width: 134, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.15)" }} /></div>
      </div>
    </div>
  );

  // ══════ RECEIVER CONTENT ══════
  const Rx = () => (
    <div style={{ padding: "0 24px" }}>
      {rxPhase === 0 && <div style={{ textAlign: "center", paddingTop: 60 }}><div style={{ fontSize: 56, fontWeight: 200 }}>9:41</div><div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>domingo, 8 de febrero</div><div style={{ marginTop: 60, fontSize: 12, color: "#475569" }}>🔒 Waiting...</div></div>}
      {rxPhase === 1 && <div style={{ paddingTop: 40 }}><div style={{ textAlign: "center", marginBottom: 36 }}><div style={{ fontSize: 56, fontWeight: 200 }}>9:41</div><div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>domingo, 8 de febrero</div></div><div style={{ padding: "14px", borderRadius: 18, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", animation: "notifSlide 0.5s cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366F1,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>P</div><div><div style={{ fontSize: 13, fontWeight: 700 }}>Pulse</div><div style={{ fontSize: 10, color: "#94A3B8" }}>ahora</div></div></div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>💰 ¡Recibiste dinero!</div><div style={{ fontSize: 13, color: "#CBD5E1", lineHeight: 1.4 }}>Alex Thompson te envió <span style={{ color: "#10B981", fontWeight: 700 }}>{formatMXN(mxn)} MXN</span></div></div></div>}
      {rxPhase >= 2 && <div style={{ animation: "fadeUp 0.5s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><div><div style={{ fontSize: 14, color: "#64748B" }}>{t.hello}</div><div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>{recipient?.name}</div></div><div style={{ width: 40, height: 40, borderRadius: "50%", background: recipient?.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>{recipient?.initials}</div></div>
        <div style={{ background: "linear-gradient(145deg,rgba(16,185,129,0.15),rgba(5,150,105,0.08))", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "24px 22px", marginBottom: 18 }}><div style={{ fontSize: 12, color: "#6EE7B7", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.balAvail}</div><div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>$<AnimNum value={rxBal ? (recipient?.prevBalance || 0) + mxn : recipient?.prevBalance || 0} /></div><div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>MXN • Visa ****{recipient?.card?.slice(-4)}</div></div>
        <div style={{ padding: "16px", borderRadius: 14, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#6EE7B7", textTransform: "uppercase", marginBottom: 8 }}>● {t.txReceived}</div><div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 15, fontWeight: 600 }}>{t.from}: Alex Thompson</div><div style={{ fontSize: 12, color: "#64748B" }}>🇺🇸 {t.via}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>+{formatMXN(mxn)}</div></div></div></div>
        {rxPhase >= 3 && <div style={{ ...cs.card, animation: "fadeUp 0.4s", marginBottom: 16 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#A5B4FC", marginBottom: 10 }}>{t.details}</div>{[[t.origAmount, formatUSD(parseFloat(amount)) + " USD"], [t.fxRate, `1 USD = ${FX_RATE} MXN`], [t.amtRx, formatMXN(mxn) + " MXN"], [t.feePaid, "$0.00"], [t.method, t.visaDirect], [t.reference, txId], [t.status, t.credited]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}><span style={{ color: "#64748B" }}>{l}</span><span style={{ fontWeight: 600, color: v.includes("✓") ? "#10B981" : "#E2E8F0", fontFamily: l === t.reference ? "'JetBrains Mono',monospace" : "inherit", fontSize: l === t.reference ? 10 : 12 }}>{v}</span></div>)}</div>}
      </div>}
    </div>
  );

  // ══════ SENDER CONTENT ══════
  const Sender = () => (
    <div key={aKey} style={{ animation: `${slideDir === "right" ? "slideR" : "slideL"} 0.35s ease-out` }}>
      {/* Tab bar inside phone */}
      <div style={{ display: "flex", gap: 4, padding: "0 24px 16px", marginTop: 4 }}>
        {[{ k: TABS.SEND, l: t.remittance }, { k: TABS.CREDIT, l: t.creditBuilder }].map(tb => (
          <button key={tb.k} onClick={() => { setTab(tb.k); if (tb.k === TABS.SEND) nav(SCR.HOME); }} style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", cursor: "pointer", background: tab === tb.k ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)", color: tab === tb.k ? "#C7D2FE" : "#64748B", fontSize: 13, fontWeight: 700, fontFamily: "inherit", transition: "all 0.2s" }}>{tb.l}</button>
        ))}
      </div>

      {/* Credit Builder Tab */}
      {tab === TABS.CREDIT && <CreditBuilder />}

      {/* Send Tab */}
      {tab === TABS.SEND && (<>
        {/* HOME */}
        {screen === SCR.HOME && <div style={{ padding: "0 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}><div><div style={{ fontSize: 14, color: "#64748B" }}>{t.welcomeBack}</div><div style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>Alex Thompson</div></div><div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>AT</div></div>
          <div style={{ background: "linear-gradient(145deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20, padding: "24px 22px", marginBottom: 12, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 12, color: "#A5B4FC", fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 }}>{t.availableBalance}</div>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}><AnimNum value={balance} prefix="$" /></div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>{t.demoWallet}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, padding: "7px 10px", borderRadius: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}><span style={{ fontSize: 11 }}>🛡️</span><span style={{ fontSize: 11, color: "#6EE7B7", fontWeight: 600 }}>{t.safeTo} {formatUSD(bw.safeAmount)}</span></div>
          </div>
          {sugs.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase" }}>{t.aiOpportunities}</span><span style={{ fontSize: 11, color: "#6366F1" }}>{t.seeAll}</span></div><div style={{ display: "flex", gap: 10, overflowX: "auto", margin: "0 -24px", padding: "0 24px 6px" }}>{sugs.map(o => <OppCard key={o.id} o={o} />)}</div></div>}
          <button onClick={() => nav(SCR.AMT)} style={{ width: "100%", padding: "16px", border: "none", borderRadius: 14, cursor: "pointer", background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "inherit", boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}>{t.sendMoney}</button>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 14, fontSize: 12, color: "#64748B" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />{t.liveRate}: 1 USD = {FX_RATE} MXN</div>
          {txHistory.length > 0 && <div style={{ marginTop: 14 }}><div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 10, textTransform: "uppercase" }}>{t.recentTransfers}</div>{txHistory.map(tx => <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>{tx.recipient}</div><div style={{ fontSize: 11, color: "#64748B" }}>{tx.id}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 14, fontWeight: 600, color: "#F87171" }}>-{formatUSD(tx.usd)}</div><div style={{ fontSize: 11, color: "#10B981" }}>{formatMXN(tx.mxn)} MXN</div></div></div>)}</div>}
          {/* Error sim button */}
          <button onClick={triggerError} style={{ width: "100%", marginTop: 16, padding: "10px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.2)", background: "transparent", color: "rgba(239,68,68,0.5)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase", letterSpacing: 1 }}>{t.simError}</button>
        </div>}

        {/* AMOUNT */}
        {screen === SCR.AMT && <div style={{ padding: "0 24px" }}>
          <button onClick={() => nav(SCR.HOME, "left")} style={{ background: "none", border: "none", color: "#A5B4FC", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 16, fontFamily: "inherit", padding: 0 }}>{t.back}</button>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t.sendMoneyTitle}</div>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 28 }}>{t.enterAmount}</div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <span style={{ fontSize: 44, fontWeight: 300, color: "#475569", position: "absolute", left: -24, top: 2 }}>$</span>
              <input type="number" value={amount} onChange={e => { const v = e.target.value; if (v === "" || (parseFloat(v) >= 0 && parseFloat(v) <= balance)) setAmount(v); }} placeholder="0.00" autoFocus style={{ fontSize: 52, fontWeight: 700, textAlign: "center", width: 200, background: "transparent", border: "none", borderBottom: `3px solid ${bw.level === "safe" ? "rgba(99,102,241,0.3)" : bw.level === "caution" ? "#F59E0B" : "#EF4444"}`, color: "#F1F5F9", fontFamily: "inherit", caretColor: "#6366F1", paddingBottom: 6 }} />
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>{t.available}: {formatUSD(balance)}</div>
            {bw.message && parseFloat(amount) > 0 && <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: bw.level === "caution" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${bw.level === "caution" ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`, textAlign: "left", animation: "fadeUp 0.3s" }}><div style={{ fontSize: 12, color: bw.level === "caution" ? "#FCD34D" : "#FCA5A5", lineHeight: 1.4 }}>{bw.message}</div><div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>🛡️ {t.budgetSoft}</div></div>}
            {parseFloat(amount) > 0 && bw.level === "safe" && <div style={{ marginTop: 10, fontSize: 11, color: "#6EE7B7", display: "flex", justifyContent: "center", gap: 4 }}>🛡️ {t.withinBudget}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18 }}>{[10, 25, 50, 100].filter(v => v <= balance).map(v => <button key={v} onClick={() => setAmount(v.toString())} style={{ padding: "9px 18px", borderRadius: 10, border: `1px solid ${v > bw.safeAmount ? "rgba(245,158,11,0.3)" : "rgba(99,102,241,0.3)"}`, background: amount === v.toString() ? "rgba(99,102,241,0.2)" : "transparent", color: v > bw.safeAmount ? "#FCD34D" : "#C7D2FE", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>${v}</button>)}</div>
            {parseFloat(amount) > 0 && <div style={{ marginTop: 24, padding: "18px", borderRadius: 14, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", animation: "fadeUp 0.3s" }}><div style={{ fontSize: 12, color: "#6EE7B7", fontWeight: 600, marginBottom: 4 }}>{t.recipientGets}</div><div style={{ fontSize: 30, fontWeight: 700, color: "#10B981" }}><AnimNum value={mxn} suffix=" MXN" /></div><div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>1 USD = {FX_RATE} MXN • 0% fee</div></div>}
          </div>
          <button disabled={!amount || parseFloat(amount) <= 0} onClick={() => nav(SCR.RECIP)} style={{ width: "100%", padding: "16px", border: "none", borderRadius: 14, cursor: "pointer", background: parseFloat(amount) > 0 ? "linear-gradient(135deg,#6366F1,#7C3AED)" : "rgba(255,255,255,0.06)", color: parseFloat(amount) > 0 ? "#fff" : "#475569", fontSize: 16, fontWeight: 700, fontFamily: "inherit", opacity: parseFloat(amount) > 0 ? 1 : 0.5 }}>{t.cont}</button>
        </div>}

        {/* RECIPIENT */}
        {screen === SCR.RECIP && <div style={{ padding: "0 24px" }}>
          <button onClick={() => nav(SCR.AMT, "left")} style={{ background: "none", border: "none", color: "#A5B4FC", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 16, fontFamily: "inherit", padding: 0 }}>{t.back}</button>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t.chooseRecipient}</div>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 24 }}>{t.selectWho} {formatMXN(mxn)} MXN</div>
          {CONTACTS.map(c => <button key={c.id} onClick={() => { setRecipient(c); nav(SCR.REVIEW); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 14px", marginBottom: 10, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}><div style={{ width: 46, height: 46, borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{c.initials}</div><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0" }}>{c.name}</div><div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{c.city}</div></div><div style={{ color: "#475569" }}>›</div></button>)}
        </div>}

        {/* REVIEW */}
        {screen === SCR.REVIEW && recipient && <div style={{ padding: "0 24px" }}>
          <button onClick={() => nav(SCR.RECIP, "left")} style={{ background: "none", border: "none", color: "#A5B4FC", fontSize: 14, fontWeight: 500, cursor: "pointer", marginBottom: 16, fontFamily: "inherit", padding: 0 }}>{t.back}</button>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>{t.reviewTransfer}</div>
          {bw.level !== "safe" && <div style={{ padding: "10px 14px", borderRadius: 12, marginBottom: 14, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", fontSize: 12, color: "#FCD34D", display: "flex", gap: 8 }}><span>🛡️</span><span>{t.budgetGuard}: {t.softWarn}</span></div>}
          <div style={{ ...cs.card, borderRadius: 18, padding: "22px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>🇺🇸</div><div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{t.youSend}</div><div style={{ fontSize: 20, fontWeight: 700 }}>{formatUSD(parseFloat(amount))}</div></div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}><div style={{ width: 36, height: 1, background: "linear-gradient(90deg,#6366F1,#10B981)" }} /><div style={{ fontSize: 9, color: "#64748B" }}>USDC</div><div style={{ width: 36, height: 1, background: "linear-gradient(90deg,#6366F1,#10B981)" }} /></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 26 }}>🇲🇽</div><div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>{recipient.name.split(" ")[0]} {t.gets}</div><div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>{formatMXN(mxn)}</div></div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
              {[[t.recipient, recipient.name], [t.exchangeRate, `1 USD = ${FX_RATE} MXN`], [t.transferFee, t.free], [t.budgetGuard, bw.level === "safe" ? t.withinSafe : t.softWarn], [t.delivery, t.under60]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}><span style={{ color: "#64748B" }}>{l}</span><span style={{ fontWeight: 600, color: v === t.free ? "#10B981" : v.includes("✓") ? "#10B981" : v.includes("⚠") ? "#FCD34D" : "#E2E8F0" }}>{v}</span></div>)}
            </div>
          </div>
          <div style={{ padding: "14px", borderRadius: 12, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", marginBottom: 20, fontSize: 12, color: "#A5B4FC", lineHeight: 1.4 }}><strong>{t.howPulse}</strong> {t.howDesc}</div>
          <button onClick={() => nav(SCR.PROC)} style={{ width: "100%", padding: "16px", border: "none", borderRadius: 14, cursor: "pointer", background: "#000", color: "#fff", fontSize: 16, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{t.payApple}</button>
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: "#475569" }}>{t.demoMode}</div>
        </div>}

        {/* PROCESSING */}
        {screen === SCR.PROC && <div style={{ padding: "20px 24px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}><div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pGlow 2s infinite" }}><div style={{ width: 24, height: 24, border: "3px solid #818CF8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div><div style={{ fontSize: 18, fontWeight: 700 }}>{t.processing}</div></div>
          <div style={{ padding: "6px 18px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>{steps.map(s => <Step key={s.k} l={s.l} s={s.s} d={s.d} />)}</div>
        </div>}

        {/* SUCCESS */}
        {(screen === SCR.OK || screen === SCR.RX) && <div style={{ padding: "0 24px", textAlign: "center", paddingTop: 36 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto", boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 20 }}>{t.complete}</div>
          <div style={{ fontSize: 14, color: "#64748B", marginTop: 6 }}>{recipient?.name} {t.received}<br /><span style={{ fontSize: 26, fontWeight: 700, color: "#10B981" }}>{formatMXN(mxn)} MXN</span></div>
          <div style={{ margin: "24px 0", ...cs.card, textAlign: "left", fontSize: 12 }}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: "#A5B4FC" }}>{t.receipt}</div>{[[t.txId, txId], [t.amtSent, formatUSD(parseFloat(amount))], [t.amtReceived, formatMXN(mxn) + " MXN"], [t.exchangeRate, `1 USD = ${FX_RATE} MXN`], [t.fee, "$0.00"], [t.budgetGuard, bw.level === "safe" ? t.approved : t.userOverride], [t.rail, "Solana → Visa Direct"], [t.status, t.delivered]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><span style={{ color: "#64748B" }}>{l}</span><span style={{ fontWeight: 600, color: v.includes("✓") ? "#10B981" : v.includes("⚠") ? "#FCD34D" : "#E2E8F0", fontFamily: l === t.txId ? "'JetBrains Mono',monospace" : "inherit", fontSize: l === t.txId ? 10 : 12 }}>{v}</span></div>)}</div>
          {screen === SCR.OK && <button onClick={() => { setViewMode("receiver"); nav(SCR.RX); }} style={{ width: "100%", padding: "14px", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, cursor: "pointer", background: "rgba(16,185,129,0.08)", color: "#6EE7B7", fontSize: 15, fontWeight: 700, fontFamily: "inherit", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🇲🇽 {t.seeRecipient} {recipient?.name?.split(" ")[0]} {t.sees}</button>}
          <button onClick={reset} style={{ width: "100%", padding: "14px", border: "none", borderRadius: 14, cursor: "pointer", background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "inherit" }}>{t.sendAnother}</button>
        </div>}
      </>)}
    </div>
  );

  // ══════ MAIN RENDER ══════
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#020617,#0F172A 40%,#1E1B4B)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", gap: 20, fontFamily: "'DM Sans',-apple-system,sans-serif", direction: isRTL ? "rtl" : "ltr" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideR{from{transform:translateX(50px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes slideL{from{transform:translateX(-50px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pGlow{0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)}50%{box-shadow:0 0 40px rgba(99,102,241,0.6)}}
        @keyframes notifSlide{from{transform:translateY(-40px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes fabP{0%,100%{box-shadow:0 8px 24px rgba(99,102,241,0.5)}50%{box-shadow:0 8px 36px rgba(99,102,241,0.8)}}
        @keyframes dot{0%,100%{opacity:0.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}
        *{box-sizing:border-box;margin:0;padding:0}
        input:focus{outline:none}
        ::-webkit-scrollbar{width:0}
      `}</style>

      {/* Top bar: badge + language */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 100, padding: "7px 18px", fontSize: 12, color: "#A5B4FC", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />{t.investorDemo} — {t.interactive}
        </div>
        {/* Language selector */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "7px 16px", fontSize: 13, color: "#A5B4FC", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>{LANGS[lang]?.flag} {LANGS[lang]?.label} ▾</button>
          {langOpen && <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, background: "#1A1F35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "6px", zIndex: 100, minWidth: 160, animation: "fadeUp 0.2s" }}>
            {Object.entries(LANGS).map(([k, v]) => (
              <button key={k} onClick={() => { setLang(k); setLangOpen(false); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "none", background: lang === k ? "rgba(99,102,241,0.2)" : "transparent", color: lang === k ? "#C7D2FE" : "#94A3B8", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 18 }}>{v.flag}</span>{v.label}</button>
            ))}
          </div>}
        </div>
      </div>

      {/* View toggle for receiver */}
      {screen === SCR.RX && <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        {[{ k: "sender", l: t.senderView }, { k: "receiver", l: t.recipientView }].map(v => (
          <button key={v.k} onClick={() => { setViewMode(v.k); if (v.k === "sender") nav(SCR.OK, "left"); }} style={{ padding: "9px 22px", borderRadius: 10, border: "none", cursor: "pointer", background: viewMode === v.k ? "rgba(99,102,241,0.2)" : "transparent", color: viewMode === v.k ? "#C7D2FE" : "#64748B", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>{v.l}</button>
        ))}
      </div>}

      {/* Phone(s) */}
      <div style={{ display: "flex", gap: 36, alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap" }}>
        {(screen !== SCR.RX || viewMode === "sender") && <Phone label={screen >= SCR.OK ? `${t.senderView}` : null} active={viewMode === "sender" || screen < SCR.OK} fab={true}><Sender /></Phone>}
        {screen === SCR.RX && viewMode === "receiver" && <Phone label={`${t.recipientView} — ${recipient?.city}`} active={true} grad="linear-gradient(165deg,#041210,#082f23,#0a1f1a)"><Rx /></Phone>}
      </div>

      {/* Footer tech labels */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono',monospace" }}>
        {["Stripe", "Budget Guard AI", "USDC / Solana", "Circle", "Visa Direct", "Gemini AI"].map(x => <span key={x} style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>{x}</span>)}
      </div>
    </div>
  );
}
