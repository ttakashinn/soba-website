export type Language = 'vi' | 'en' | 'ja';

export interface LocalizedText {
  vi: string;
  en: string;
  ja: string;
}

export interface AssessmentOption {
  score: number;
  text: LocalizedText;
}

export interface AssessmentQuestion {
  id: string;
  category: 'tech' | 'process' | 'people';
  question: LocalizedText;
  options: AssessmentOption[];
}

export const QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1",
    category: "tech",
    question: {
      vi: "Dữ liệu kinh doanh (khách hàng, đơn hàng, kho) đang được lưu trữ thế nào?",
      en: "How is your business data (customers, orders, inventory) currently stored?",
      ja: "ビジネスデータ（顧客、注文、在庫）は現在どのように保存されていますか？"
    },
    options: [
      { score: 1, text: { vi: "Sổ sách hoặc Excel rời rạc", en: "Paper or scattered Excel files", ja: "紙の台帳、または散在するExcelファイル" } },
      { score: 2, text: { vi: "Phần mềm kế toán/bán hàng riêng lẻ", en: "Standalone accounting/sales software", ja: "独立した会計/販売ソフト" } },
      { score: 3, text: { vi: "Hệ thống quản lý tập trung (ERP/CRM)", en: "Centralized management system (ERP/CRM)", ja: "一元管理システム (ERP/CRM)" } }
    ]
  },
  {
    id: "q2",
    category: "tech",
    question: {
      vi: "Ban lãnh đạo mất bao lâu để có báo cáo doanh thu/lợi nhuận chính xác?",
      en: "How long does it take for management to get accurate revenue/profit reports?",
      ja: "経営陣が正確な売上/利益レポートを入手するのにどれくらい時間がかかりますか？"
    },
    options: [
      { score: 1, text: { vi: "Vài ngày đến 1 tuần (chờ tổng hợp)", en: "Days to a week (waiting for compilation)", ja: "数日〜1週間（集計待ち）" } },
      { score: 2, text: { vi: "Trong ngày (nhưng cần kiểm tra lại)", en: "Within the day (but needs double-checking)", ja: "当日中（ただし再確認が必要）" } },
      { score: 3, text: { vi: "Thời gian thực (Real-time)", en: "Real-time", ja: "リアルタイム" } }
    ]
  },
  {
    id: "q3",
    category: "process",
    question: {
      vi: "Quy trình làm việc giữa các phòng ban hiện tại ra sao?",
      en: "How is the workflow between departments currently structured?",
      ja: "部門間の業務フローは現在どのような状態ですか？"
    },
    options: [
      { score: 1, text: { vi: "Trao đổi miệng hoặc Chat, hay quên việc", en: "Verbal or Chat, tasks often missed", ja: "口頭やチャット（タスク漏れが多い）" } },
      { score: 2, text: { vi: "Có quy trình văn bản nhưng ít tuân thủ", en: "Documented processes but low compliance", ja: "文書化されているが、あまり守られていない" } },
      { score: 3, text: { vi: "Quy trình chuẩn hóa và tự động hóa", en: "Standardized and automated workflows", ja: "標準化・自動化されたワークフロー" } }
    ]
  },
  {
    id: "q4",
    category: "process",
    question: {
      vi: "Việc phê duyệt đề xuất/chi tiêu đang diễn ra thế nào?",
      en: "How are proposal/spending approvals handled?",
      ja: "提案や支出の承認はどのように行われていますか？"
    },
    options: [
      { score: 1, text: { vi: "Ký giấy tờ thủ công, trình ký lâu", en: "Manual paper signing, slow process", ja: "手書きの署名（時間がかかる）" } },
      { score: 2, text: { vi: "Email hoặc Zalo", en: "Email or Messaging Apps", ja: "メールまたはチャットツール" } },
      { score: 3, text: { vi: "Phê duyệt online trên hệ thống", en: "Online approval via system", ja: "システム上でのオンライン承認" } }
    ]
  },
  {
    id: "q5",
    category: "people",
    question: {
      vi: "Thái độ của nhân viên khi tiếp cận công nghệ mới?",
      en: "Employee attitude towards adopting new technology?",
      "ja": "新しい技術に対する従業員の態度はどうですか？"
    },
    options: [
      { score: 1, text: { vi: "Ngại thay đổi, thích làm cách cũ", en: "Resistant, prefer old ways", ja: "変化を嫌い、従来の方法を好む" } },
      { score: 2, text: { vi: "Hợp tác nhưng cần đào tạo nhiều", en: "Cooperative but need heavy training", ja: "協力的だが、多くのトレーニングが必要" } },
      { score: 3, text: { vi: "Chủ động học hỏi và thích ứng nhanh", en: "Proactive and quick to adapt", ja: "主体的で、適応が早い" } }
    ]
  },
  {
    id: "q6",
    category: "people",
    question: {
      vi: "Kỹ năng số (Digital Skills) của đội ngũ nhân sự?",
      en: "Digital skills of the staff?",
      ja: "スタッフのデジタルスキルはどうですか？"
    },
    options: [
      { score: 1, text: { vi: "Chỉ biết tin học văn phòng cơ bản", en: "Basic office skills only", ja: "基本的なオフィススキルのみ" } },
      { score: 2, text: { vi: "Biết sử dụng các phần mềm chuyên môn", en: "Can use specialized software", ja: "専門的なソフトウェアを使用できる" } },
      { score: 3, text: { vi: "Tư duy dựa trên dữ liệu (Data-driven)", en: "Data-driven mindset", ja: "データドリブンな思考ができる" } }
    ]
  }
];