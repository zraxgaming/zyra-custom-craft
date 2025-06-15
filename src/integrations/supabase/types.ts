export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      barcode_generations: {
        Row: {
          barcode_data: string
          barcode_type: string
          created_at: string
          generated_by: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          barcode_data: string
          barcode_type?: string
          created_at?: string
          generated_by?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          barcode_data?: string
          barcode_type?: string
          created_at?: string
          generated_by?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "barcode_generations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          customization: Json | null
          id: string
          image_url: string | null
          name: string | null
          price: number | null
          product_id: string | null
          quantity: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          image_url?: string | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cart_items_product"
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
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          admin_reply: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_reply?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          max_uses: number | null
          min_purchase: number
          starts_at: string
          updated_at: string
          used_count: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_purchase?: number
          starts_at?: string
          updated_at?: string
          used_count?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_purchase?: number
          starts_at?: string
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      customization_options: {
        Row: {
          allow_image: boolean | null
          allow_resize_rotate: boolean | null
          allow_text: boolean | null
          created_at: string | null
          id: string
          max_image_count: number | null
          max_text_length: number | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          allow_image?: boolean | null
          allow_resize_rotate?: boolean | null
          allow_text?: boolean | null
          created_at?: string | null
          id?: string
          max_image_count?: number | null
          max_text_length?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_image?: boolean | null
          allow_resize_rotate?: boolean | null
          allow_text?: boolean | null
          created_at?: string | null
          id?: string
          max_image_count?: number | null
          max_text_length?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customization_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          html_content: string | null
          id: string
          recipient_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          html_content?: string | null
          id?: string
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          amount: number
          code: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          expires_at: string | null
          id: string
          initial_amount: number
          is_active: boolean | null
          message: string | null
          recipient_email: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          code: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          initial_amount: number
          is_active?: boolean | null
          message?: string | null
          recipient_email?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expires_at?: string | null
          id?: string
          initial_amount?: number
          is_active?: boolean | null
          message?: string | null
          recipient_email?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_mode: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          message: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          preferences: Json | null
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          preferences?: Json | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          preferences?: Json | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          customization: Json | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          customization?: Json | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_order_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
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
      order_refunds: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          order_id: string
          reason: string | null
          status: string
          updated_at: string
          ziina_refund_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          order_id: string
          reason?: string | null
          status: string
          updated_at?: string
          ziina_refund_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          order_id?: string
          reason?: string | null
          status?: string
          updated_at?: string
          ziina_refund_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          currency: string | null
          delivery_type: string | null
          id: string
          notes: string | null
          payment_intent_id: string | null
          payment_method: string | null
          payment_status: string | null
          profile_id: string | null
          shipping_address: Json | null
          status: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
          ziina_payment_id: string | null
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          delivery_type?: string | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          profile_id?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          ziina_payment_id?: string | null
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          currency?: string | null
          delivery_type?: string | null
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          profile_id?: string | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          ziina_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          id: string
          path: string
          referrer: string | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          price_adjustment: number | null
          product_id: string
          sku: string | null
          stock_quantity: number | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_adjustment?: number | null
          product_id: string
          sku?: string | null
          stock_quantity?: number | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_adjustment?: number | null
          product_id?: string
          sku?: string | null
          stock_quantity?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category: string | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          dimensions_height: number | null
          dimensions_length: number | null
          dimensions_width: number | null
          discount_percentage: number | null
          featured: boolean | null
          id: string
          images: Json | null
          in_stock: boolean | null
          is_customizable: boolean | null
          is_digital: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          manage_stock: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          short_description: string | null
          sku: string | null
          slug: string
          status: string | null
          stock_quantity: number | null
          stock_status: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          category?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          dimensions_height?: number | null
          dimensions_length?: number | null
          dimensions_width?: number | null
          discount_percentage?: number | null
          featured?: boolean | null
          id?: string
          images?: Json | null
          in_stock?: boolean | null
          is_customizable?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          manage_stock?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          sku?: string | null
          slug: string
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          category?: string | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          dimensions_height?: number | null
          dimensions_length?: number | null
          dimensions_width?: number | null
          discount_percentage?: number | null
          featured?: boolean | null
          id?: string
          images?: Json | null
          in_stock?: boolean | null
          is_customizable?: boolean | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          manage_stock?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          status?: string | null
          stock_quantity?: number | null
          stock_status?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          preferred_currency: string | null
          preferred_language: string | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferred_currency?: string | null
          preferred_language?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          link_url: string | null
          placement: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          placement?: string
          start_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          placement?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string | null
          reward_earned: boolean | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_earned?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string | null
          reward_earned?: boolean | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id: string
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string | null
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_reviews_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          estimated_days: string | null
          id: string
          name: string
          price: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          estimated_days?: string | null
          id?: string
          name: string
          price?: number
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          estimated_days?: string | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      site_config: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
