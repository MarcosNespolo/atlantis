export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      aquarium_fish: {
        Row: {
          aquarium_id: number
          fish_id: number
          quantity: number
        }
        Insert: {
          aquarium_id: number
          fish_id: number
          quantity: number
        }
        Update: {
          aquarium_id?: number
          fish_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "aquarium_fish_aquarium_id_fkey"
            columns: ["aquarium_id"]
            isOneToOne: false
            referencedRelation: "aquariums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aquarium_fish_fish_id_fkey"
            columns: ["fish_id"]
            isOneToOne: false
            referencedRelation: "fish"
            referencedColumns: ["id"]
          },
        ]
      }
      aquariums: {
        Row: {
          created_at: string
          id: number
          name: string
          tank_height: number | null
          tank_volume: number | null
          tank_width: number | null
          updated_at: string
          user_id: string
          water_type: Database["public"]["Enums"]["water_type"]
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
          tank_height?: number | null
          tank_volume?: number | null
          tank_width?: number | null
          updated_at?: string
          user_id: string
          water_type?: Database["public"]["Enums"]["water_type"]
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
          tank_height?: number | null
          tank_volume?: number | null
          tank_width?: number | null
          updated_at?: string
          user_id?: string
          water_type?: Database["public"]["Enums"]["water_type"]
        }
        Relationships: [
          {
            foreignKeyName: "aquariums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fish: {
        Row: {
          aquarium_height_max: number | null
          aquarium_height_min: number | null
          aquarium_width_max: number | null
          aquarium_width_min: number | null
          created_at: string
          dgh_max: number
          dgh_min: number
          id: number
          image: string | null
          minimum_shoal: number
          name: string
          name_en: string | null
          note: string | null
          ph_max: number
          ph_min: number
          position: Database["public"]["Enums"]["fish_position"]
          salinity_max: number
          salinity_min: number
          scientific_name: string
          size: number
          specialist_id: string | null
          temperament_others: Database["public"]["Enums"]["temperament_others"]
          temperament_same: Database["public"]["Enums"]["temperament_same"]
          temperature_max: number
          temperature_min: number
          updated_at: string
          volume_additional: number
          volume_first: number
          water_type: Database["public"]["Enums"]["water_type"]
        }
        Insert: {
          aquarium_height_max?: number | null
          aquarium_height_min?: number | null
          aquarium_width_max?: number | null
          aquarium_width_min?: number | null
          created_at?: string
          dgh_max: number
          dgh_min: number
          id?: never
          image?: string | null
          minimum_shoal?: number
          name: string
          name_en?: string | null
          note?: string | null
          ph_max: number
          ph_min: number
          position: Database["public"]["Enums"]["fish_position"]
          salinity_max?: number
          salinity_min?: number
          scientific_name: string
          size: number
          specialist_id?: string | null
          temperament_others?: Database["public"]["Enums"]["temperament_others"]
          temperament_same?: Database["public"]["Enums"]["temperament_same"]
          temperature_max: number
          temperature_min: number
          updated_at?: string
          volume_additional?: number
          volume_first: number
          water_type?: Database["public"]["Enums"]["water_type"]
        }
        Update: {
          aquarium_height_max?: number | null
          aquarium_height_min?: number | null
          aquarium_width_max?: number | null
          aquarium_width_min?: number | null
          created_at?: string
          dgh_max?: number
          dgh_min?: number
          id?: never
          image?: string | null
          minimum_shoal?: number
          name?: string
          name_en?: string | null
          note?: string | null
          ph_max?: number
          ph_min?: number
          position?: Database["public"]["Enums"]["fish_position"]
          salinity_max?: number
          salinity_min?: number
          scientific_name?: string
          size?: number
          specialist_id?: string | null
          temperament_others?: Database["public"]["Enums"]["temperament_others"]
          temperament_same?: Database["public"]["Enums"]["temperament_same"]
          temperature_max?: number
          temperature_min?: number
          updated_at?: string
          volume_additional?: number
          volume_first?: number
          water_type?: Database["public"]["Enums"]["water_type"]
        }
        Relationships: [
          {
            foreignKeyName: "fish_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fish_foods: {
        Row: {
          fish_id: number
          food_id: number
        }
        Insert: {
          fish_id: number
          food_id: number
        }
        Update: {
          fish_id?: number
          food_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fish_foods_fish_id_fkey"
            columns: ["fish_id"]
            isOneToOne: false
            referencedRelation: "fish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fish_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      fish_substrates: {
        Row: {
          fish_id: number
          substrate_id: number
        }
        Insert: {
          fish_id: number
          substrate_id: number
        }
        Update: {
          fish_id?: number
          substrate_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fish_substrates_fish_id_fkey"
            columns: ["fish_id"]
            isOneToOne: false
            referencedRelation: "fish"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fish_substrates_substrate_id_fkey"
            columns: ["substrate_id"]
            isOneToOne: false
            referencedRelation: "substrates"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          description: string | null
          id: number
          image: string | null
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          id: number
          image?: string | null
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      mapa_config: {
        Row: {
          id: number
          pass_hash: string
        }
        Insert: {
          id?: number
          pass_hash: string
        }
        Update: {
          id?: number
          pass_hash?: string
        }
        Relationships: []
      }
      mapa_plano: {
        Row: {
          data: Json
          id: string
          updated_at: string
        }
        Insert: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Update: {
          data?: Json
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_state: {
        Row: {
          state: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          state?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          state?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: string
          image: string | null
          link: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id: string
          image?: string | null
          link?: string | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          image?: string | null
          link?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      substrates: {
        Row: {
          description: string | null
          id: number
          image: string | null
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          id: number
          image?: string | null
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      mapa_change_pass: {
        Args: { p_new: string; p_old: string }
        Returns: undefined
      }
      mapa_load: { Args: { p_pass: string }; Returns: Json }
      mapa_save: { Args: { p_data: Json; p_pass: string }; Returns: undefined }
      user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      fish_position: "fundo" | "meio" | "superficie"
      temperament_others:
        | "pacifico"
        | "territorial"
        | "agressivo_menores"
        | "agressivo_maiores"
      temperament_same:
        | "pacifico"
        | "territorial"
        | "territorial_femeas"
        | "territorial_machos"
      user_role: "aquarista" | "especialista" | "admin"
      water_type: "doce" | "salgada" | "salobra"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      fish_position: ["fundo", "meio", "superficie"],
      temperament_others: [
        "pacifico",
        "territorial",
        "agressivo_menores",
        "agressivo_maiores",
      ],
      temperament_same: [
        "pacifico",
        "territorial",
        "territorial_femeas",
        "territorial_machos",
      ],
      user_role: ["aquarista", "especialista", "admin"],
      water_type: ["doce", "salgada", "salobra"],
    },
  },
} as const
