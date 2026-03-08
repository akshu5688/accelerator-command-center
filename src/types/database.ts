export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      applications: {
        Row: {
          ai_fit: string | null;
          applicant_name: string;
          created_at: string;
          date_applied: string;
          email: string | null;
          form_id: string | null;
          id: string;
          industry: string | null;
          notes: string | null;
          payload: Json | null;
          revenue: number | null;
          reviewer: string | null;
          score: number | null;
          stage: string | null;
          startup_id: string | null;
          startup_name: string;
          status: string;
          workspace_id: string;
        };
        Insert: {
          ai_fit?: string | null;
          applicant_name: string;
          created_at?: string;
          date_applied?: string;
          email?: string | null;
          form_id?: string | null;
          id?: string;
          industry?: string | null;
          notes?: string | null;
          payload?: Json | null;
          revenue?: number | null;
          reviewer?: string | null;
          score?: number | null;
          stage?: string | null;
          startup_id?: string | null;
          startup_name: string;
          status?: string;
          workspace_id: string;
        };
        Update: {
          ai_fit?: string | null;
          applicant_name?: string;
          created_at?: string;
          date_applied?: string;
          email?: string | null;
          form_id?: string | null;
          id?: string;
          industry?: string | null;
          notes?: string | null;
          payload?: Json | null;
          revenue?: number | null;
          reviewer?: string | null;
          score?: number | null;
          stage?: string | null;
          startup_id?: string | null;
          startup_name?: string;
          status?: string;
          workspace_id?: string;
        };
      };
      cohorts: {
        Row: {
          cadence: string | null;
          created_at: string;
          duration: string | null;
          end_date: string | null;
          id: string;
          name: string;
          start_date: string | null;
          status: string;
          workspace_id: string;
        };
        Insert: {
          cadence?: string | null;
          created_at?: string;
          duration?: string | null;
          end_date?: string | null;
          id?: string;
          name: string;
          start_date?: string | null;
          status?: string;
          workspace_id: string;
        };
        Update: {
          cadence?: string | null;
          created_at?: string;
          duration?: string | null;
          end_date?: string | null;
          id?: string;
          name?: string;
          start_date?: string | null;
          status?: string;
          workspace_id?: string;
        };
      };
      form_questions: {
        Row: {
          created_at: string;
          description: string | null;
          form_id: string;
          id: string;
          label: string;
          options: Json | null;
          required: boolean;
          sort_order: number;
          type: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          form_id: string;
          id?: string;
          label: string;
          options?: Json | null;
          required?: boolean;
          sort_order?: number;
          type: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          form_id?: string;
          id?: string;
          label?: string;
          options?: Json | null;
          required?: boolean;
          sort_order?: number;
          type?: string;
          version?: number;
        };
      };
      forms: {
        Row: {
          created_at: string;
          deadline: string | null;
          description: string | null;
          id: string;
          name: string;
          publish_slug: string | null;
          publish_link: string | null;
          published_at: string | null;
          status: string;
          version: number;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          publish_slug?: string | null;
          publish_link?: string | null;
          published_at?: string | null;
          status?: string;
          version?: number;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          publish_slug?: string | null;
          publish_link?: string | null;
          published_at?: string | null;
          status?: string;
          version?: number;
          workspace_id?: string;
        };
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
        };
      };
      startup_documents: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          size: string | null;
          startup_id: string;
          type: string | null;
          url: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          size?: string | null;
          startup_id: string;
          type?: string | null;
          url?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          size?: string | null;
          startup_id?: string;
          type?: string | null;
          url?: string | null;
          workspace_id?: string;
        };
      };
      startup_milestones: {
        Row: {
          created_at: string;
          due_date: string | null;
          id: string;
          owner: string | null;
          progress: number;
          startup_id: string;
          status: string;
          title: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          due_date?: string | null;
          id?: string;
          owner?: string | null;
          progress?: number;
          startup_id: string;
          status?: string;
          title: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          due_date?: string | null;
          id?: string;
          owner?: string | null;
          progress?: number;
          startup_id?: string;
          status?: string;
          title?: string;
          workspace_id?: string;
        };
      };
      startup_reviews: {
        Row: {
          actions: string | null;
          created_at: string;
          flags: string | null;
          id: string;
          review_date: string;
          reviewer: string | null;
          score: number | null;
          startup_id: string;
          workspace_id: string;
        };
        Insert: {
          actions?: string | null;
          created_at?: string;
          flags?: string | null;
          id?: string;
          review_date?: string;
          reviewer?: string | null;
          score?: number | null;
          startup_id: string;
          workspace_id: string;
        };
        Update: {
          actions?: string | null;
          created_at?: string;
          flags?: string | null;
          id?: string;
          review_date?: string;
          reviewer?: string | null;
          score?: number | null;
          startup_id?: string;
          workspace_id?: string;
        };
      };
      startups: {
        Row: {
          burn_multiple: number | null;
          cohort_id: string | null;
          created_at: string;
          founder_email: string | null;
          founder_name: string | null;
          id: string;
          industry: string | null;
          last_review_date: string | null;
          location: string | null;
          name: string;
          revenue: number | null;
          runway_months: number | null;
          stage: string | null;
          status: string;
          team_size: number | null;
          workspace_id: string;
        };
        Insert: {
          burn_multiple?: number | null;
          cohort_id?: string | null;
          created_at?: string;
          founder_email?: string | null;
          founder_name?: string | null;
          id?: string;
          industry?: string | null;
          last_review_date?: string | null;
          location?: string | null;
          name: string;
          revenue?: number | null;
          runway_months?: number | null;
          stage?: string | null;
          status?: string;
          team_size?: number | null;
          workspace_id: string;
        };
        Update: {
          burn_multiple?: number | null;
          cohort_id?: string | null;
          created_at?: string;
          founder_email?: string | null;
          founder_name?: string | null;
          id?: string;
          industry?: string | null;
          last_review_date?: string | null;
          location?: string | null;
          name?: string;
          revenue?: number | null;
          runway_months?: number | null;
          stage?: string | null;
          status?: string;
          team_size?: number | null;
          workspace_id?: string;
        };
      };
      team_members: {
        Row: {
          accepted_at: string | null;
          created_at: string;
          email: string;
          id: string;
          invited_at: string | null;
          name: string;
          role: string;
          status: string;
          workspace_id: string;
        };
        Insert: {
          accepted_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          invited_at?: string | null;
          name: string;
          role: string;
          status?: string;
          workspace_id: string;
        };
        Update: {
          accepted_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          invited_at?: string | null;
          name?: string;
          role?: string;
          status?: string;
          workspace_id?: string;
        };
      };
      templates: {
        Row: {
          applied_to: number;
          created_at: string;
          description: string | null;
          id: string;
          last_updated: string;
          name: string;
          type: string;
          workspace_id: string;
        };
        Insert: {
          applied_to?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          last_updated?: string;
          name: string;
          type: string;
          workspace_id: string;
        };
        Update: {
          applied_to?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          last_updated?: string;
          name?: string;
          type?: string;
          workspace_id?: string;
        };
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
          user_id?: string;
          workspace_id?: string;
        };
      };
      workspace_settings: {
        Row: {
          ai_risk_alerts: boolean;
          automated_review_reminders: boolean;
          cohort_benchmarking: boolean;
          document_auto_tagging: boolean;
          founder_financial_sync: boolean;
          sync_frequency: string;
          updated_at: string;
          workspace_id: string;
        };
        Insert: {
          ai_risk_alerts?: boolean;
          automated_review_reminders?: boolean;
          cohort_benchmarking?: boolean;
          document_auto_tagging?: boolean;
          founder_financial_sync?: boolean;
          sync_frequency?: string;
          updated_at?: string;
          workspace_id: string;
        };
        Update: {
          ai_risk_alerts?: boolean;
          automated_review_reminders?: boolean;
          cohort_benchmarking?: boolean;
          document_auto_tagging?: boolean;
          founder_financial_sync?: boolean;
          sync_frequency?: string;
          updated_at?: string;
          workspace_id?: string;
        };
      };
      workspaces: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          name: string;
          organization: string | null;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          name: string;
          organization?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
          organization?: string | null;
        };
      };
    };
    Functions: {
      is_workspace_member: {
        Args: { ws_id: string };
        Returns: boolean;
      };
    };
  };
};

export type PublicTables = Database["public"]["Tables"];
