export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          button_text: string | null
          created_at: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          link: string | null
          position: number | null
          subtitle: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          button_text?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          link?: string | null
          position?: number | null
          subtitle?: string | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          link?: string | null
          position?: number | null
          subtitle?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      base_categories: {
        Row: {
          created_at: string | null
          id: number
          image_url: string | null
          name: string
          slug: string
          subcategory_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          name: string
          slug: string
          subcategory_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          name?: string
          slug?: string
          subcategory_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "base_categories_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_base_categories_subcategory"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: number
          price: number
          product_id: number
          product_image: string | null
          product_name: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          price: number
          product_id: number
          product_image?: string | null
          product_name: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          price?: number
          product_id?: number
          product_image?: string | null
          product_name?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: number
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      client_testimonials: {
        Row: {
          comment: string
          created_at: string | null
          id: number
          image_url: string
          is_featured: boolean | null
          name: string
          rating: number
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: number
          image_url: string
          is_featured?: boolean | null
          name: string
          rating: number
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: number
          image_url?: string
          is_featured?: boolean | null
          name?: string
          rating?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: number
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      content_pages: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: number
          max_uses: number | null
          minimum_order_value: number | null
          starts_at: string | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: number
          max_uses?: number | null
          minimum_order_value?: number | null
          starts_at?: string | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: number
          max_uses?: number | null
          minimum_order_value?: number | null
          starts_at?: string | null
          used_count?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: number
          order_id: number | null
          product_id: number | null
          product_image: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          product_image?: string | null
          product_name: string
          product_sku?: string | null
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          product_image?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          coupon_code: string | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          discount_amount: number
          id: number
          items: Json
          notes: string | null
          order_number: string
          order_status: string
          payment_method: string | null
          payment_status: string
          shipping_address: Json
          shipping_amount: number
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_address?: Json | null
          coupon_code?: string | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number
          id?: number
          items?: Json
          notes?: string | null
          order_number?: string
          order_status?: string
          payment_method?: string | null
          payment_status?: string
          shipping_address: Json
          shipping_amount?: number
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_address?: Json | null
          coupon_code?: string | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number
          id?: number
          items?: Json
          notes?: string | null
          order_number?: string
          order_status?: string
          payment_method?: string | null
          payment_status?: string
          shipping_address?: Json
          shipping_amount?: number
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          additional_images: Json | null
          base_category_id: number | null
          category_id: number | null
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          featured: boolean | null
          id: number
          image_url: string | null
          name: string
          price: number
          sale_price: number | null
          sku: string | null
          slug: string
          specifications: Json | null
          stock: number | null
          subcategory_id: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          additional_images?: Json | null
          base_category_id?: number | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          sale_price?: number | null
          sku?: string | null
          slug: string
          specifications?: Json | null
          stock?: number | null
          subcategory_id?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          additional_images?: Json | null
          base_category_id?: number | null
          category_id?: number | null
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          featured?: boolean | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          sale_price?: number | null
          sku?: string | null
          slug?: string
          specifications?: Json | null
          stock?: number | null
          subcategory_id?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string
          id: number
          is_active: boolean | null
          platform: string
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon: string
          id?: number
          is_active?: boolean | null
          platform: string
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string
          id?: number
          is_active?: boolean | null
          platform?: string
          url?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          base_category_id: number | null
          category_id: number | null
          created_at: string | null
          id: number
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          base_category_id?: number | null
          category_id?: number | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          base_category_id?: number | null
          category_id?: number | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subcategories_base_category"
            columns: ["base_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_subcategories_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          id: number
          in_stock: boolean | null
          price: number
          product_id: number
          product_image: string | null
          product_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          in_stock?: boolean | null
          price: number
          product_id: number
          product_image?: string | null
          product_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          in_stock?: boolean | null
          price?: number
          product_id?: number
          product_image?: string | null
          product_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_to_cart: {
        Args: {
          p_user_id: string
          p_product_id: number
          p_product_name: string
          p_product_image: string
          p_price: number
          p_quantity: number
        }
        Returns: undefined
      }
      clear_cart: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      remove_from_cart: {
        Args: { p_user_id: string; p_product_id: number }
        Returns: undefined
      }
      swap_banner_positions: {
        Args: { banner1_id: number; banner2_id: number }
        Returns: undefined
      }
      update_cart_item_quantity: {
        Args: { p_user_id: string; p_product_id: number; p_quantity: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
