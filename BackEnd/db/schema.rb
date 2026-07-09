# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_07_04_194019) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "analyses", force: :cascade do |t|
    t.bigint "property_id", null: false
    t.datetime "analysis_date", default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.decimal "solar_irradiation", precision: 10, scale: 2
    t.decimal "cloud_cover", precision: 5, scale: 2
    t.decimal "temperature", precision: 5, scale: 2
    t.decimal "estimated_generation_kwh", precision: 10, scale: 3
    t.decimal "estimated_consumption_kwh", precision: 10, scale: 3
    t.decimal "balance_kwh", precision: 10, scale: 3
    t.string "classification"
    t.decimal "battery_charge_kwh", precision: 10, scale: 3
    t.string "battery_status"
    t.text "executive_summary"
    t.text "recommendations"
    t.decimal "estimated_savings_kwh", precision: 10, scale: 3
    t.decimal "estimated_savings_currency", precision: 12, scale: 2
    t.string "currency", default: "BRL"
    t.jsonb "raw_data", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["property_id"], name: "index_analyses_on_property_id"
  end

  create_table "properties", force: :cascade do |t|
    t.string "city", null: false
    t.decimal "latitude", precision: 10, scale: 7
    t.decimal "longitude", precision: 10, scale: 7
    t.decimal "installed_power_kwp", precision: 10, scale: 3, null: false
    t.boolean "has_battery", default: false, null: false
    t.decimal "battery_capacity_kwh", precision: 10, scale: 3
    t.decimal "average_daily_consumption_kwh", precision: 10, scale: 3, null: false
    t.string "operation_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.string "farm_name"
    t.string "peak_consumption_period"
    t.boolean "flexible_operation", default: false
    t.jsonb "main_equipments", default: []
    t.text "operation_description"
    t.index ["user_id"], name: "index_properties_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "full_name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "phone"
    t.boolean "has_whatsapp", default: false
    t.string "cpf"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cpf"], name: "index_users_on_cpf", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "analyses", "properties"
  add_foreign_key "properties", "users"
end
