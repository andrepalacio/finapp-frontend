/* ── User ────────────────────────────────────────────────────────── */
export interface User {
  id:         string
  email:      string
  name:       string
  created_at: string
  updated_at: string
}

/* ── Auth ────────────────────────────────────────────────────────── */
export interface AuthTokens {
  access_token:  string
  refresh_token: string
}

/* ── Workspace ───────────────────────────────────────────────────── */
export interface Workspace {
  id:         string
  name:       string
  currency:   string
  owner_id:   string
  created_at: string
  updated_at: string
}

/* ── Category ────────────────────────────────────────────────────── */
export type CategoryType = 'expense' | 'income' | 'both'

export interface Category {
  id:           string
  workspace_id: string | null
  name:         string
  icon:         string | null
  color:        string | null
  type:         CategoryType
  is_system:    boolean
  created_at:   string
}

/* ── Transaction ─────────────────────────────────────────────────── */
export type TransactionType      = 'expense' | 'income' | 'transfer'
export type TransferDirection    = 'in' | 'out'

export interface Transaction {
  id:                 string
  workspace_id:       string
  user_id:            string
  category_id:        string | null
  transfer_id:        string | null
  type:               TransactionType
  transfer_direction: TransferDirection | null
  amount:             number
  description:        string | null
  date:               string
  created_at:         string
  updated_at:         string
}

export interface DailySummary {
  date:               string
  total_expense:      number
  total_income:       number
  total_transfer_out: number
  total_transfer_in:  number
  transaction_count:  number
}

/* ── Budget ──────────────────────────────────────────────────────── */
export interface BudgetCategory {
  budget_id:     string
  category_id:   string
  category_name: string
  limit_amount:  number
  spent?:        number
  remaining?:    number
}

export interface Budget {
  id:           string
  workspace_id: string
  year:         number
  month:        number
  total_limit:  number
  total_spent:  number
  remaining:    number
  created_at:   string
  updated_at:   string
  categories:   BudgetCategory[]
}

/* ── Debt ────────────────────────────────────────────────────────── */
export type RateType = 'effective_annual' | 'nominal_annual' | 'monthly'

export interface Debt {
  id:                 string
  workspace_id:       string
  name:               string
  lender:             string | null
  principal:          number
  rate:               number
  rate_type:          RateType
  installments:       number
  first_payment_date: string
  notes:              string | null
  created_at:         string
  updated_at:         string
}

export interface DebtPayment {
  id:         string
  debt_id:    string
  period:     number
  amount:     number
  paid_at:    string
  notes:      string | null
  created_at: string
}

export type InstallmentStatus = 'paid' | 'pending'

export interface DebtScheduleInstallment {
  period:      number
  due_date:    string
  payment:     number
  principal:   number
  interest:    number
  balance:     number
  status:      InstallmentStatus
  paid_at:     string | null
  paid_amount: number | null
}

/* ── Savings ─────────────────────────────────────────────────────── */
export interface SavingsGoal {
  id:            string
  workspace_id:  string
  name:          string
  target_amount: number
  deadline:      string | null
  notes:         string | null
  created_at:    string
  updated_at:    string
}

export interface SavingsGoalProgress extends SavingsGoal {
  total_contributed: number
  remaining:         number
  progress_pct:      number
}

export interface SavingsContribution {
  id:             string
  goal_id:        string
  amount:         number
  contributed_at: string
  notes:          string | null
  created_at:     string
}
